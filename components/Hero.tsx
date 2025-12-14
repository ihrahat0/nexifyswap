import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, PlayCircle } from 'lucide-react';

interface HeroProps {
  onCtaClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-medium tracking-wide text-gray-300 uppercase">Zyntra V 2.0 Now Live</span>
            <ChevronRight className="w-3 h-3 text-gray-500" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-sans leading-tight mb-6">
            Buy & Sell Crypto <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient bg-300%">
              Instant & Secure
            </span>
          </h1>

          <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
            Experience the next generation of decentralized trading with Zyntra.
            Zero hidden fees, lightning-fast execution, and bank-grade security.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105">
              <span className="relative z-10 flex items-center gap-2 group-hover:gap-3 transition-all">
                Start Trading <ArrowRight className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={onCtaClick}
              className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 backdrop-blur-sm text-white font-medium flex items-center gap-3 transition-all hover:border-white/40"
            >
              <PlayCircle className="w-5 h-5" />
              Earn Yield
            </button>
          </div>

          <div className="mt-12 flex items-center gap-8 text-gray-500 grayscale opacity-70">
            {['Binance', 'Coinbase', 'Kraken', 'Gemini'].map((partner) => (
              <span key={partner} className="text-sm font-mono tracking-widest hover:grayscale-0 hover:text-white transition-all cursor-default">{partner}</span>
            ))}
          </div>
        </motion.div>

        {/* Right Content - Circular Portfolio Hub */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:flex justify-center items-center translate-x-12"
        >
          {/* Outer Glow Rings */}
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />

          {/* Main Circular Container */}
          <div className="relative w-[500px] h-[500px]">
            {/* Rotating Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-white/5 border-t-indigo-500/50 border-r-purple-500/50 shadow-[0_0_50px_rgba(99,102,241,0.1)]"
            />

            {/* Counter-Rotating Inner Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 rounded-full border border-white/5 border-b-pink-500/30 border-l-blue-500/30"
            />

            {/* Central Glass Hub */}
            <div className="absolute inset-16 rounded-full bg-gray-900/40 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center p-8 overflow-hidden group">
              {/* Background Gradient Mesh */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="text-gray-400 text-sm font-medium tracking-wider uppercase mb-2">Total Balance</div>
                <div className="text-5xl font-bold text-white tracking-tight mb-4">
                  $124,532<span className="text-2xl text-gray-400">.89</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold">
                  +24.5% <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
              </div>

              {/* Decorative Wave/Graph Line */}
              <div className="absolute bottom-0 left-0 right-0 h-24 opacity-30">
                <svg viewBox="0 0 200 100" className="w-full h-full fill-indigo-500/20 stroke-indigo-400 stroke-2">
                  <path d="M0,80 C50,80 50,20 100,50 C150,80 150,20 200,50 V100 H0 Z" />
                </svg>
              </div>
            </div>

            {/* Orbiting Elements */}
            {/* Bitcoin */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                <div className="p-3 bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg flex items-center gap-3 min-w-[140px]">
                  <div className="w-10 h-10 rounded-full bg-[#F7931A] flex items-center justify-center text-white font-bold text-xl shadow-inner">₿</div>
                  <div>
                    <div className="text-sm font-bold text-white">Bitcoin</div>
                    <div className="text-xs text-green-400">+5.2%</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Ethereum */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 1 }}
              className="absolute inset-0"
            >
              <motion.div
                className="absolute bottom-1/4 -right-4"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 1 }}
              >
                <div className="p-3 bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg flex items-center gap-3 min-w-[140px]">
                  <div className="w-10 h-10 rounded-full bg-[#627EEA] flex items-center justify-center text-white font-bold text-xl shadow-inner">Ξ</div>
                  <div>
                    <div className="text-sm font-bold text-white">Ethereum</div>
                    <div className="text-xs text-green-400">+2.8%</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Solana (New) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
              className="absolute inset-0"
            >
              <motion.div
                className="absolute bottom-1/4 -left-4"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
              >
                <div className="p-3 bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg flex items-center gap-3 min-w-[140px]">
                  <div className="w-10 h-10 rounded-full bg-[#14F195] flex items-center justify-center text-black font-bold text-xl shadow-inner">S</div>
                  <div>
                    <div className="text-sm font-bold text-white">Solana</div>
                    <div className="text-xs text-green-400">+8.4%</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;