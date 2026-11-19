'use client';

import { ThumbsUp, MessageSquare, X, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchComments, addComment, toggleLikeComment } from '@/lib/api';
import { useThreads } from '@/context/ThreadContext';

interface Comment {
    id: number;
    threadId: number;
    context: string;
    likesCount: number;
    createdAt: string;
}

interface CommentThreadProps {
    isOpen: boolean;
    onClose: () => void;
    threadId: number;
    threadTitle: string;
    threadDescription?: string;
    commentsCount: number;
}

const CommentThread = ({
    isOpen,
    onClose,
    threadId,
    threadTitle,
    threadDescription,
    commentsCount: initialCommentsCount
}: CommentThreadProps) => {
    const { updateThread } = useThreads();
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newCommentText, setNewCommentText] = useState('');

    useEffect(() => {
        setCommentsCount(initialCommentsCount);
    }, [initialCommentsCount]);

    useEffect(() => {
        let ignore = false;
        if (isOpen && threadId) {
            document.body.style.overflow = 'hidden';
            setIsLoading(true);
            fetchComments(threadId)
                .then((data) => {
                    if (!ignore) {
                        setComments(data.comments || []);
                    }
                })
                .catch((err) => console.error('Failed to fetch comments:', err))
                .finally(() => {
                    if (!ignore) setIsLoading(false);
                });
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            ignore = true;
        };
    }, [isOpen, threadId]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('context', newCommentText.trim());

            const data = await addComment(threadId, formData);
            if (data?.comment) {
                const createdComment = Array.isArray(data.comment) ? data.comment[0] : data.comment;
                setComments((prev) => [...prev, createdComment]);
                const newCount = commentsCount + 1;
                setCommentsCount(newCount);
                updateThread(threadId, { commentsCount: newCount });
                setNewCommentText('');
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLikeComment = async (commentId: number) => {
        try {
            await toggleLikeComment(threadId, commentId);
            setComments((prev) =>
                prev.map((c) =>
                    c.id === commentId ? { ...c, likesCount: c.likesCount + 1 } : c
                )
            );
        } catch (error) {
            console.error('Failed to like comment:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex flex-col bg-black/60 transition-all animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div className="flex-1 w-full" />
            
            <div 
                className="bg-surface w-full max-w-2xl mx-auto h-[92dvh] sm:h-[85dvh] rounded-t-3xl border-t border-ui-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-ui-border/50 bg-surface flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold">{threadTitle}</h2>
                        {threadDescription && (
                            <p className="text-color-secondary text-sm mt-3 leading-relaxed whitespace-pre-wrap">
                                {threadDescription}
                            </p>
                        )}
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1 text-color-secondary hover:text-color-primary rounded-full hover:bg-ui/30 transition-colors cursor-pointer shrink-0 ml-4"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="bg-ui/30 px-6 py-2 border-b border-ui-border/30 flex justify-between items-center">
                    <span className="text-xs font-bold text-color-secondary uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        Comments ({commentsCount})
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-6 h-6 animate-spin text-accent" />
                        </div>
                    ) : comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="group cursor-default">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-mono text-accent/80">
                                        User
                                    </span>
                                    <span className="text-[10px] text-color-secondary italic">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="bg-ui/20 p-4 rounded-2xl rounded-tl-none border border-ui-border/40 group-hover:border-accent/30 hover:bg-ui/30 transition-all cursor-text">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.context}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-2 px-1">
                                    <button 
                                        onClick={() => handleLikeComment(comment.id)}
                                        className="flex items-center gap-1 text-[10px] text-color-secondary hover:text-accent transition-colors cursor-pointer bg-transparent border-none p-0"
                                    >
                                        <ThumbsUp className="w-3 h-3" />
                                        <span>{comment.likesCount}</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-color-secondary space-y-2 opacity-50">
                            <MessageSquare className="w-12 h-12 stroke-1" />
                            <p className="text-sm italic">No comments yet. Be the first to reply!</p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleAddComment} className="p-4 bg-ui/10 border-t border-ui-border/50 mt-auto flex items-center gap-3">
                    <div className="flex items-center gap-3 bg-surface border border-ui-border rounded-2xl p-2 pl-4 focus-within:border-accent transition-all flex-1">
                        <input 
                            type="text" 
                            placeholder="Write a comment... (Press Enter to reply)" 
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAddComment(e);
                                }
                            }}
                            className="bg-transparent flex-1 text-sm outline-none py-2"
                        />
                        <button 
                            type="submit"
                            disabled={isSubmitting || !newCommentText.trim()}
                            className="bg-accent text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                            <span>Reply</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommentThread;
