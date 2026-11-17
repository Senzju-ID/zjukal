'use client';

import { useState, useEffect } from 'react';
import CardThread from '@/components/CardThread';
import CreateThread from '@/components/CreateThread';
import Header from '@/components/Header';
import { fetchThreads } from '@/lib/api';
import { Plus, Loader2 } from 'lucide-react';

interface Thread {
  id: string;
  title: string;
  description?: string;
  imgPath?: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  createdAt: string;
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadThreads = async () => {
    try {
      setIsLoading(true);
      const data = await fetchThreads();
      setThreads(data);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || 'Failed to fetch threads');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  return (
    <main className="min-h-screen pb-20">
      <Header />
      
      <div className="px-7 mt-6 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-color-secondary tracking-wider">Newest Threads</h2>
      </div>

      <div className="flex flex-col gap-4 mt-2 px-5">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-xl text-center">
            {error}
          </div>
        ) : threads.length > 0 ? (
          threads.map((thread) => (
            <CardThread 
              key={thread.id}
              id={thread.id}
              title={thread.title} 
              description={thread.description} 
              imgPath={thread.imgPath}
              likesCount={thread.likesCount}
              dislikesCount={thread.dislikesCount}
              commentsCount={thread.commentsCount}
              onDelete={(id) => setThreads(threads.filter(t => t.id !== id))}
            />
          ))
        ) : (
          <div className="text-center py-20 text-color-secondary italic">
            No threads found. Create one!
          </div>
        )}
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white text-sm font-bold rounded-full shadow-2xl hover:scale-105 transition-all cursor-pointer z-40"
      >
        <Plus size={20} />
        <span>Create Thread</span>
      </button>

      <CreateThread 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadThreads} 
      />
    </main>
  );
}
