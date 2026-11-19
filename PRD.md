# PRD.md - Zjukal Product Requirements Document

## Overview
Zjukal adalah platform forum & media feed anonim yang terinspirasi dari Kaskus & X (Twitter), dibangun dengan Next.js 16 (App Router), React 19, Prisma 7, PostgreSQL Neon, dan Neon Object Storage (S3-compatible API). Aplikasi ini mengusung identitas pengguna anonim berbasis cookie `guestToken`, perataan feed media responsif, serta interaksi sosial real-time (Thread, Comment, Like, Dislike dengan aturan Mutual Exclusion).

## Core Features & Current Status
1. **Anonymous Identity & Security**:
   - Pengguna otomatis mendapatkan cookie `guestToken` (HTTP-only, `sameSite: lax`, 1 tahun) via `proxy.ts`.
   - Server meng-hash token menggunakan SHA-256 dengan `AUTH_SALT` untuk memetakan `AnonymousUser` di database PostgreSQL.
   - Endpoint `/api/users/me` mengembalikan ID profil anonim pengguna yang aktif.
2. **Dynamic Media Feed**:
   - Tampilan feed terpusat (`max-w-2xl mx-auto`) yang responsif di perangkat mobile dan desktop.
   - Mendukung media **Gambar** (`.png`, `.jpg`, `.jpeg`) menggunakan `next/image` (dengan `priority` untuk LCP) dan **Video** (`.mp4`, `.webm`) menggunakan `<video controls preload="none">`.
   - Media diunggah langsung ke **Neon Object Storage** via AWS S3 SDK.
3. **Thread Management**:
   - Membuat thread baru (Judul, Deskripsi, Opsional Media Gambar/Video).
   - Mengedit Judul dan Deskripsi thread milik sendiri via modal `EditThread`.
   - Menghapus thread milik sendiri secara atomic beserta media terkait di Object Storage.
4. **Social Interactions**:
   - **Atomic Counters**: `commentsCount`, `likesCount`, `dislikesCount`.
   - **Like & Dislike Mutual Exclusion**: Menekan Like saat Dislike aktif akan menghapus Dislike dan sebaliknya secara atomic via `prisma.$transaction`.
   - **Komentar**: Pengiriman komentar dapat disubmit via tombol Enter atau Reply, disertai fitur Like Komentar.
5. **Theme Support**:
   - Mode Gelap/Terang (Dark/Light Mode) disesuaikan via `next-themes` dan `ThemeSwitch.tsx`.
6. **User Profile & Management Page (`/[userId]`)**:
   - Rute dinamis dengan Partial Prerendering (`Suspense`) untuk menampilkan seluruh thread ciptaan user anonim terkait.
   - Hak akses edit dan hapus secara otomatis diverifikasi berdasarkan kepemilikan cookie `guestToken`.

---

## Database Architecture (Prisma 7 & Neon PostgreSQL)

### Schema Models:
- **`AnonymousUser`**: `id` (UUID), `tokenHash` (String Unique), `createdAt`, `updatedAt`. Relasi ke `Thread`, `Comment`, `Like`, `Dislike`.
- **`Thread`**: `id` (Int Autoincrement), `title` (String), `description` (String), `mediaUrl` (String?), `mediaType` (String?), `anonymousUserId` (String, FK to AnonymousUser), `commentsCount` (Int default 0), `likesCount` (Int default 0), `dislikesCount` (Int default 0), `createdAt` (DateTime). Indexes: `@@index([createdAt])`, `@@index([anonymousUserId])`.
- **`Comment`**: `id` (Int Autoincrement), `threadId` (Int, FK to Thread onDelete Cascade), `context` (String), `anonymousUserId` (String, FK to AnonymousUser), `likesCount` (Int default 0), `createdAt` (DateTime). Indexes: `@@index([threadId])`, `@@index([anonymousUserId])`.
- **`Like`**: `id` (Int Autoincrement), `threadId` (Int?), `commentId` (Int?), `anonymousUserId` (String). Composite Uniques: `@@unique([threadId, anonymousUserId])`, `@@unique([commentId, anonymousUserId])`. Index: `@@index([anonymousUserId])`.
- **`Dislike`**: `id` (Int Autoincrement), `threadId` (Int?), `anonymousUserId` (String). Composite Unique: `@@unique([threadId, anonymousUserId])`. Index: `@@index([anonymousUserId])`.

---

## API Routes Specification

### Thread Routes
- `GET /api/threads` - Mengambil daftar seluruh thread (diurutkan berdasarkan `createdAt desc`).
- `POST /api/threads` - Membuat thread baru & mengunggah file media ke Neon Object Storage.
- `GET /api/threads/[id]` - Mengambil detail single thread.
- `PATCH /api/threads/[id]` - Mengedit `title` & `description` thread (terproteksi hak milik).
- `DELETE /api/threads/[id]` - Menghapus thread & menghapus file media terkait dari Neon Object Storage (terproteksi hak milik).
- `POST /api/threads/[id]/likes` - Toggle like thread (atomic mutual exclusion dengan dislike).
- `POST /api/threads/[id]/dislikes` - Toggle dislike thread (atomic mutual exclusion dengan like).

### Comment Routes
- `GET /api/threads/[id]/comments` - Mengambil daftar komentar untuk thread tertentu.
- `POST /api/threads/[id]/comments` - Menambahkan komentar baru dan menginkremen `commentsCount`.
- `DELETE /api/threads/[id]/comments/[commentId]` - Menghapus komentar.
- `POST /api/threads/[id]/comments/[commentId]/likes` - Toggle like komentar.

### User Routes
- `GET /api/users/me` - Mengembalikan `userId` milik pengguna anonim yang aktif berdasarkan cookie `guestToken`.
- `GET /api/users/[userId]/threads` - Mengambil daftar thread spesifik milik pengguna anonim tertentu.

---

## Media Management (Neon Object Storage)
- **Engine**: S3 Client (`@aws-sdk/client-s3`).
- **Path Storage**: `uploads/{timestamp}-{clean_filename}`.
- **Tipe File yang Diterima**: `.png`, `.jpg`, `.jpeg`, `.mp4`, `.webm`.
- **Penghapusan**: Saat thread dihapus via `DELETE /api/threads/[id]`, sistem secara otomatis membedah `mediaUrl` dan memanggil `deleteFromNeonStorage` untuk menghapus file dari S3 bucket.

---

## Technology Stack Summary
- **Frontend**: Next.js 16.4.6 (App Router), React 19.3.0, Tailwind CSS v4, Lucide React, `next-themes`.
- **Backend / Database**: Node.js, Prisma 7.10.1 with `@prisma/adapter-neon`, PostgreSQL (Neon Serverless).
- **Storage**: Neon Object Storage (AWS S3 SDK).
