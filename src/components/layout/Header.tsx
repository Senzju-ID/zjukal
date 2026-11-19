'use client';

import ThemeSwitch from '@/components/ui/ThemeSwitch';
import { Spool, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchMe } from '@/lib/api';

const Header = () => {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchMe()
            .then((res) => {
                if (res?.userId) setUserId(res.userId);
            })
            .catch(() => {});
    }, []);

    return (
        <header className="flex w-full pt-4 px-7 justify-between items-center gap-4"> 
           <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 rounded-full bg-ui/50 flex items-center justify-center shrink-0 border border-ui-border shadow-sm">
                  <Spool size={18} className="text-color-primary" />
                </div> 
                <span className="font-bold tracking-tight text-2xl">Zjukal</span>
            </Link>
           </div>
           <div className="flex items-center gap-2 flex-1 justify-end max-w-md">
            {userId && (
                <Link 
                    href={`/${userId}`} 
                    className="p-2 bg-surface/40 backdrop-blur-md border border-ui-border rounded-xl shadow-lg hover:bg-ui/50 transition-all duration-300 flex items-center gap-2 text-xs font-semibold text-color-secondary hover:text-accent cursor-pointer"
                    title="My Threads"
                >
                    <User size={18} />
                    <span className="hidden sm:inline">My Threads</span>
                </Link>
            )}
            <ThemeSwitch sizeIcon={18} border={false} className="p-2 bg-surface/40 backdrop-blur-md border border-ui-border rounded-xl shadow-lg hover:bg-ui/50 transition-all duration-300" />
           </div>
        </header>
    );
};

export default Header;
