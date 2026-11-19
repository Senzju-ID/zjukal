'use client';

import { useState, useEffect } from 'react';
import CardThread from '@/components/ui/CardThread';
import EditThreadModal from '@/components/ui/EditThread';
import { fetchUserThreads, fetchMe } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface Thread {
  id: number;
  title: string;
  description: string;
  mediaUrl?: string | null;
  mediaType?: 'IMAGE' | 'VIDEO' | null;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  createdAt: string;
}

export default function UserFeed({ userId }: { userId: string }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [editingThread, setEditingThread] = useState<Thread | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setIsLoading(true);
        const [meData, userThreads] = await Promise.all([
          fetchMe().catch(() => null),
          fetchUserThreads(userId),
        ]);

        if (!ignore) {
          if (meData?.userId === userId) {
            setIsOwner(true);
          }
          setThreads(userThreads);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg = (err as { message?: string })?.message || 'Failed to fetch user threads';
          setError(msg);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-xl text-center">
        {error}
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="text-center py-20 text-color-secondary italic">
        No threads posted yet.
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {threads.map((thread, index) => (
          <CardThread 
            key={thread.id}
            id={thread.id}
            title={thread.title} 
            description={thread.description} 
            mediaUrl={thread.mediaUrl}
            mediaType={thread.mediaType}
            likesCount={thread.likesCount}
            dislikesCount={thread.dislikesCount}
            commentsCount={thread.commentsCount}
            deleteButton={isOwner}
            onEdit={isOwner ? () => setEditingThread(thread) : undefined}
            isPriority={index === 0}
          />
        ))}
      </div>

      <EditThreadModal 
        isOpen={!!editingThread}
        thread={editingThread}
        onClose={() => setEditingThread(null)}
      />
    </>
  );
}
