'use client';

import { useState } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { createThread } from '@/lib/api';

interface CreateThreadProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface ApiError {
    message?: string;
}

const CreateThread = ({ isOpen, onClose, onSuccess }: CreateThreadProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

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
            if (file) formData.append('file', file);

            await createThread(formData);
            setTitle('');
            setDescription('');
            setFile(null);
            onSuccess();
            onClose();
        } catch (err: unknown) {
            const errorObj = err as ApiError;
            setError(errorObj.message || 'Failed create thread.');
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
                    <h2 className="text-xl font-bold">Create New Thread</h2>
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        form="create-thread-form"
                        className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-xl shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>Post</span>
                    </button>
                </div>

                <form id="create-thread-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
                    {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-xl">{error}</div>}

                    <div>
                        <label className="block text-xs font-bold text-color-secondary uppercase tracking-wider mb-2">Title</label>
                        <input 
                            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full bg-ui/20 border border-ui-border rounded-xl p-3 text-sm outline-none focus:border-accent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-color-secondary uppercase tracking-wider mb-2">Description</label>
                        <textarea 
                            value={description} onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write your thread details..." rows={4}
                            className="w-full bg-ui/20 border border-ui-border rounded-xl p-3 text-sm outline-none focus:border-accent resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-color-secondary uppercase tracking-wider mb-2">Media (Optional)</label>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 px-4 py-2.5 bg-ui/40 hover:bg-ui/60 border border-ui-border rounded-xl text-sm font-medium cursor-pointer">
                                <ImageIcon className="w-4 h-4 text-accent" />
                                <span>{file ? file.name : 'Choose Image/Video'}</span>
                                <input type="file" accept="image/png,image/jpg,image/jpeg,video/mp4,video/webm" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                            </label>
                            {file && <button type="button" onClick={() => setFile(null)} className="text-xs text-red-500 hover:underline cursor-pointer">Remove</button>}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateThread;