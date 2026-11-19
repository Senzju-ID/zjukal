import Header from '@/components/layout/Header';
import UserFeed from './UserFeed';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense, use } from 'react';
import { Loader2 } from 'lucide-react';

async function UserProfileContent({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return (
    <>
      <div className="px-7 mt-6 flex items-center gap-4">
        <Link href="/" className="p-2 bg-ui/30 hover:bg-ui/50 rounded-xl transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-lg font-bold">User Profile</h2>
          <p className="text-xs text-color-secondary font-mono">ID: {userId}</p>
        </div>
      </div>
      <div className="mt-6 px-5">
        <UserFeed userId={userId} />
      </div>
    </>
  );
}

export default function UserThreadsPage({ params }: { params: Promise<{ userId: string }> }) {
  return (
    <main className="min-h-screen pb-20">
      <Header />
      <Suspense fallback={<div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>}>
        <UserProfileContent params={params} />
      </Suspense>
    </main>
  );
}
