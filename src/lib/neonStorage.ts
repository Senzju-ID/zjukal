
import "server-only";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const requiredEnv = [
  "AWS_ENDPOINT_URL_S3",
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "NEON_STORAGE_BUCKET",
] as const;

for (const name of requiredEnv) {
  if (!process.env[name]) {
    throw new Error(`Missing environment variable: ${name}`);
  }
}

const endpoint = process.env.AWS_ENDPOINT_URL_S3!.replace(/\/+$/, "");
const bucket = process.env.NEON_STORAGE_BUCKET!;

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function validateKey(key: string): void {
  if (
    !key ||
    key.startsWith("/") ||
    key.split("/").some((part) => part === "." || part === "..") ||
    /[\u0000-\u001F\u007F]/.test(key)
  ) {
    throw new Error("Invalid storage object key");
  }
}

export function getPublicUrl(key: string): string {
  validateKey(key);

  const encodedKey = key
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return `${endpoint}/${encodeURIComponent(bucket)}/${encodedKey}`;
}

export async function uploadToNeonStorage(params: {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
}) {
  const { key, body, contentType } = params;

  validateKey(key);

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentLength: body.byteLength,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    key,
    url: getPublicUrl(key),
  };
}

export async function deleteFromNeonStorage(key: string): Promise<void> {
  validateKey(key);

  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}
