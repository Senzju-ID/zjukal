-- CreateTable
CREATE TABLE "AnonymousUser" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnonymousUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thread" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "mediaType" TEXT,
    "anonymousUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentsCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "dislikesCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "threadId" INTEGER NOT NULL,
    "context" TEXT NOT NULL,
    "anonymousUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likesCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "threadId" INTEGER,
    "commentId" INTEGER,
    "anonymousUserId" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dislike" (
    "id" SERIAL NOT NULL,
    "threadId" INTEGER,
    "anonymousUserId" TEXT NOT NULL,

    CONSTRAINT "Dislike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnonymousUser_tokenHash_key" ON "AnonymousUser"("tokenHash");

-- CreateIndex
CREATE INDEX "Thread_createdAt_idx" ON "Thread"("createdAt");

-- CreateIndex
CREATE INDEX "Thread_anonymousUserId_idx" ON "Thread"("anonymousUserId");

-- CreateIndex
CREATE INDEX "Comment_threadId_idx" ON "Comment"("threadId");

-- CreateIndex
CREATE INDEX "Comment_anonymousUserId_idx" ON "Comment"("anonymousUserId");

-- CreateIndex
CREATE INDEX "Like_anonymousUserId_idx" ON "Like"("anonymousUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_threadId_anonymousUserId_key" ON "Like"("threadId", "anonymousUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_commentId_anonymousUserId_key" ON "Like"("commentId", "anonymousUserId");

-- CreateIndex
CREATE INDEX "Dislike_anonymousUserId_idx" ON "Dislike"("anonymousUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Dislike_threadId_anonymousUserId_key" ON "Dislike"("threadId", "anonymousUserId");

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_anonymousUserId_fkey" FOREIGN KEY ("anonymousUserId") REFERENCES "AnonymousUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_anonymousUserId_fkey" FOREIGN KEY ("anonymousUserId") REFERENCES "AnonymousUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_anonymousUserId_fkey" FOREIGN KEY ("anonymousUserId") REFERENCES "AnonymousUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dislike" ADD CONSTRAINT "Dislike_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dislike" ADD CONSTRAINT "Dislike_anonymousUserId_fkey" FOREIGN KEY ("anonymousUserId") REFERENCES "AnonymousUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
