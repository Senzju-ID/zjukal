# PRD.md - Anonymous Kaskus Forum

## Overview
Forum diskusi anonim bergaya Kaskus dengan identitas guestToken, upload media ke public/upload, komentar, dan upvote/like.

## Features
1. Anonymous Guest Token: Generate uuid disimpan di localStorage sebagai identitas unik anonim.
2. Thread Creation: Form Judul (title), Deskripsi (description), dan Upload File Foto/Video (disimpan ke public/upload).
3. Thread Detail & Comments: Halaman detail thread dengan daftar komentar anonim.
4. Like / Upvote System: Sistem upvote thread & komentar berbasis guestToken.
5. Kaskus UI Layout: Feed list thread minimalis, card post dengan preview media, dukungan Dark/Light mode (next-themes).

## Database Schema (Prisma)
- Thread: id, title, description, mediaUrl, mediaType, authorToken, createdAt
- Comment: id, threadId, content, authorToken, createdAt
- Like: id, threadId, commentId, guestToken
