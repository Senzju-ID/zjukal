# AGENTS.md - Developer Guidelines & Architecture

## Role & Expertise
- Senior Web Development Expert (Next.js 16, TypeScript, Fullstack Architecture, SQLite, Prisma, Tailwind CSS v4).

## Tech Stack & Conventions
- Framework: Next.js 16 (App Router), React 19.
- Styling: Tailwind CSS v4 (@theme, CSS variables).
- Theme: `next-themes` (ThemeProvider, ThemeSwitch in `src/components/ui/ThemeSwitch.tsx`).
- ORM/Database: Prisma 7 with SQLite (`@prisma/adapter-better-sqlite3`).
- File Upload: Local storage (`public/upload/`, valid types: png, jpg, jpeg, mp4, webm).
- State / Auth: Anonymous `guestToken` stored in `localStorage`.

## Coding Rules
- Gunakan stdlib / native fitur pertama.
- Kode minimal, kering, YAGNI, hindari over-engineering.
- Validasi input di trust boundaries.
