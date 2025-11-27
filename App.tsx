import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { CalendarSidebar } from './components/InputSection'; 
import { BlogView } from './components/ResultSection'; 
import { AuthScreen } from './components/AuthScreen';
import { BlogPost, DateStats } from './types';

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('hcg_current_user');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // Load posts for specific user whenever user changes
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`hcg_posts_${user}`);
      if (saved) {
        try {
          setPosts(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse posts", e);
          setPosts([]);
        }
      } else {
        setPosts([]);
      }
      setSelectedDate(null); // Reset selection on user change
    } else {
      setPosts([]);
    }
  }, [user]);

  // Save posts to localStorage for specific user whenever posts change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`hcg_posts_${user}`, JSON.stringify(posts));
    }
  }, [posts, user]);

  // Login Handler
  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem('hcg_current_user', username);
  };

  // Logout Handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hcg_current_user');
  };

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

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-purple-500 selection:text-white">
      <Header user={user} onLogout={handleLogout} />

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
            <p className="text-gray-600 text-sm">Logged in as <span className="text-purple-500 font-bold">{user}</span></p>
            <p className="text-gray-800 text-xs mt-2 font-mono">SECURE • PRIVATE • INTELLIGENT</p>
        </div>
      </footer>
    </div>
  );
}

export default App;