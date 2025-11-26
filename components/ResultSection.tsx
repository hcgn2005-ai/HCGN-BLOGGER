import React, { useState } from 'react';
import { BlogPost } from '../types';
import { generateBlogDraft } from '../services/geminiService';
import { PenTool, Save, Sparkles, Clock, Trash2, Plus, Calendar, X } from 'lucide-react';

interface BlogViewProps {
  selectedDate: string | null;
  posts: BlogPost[];
  onSave: (post: Omit<BlogPost, 'id' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ selectedDate, posts, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setTitle('');
    setContent('');
    // Default to selected date if available, else today
    setDate(selectedDate || new Date().toISOString().split('T')[0]); 
  };

  const handleAiDraft = async () => {
    if (!title) return;
    setIsGenerating(true);
    try {
      const draft = await generateBlogDraft(title, content);
      setTitle(draft.title);
      setContent(prev => prev + (prev ? '\n\n' : '') + draft.content);
    } catch (e) {
      alert("AI Generation failed. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, content, date });
    setIsEditing(false);
  };

  // Filter posts if a date is selected
  const filteredPosts = selectedDate 
    ? posts.filter(p => p.date === selectedDate)
    : posts;

  // Sort by created time descending
  const sortedPosts = [...filteredPosts].sort((a, b) => b.createdAt - a.createdAt);

  if (isEditing) {
    return (
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 shadow-2xl animate-fade-up relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="flex justify-between items-center mb-8 relative z-10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="p-2 bg-purple-500/10 rounded-lg">
                <PenTool className="w-5 h-5 text-purple-400" />
            </span>
            New Entry
          </h2>
          <button 
             onClick={() => setIsEditing(false)}
             className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Title</label>
                <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-xl font-medium text-white placeholder-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all shadow-inner"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Date</label>
                <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4.5 text-sm font-mono text-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all shadow-inner"
                />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Content</label>
                <button
                    type="button"
                    onClick={handleAiDraft}
                    disabled={isGenerating || !title}
                    className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300
                        ${isGenerating 
                            ? 'bg-white/5 text-gray-500 border-transparent' 
                            : !title 
                                ? 'opacity-50 cursor-not-allowed text-gray-600 border-transparent'
                                : 'bg-gradient-to-r from-purple-900/30 to-fuchsia-900/30 text-purple-300 border-purple-500/30 hover:border-purple-500/60 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                        }`}
                >
                    {isGenerating ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Sparkles className="w-3 h-3" />
                    )}
                    {isGenerating ? 'Enhancing...' : 'AI Enhance'}
                </button>
            </div>
            <textarea
                required
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Start writing here..."
                className="w-full h-[500px] bg-black border border-white/10 rounded-2xl px-6 py-6 text-gray-300 leading-8 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all resize-none font-serif text-lg shadow-inner selection:bg-purple-500/30"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
                type="submit"
                className="group flex items-center gap-2 bg-white text-black hover:bg-purple-400 px-8 py-3.5 rounded-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(192,132,252,0.4)] transition-all duration-300 active:scale-95"
            >
                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Save Entry
            </button>
          </div>
        </form>
      </div>
    );
  }

  // View Mode: List of Posts
  return (
    <div className="space-y-8 pb-20">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
                {selectedDate 
                    ? new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) 
                    : 'Recent Entries'}
            </h2>
            <div className="h-1 w-12 bg-purple-600 rounded-full mt-2 mb-2"></div>
            <p className="text-gray-500 text-sm">
                {sortedPosts.length} {sortedPosts.length === 1 ? 'entry' : 'entries'} found
            </p>
        </div>
        <button
            onClick={handleStartEdit}
            className="group flex items-center gap-2 bg-white text-black hover:bg-purple-400 px-6 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(192,132,252,0.4)] transition-all duration-300 active:scale-95"
        >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="">Write New</span>
        </button>
      </div>

      {sortedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-600 bg-[#0a0a0a] rounded-3xl border border-dashed border-white/10 animate-fade-up">
            <div className="p-6 bg-black rounded-full mb-6 border border-white/5 shadow-2xl">
                <PenTool className="w-10 h-10 text-gray-700" />
            </div>
            <p className="text-xl font-medium text-gray-400">Your journal is empty</p>
            <p className="text-sm opacity-50 mt-2">Select a date or start writing to begin your journey.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {sortedPosts.map((post, index) => (
            <div 
                key={post.id} 
                style={{ animationDelay: `${index * 100}ms` }}
                className="group bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:border-purple-500/30 transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.05)] relative overflow-hidden animate-fade-up"
            >
              {/* Card Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/0 via-purple-900/0 to-purple-900/0 group-hover:via-purple-900/5 group-hover:to-purple-900/10 transition-all duration-500"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="space-y-3">
                   <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
                      <span className="flex items-center gap-1.5 text-purple-400 bg-purple-900/20 px-2 py-1 rounded-md border border-purple-500/20">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </div>
                   <h3 className="text-2xl font-bold text-gray-100 group-hover:text-purple-300 transition-colors duration-300">{post.title}</h3>
                </div>
                <button 
                  onClick={() => onDelete(post.id)}
                  className="p-2.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                  title="Delete Entry"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="relative z-10">
                <div className="prose prose-invert prose-lg max-w-none text-gray-400 line-clamp-4 font-serif leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    <div style={{ whiteSpace: 'pre-wrap' }}>{post.content}</div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-sm text-purple-500/0 group-hover:text-purple-500/100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 font-medium">
                    <span>Read full entry</span>
                    <span className="text-lg">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};