'use client';

import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { toggleLikeThread, toggleDislikeThread } from '@/lib/api';
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
}

const CardThread = ({ 
    id,
    title, 
    description, 
    imgPath, 
    likesCount: initialLikes = 0, 
    dislikesCount: initialDislikes = 0, 
    commentsCount = 0 
}: CardThreadProps) => {
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [isLoading, setIsLoading] = useState(false);
    const [isCommentOpen, setIsCommentOpen] = useState(false);

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
                    <div className="overflow-hidden rounded-xl mt-4">
                        <img 
                            src={imgPath} 
                            alt={title} 
                            className="w-full h-48 object-cover"
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
