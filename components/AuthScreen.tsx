import React, { useState } from 'react';
import { User, Lock, ArrowRight, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (username: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const usersRaw = localStorage.getItem('hcg_users');
      const users = usersRaw ? JSON.parse(usersRaw) : {};

      if (isLogin) {
        if (users[username] && users[username] === password) {
          onLogin(username);
        } else {
          setError('Invalid username or password');
        }
      } else {
        if (users[username]) {
          setError('Username already exists');
        } else if (username.length < 3) {
            setError('Username must be at least 3 characters');
        } else if (password.length < 4) {
            setError('Password must be at least 4 characters');
        } else {
          users[username] = password;
          localStorage.setItem('hcg_users', JSON.stringify(users));
          onLogin(username);
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#030303]">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-900/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md p-8 relative z-10 animate-fade-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-purple-900/50 to-black rounded-2xl border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.2)] mb-6">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-2 tracking-tight">
            HCG BLOGGER
          </h1>
          <p className="text-gray-500 font-medium">Your Intelligent Personal Journal</p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600"></div>
          
           <div className="flex mb-8 bg-black/50 p-1 rounded-xl border border-white/5">
             <button
               onClick={() => { setIsLogin(true); setError(''); }}
               className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${isLogin ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
             >
               <LogIn className="w-4 h-4" /> Login
             </button>
             <button
               onClick={() => { setIsLogin(false); setError(''); }}
               className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${!isLogin ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
             >
               <UserPlus className="w-4 h-4" /> Sign Up
             </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center animate-pulse">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-purple-400 hover:text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 group mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Access Journal' : 'Create Account'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
           </form>
        </div>
        
        <p className="text-center text-gray-600 text-sm mt-8">
           {isLogin ? "New to HCG Blogger?" : "Already have an account?"}
           <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="ml-2 text-purple-400 hover:text-purple-300 font-bold transition-colors">
             {isLogin ? "Create Account" : "Login Here"}
           </button>
        </p>
      </div>
    </div>
  );
};