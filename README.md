# Zjukal - Anonymous Thread & Media Sharing Platform

Zjukal adalah platform forum & media feed anonim responsif yang terinspirasi dari Kaskus & X (Twitter), dibangun menggunakan Next.js 16 (App Router), React 19, Prisma 7, PostgreSQL Neon, dan Neon Object Storage.

## Fitur Utama
- **Identitas Anonim Otomatis**: Setiap pengunjung mendapatkan cookie `guestToken` tanpa perlu pendaftaran/login. Token di-hash secara aman menggunakan SHA-256 (`AUTH_SALT`).
- **Media Feed Responsif**: Feed terpusat (`max-w-2xl mx-auto`) dengan optimasi gambar LCP (`next/image` + `priority`) dan pemuatan video efisien (`<video controls preload="none">`).
- **Upload Media Neon Storage**: Unggah gambar (`.png`, `.jpg`, `.jpeg`) dan video (`.mp4`, `.webm`) langsung ke Neon Object Storage (API S3-compatible).
- **Interaksi Sosial Real-Time**:
  - Upvote / Like & Downvote / Dislike dengan aturan **Mutual Exclusion** (atomic via `prisma.$transaction`).
  - Sistem komentar dengan pengiriman cepat menggunakan tombol Enter / Reply.
- **Halaman Profil Anonim (`/[userId]`)**:
  - Halaman khusus untuk melihat, mengedit, dan menghapus thread ciptaan sendiri secara aman.
- **Mode Terang & Gelap**: Mendukung switch tema gelap/terang via `next-themes`.

---

## Tech Stack
- **Framework**: Next.js 16.4.6 (App Router)
- **Library Frontend**: React 19.3.0, Tailwind CSS v4, Lucide React, `next-themes`
- **Database & ORM**: PostgreSQL (Neon Serverless), Prisma 7.10.1 dengan `@prisma/adapter-neon`
- **Object Storage**: Neon Object Storage via `@aws-sdk/client-s3`

---

## Requirements
- Node.js >= 20.x
- pnpm / npm
- Database PostgreSQL (Neon)
- Neon Object Storage S3 Credentials

---

## Environment Variables Configuration

Buat file `.env` di direktori utama proyek dengan variabel berikut:

```env
# Database Connection (Neon PostgreSQL)
DATABASE_URL="postgresql://<user>:<password>@<neon-hostname>/<dbname>?sslmode=require"

# Security Salt for Anonymous Token Hashing
AUTH_SALT="your-secure-random-salt-string"

# Neon Object Storage (S3 Compatible API)
AWS_ENDPOINT_URL_S3="https://<endpoint-storage>.neon.tech"
AWS_REGION="ap-southeast-1"
AWS_ACCESS_KEY_ID="your-s3-access-key-id"
AWS_SECRET_ACCESS_KEY="your-s3-secret-access-key"
NEON_STORAGE_BUCKET="your-bucket-name"
```

---

## Getting Started

1. **Install Dependensi**:
   ```bash
   pnpm install
   ```

2. **Generate Prisma Client**:
   ```bash
   pnpm p
   # atau npx prisma generate
   ```

3. **Jalankan Migrasi Database**:
   ```bash
   npx prisma migrate deploy
   ```

4. **Jalankan Server Development**:
   ```bash
   pnpm dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

5. **Build Production**:
   ```bash
   pnpm build
   pnpm start
   ```

---

## Deployment di Vercel

1. Hubungkan repository GitHub Zjukal ke Vercel.
2. Tambahkan seluruh Environment Variables (`DATABASE_URL`, `AUTH_SALT`, `AWS_*`, `NEON_STORAGE_BUCKET`) pada halaman Settings > Environment Variables Vercel.
3. Vercel akan secara otomatis menjalankan `pnpm build` dan memublikasikan aplikasi.

---

## Struktur Direktori Utama

```
 prisma/
   ├── schema.prisma          # Schema PostgreSQL Prisma
   └── migrations/            # Riwayat migrasi database
 src/
   ├── app/
   │   ├── api/               # Route Handler (threads, comments, likes, dislikes, users)
   │   ├── [userId]/          # Rute profil user & feed pribadi
   │   ├── layout.tsx         # Root Layout & Provider Wrapper
   │   └── page.tsx           # Feed Halaman Utama
   ├── components/
   │   ├── layout/            # Header & Navbar
   │   └── ui/                # CardThread, CreateThread, EditThread, CommentThread, ThemeSwitch
   ├── context/
   │   └── ThreadContext.tsx  # Global State Provider untuk threads
   └── lib/
       ├── api.ts             # API Client Layer (native fetch)
       ├── neonStorage.ts     # SDK S3 Object Storage Client
       ├── prisma.ts          # Client Singleton Prisma (Neon Adapter)
       └── userToken.ts       # Hash Token & Identitas Anonim
```
