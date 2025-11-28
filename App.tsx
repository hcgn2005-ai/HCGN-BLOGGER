import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { CalendarSidebar } from './components/InputSection'; 
import { BlogView } from './components/ResultSection'; 
import { BlogPost, DateStats } from './types';
import { MoreVertical, Smartphone, Tablet, Monitor, X } from 'lucide-react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

function App() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState<DeviceType>('desktop');
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  
  // Key for local storage (Single user mode)
  const STORAGE_KEY = 'hcg_blog_posts_data';

  // Load posts on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse posts", e);
        setPosts([]);
      }
    }
  }, []);

  // Save posts whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
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

  // Determine container classes based on device view
  const containerClasses = useMemo(() => {
    switch (deviceView) {
      case 'mobile':
        return 'max-w-[400px] my-8 rounded-[3rem] border-[8px] border-[#1a1a1a] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden bg-[#030303] min-h-[800px]';
      case 'tablet':
        return 'max-w-[820px] my-8 rounded-[2.5rem] border-[8px] border-[#1a1a1a] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden bg-[#030303] min-h-[1024px]';
      case 'desktop':
      default:
        return 'w-full min-h-screen bg-[#030303]';
    }
  }, [deviceView]);

  return (
    <div className="min-h-screen bg-[#050505] flex justify-center selection:bg-purple-500 selection:text-white overflow-x-hidden">
      
      {/* Device Content Wrapper */}
      <div className={`transition-all duration-500 ease-in-out flex flex-col relative ${containerClasses}`}>
        <Header />

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Adjust grid based on view mode */}
          <div className={`grid gap-8 items-start ${
            deviceView === 'mobile' 
              ? 'grid-cols-1' 
              : 'grid-cols-1 lg:grid-cols-12 lg:gap-12'
          }`}>
            
            {/* Calendar Sidebar */}
            {/* On mobile view, stack it. On desktop view, use grid columns */}
            <div className={`
              ${deviceView === 'desktop' ? 'lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28' : ''}
              ${deviceView === 'tablet' ? 'lg:col-span-5' : ''}
              transition-all duration-500
            `}>
              <CalendarSidebar 
                selectedDate={selectedDate} 
                onSelectDate={setSelectedDate}
                stats={stats} 
              />
            </div>

            {/* Main Content Area */}
            <div className={`
              ${deviceView === 'desktop' ? 'lg:col-span-8 xl:col-span-9' : ''}
              ${deviceView === 'tablet' ? 'lg:col-span-7' : ''}
              w-full min-h-[600px]
            `}>
               <BlogView 
                  selectedDate={selectedDate}
                  posts={posts}
                  onSave={handleSavePost}
                  onDelete={handleDeletePost}
               />
            </div>

          </div>
        </main>
        
        <footer className="border-t border-white/5 py-10 mt-auto bg-black relative z-10">
          <div className="container mx-auto px-6 text-center">
              <p className="text-gray-600 text-sm">HCG BLOGGER</p>
              <p className="text-gray-800 text-xs mt-2 font-mono">SECURE • PRIVATE • INTELLIGENT</p>
          </div>
        </footer>
      </div>

      {/* Floating Device Switcher Menu */}
      <div className="fixed bottom-8 left-8 z-[100] flex flex-col gap-3 items-start">
        
        {showDeviceMenu && (
          <div className="flex flex-col gap-2 mb-2 animate-fade-up origin-bottom-left">
            <button 
              onClick={() => { setDeviceView('desktop'); setShowDeviceMenu(false); }}
              className={`p-3 rounded-full flex items-center gap-3 transition-all duration-300 shadow-lg border backdrop-blur-md
                ${deviceView === 'desktop' 
                  ? 'bg-purple-600 text-white border-purple-500 shadow-purple-500/30' 
                  : 'bg-black/80 text-gray-400 border-white/10 hover:text-white hover:bg-black'}`}
            >
              <Monitor className="w-5 h-5" />
              <span className="text-xs font-bold pr-2">Laptop</span>
            </button>
            
            <button 
              onClick={() => { setDeviceView('tablet'); setShowDeviceMenu(false); }}
              className={`p-3 rounded-full flex items-center gap-3 transition-all duration-300 shadow-lg border backdrop-blur-md
                ${deviceView === 'tablet' 
                  ? 'bg-purple-600 text-white border-purple-500 shadow-purple-500/30' 
                  : 'bg-black/80 text-gray-400 border-white/10 hover:text-white hover:bg-black'}`}
            >
              <Tablet className="w-5 h-5" />
              <span className="text-xs font-bold pr-2">Tablet</span>
            </button>
            
            <button 
              onClick={() => { setDeviceView('mobile'); setShowDeviceMenu(false); }}
              className={`p-3 rounded-full flex items-center gap-3 transition-all duration-300 shadow-lg border backdrop-blur-md
                ${deviceView === 'mobile' 
                  ? 'bg-purple-600 text-white border-purple-500 shadow-purple-500/30' 
                  : 'bg-black/80 text-gray-400 border-white/10 hover:text-white hover:bg-black'}`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="text-xs font-bold pr-2">Phone</span>
            </button>
          </div>
        )}

        <button 
          onClick={() => setShowDeviceMenu(!showDeviceMenu)}
          className={`p-4 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 border border-white/10
            ${showDeviceMenu 
              ? 'bg-white text-black rotate-90' 
              : 'bg-black text-purple-400 hover:bg-purple-900/20 hover:text-purple-300'}`}
        >
          {showDeviceMenu ? <X className="w-6 h-6" /> : <MoreVertical className="w-6 h-6" />}
        </button>
      </div>

    </div>
  );
}

export default App;