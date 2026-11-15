# PRD.md - Anonymous Kaskus Forum

## Overview
Forum diskusi anonim bergaya Kaskus dengan identitas `authorToken` otomatis via Cookie, upload media, komentar, upvote/like, downvote/dislike, dan performa database teroptimasi dengan B-Tree index dan atomic counter.

## Core Features
1. **Anonymous Identity**: `authorToken` otomatis dibuat dan dikirim via Cookie (`httpOnly`, `1 tahun`) melalui `src/proxy.ts` & `src/lib/userToken.ts`.
2. **Threads**: Title, Description, Media (Image/Video), Atomic `commentsCount`, `likesCount`, & `dislikesCount`.
3. **Media Validation**: File upload disimpan ke `/public/uploads/` (hanya .png, .jpg, .jpeg, .mp4, .webm).
4. **Interaction**: Komentar per Thread, Like & Dislike pada Thread (Mutual Exclusion), serta Like Komentar.
5. **Theme**: Dark/Light mode switcher (`ThemeSwitch.tsx`).

## Database Schema (Prisma)
- **Thread**: `id` (UUID), `title`, `description`, `mediaUrl`, `mediaType`, `authorToken`, `createdAt`, `commentsCount` (Int), `likesCount` (Int), `dislikesCount` (Int), `@@index([createdAt])`.
- **Comment**: `id` (Int Autoincrement), `threadId`, `context`, `authorToken`, `createdAt`, `likesCount` (Int), `@@index([threadId])`.
- **Like**: `id` (Int Autoincrement), `threadId`, `commentId`, `authorToken`, `@@unique([threadId, authorToken])`, `@@unique([commentId, authorToken])`.
- **Dislike**: `id` (Int Autoincrement), `threadId`, `authorToken`, `@@unique([threadId, authorToken])`.

## API Routes Specification
- `GET /api/threads` - Mengambil daftar semua thread.
- `POST /api/threads` - Membuat thread baru & upload media.
- `PATCH /api/threads/[id]` - Mengedit title/description thread.
- `DELETE /api/threads/[id]` - Menghapus thread & file media terkait.
- `POST /api/threads/[id]/likes` - Toggle like thread (atomic mutual exclusion dengan dislike).
- `POST /api/threads/[id]/dislikes` - Toggle dislike thread (atomic mutual exclusion dengan like).
- `GET /api/threads/[id]/comments` - Mengambil komentar dari thread tertentu.
- `POST /api/threads/[id]/comments` - Menambah komentar baru ke thread.
- `DELETE /api/threads/[id]/comments/[commentId]` - Menghapus komentar.
- `POST /api/threads/[id]/comments/[commentId]/likes` - Toggle like komentar.

## Implementation Roadmap
1. `prisma/schema.prisma` (definisi model, indeks, & relasi).
2. Helper & Auth Layer (`src/lib/userToken.ts`, `src/lib/api.ts`, `src/proxy.ts`).
3. API Routes (`/api/threads`, `/api/threads/[id]`, comments, likes, dislikes).
4. UI Components (CardPost, Feed, ThreadDetail, ThemeSwitch).


