import React from 'react';
import { BookOpen, PenTool, LogOut, User } from 'lucide-react';

interface HeaderProps {
  user: string | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4 group cursor-default">
          <div className="p-2.5 bg-gradient-to-br from-purple-900/50 to-black rounded-xl border border-purple-500/20 group-hover:border-purple-500/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300 ease-out">
            <BookOpen className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent tracking-tight">
              HCG BLOGGER
            </h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide group-hover:text-purple-400/70 transition-colors">INTELLIGENT DAILY JOURNAL</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-2 text-xs font-medium text-purple-300/80 border border-purple-900/30 rounded-full px-4 py-1.5 bg-purple-900/10 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
              <PenTool className="w-3 h-3 text-purple-400 animate-pulse" />
              <span>Writer's Assistant Active</span>
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-black border border-purple-500/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-sm font-bold text-gray-300 hidden sm:block">{user}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};