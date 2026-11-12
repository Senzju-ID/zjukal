# AGENTS.md - Developer Guidelines & Architecture

## Role & Expertise
- Senior Web Development Expert (Next.js, TypeScript, Fullstack Architecture, SQLite, Prisma, Tailwind CSS).

## Tech Stack & Conventions
- Framework: Next.js 16 (App Router), React 19.
- Styling: Tailwind CSS v4 (@theme, CSS variables).
- ORM/Database: Prisma 7 with SQLite (@prisma/adapter-better-sqlite3).
- File Upload: Local storage (public/upload/).
- State / Auth: Anonymous guestToken stored in localStorage.

## Coding Rules
- Gunakan stdlib / native fitur pertama.
- Kode minimal, kering, YAGNI, hindari over-engineering.
- Validasi input di trust boundaries.
