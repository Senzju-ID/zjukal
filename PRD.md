# PRD.md - Anonymous Kaskus Forum

## Overview
Forum diskusi anonim bergaya Kaskus dengan identitas `guestToken`, upload media, komentar, dan upvote.

## Core Features
1. **Anonymous Identity**: `guestToken` (uuid) di `localStorage`.
2. **Threads**: Title, Description, Media (Image/Video).
3. **Media Validation**: Hanya .png, .jpg, .jpeg, .mp4, .webm.
4. **Interaction**: Komentar (threaded) & Like (Threads & Comments).
5. **Theme**: Dark/Light mode switcher (`ThemeSwitch.tsx`).

## Database Schema (Prisma)
- `Thread`: id, title, description, mediaUrl, mediaType, authorToken, createdAt
- `Comment`: id, threadId, content, authorToken, createdAt
- `Like`: id, threadId, commentId, guestToken

## Implementation Roadmap
1. `prisma/schema.prisma` (define model & migrate).
2. API Routes (CRUD Threads, Comments, Likes, Uploads).
3. UI Components (CardPost, Feed, ThreadDetail, ThemeSwitch).
