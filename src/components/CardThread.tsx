'use client';

import Image from 'next/image';
import { ThumbsUp, ThumbsDown, MessageSquare, Trash2 } from 'lucide-react';
import { toggleLikeThread, toggleDislikeThread, deleteThread } from '@/lib/api';
import { useState } from 'react';
import CommentThread from './CommentThread';

interface CardThreadProps {
    id: string;
    title: string;
    description?: string;
    imgPath?: string;
    likesCount?: number;
    dislikesCount?: number;
    commentsCount?: number;
    onDelete?: (id: string) => void;
}

const CardThread = ({ 
    id,
    title, 
    description, 
    imgPath, 
    likesCount: initialLikes = 0, 
    dislikesCount: initialDislikes = 0, 
    commentsCount = 0,
    onDelete
}: CardThreadProps) => {
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
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
                setLikes(data.likesCount);
                setDislikes(data.dislikesCount);
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
            if (onDelete) onDelete(id);
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
                <h1 className="text-xl font-bold transition-colors">
                    {title}
                </h1>
                
                {description && (
                    <p className="text-color-secondary text-sm mt-2 line-clamp-2">
                        {description}
                    </p>
                )}

                {imgPath && (
                    <div className={`rounded-xl mt-4 relative w-full border border-ui-border ${!imageLoaded ? 'animate-pulse bg-ui/20 min-h-50' : ''}`}>
                        <Image 
                            src={imgPath} 
                            alt={title} 
                            width={1000}
                            height={1000}
                            className={`w-full h-auto object-contain rounded-xl transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setImageLoaded(true)}
                            unoptimized
                        />
                    </div>
                )}

                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-ui-border/50">
                    <button 
                        onClick={(e) => handleAction('like', e)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 text-color-secondary hover:text-accent-hover disabled:opacity-50 transition-colors cursor-pointer bg-transparent border-none p-0"
                    >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-xs font-medium">{likes}</span>
                    </button>
                    
                    <button 
                        onClick={(e) => handleAction('dislike', e)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 text-color-secondary hover:text-red-500 disabled:opacity-50 transition-colors cursor-pointer bg-transparent border-none p-0"
                    >
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-xs font-medium">{dislikes}</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-color-secondary">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs font-medium">{commentsCount}</span>
                    </div>

                    <button 
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="ml-auto flex items-center gap-1.5 text-color-secondary hover:text-red-500 disabled:opacity-50 transition-colors cursor-pointer bg-transparent border-none p-0"
                        title="Delete Thread"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <CommentThread 
                isOpen={isCommentOpen}
                onClose={() => setIsCommentOpen(false)}
                threadTitle={title}
                threadDescription={description}
                imgPath={imgPath}
                commentsCount={commentsCount}
            />
        </>
    )
}

export default CardThread;
