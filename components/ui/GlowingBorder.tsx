import React from 'react';

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

const GlowingBorder: React.FC<GlowingBorderProps> = ({ 
  children, 
  className = "", 
  gradient = "from-transparent via-indigo-500 to-transparent" 
}) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Animated Border Container */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
      {/* Moving Border Logic */}
      <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
        
        {/* Conic Spinner Effect */}
        <div className="absolute -inset-[100%] animate-border-spin opacity-40 group-hover:opacity-100 transition-opacity duration-500" 
             style={{ 
               background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 340deg, #6366f1 360deg)` 
             }} 
        />
      </div>

      {/* Content Container */}
      <div className="relative bg-[#0F0F16] rounded-2xl h-full border border-white/5 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default GlowingBorder;