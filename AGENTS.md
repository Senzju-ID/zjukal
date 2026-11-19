# AGENTS.md - Developer Guidelines & Architecture

## Role & Expertise
- Senior Web Development Expert (Next.js 16, TypeScript, Fullstack Architecture, SQLite, Prisma, Tailwind CSS v4).

## Tech Stack & Conventions
- Framework: Next.js 16 (App Router), React 19.
- Styling: Tailwind CSS v4 (@theme, CSS variables).
- Theme: `next-themes` (ThemeProvider, ThemeSwitch in `src/components/ui/ThemeSwitch.tsx`).
- ORM/Database: Prisma 7 with SQLite (`@prisma/adapter-better-sqlite3`).
- File Upload: Local storage (`public/uploads/`, valid types: png, jpg, jpeg, mp4, webm). Ignore contents in `.gitignore` except `.gitkeep`.
- State / Auth: Anonymous `authorToken` stored in HTTP-only Cookie, generated via `src/proxy.ts` (`src/middleware.ts`) and accessed via `getGuestToken()` in `src/lib/userToken.ts`.
- API Client Layer: Native `fetch` wrapper in `src/lib/api.ts` (automatically sends cookies).

## Database & Indexing Rules
- `Thread`: ID string (UUID). Contains atomic counters `commentsCount`, `likesCount`, and `dislikesCount`. Indexed by `createdAt` (`@@index([createdAt])`).
- `Comment`: ID integer (`autoincrement`). Relates to `threadId` (`onDelete: Cascade`), contains `likesCount`. Indexed by `threadId` (`@@index([threadId])`).
- `Like`: ID integer (`autoincrement`). Foreign keys `threadId` and `commentId` (`onDelete: Cascade`). Composite unique constraints: `@@unique([threadId, authorToken])` and `@@unique([commentId, authorToken])`.
- `Dislike`: ID integer (`autoincrement`). Foreign key `threadId` (`onDelete: Cascade`). Composite unique constraint: `@@unique([threadId, authorToken])`.

## Business Logic Rules
- **Like & Dislike Mutual Exclusion**: User tidak bisa Like dan Dislike bersamaan di 1 thread. Menekan Like saat Dislike aktif akan menghapus Dislike dan sebaliknya secara atomic via `prisma.$transaction`.

## Coding Rules
- Gunakan stdlib / native fitur pertama (`fetch` native, tanpa Axios).
- Kode minimal, kering, YAGNI, hindari over-engineering.
- Validasi input di trust boundaries.


