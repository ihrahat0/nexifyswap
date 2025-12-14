import React, { useState, useEffect } from 'react';
import { Hexagon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onNavigate: (view: 'home' | 'staking' | 'staking-detail' | 'referral' | 'market' | 'trade' | 'login' | 'signup') => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide Navbar on Auth Pages
  if (currentView === 'login' || currentView === 'signup') return null;

  const navLinks = [
    { name: 'Markets', action: () => onNavigate('market'), active: currentView === 'market' },
    { name: 'Exchange', action: () => onNavigate('trade'), active: currentView === 'trade' },
    { name: 'Earn', action: () => onNavigate('staking'), active: currentView.includes('staking') },
    { name: 'Referral', action: () => onNavigate('referral'), active: currentView === 'referral' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-6 px-4 flex justify-center items-start pointer-events-none">
      <div
        className={`
          pointer-events-auto
          w-full max-w-7xl 
          rounded-2xl md:rounded-full 
          bg-[#0A0A0F]/60 backdrop-blur-xl 
          border border-white/10 
          shadow-[0_8px_32px_rgba(0,0,0,0.5)]
          transition-all duration-300 ease-in-out
          flex items-center justify-between
          px-6 py-3
          ${isScrolled ? 'bg-[#0A0A0F]/80 shadow-indigo-500/10' : 'bg-[#0A0A0F]/40'}
        `}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <div className="relative">
            <Hexagon className="w-8 h-8 text-indigo-500 fill-indigo-500/20 group-hover:rotate-90 transition-transform duration-500" />
            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40" />
          </div>
          <span className="text-2xl font-bold font-sans tracking-tight text-white">
            <span className="text-indigo-400">Z</span>yntra
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5">
          {navLinks.map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className={`
                px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${item.active
                  ? 'bg-white/10 text-white shadow-lg shadow-white/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => onNavigate('login')}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => onNavigate('signup')}
            className="relative group px-6 py-2.5 rounded-full bg-indigo-600 text-white font-medium overflow-hidden shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:opacity-90 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2 text-sm">
              Sign Up
            </span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-24 left-4 right-4 z-40 bg-[#0F0F16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-4 rounded-xl text-lg font-medium text-left text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  {item.name}
                </button>
              ))}
              <hr className="border-white/10 my-2" />
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    onNavigate('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    onNavigate('signup');
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;