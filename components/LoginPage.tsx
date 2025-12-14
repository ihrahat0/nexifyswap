import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github, Chrome, Apple, ArrowLeft, Hexagon } from 'lucide-react';
import GlassCard from './ui/GlassCard';

interface LoginPageProps {
  onNavigate: (view: 'signup' | 'home') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate('home'); // Simulate login
    }, 1500);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-black z-0">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex flex-1 relative z-10 flex-col justify-between p-12 border-r border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="flex items-center gap-2 text-2xl font-bold font-sans tracking-tight">
             <Hexagon className="w-8 h-8 text-indigo-500 fill-indigo-500/20" />
             <span><span className="text-indigo-400">Z</span>yntra</span>
          </div>
        </div>
        
        <div className="max-w-md">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
          >
             <h1 className="text-5xl font-bold mb-6 leading-tight">
                Welcome Back to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Future</span>
             </h1>
             <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Access the world's most advanced crypto trading terminal. 
                Real-time analytics, AI insights, and institutional liquidity.
             </p>
          </motion.div>
          
          <div className="flex items-center gap-4">
             <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                   <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-xs overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                   </div>
                ))}
             </div>
             <div className="text-sm font-medium">
                <div className="text-white">Trusted by 2M+ Traders</div>
                <div className="text-gray-500">Join the elite community</div>
             </div>
          </div>
        </div>

        <div className="text-gray-500 text-sm">
           © 2024 Zyntra Exchange. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative z-10">
         <button 
           onClick={() => onNavigate('home')}
           className="absolute top-8 left-8 lg:hidden text-gray-400 hover:text-white"
         >
            <ArrowLeft className="w-6 h-6" />
         </button>

         <div className="w-full max-w-[420px]">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="mb-8"
            >
               <h2 className="text-3xl font-bold mb-2">Sign In</h2>
               <p className="text-gray-400">Enter your credentials to access your account</p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative group">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                     <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                        placeholder="name@example.com"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex justify-between">
                     Password
                     <a href="#" className="text-indigo-400 hover:text-indigo-300 text-xs">Forgot password?</a>
                  </label>
                  <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                     <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                        placeholder="••••••••"
                     />
                  </div>
               </div>

               <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
               >
                  {loading ? (
                     <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                     <>Sign In <ArrowRight className="w-5 h-5" /></>
                  )}
               </button>
            </form>

            <div className="my-8 flex items-center gap-4">
               <div className="h-px bg-white/10 flex-1" />
               <span className="text-sm text-gray-500">Or continue with</span>
               <div className="h-px bg-white/10 flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
               </button>
               <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors border border-white/10">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.7.79 3.45 1.89-.26.25-1.96 1.2-1.96 3.54 0 2.89 2.47 3.92 2.57 3.98-.06.27-.42 1.57-1.65 3.61zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Apple
               </button>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
               Don't have an account? {' '}
               <button onClick={() => onNavigate('signup')} className="text-indigo-400 hover:text-indigo-300 font-bold">
                  Create Account
               </button>
            </p>
         </div>
      </div>
    </div>
  );
};

export default LoginPage;