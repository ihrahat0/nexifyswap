import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  Flame, CheckCircle2, TrendingUp, Shield, Users, Sparkles,
  Info, ChevronRight, BarChart3, Lock, Zap
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import GlassCard from './ui/GlassCard';
import GlowingBorder from './ui/GlowingBorder';
import { STAKING_PLANS } from '../constants';

interface StakingProps {
  onSelectPlan: (planId: string) => void;
}

// Generate sparkline data
const generateSparkline = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: 50 + Math.random() * 50 + i * 2
  }));
};

const Staking: React.FC<StakingProps> = ({ onSelectPlan }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Animated counter component
  const AnimatedStat = ({ value, color }: { value: string; color: string }) => (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 15 }}
      className={`text-3xl md:text-4xl font-mono font-bold ${color}`}
    >
      {value}
    </motion.div>
  );

  return (
    <div className="pt-24 pb-32 min-h-screen relative overflow-hidden">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-black to-purple-950/20"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-24">
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-500/20 backdrop-blur-xl mb-8 shadow-lg shadow-violet-500/10"
          >
            <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            <span className="text-sm font-bold bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200 bg-clip-text text-transparent tracking-wide uppercase">
              Up to 18% APY • Insured Vaults
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-sans mb-6 leading-tight"
          >
            <span className="text-white">Stake &</span>
            <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 animate-gradient">
              Earn Rewards
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Maximize your crypto earnings with our premium staking vaults. Industry-leading APYs,
            institutional-grade security, and flexible terms designed for every investor.
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-8"
          >
            {[
              { icon: Shield, text: 'Audited Contracts', color: 'text-emerald-400' },
              { icon: Lock, text: 'Insured Assets', color: 'text-blue-400' },
              { icon: Zap, text: 'Instant Rewards', color: 'text-purple-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Stats Cards with Sparklines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-24">
          {[
            { label: 'Total Value Locked', val: '$248.6M', color: 'text-white', trend: '+12.4%', sparkline: generateSparkline() },
            { label: 'Total Rewards Distributed', val: '$12.8M', color: 'text-emerald-400', trend: '+8.2%', sparkline: generateSparkline() },
            { label: 'Active Stakers', val: '145,203', color: 'text-violet-400', trend: '+24.1%', sparkline: generateSparkline() },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-purple-500/10 to-fuchsia-500/0 rounded-2xl blur-xl group-hover:via-purple-500/20 transition-all"></div>
              <div className="relative p-6 md:p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 group-hover:border-violet-500/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">{stat.label}</div>
                    <AnimatedStat value={stat.val} color={stat.color} />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">{stat.trend}</span>
                  </div>
                </div>
                {/* Sparkline */}
                <div className="h-12 opacity-50 group-hover:opacity-100 transition-opacity">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stat.sparkline}>
                      <defs>
                        <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={stat.color.includes('emerald') ? '#10b981' : stat.color.includes('violet') ? '#8b5cf6' : '#ffffff'} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={stat.color.includes('emerald') ? '#10b981' : stat.color.includes('violet') ? '#8b5cf6' : '#ffffff'} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={stat.color.includes('emerald') ? '#10b981' : stat.color.includes('violet') ? '#8b5cf6' : '#ffffff'}
                        strokeWidth={2}
                        fill={`url(#grad-${i})`}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Plans Grid with 3D Effects */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {STAKING_PLANS.map((plan, idx) => {
            const isExpanded = expandedCard === plan.id;
            const isHovered = hoveredCard === plan.id;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (idx * 0.15), type: "spring", damping: 15 }}
                onHoverStart={() => setHoveredCard(plan.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="h-full perspective-1000"
              >
                <motion.div
                  whileHover={{
                    y: -12,
                    rotateX: 2,
                    rotateY: -2,
                    scale: 1.02
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full relative preserve-3d"
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}></div>

                  {/* Card */}
                  <div className="h-full p-6 md:p-8 rounded-3xl bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col relative overflow-hidden group">

                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient}`}></div>
                    </div>

                    {/* Badge */}
                    {plan.badge && (
                      <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + (idx * 0.15) }}
                        className="absolute top-0 right-0 z-10"
                      >
                        <div className={`px-4 py-2 bg-gradient-to-r ${plan.gradient} text-white text-xs font-bold rounded-bl-2xl rounded-tr-3xl shadow-xl`}>
                          {plan.badge}
                        </div>
                      </motion.div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={`p-4 rounded-2xl bg-gradient-to-br ${plan.gradient} ${plan.shadow} group-hover:shadow-2xl transition-shadow`}
                      >
                        <plan.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <div className="text-right">
                        <motion.div
                          className={`text-5xl font-bold font-mono tracking-tighter bg-gradient-to-br ${plan.gradient} bg-clip-text text-transparent`}
                          animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {plan.apy}%
                        </motion.div>
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">APY</div>
                      </div>
                    </div>

                    {/* Plan Info */}
                    <div className="mb-6 relative z-10">
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-gray-100 group-hover:to-white transition-all">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    {/* Quick Calculator Preview */}
                    <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Stake $1,000</span>
                        <Info className="w-3 h-3 text-gray-600" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                          ${((1000 * plan.apy) / 100 / 12).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">/month</span>
                      </div>
                    </div>

                    {/* Pool Status */}
                    <div className="mb-6 space-y-2 relative z-10">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-500">Pool Capacity</span>
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3 text-gray-600" />
                          <span className={plan.poolFilled > 90 ? 'text-orange-400' : 'text-gray-400'}>
                            {plan.poolFilled}% Filled
                          </span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${plan.poolFilled}%` }}
                          transition={{ delay: 0.8 + (idx * 0.15), duration: 1, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${plan.gradient} relative`}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6 flex-grow relative z-10">
                      {plan.features.slice(0, isExpanded ? plan.features.length : 3).map((feat, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + (idx * 0.15) + (i * 0.05) }}
                          className="flex items-center gap-3 text-sm text-gray-300"
                        >
                          <CheckCircle2 className={`w-4 h-4 ${plan.color} shrink-0`} />
                          <span>{feat}</span>
                        </motion.div>
                      ))}

                      {plan.features.length > 3 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCard(isExpanded ? null : plan.id);
                          }}
                          className="flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition-colors mt-2"
                        >
                          <span>{isExpanded ? 'Show Less' : `+${plan.features.length - 3} More Features`}</span>
                          <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Risk Indicator */}
                    <div className="mb-6 p-3 rounded-lg bg-white/5 border border-white/5 relative z-10">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Risk Level</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-3 rounded-full ${i < (plan.id === 'flexible' ? 1 : plan.id === 'fixed' ? 2 : 3)
                                  ? 'bg-gradient-to-t from-emerald-500 to-emerald-400'
                                  : 'bg-white/10'
                                }`}
                            />
                          ))}
                          <span className="ml-2 text-emerald-400">Low</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      onClick={() => onSelectPlan(plan.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all bg-gradient-to-r ${plan.gradient} text-white shadow-lg hover:shadow-2xl relative overflow-hidden group/btn z-10`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        View Details
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-20 md:mt-32 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-gray-400">Secured by leading auditors</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
            {['CertiK', 'PeckShield', 'SlowMist', 'Hacken'].map((auditor) => (
              <div key={auditor} className="text-gray-600 font-bold text-lg">{auditor}</div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Staking;