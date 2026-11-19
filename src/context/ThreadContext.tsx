'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { fetchThreads } from '@/lib/api';

export interface Thread {
  id: number;
  title: string;
  description: string;
  mediaUrl?: string | null;
  mediaType?: 'IMAGE' | 'VIDEO' | null;
  commentsCount: number;
  likesCount: number;
  dislikesCount: number;
  createdAt: string;
}

interface ThreadContextType {
  threads: Thread[];
  isLoading: boolean;
  error: string | null;
  refreshThreads: () => Promise<void>;
  updateThread: (id: number, patch: Partial<Thread>) => void;
  removeThread: (id: number) => void;
}

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

export function ThreadProvider({ children }: { children: React.ReactNode }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadThreads = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchThreads();
      setThreads(data);
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Failed to fetch threads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const updateThread = useCallback((id: number, patch: Partial<Thread>) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
    );
  }, []);

  const removeThread = useCallback((id: number) => {
    setThreads((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ThreadContext.Provider
      value={{
        threads,
        isLoading,
        error,
        refreshThreads: loadThreads,
        updateThread,
        removeThread,
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
}

export function useThreads() {
  const context = useContext(ThreadContext);
  if (!context) throw new Error('useThreads must be used within ThreadProvider');
  return context;
}
