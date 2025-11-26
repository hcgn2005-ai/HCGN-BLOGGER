import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { CalendarSidebar } from './components/InputSection'; // Conceptually CalendarSidebar
import { BlogView } from './components/ResultSection'; // Conceptually BlogView
import { BlogPost, DateStats } from './types';

function App() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Load posts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chronicle_posts');
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse posts", e);
      }
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chronicle_posts', JSON.stringify(posts));
  }, [posts]);

  // Compute stats for calendar (how many posts per date)
  const stats: DateStats = useMemo(() => {
    const s: DateStats = {};
    posts.forEach(p => {
      s[p.date] = (s[p.date] || 0) + 1;
    });
    return s;
  }, [posts]);

  const handleSavePost = (newPostData: Omit<BlogPost, 'id' | 'createdAt'>) => {
    const newPost: BlogPost = {
      ...newPostData,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-purple-500 selection:text-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Calendar Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28 transition-all duration-500">
            <CalendarSidebar 
              selectedDate={selectedDate} 
              onSelectDate={setSelectedDate}
              stats={stats} 
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 xl:col-span-9 w-full min-h-[600px]">
             <BlogView 
                selectedDate={selectedDate}
                posts={posts}
                onSave={handleSavePost}
                onDelete={handleDeletePost}
             />
          </div>

        </div>
      </main>
      
      <footer className="border-t border-white/5 py-10 mt-auto bg-black">
        <div className="container mx-auto px-6 text-center">
            <p className="text-gray-600 text-sm">HCG BLOGGER stores all data locally in your browser.</p>
            <p className="text-gray-800 text-xs mt-2 font-mono">SECURE • PRIVATE • INTELLIGENT</p>
        </div>
      </footer>
    </div>
  );
}

export default App;