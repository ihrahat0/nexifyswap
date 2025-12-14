import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)" } : {}}
      className={`
        relative overflow-hidden
        bg-white/5 backdrop-blur-xl 
        border border-white/10 
        rounded-2xl 
        shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;