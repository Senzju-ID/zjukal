# PRD.md - Anonymous Kaskus Forum

## Overview
Forum diskusi anonim bergaya Kaskus dengan identitas `guestToken` otomatis via Cookie, upload media, komentar, upvote/like, dan performa database teroptimasi dengan B-Tree index dan atomic counter.

## Core Features
1. **Anonymous Identity**: `guestToken` otomatis dibuat dan dikirim via Cookie (`httpOnly`, `1 tahun`) melalui `src/proxy.ts` & `src/lib/guestUser.ts`.
2. **Threads**: Title, Description, Media (Image/Video), Atomic `commentsCount` & `likesCount`.
3. **Media Validation**: File upload disimpan ke `/public/uploads/` (hanya .png, .jpg, .jpeg, .mp4, .webm).
4. **Interaction**: Komentar per Thread & Like (Threads & Comments) dengan pencegahan double-like via DB unique constraint.
5. **Theme**: Dark/Light mode switcher (`ThemeSwitch.tsx`).

## Database Schema (Prisma)
- **Thread**: `id` (UUID), `title`, `description`, `mediaUrl`, `mediaType`, `authorToken`, `createdAt`, `commentsCount` (Int), `likesCount` (Int), `@@index([createdAt])`.
- **Comment**: `id` (Int Autoincrement), `threadId`, `context`, `authorToken`, `createdAt`, `likesCount` (Int), `@@index([threadId])`.
- **Like**: `id` (Int Autoincrement), `threadId`, `commentId`, `authorToken`, `@@unique([threadId, authorToken])`, `@@unique([commentId, authorToken])`.

## API Routes Specification
- `GET /api/threads` - Mengambil daftar semua thread.
- `POST /api/threads` - Membuat thread baru & upload media.
- `PATCH /api/threads/[id]` - Mengedit title/description thread.
- `DELETE /api/threads/[id]` - Menghapus thread & file media terkait.
- `POST /api/threads/[id]/likes` - Toggle like thread (atomic increment/decrement).
- `GET /api/threads/[id]/comments` - Mengambil komentar dari thread tertentu.
- `POST /api/threads/[id]/comments` - Menambah komentar baru ke thread.
- `DELETE /api/threads/[id]/comments/[commentId]` - Menghapus komentar.
- `POST /api/threads/[id]/comments/[commentId]/likes` - Toggle like komentar.

## Implementation Roadmap
1. `prisma/schema.prisma` (definisi model & indeks).
2. Helper & Auth Layer (`src/lib/guestUser.ts`, `src/lib/api.ts`, `src/proxy.ts`).
3. API Routes (`/api/threads`, `/api/threads/[id]`, comments, likes).
4. UI Components (CardPost, Feed, ThreadDetail, ThemeSwitch).

