
'use client';

import { useState } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { createThread } from '@/lib/api';
import { useThreads } from '@/context/ThreadContext';

interface CreateThreadProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_TYPES = [
    'image/png',
    'image/jpeg',
    'video/mp4',
    'video/webm',
];

const CreateThread = ({ isOpen, onClose, onSuccess }: CreateThreadProps) => {
    const { refreshThreads } = useThreads();
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

        if (file) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                setError('Unsupported file type.');
                return;
            }

            if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
                setError('File size must be between 0 and 50 MB.');
                return;
            }
        }

        setIsLoading(true);
        setError('');

        try {
            let mediaKey: string | null = null;
            let mediaType: 'IMAGE' | 'VIDEO' | null = null;

            if (file) {
                const presignedResponse = await fetch('/api/uploads/presigned', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fileName: file.name,
                        contentType: file.type,
                        size: file.size,
                    }),
                });

                const presignedData = await presignedResponse.json();

                if (!presignedResponse.ok) {
                    throw new Error(
                        presignedData.error || 'Failed to prepare media upload.'
                    );
                }

                const uploadResponse = await fetch(presignedData.uploadUrl, {
                    method: 'PUT',
                    headers: presignedData.headers,
                    body: file,
                });

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload media to storage.');
                }

                mediaKey = presignedData.key;
                mediaType = presignedData.mediaType;
            }

            await createThread({
                title: title.trim(),
                description: description.trim(),
                mediaKey,
                mediaType,
            });

            setTitle('');
            setDescription('');
            setFile(null);

            await refreshThreads();

            if (onSuccess) onSuccess();
            onClose();
        } catch (err: unknown) {
            setError(
                err instanceof Error ? err.message : 'Failed to create thread.'
            );
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

                <form
                    id="create-thread-form"
                    onSubmit={handleSubmit}
                    className="p-6 space-y-4 overflow-y-auto max-h-[80vh]"
                >
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-color-secondary uppercase tracking-wider mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full bg-ui/20 border border-ui-border rounded-xl p-3 text-sm outline-none focus:border-accent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-color-secondary uppercase tracking-wider mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write your thread details..."
                            rows={4}
                            className="w-full bg-ui/20 border border-ui-border rounded-xl p-3 text-sm outline-none focus:border-accent resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-color-secondary uppercase tracking-wider mb-2">
                            Media (Optional)
                        </label>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 px-4 py-2.5 bg-ui/40 hover:bg-ui/60 border border-ui-border rounded-xl text-sm font-medium cursor-pointer">
                                <ImageIcon className="w-4 h-4 text-accent" />
                                <span>{file ? file.name : 'Choose Image/Video'}</span>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,video/mp4,video/webm"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                            </label>
                            {file && (
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="text-xs text-red-500 hover:underline cursor-pointer"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateThread;
