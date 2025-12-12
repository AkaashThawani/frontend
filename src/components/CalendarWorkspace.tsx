import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, GripVertical, Table, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarWorkspaceProps {
    posts: any[];
    campaignStartDate: string | null;
}

const CalendarWorkspace: React.FC<CalendarWorkspaceProps> = ({ posts, campaignStartDate }) => {
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');

    // Initialize weekStart with campaign start date, defaulting to today if not provided
    const [weekStart, setWeekStart] = useState<Date>(() => {
        if (campaignStartDate) {
            const startDate = new Date(campaignStartDate);
            startDate.setHours(0, 0, 0, 0);
            return startDate;
        }
        return new Date();
    });

    // Update weekStart when campaignStartDate changes
    React.useEffect(() => {
        if (campaignStartDate) {
            const startDate = new Date(campaignStartDate);
            startDate.setHours(0, 0, 0, 0);
            setWeekStart(startDate);
        }
    }, [campaignStartDate]);

    // Group posts by day
    const groupPostsByDay = () => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const days = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            
            const dayPosts = posts.filter(post => {
                if (!post.scheduled_time) return false;
                const postDate = new Date(post.scheduled_time);
                return postDate.toDateString() === date.toDateString();
            }).map(post => ({
                id: post.id,
                title: post.title,
                sub: post.subreddit,
                time: new Date(post.scheduled_time).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }),
                commentCount: post.comments?.length || 0
            }));
            
            days.push({
                name: daysOfWeek[date.getDay()],
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                posts: dayPosts
            });
        }
        
        return days;
    };

    const days = groupPostsByDay();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[600px]">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => {
                                const newDate = new Date(weekStart);
                                newDate.setDate(newDate.getDate() - 7);
                                setWeekStart(newDate);
                            }}
                            className="p-1 hover:bg-white rounded shadow-sm transition"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="px-3 text-sm font-medium text-gray-700">
                            {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <button
                            onClick={() => {
                                const newDate = new Date(weekStart);
                                newDate.setDate(newDate.getDate() + 7);
                                setWeekStart(newDate);
                            }}
                            className="p-1 hover:bg-white rounded shadow-sm transition"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`p-2 rounded transition ${viewMode === 'calendar' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                        >
                            <CalendarIcon className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded transition ${viewMode === 'table' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                        >
                            <Table className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    {posts.length} Posts Scheduled
                </div>
            </div>

            {/* Content Area */}
            {viewMode === 'calendar' ? (
                /* Calendar Grid */
                <div className="flex-1 grid grid-cols-7 divide-x divide-gray-200 overflow-hidden">
                    {days.map((day) => (
                        <div key={day.name} className="flex flex-col">
                            <div className="p-3 text-center border-b border-gray-100 bg-gray-50">
                                <span className="block text-xs font-medium text-gray-500 uppercase">{day.name}</span>
                                <span className="block text-sm font-bold text-gray-900">{day.date}</span>
                            </div>
                            <div className="flex-1 p-2 space-y-2 bg-white hover:bg-gray-50/50 transition relative">
                                {day.posts.map((post) => {
                                    const fullPost = posts.find(p => p.id === post.id);
                                    return (
                                        <div
                                            key={post.id}
                                            onClick={() => setSelectedPost(fullPost)}
                                            className="group p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-brand-300 transition cursor-pointer"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">{post.sub}</span>
                                                <GripVertical className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100" />
                                            </div>
                                            <h4 className="text-xs font-medium text-gray-900 leading-tight line-clamp-2">{post.title}</h4>
                                            <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                                                <span>{post.time}</span>
                                                {post.commentCount > 0 && (
                                                    <span className="text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                                                        {post.commentCount} comments
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* {day.posts.length === 0 && (
                                    <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition">
                                        <button className="text-xs text-brand-600 font-medium border border-dashed border-brand-200 px-2 py-1 rounded hover:bg-brand-50">
                                            + Add Post
                                        </button>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Table View */
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 font-medium text-gray-700">Post ID</th>
                                <th className="px-4 py-3 font-medium text-gray-700">Subreddit</th>
                                <th className="px-4 py-3 font-medium text-gray-700">Title</th>
                                <th className="px-4 py-3 font-medium text-gray-700">Body</th>
                                <th className="px-4 py-3 font-medium text-gray-700">Author</th>
                                <th className="px-4 py-3 font-medium text-gray-700">Timestamp</th>
                                <th className="px-4 py-3 font-medium text-gray-700">Keyword IDs</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{post.id}</td>
                                    <td className="px-4 py-3 text-gray-900">{post.subreddit}</td>
                                    <td className="px-4 py-3 text-gray-900 max-w-xs truncate">{post.title}</td>
                                    <td className="px-4 py-3 text-gray-600 max-w-sm truncate">{post.body}</td>
                                    <td className="px-4 py-3 text-gray-600">{post.author_username}</td>
                                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                                        {new Date(post.scheduled_time).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                                        {post.keyword_ids ? post.keyword_ids.join(', ') : ''}
                                    </td>
                                </tr>
                            ))}
                            {posts.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                        No posts scheduled for this week
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Comments Table */}
                    {posts.some(p => p.comments && p.comments.length > 0) && (
                        <>
                            <div className="mt-8 mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Comments</h4>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 font-medium text-gray-700">Comment ID</th>
                                        <th className="px-4 py-3 font-medium text-gray-700">Post ID</th>
                                        <th className="px-4 py-3 font-medium text-gray-700">Parent Comment ID</th>
                                        <th className="px-4 py-3 font-medium text-gray-700">Comment Text</th>
                                        <th className="px-4 py-3 font-medium text-gray-700">Username</th>
                                        <th className="px-4 py-3 font-medium text-gray-700">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {posts.flatMap(post =>
                                        (post.comments || []).map((comment: any) => (
                                            <tr key={comment.id} className="hover:bg-gray-50 transition">
                                                <td className="px-4 py-3 font-mono text-xs text-gray-600">{comment.id}</td>
                                                <td className="px-4 py-3 font-mono text-xs text-gray-600">{post.id}</td>
                                                <td className="px-4 py-3 font-mono text-xs text-gray-600">
                                                    {comment.parent_comment_id || ''}
                                                </td>
                                                <td className="px-4 py-3 text-gray-900 max-w-md truncate">{comment.content}</td>
                                                <td className="px-4 py-3 text-gray-600">{comment.author_username}</td>
                                                <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                                                    {new Date(comment.scheduled_time).toLocaleString('en-US', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            )}

            {/* Side Panel */}
            {selectedPost && (
                <>
                    {/* Overlay */}
                    <div 
                        className="fixed inset-0 bg-black/30 z-40"
                        onClick={() => setSelectedPost(null)}
                    />
                    
                    {/* Panel */}
                    <div className="fixed right-0 top-0 h-full w-128 bg-white shadow-2xl z-50 overflow-y-auto">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <span className="inline-block text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded mb-2">
                                        {selectedPost.subreddit}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900">{selectedPost.title}</h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedPost(null)}
                                    className="text-gray-400 hover:text-gray-600 ml-4"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Post Details */}
                            <div className="mb-6 space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium text-gray-500">Posted by:</span>
                                    <span className="font-semibold text-gray-900">u/{selectedPost.author_username}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium text-gray-500">Scheduled:</span>
                                    <span className="text-gray-900">
                                        {new Date(selectedPost.scheduled_time).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium text-gray-500">Status:</span>
                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                        {selectedPost.status}
                                    </span>
                                </div>
                            </div>

                            {/* Post Body */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Post Content</h4>
                                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                                    {selectedPost.body}
                                </div>
                            </div>

                            {/* Comments */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                    Comments ({selectedPost.comments?.length || 0})
                                </h4>
                                <div className="space-y-4">
                                    {selectedPost.comments && selectedPost.comments.length > 0 ? (
                                        selectedPost.comments.map((comment: any) => (
                                            <div 
                                                key={comment.id} 
                                                className={`bg-gray-50 rounded-lg p-4 ${comment.parent_comment_id ? 'ml-6 border-l-2 border-brand-200' : ''}`}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-semibold text-sm text-gray-900">
                                                        u/{comment.author_username}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(comment.scheduled_time).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700">{comment.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">No comments yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CalendarWorkspace;
