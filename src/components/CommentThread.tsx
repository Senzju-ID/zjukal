import { ThumbsUp, MessageSquare, X } from 'lucide-react';
import { useEffect } from 'react';

interface Comment {
    id: number;
    authorToken: string;
    context: string;
    likesCount: number;
    createdAt: string;
}

interface CommentThreadProps {
    isOpen: boolean;
    onClose: () => void;
    threadTitle: string;
    threadDescription?: string;
    imgPath?: string;
    comments?: Comment[];
    commentsCount: number;
}

const CommentThread = ({
    isOpen,
    onClose,
    threadTitle,
    threadDescription,
    imgPath,
    comments = [],
    commentsCount
}: CommentThreadProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 transition-all animate-in fade-in duration-200">
            <div className="bg-surface w-full max-w-2xl h-[92dvh] sm:h-[85dvh] rounded-t-3xl sm:rounded-3xl border-t sm:border border-ui-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
                
                <div className="p-6 border-b border-ui-border/50 relative bg-surface overflow-y-auto max-h-[50vh]">
                    <button 
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 rounded-full hover:bg-ui/50 transition-colors text-color-secondary cursor-pointer z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    <h2 className="text-xl font-bold pr-8">{threadTitle}</h2>
                    {threadDescription && (
                        <p className="text-color-secondary text-sm mt-3 leading-relaxed whitespace-pre-wrap">
                            {threadDescription}
                        </p>
                    )}

                    {imgPath && (
                        <div className="overflow-hidden rounded-xl mt-4">
                            <img 
                                src={imgPath} 
                                alt={threadTitle} 
                                className="w-full max-h-64 object-cover"
                            />
                        </div>
                    )}
                </div>

                <div className="bg-ui/30 px-6 py-2 border-b border-ui-border/30 flex justify-between items-center">
                    <span className="text-xs font-bold text-color-secondary uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        Comments ({commentsCount})
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="group cursor-default">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-mono text-accent/80">
                                        Author_{comment.authorToken.slice(0, 8)}
                                    </span>
                                    <span className="text-[10px] text-color-secondary italic">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="bg-ui/20 p-4 rounded-2xl rounded-tl-none border border-ui-border/40 group-hover:border-accent/30 hover:bg-ui/30 transition-all cursor-text">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.context}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-2 px-1">
                                    <button className="flex items-center gap-1 text-[10px] text-color-secondary hover:text-accent transition-colors cursor-pointer">
                                        <ThumbsUp className="w-3 h-3" />
                                        {comment.likesCount}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-color-secondary space-y-2 opacity-50">
                            <MessageSquare className="w-12 h-12 stroke-1" />
                            <p className="text-sm italic">No comments yet. Be the first to reply!</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-ui/10 border-t border-ui-border/50">
                    <div className="flex items-center gap-3 bg-surface border border-ui-border rounded-2xl p-2 pl-4 focus-within:border-accent transition-all">
                        <input 
                            type="text" 
                            placeholder="Write a comment..." 
                            className="bg-transparent flex-1 text-sm outline-none py-2"
                        />
                        <button className="bg-accent text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity cursor-pointer">
                            Reply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentThread;
