'use client';

import Image from 'next/image';
import { ThumbsUp, ThumbsDown, MessageSquare, Trash2, Edit } from 'lucide-react';
import { toggleLikeThread, toggleDislikeThread, deleteThread } from '@/lib/api';
import { useState } from 'react';
import CommentThread from './CommentThread';
import { useThreads } from '@/context/ThreadContext';

interface CardThreadProps {
    id: number;
    title: string;
    description?: string;
    mediaUrl?: string | null;
    mediaType?: 'IMAGE' | 'VIDEO' | null;
    likesCount?: number;
    dislikesCount?: number;
    commentsCount?: number;
    deleteButton?: boolean;
    onEdit?: () => void;
    isPriority?: boolean;
}

const CardThread = ({ 
    id,
    title, 
    description, 
    mediaUrl, 
    mediaType,
    likesCount = 0, 
    dislikesCount = 0, 
    commentsCount = 0,
    deleteButton = false,
    onEdit,
    isPriority = false
}: CardThreadProps) => {
    const { updateThread, removeThread } = useThreads();
    const [isLoading, setIsLoading] = useState(false);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleAction = async (action: 'like' | 'dislike', e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLoading || !id) return;
        
        setIsLoading(true);
        try {
            const data = action === 'like' 
                ? await toggleLikeThread(id) 
                : await toggleDislikeThread(id);
            
            if (data) {
                updateThread(id, {
                    likesCount: data.likesCount,
                    dislikesCount: data.dislikesCount
                });
            }
        } catch (error) {
            console.error(`${action} failed:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLoading || !id) return;
        if (!confirm('Are you sure you want to delete this thread?')) return;

        setIsLoading(true);
        try {
            await deleteThread(id);
            removeThread(id);
        } catch (error) {
            console.error('Delete thread failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div 
                onClick={() => setIsCommentOpen(true)}
                className="flex flex-col w-full bg-surface rounded-2xl shadow-sm p-5 border border-ui-border hover:border-accent transition-all duration-300 cursor-pointer"
            >
                <div className="flex justify-between items-start gap-4">
                    <h1 className="text-xl font-bold transition-colors flex-1">{title}</h1>
                    {onEdit && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(); }}
                            className="p-1.5 text-color-secondary hover:text-accent rounded-lg bg-ui/20 hover:bg-ui/40 transition-colors cursor-pointer"
                            title="Edit Thread"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                    )}
                </div>
                
                {description && (
                    <p className="text-color-secondary text-sm mt-2 line-clamp-3">{description}</p>
                )}

                {mediaUrl && (
                    <div className={`rounded-xl mt-4 relative w-full overflow-hidden flex justify-center items-center bg-black/10 dark:bg-black/30 border border-ui-border/50 max-h-[380px] ${!imageLoaded && mediaType !== 'VIDEO' ? 'animate-pulse min-h-[180px]' : ''}`}>
                        {mediaType === 'VIDEO' ? (
                            <video 
                                src={mediaUrl} 
                                controls 
                                playsInline 
                                onClick={(e) => e.stopPropagation()} 
                                className="w-full max-h-[380px] object-contain rounded-xl bg-black"
                            />
                        ) : (
                            <Image 
                                src={mediaUrl} 
                                alt={title} 
                                width={1000}
                                height={1000}
                                priority={isPriority}
                                className={`w-full max-h-[380px] object-contain rounded-xl transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                onLoad={() => setImageLoaded(true)}
                                unoptimized
                            />
                        )}
                    </div>
                )}

                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-ui-border/50">
                    <button 
                        onClick={(e) => handleAction('like', e)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 text-color-secondary hover:text-accent-hover disabled:opacity-50 transition-colors cursor-pointer bg-transparent border-none p-0"
                    >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-xs font-medium">{likesCount}</span>
                    </button>
                    
                    <button 
                        onClick={(e) => handleAction('dislike', e)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 text-color-secondary hover:text-red-500 disabled:opacity-50 transition-colors cursor-pointer bg-transparent border-none p-0"
                    >
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-xs font-medium">{dislikesCount}</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-color-secondary">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs font-medium">{commentsCount}</span>
                    </div>

                    {deleteButton && (
                        <button 
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="ml-auto flex items-center gap-1.5 text-color-secondary hover:text-red-500 disabled:opacity-50 transition-colors cursor-pointer bg-transparent border-none p-0"
                            title="Delete Thread"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <CommentThread 
                isOpen={isCommentOpen}
                onClose={() => setIsCommentOpen(false)}
                threadId={id}
                threadTitle={title}
                threadDescription={description}
                commentsCount={commentsCount}
            />
        </>
    );
};

export default CardThread;
