# AGENTS.md - Developer Guidelines & Architecture

## Role & Expertise
- Senior Web Development Expert (Next.js 16, TypeScript, Fullstack Architecture, PostgreSQL Neon, Prisma 7, Neon Object Storage, Tailwind CSS v4).

## Tech Stack & Verified Versions
- **Framework**: Next.js 16.4.6 (App Router), React 19.3.0.
- **Styling**: Tailwind CSS v4 (`@theme`, CSS variables).
- **Theme**: `next-themes` (`ThemeProvider`, `ThemeSwitch` in `src/components/ui/ThemeSwitch.tsx`).
- **ORM / Database**: Prisma 7.10.1 with Neon PostgreSQL (`@prisma/adapter-neon`).
- **Media Storage**: Neon Object Storage via `@aws-sdk/client-s3` (`src/lib/neonStorage.ts`). Valid types: `png`, `jpg`, `jpeg`, `mp4`, `webm`.
- **State / Auth**: Anonymous `guestToken` stored in HTTP-only Cookie, generated via `src/proxy.ts` and hashed (SHA-256 with `AUTH_SALT`) via `src/lib/userToken.ts` to map an `AnonymousUser` record.
- **API Client Layer**: Native `fetch` wrapper in `src/lib/api.ts` (automatically passes cookies).

---

## Directory & File Layout
```
 prisma/
   ├── schema.prisma          # Definisi schema Prisma PostgreSQL
   └── migrations/            # Riwayat migrasi PostgreSQL
 prisma.config.ts           # Config datasource Prisma 7
 src/
   ├── app/
   │   ├── api/               # API Routes (threads, comments, likes, dislikes, users)
   │   ├── [userId]/          # Page profil user & thread ciptaan sendiri
   │   ├── layout.tsx         # Root layout dengan ThemeProvider & ThreadProvider
   │   └── page.tsx           # Halaman utama (Feed threads)
   ├── components/
   │   ├── layout/            # Komponen Header & Layout
   │   └── ui/                # CardThread, CreateThread, EditThread, CommentThread, ThemeSwitch
   ├── context/
   │   └── ThreadContext.tsx  # Central State Provider untuk threads
   ├── lib/
   │   ├── api.ts             # Native fetch client helper
   │   ├── neonStorage.ts     # S3 Client upload/delete Neon Object Storage
   │   ├── prisma.ts          # Singleton Prisma Client dengan Neon Adapter
   │   └── userToken.ts       # Hash SHA-256 token & helper AnonymousUser
   └── proxy.ts               # Cookie initialization proxy
```

---

## Prisma 7 & Database Rules
- **Prisma Client Generation**: Jalankan `npx prisma generate` atau `pnpm p`.
- **Datasource Configuration**: Prisma 7 menggunakan `prisma.config.ts` untuk mengkonfigurasi `DATABASE_URL`. Jangan menggunakan format datasource `db` konvensional lama.
- **Database Migrations**:
  - Terapkan migrasi terdaftar menggunakan `npx prisma migrate deploy`.
  - DILARANG menggunakan `prisma migrate reset` pada environment produksi.
  - DILARANG menggunakan `prisma db push` sebagai pengganti alur migrasi resmi di produksi.
  - DILARANG membuat file migrasi baru tanpa memeriksa `prisma/schema.prisma` dan riwayat di `prisma/migrations/`.
  - DILARANG mengubah `schema.prisma` tanpa persetujuan eksplisit.

---

## Environment Variables & Security Rules
DILARANG keras menuliskan kredensial, secret, connection string, atau access key secara eksplisit di file kode atau dokumentasi. Gunakan `.env`.

Variabel yang dibutuhkan:
- `DATABASE_URL`: Connection string PostgreSQL Neon (`postgresql://...`).
- `AUTH_SALT`: Salt rahasia untuk hashing `guestToken` anonim.
- `AWS_ENDPOINT_URL_S3`: Endpoint URL Neon Object Storage S3.
- `AWS_REGION`: Region S3 (e.g. `ap-southeast-1`).
- `AWS_ACCESS_KEY_ID`: Access Key ID Object Storage.
- `AWS_SECRET_ACCESS_KEY`: Secret Access Key Object Storage.
- `NEON_STORAGE_BUCKET`: Nama Bucket Neon Object Storage.

---

## Business Logic & Database Rules
- **Thread**: ID integer (`autoincrement`). Memiliki atomic counter `commentsCount`, `likesCount`, `dislikesCount`. Terindeks pada `createdAt` (`@@index([createdAt])`) dan `anonymousUserId` (`@@index([anonymousUserId])`).
- **Comment**: ID integer (`autoincrement`). Terikat pada `threadId` (`onDelete: Cascade`). Terindeks pada `threadId` dan `anonymousUserId`.
- **Like & Dislike Mutual Exclusion**: User tidak bisa Like dan Dislike bersamaan pada 1 thread. Menekan Like saat Dislike aktif akan membatalkan Dislike dan menambah Like secara atomic via `prisma.$transaction`.
- **Media Cleanup**: Saat thread dihapus via `DELETE /api/threads/[id]`, file media di Neon Object Storage harus secara otomatis dihapus via `deleteFromNeonStorage`.

---

## Vercel Deployment & Build Rules
- Build Command: `pnpm build` (atau `next build`).
- Pastikan Environment Variables terdaftar di Dashboard Vercel.
- Prisma client di-generate otomatis saat install/build via script `pnpm p` (`prisma generate`).
