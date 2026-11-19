'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { editThread } from '@/lib/api';
import { useThreads } from '@/context/ThreadContext';

interface ThreadItem {
    id: number;
    title: string;
    description: string;
}

interface EditThreadProps {
    isOpen: boolean;
    thread: ThreadItem | null;
    onClose: () => void;
}

const EditThread = ({ isOpen, thread, onClose }: EditThreadProps) => {
    const { updateThread } = useThreads();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (thread) {
            setTitle(thread.title);
            setDescription(thread.description || '');
        }
    }, [thread]);

    if (!isOpen || !thread) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            setError('Title and description required.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);

            const res = await editThread(thread.id, formData);
            if (res.thread) {
                updateThread(thread.id, {
                    title: res.thread.title,
                    description: res.thread.description,
                });
            }
            onClose();
        } catch (err: unknown) {
            const msg = (err as { message?: string })?.message || 'Failed to edit thread.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex flex-col bg-black/60 transition-all animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div className="flex-1 w-full" />
            <div 
                className="bg-surface w-full max-w-lg mx-auto rounded-t-3xl border-t border-ui-border shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-ui-border/50 relative flex justify-between items-center">
                    <h2 className="text-xl font-bold">Edit Thread</h2>
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-ui/30 text-color-secondary"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-color-secondary uppercase tracking-wider mb-2">Title</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-ui/20 border border-ui-border rounded-xl p-3 text-sm outline-none focus:border-accent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-color-secondary uppercase tracking-wider mb-2">Description</label>
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-ui/20 border border-ui-border rounded-xl p-3 text-sm outline-none focus:border-accent resize-none"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-bold rounded-xl bg-ui/30 hover:bg-ui/50"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-xl shadow-lg disabled:opacity-50 flex items-center gap-2 hover:opacity-90"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>Save Changes</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditThread;