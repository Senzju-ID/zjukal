
'use client';

import { useState } from 'react';
import CardThread from '@/components/ui/CardThread';
import CreateThread from '@/components/ui/CreateThread';
import Header from '@/components/layout/Header';
import { useThreads } from '@/context/ThreadContext';
import { Plus, Loader2 } from 'lucide-react';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { threads, isLoading, error } = useThreads();

  return (
    <main className="min-h-screen pb-20">
      <Header />

      <div className="max-w-2xl mx-auto px-5 mt-6 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-color-secondary tracking-wider">
          Newest Threads
        </h2>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-4 mt-2 px-5">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-xl text-center">
            {error}
          </div>
        ) : threads.length > 0 ? (
          threads.map((thread, index) => (
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
              deleteButton={false}
              isPriority={index === 0}
            />
          ))
        ) : (
          <div className="text-center py-20 text-color-secondary italic">
            No threads found
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
      />
    </main>
  );
}
