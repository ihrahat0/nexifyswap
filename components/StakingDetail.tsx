import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   ArrowLeft, Wallet, BarChart3, ChevronDown, Calendar, AlertCircle,
   ShieldCheck, HelpCircle, CheckCircle2, TrendingUp, Lock, DollarSign,
   Clock, Zap, Award, Users, Info, Sparkles, AlertTriangle, X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Bar } from 'recharts';
import { StakingPlan } from '../types';
import GlassCard from './ui/GlassCard';

interface StakingDetailProps {
   plan: StakingPlan;
   onBack: () => void;
}

const generateChartData = (amount: number, apy: number, days: number) => {
   const data = [];
   const effectiveDays = days === 0 ? 365 : days;
   const dailyRate = apy / 100 / 365;
   const intervals = Math.min(30, effectiveDays);

   for (let i = 0; i <= intervals; i++) {
      const currentDay = Math.floor((effectiveDays / intervals) * i);
      const interest = amount * dailyRate * currentDay;
      data.push({
         day: currentDay,
         value: amount + interest,
         profit: interest,
         principal: amount
      });
   }
   return data;
};

// Confetti animation for success state
const Confetti = () => {
   const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      rotation: Math.random() * 360,
      color: ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)]
   }));

   return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         {particles.map((p) => (
            <motion.div
               key={p.id}
               className="absolute w-2 h-2 rounded-full"
               style={{
                  backgroundColor: p.color,
                  left: `${p.x}%`,
                  top: `${p.y}%`
               }}
               initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
               animate={{
                  y: 600,
                  x: (Math.random() - 0.5) * 200,
                  rotate: p.rotation,
                  opacity: 0
               }}
               transition={{
                  duration: 2 + Math.random(),
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
               }}
            />
         ))}
      </div>
   );
};

const StakingDetail: React.FC<StakingDetailProps> = ({ plan, onBack }) => {
   const [stakeAmount, setStakeAmount] = useState<number>(1000);
   const [accordions, setAccordions] = useState<number | null>(null);
   const [isSuccess, setIsSuccess] = useState(false);
   const [showConfetti, setShowConfetti] = useState(false);
   const [compoundEnabled, setCompoundEnabled] = useState(true);
   const [timeframe, setTimeframe] = useState<'daily' | 'monthly' | 'yearly'>('monthly');

   const calculateReturns = () => {
      const effectiveAPY = compoundEnabled ? plan.apy * 1.05 : plan.apy; // 5% boost for compound
      const yearly = stakeAmount * (effectiveAPY / 100);
      const monthly = yearly / 12;
      const daily = yearly / 365;
      const term = yearly * (plan.durationDays / 365);

      return {
         daily: daily.toFixed(2),
         monthly: monthly.toFixed(2),
         yearly: yearly.toFixed(2),
         totalTerm: term.toFixed(2),
         effectiveAPY: effectiveAPY.toFixed(2)
      };
   };

   const returns = calculateReturns();
   const chartData = generateChartData(stakeAmount, parseFloat(returns.effectiveAPY), plan.durationDays);

   const handleConfirmStake = () => {
      setShowConfetti(true);
      setTimeout(() => {
         setIsSuccess(true);
         window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
   };

   const presetAmounts = [100, 500, 1000, 5000, 10000];

   return (
      <div className="min-h-screen pt-20 pb-24 relative overflow-hidden">
         {/* Animated Background */}
         <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/10 to-black"></div>
         <div className="absolute inset-0 opacity-20">
            <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${plan.gradient} rounded-full blur-[150px] animate-pulse`}></div>
            <div className={`absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br ${plan.gradient} rounded-full blur-[150px] opacity-50`} style={{ animationDelay: '1s' }}></div>
         </div>

         {showConfetti && <Confetti />}

         {/* Hero Section */}
         <div className="relative">
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
               {/* Back Button */}
               <motion.button
                  onClick={onBack}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: -4 }}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
               >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to Plans</span>
               </motion.button>

               {/* Header */}
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-16"
               >
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                     <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6">
                           <motion.div
                              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                              className={`p-4 bg-gradient-to-br ${plan.gradient} rounded-2xl shadow-2xl`}
                           >
                              <plan.icon className="w-10 h-10 text-white" />
                           </motion.div>
                           <div className="flex gap-2">
                              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${plan.gradient} text-white`}>
                                 {plan.risk} Risk
                              </span>
                              {plan.badge && (
                                 <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                                    {plan.badge}
                                 </span>
                              )}
                           </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                           {plan.name}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed">
                           {plan.description}
                        </p>
                     </div>

                     {/* APY Display */}
                     <div className="text-right">
                        <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
                           <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Current APY</div>
                           <motion.div
                              className={`text-6xl md:text-7xl font-mono font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}
                              animate={{ scale: [1, 1.02, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                           >
                              {plan.apy}%
                           </motion.div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>

         {/* Main Content */}
         <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="grid lg:grid-cols-12 gap-8">

               {/* Left Column */}
               <div className="lg:col-span-8 space-y-8">

                  {/* Interactive Calculator */}
                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.2 }}
                  >
                     <div className="relative p-8 rounded-3xl bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-2xl border border-white/10 overflow-hidden group">
                        <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>

                        <div className="relative z-10">
                           <div className="flex items-center justify-between mb-8">
                              <h3 className="text-2xl font-bold flex items-center gap-3">
                                 <div className={`p-2 rounded-xl bg-gradient-to-br ${plan.gradient}`}>
                                    <Wallet className="w-5 h-5 text-white" />
                                 </div>
                                 <span>Staking Calculator</span>
                              </h3>
                              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                 <Wallet className="w-4 h-4 text-gray-400" />
                                 <span className="text-sm text-gray-400">Available:</span>
                                 <span className="text-sm font-bold text-white">$124,532.89</span>
                              </div>
                           </div>

                           {/* Amount Input */}
                           <div className="relative p-8 rounded-2xl bg-black/40 border border-white/10 mb-8">
                              <div className="flex items-center gap-4 mb-6">
                                 <span className="text-3xl font-bold text-gray-600">$</span>
                                 <input
                                    type="number"
                                    value={stakeAmount}
                                    onChange={(e) => setStakeAmount(Math.max(0, Number(e.target.value)))}
                                    className="flex-1 bg-transparent text-5xl md:text-6xl font-mono font-bold text-white focus:outline-none placeholder-gray-700"
                                    placeholder="0.00"
                                 />
                                 <button
                                    onClick={() => setStakeAmount(124532)}
                                    className={`px-6 py-3 bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white text-sm font-bold rounded-xl transition-all shadow-lg`}
                                 >
                                    MAX
                                 </button>
                              </div>

                              {/* Slider */}
                              <input
                                 type="range"
                                 min={plan.minStake}
                                 max={150000}
                                 step={100}
                                 value={stakeAmount}
                                 onChange={(e) => setStakeAmount(Number(e.target.value))}
                                 className="w-full h-3 bg-gray-800 rounded-full appearance-none cursor-pointer mb-4"
                                 style={{
                                    background: `linear-gradient(to right, rgb(139, 92, 246) 0%, rgb(139, 92, 246) ${(stakeAmount / 150000) * 100}%, rgb(31, 31, 31) ${(stakeAmount / 150000) * 100}%, rgb(31, 31, 31) 100%)`
                                 }}
                              />

                              {/* Preset Buttons */}
                              <div className="flex gap-2 flex-wrap">
                                 {presetAmounts.map((amount) => (
                                    <button
                                       key={amount}
                                       onClick={() => setStakeAmount(amount)}
                                       className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${stakeAmount === amount
                                             ? `bg-gradient-to-r ${plan.gradient} text-white`
                                             : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                          }`}
                                    >
                                       ${amount.toLocaleString()}
                                    </button>
                                 ))}
                              </div>
                           </div>

                           {/* Compound Interest Toggle */}
                           <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 mb-8">
                              <div className="flex items-center gap-3">
                                 <Sparkles className="w-5 h-5 text-purple-400" />
                                 <div>
                                    <div className="font-bold text-white">Auto-Compound Rewards</div>
                                    <div className="text-xs text-gray-500">Earn additional +5% APY</div>
                                 </div>
                              </div>
                              <button
                                 onClick={() => setCompoundEnabled(!compoundEnabled)}
                                 className={`relative w-14 h-8 rounded-full transition-colors ${compoundEnabled ? 'bg-gradient-to-r from-purple-500 to-violet-500' : 'bg-gray-700'
                                    }`}
                              >
                                 <motion.div
                                    className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
                                    animate={{ x: compoundEnabled ? 24 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                 />
                              </button>
                           </div>

                           {/* Returns Display */}
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <motion.div
                                 whileHover={{ y: -4, scale: 1.02 }}
                                 className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10"
                              >
                                 <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Daily</span>
                                 </div>
                                 <div className="text-3xl font-mono font-bold text-white">${returns.daily}</div>
                              </motion.div>

                              <motion.div
                                 whileHover={{ y: -4, scale: 1.02 }}
                                 className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10"
                              >
                                 <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Monthly</span>
                                 </div>
                                 <div className="text-3xl font-mono font-bold text-white">${returns.monthly}</div>
                              </motion.div>

                              <motion.div
                                 whileHover={{ y: -4, scale: 1.02 }}
                                 className={`p-6 rounded-xl bg-gradient-to-br ${plan.gradient} border border-white/20`}
                              >
                                 <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
                                    <Award className="w-4 h-4" />
                                    <span>Total Return</span>
                                 </div>
                                 <div className="text-3xl font-mono font-bold text-white">+${returns.totalTerm}</div>
                              </motion.div>
                           </div>
                        </div>
                     </div>
                  </motion.div>

                  {/* Growth Projection Chart */}
                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.3 }}
                     className="p-8 rounded-3xl bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-2xl border border-white/10"
                  >
                     <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                           <div className={`p-2 rounded-xl bg-gradient-to-br ${plan.gradient}`}>
                              <BarChart3 className="w-5 h-5 text-white" />
                           </div>
                           <span>Earnings Projection</span>
                        </h3>

                        {/* Timeframe Toggle */}
                        <div className="flex gap-1 p-1 rounded-lg bg-white/5">
                           {(['daily', 'monthly', 'yearly'] as const).map((tf) => (
                              <button
                                 key={tf}
                                 onClick={() => setTimeframe(tf)}
                                 className={`px-4 py-2 rounded-lg text-xs font-medium uppercase transition-all ${timeframe === tf
                                       ? 'bg-white/10 text-white'
                                       : 'text-gray-500 hover:text-gray-300'
                                    }`}
                              >
                                 {tf}
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                           <ComposedChart data={chartData}>
                              <defs>
                                 <linearGradient id={`gradient-${plan.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                              <XAxis
                                 dataKey="day"
                                 stroke="#6b7280"
                                 tick={{ fill: '#6b7280', fontSize: 12 }}
                                 tickFormatter={(value) => `Day ${value}`}
                              />
                              <YAxis
                                 stroke="#6b7280"
                                 tick={{ fill: '#6b7280', fontSize: 12 }}
                                 tickFormatter={(value) => `$${value.toLocaleString()}`}
                              />
                              <Tooltip
                                 contentStyle={{
                                    backgroundColor: '#000000dd',
                                    border: '1px solid #ffffff20',
                                    borderRadius: '12px',
                                    padding: '12px'
                                 }}
                                 formatter={(value: number, name: string) => {
                                    if (name === 'principal') return [`$${value.toLocaleString()}`, 'Principal'];
                                    if (name === 'profit') return [`$${value.toLocaleString()}`, 'Profit'];
                                    return [`$${value.toLocaleString()}`, 'Total Value'];
                                 }}
                                 labelStyle={{ color: '#9ca3af', marginBottom: '8px' }}
                              />
                              <Bar dataKey="principal" fill="#ffffff10" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="profit" fill="url(#gradient-${plan.id})" radius={[4, 4, 0, 0]} />
                              <Line
                                 type="monotone"
                                 dataKey="value"
                                 stroke="#8b5cf6"
                                 strokeWidth={3}
                                 dot={false}
                              />
                           </ComposedChart>
                        </ResponsiveContainer>
                     </div>

                     {/* Chart Legend */}
                     <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-white/10"></div>
                           <span className="text-gray-400">Principal</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                           <span className="text-gray-400">Profit</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                           <span className="text-gray-400">Total Value</span>
                        </div>
                     </div>
                  </motion.div>

                  {/* Plan Benefits */}
                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.4 }}
                     className="p-8 rounded-3xl bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-2xl border border-white/10"
                  >
                     <h3 className="text-2xl font-bold mb-6">Plan Benefits</h3>
                     <div className="grid md:grid-cols-2 gap-4">
                        {plan.features.map((feature, i) => (
                           <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + (i * 0.05) }}
                              className="flex items-start gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                           >
                              <CheckCircle2 className={`w-5 h-5 ${plan.color} shrink-0 mt-0.5 group-hover:scale-110 transition-transform`} />
                              <span className="text-sm text-gray-300 leading-relaxed">{feature}</span>
                           </motion.div>
                        ))}
                     </div>
                  </motion.div>

                  {/* FAQ Accordion */}
                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5 }}
                  >
                     <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
                     <div className="space-y-3">
                        {plan.faq.map((item, i) => (
                           <motion.div
                              key={i}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 + (i * 0.05) }}
                              className="rounded-2xl bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-2xl border border-white/10 overflow-hidden"
                           >
                              <button
                                 onClick={() => setAccordions(accordions === i ? null : i)}
                                 className="w-full flex items-center justify-between px-6 py-5 text-left font-medium hover:bg-white/5 transition-colors group"
                              >
                                 <span className="text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                                    {item.q}
                                 </span>
                                 <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${accordions === i ? 'rotate-180' : ''}`} />
                              </button>

                              <AnimatePresence>
                                 {accordions === i && (
                                    <motion.div
                                       initial={{ height: 0, opacity: 0 }}
                                       animate={{ height: "auto", opacity: 1 }}
                                       exit={{ height: 0, opacity: 0 }}
                                       transition={{ duration: 0.3 }}
                                       className="overflow-hidden"
                                    >
                                       <div className="px-6 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/5">
                                          <div className="pt-4">{item.a}</div>
                                       </div>
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </motion.div>
                        ))}
                     </div>
                  </motion.div>
               </div>

               {/* Right Sidebar */}
               <div className="lg:col-span-4">
                  <motion.div
                     initial={{ opacity: 0, x: 30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.3 }}
                     className="sticky top-24"
                  >
                     <div className={`relative p-8 rounded-3xl bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-2xl border-2 overflow-hidden ${isSuccess ? 'border-emerald-500/50' : `border-white/20`
                        }`}>
                        {/* Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-10`}></div>

                        <div className="relative z-10">
                           {!isSuccess ? (
                              <>
                                 <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

                                 <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-sm pb-4 border-b border-white/10">
                                       <span className="text-gray-400 flex items-center gap-2">
                                          <Calendar className="w-4 h-4" />
                                          Lock Period
                                       </span>
                                       <span className="font-bold text-white">{plan.duration}</span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm pb-4 border-b border-white/10">
                                       <span className="text-gray-400 flex items-center gap-2">
                                          <TrendingUp className="w-4 h-4" />
                                          Base APY
                                       </span>
                                       <span className={`font-bold ${plan.color}`}>{plan.apy}%</span>
                                    </div>

                                    {compoundEnabled && (
                                       <div className="flex justify-between items-center text-sm pb-4 border-b border-white/10">
                                          <span className="text-gray-400 flex items-center gap-2">
                                             <Sparkles className="w-4 h-4 text-purple-400" />
                                             Compound Bonus
                                          </span>
                                          <span className="font-bold text-purple-400">+5%</span>
                                       </div>
                                    )}

                                    <div className="flex justify-between items-center text-sm pb-4 border-b border-white/10">
                                       <span className="text-gray-400">Effective APY</span>
                                       <span className={`font-bold text-lg ${plan.color}`}>{returns.effectiveAPY}%</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-4">
                                       <span className="text-gray-400">Total Est. Return</span>
                                       <span className="font-bold text-3xl text-emerald-400 font-mono">+${returns.totalTerm}</span>
                                    </div>
                                 </div>

                                 {/* Warning */}
                                 <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-3 mb-6">
                                    <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                                    <p className="text-xs text-orange-200/90 leading-relaxed">
                                       Staking locks your assets for {plan.duration}. Early withdrawal incurs a 2% penalty fee.
                                    </p>
                                 </div>

                                 {/* Stake Button */}
                                 <motion.button
                                    onClick={handleConfirmStake}
                                    disabled={stakeAmount < plan.minStake}
                                    whileHover={{ scale: stakeAmount >= plan.minStake ? 1.02 : 1 }}
                                    whileTap={{ scale: stakeAmount >= plan.minStake ? 0.98 : 1 }}
                                    className={`w-full py-5 rounded-xl font-bold text-lg uppercase tracking-wide transition-all shadow-2xl relative overflow-hidden group ${stakeAmount < plan.minStake
                                          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                          : `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-${plan.color}/50`
                                       }`}
                                 >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                       {stakeAmount < plan.minStake ? (
                                          <>
                                             <Lock className="w-5 h-5" />
                                             Min Stake ${plan.minStake}
                                          </>
                                       ) : (
                                          <>
                                             <Zap className="w-5 h-5" />
                                             Confirm Stake
                                          </>
                                       )}
                                    </span>
                                    {stakeAmount >= plan.minStake && (
                                       <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                    )}
                                 </motion.button>
                              </>
                           ) : (
                              <motion.div
                                 initial={{ scale: 0.8, opacity: 0 }}
                                 animate={{ scale: 1, opacity: 1 }}
                                 className="text-center py-8"
                              >
                                 <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, rotate: [0, 360] }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/50"
                                 >
                                    <CheckCircle2 className="w-12 h-12 text-white" />
                                 </motion.div>

                                 <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
                                    Stake Confirmed!
                                 </h3>
                                 <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                                    Your {plan.name} stake of <span className="font-bold text-white">${stakeAmount.toLocaleString()}</span> is now active.
                                    <br />
                                    Start earning <span className="font-bold text-emerald-400">{plan.apy}% APY</span> rewards!
                                 </p>

                                 <button
                                    onClick={onBack}
                                    className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all border border-white/10"
                                 >
                                    View Dashboard
                                 </button>
                              </motion.div>
                           )}
                        </div>
                     </div>

                     {/* Trust Badges */}
                     {!isSuccess && (
                        <motion.div
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.5 }}
                           className="grid grid-cols-2 gap-4 mt-6"
                        >
                           <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center text-center gap-3 hover:bg-white/5 transition-colors">
                              <ShieldCheck className="w-8 h-8 text-emerald-400" />
                              <div>
                                 <div className="text-xs font-bold text-white mb-1">Audited</div>
                                 <div className="text-xs text-gray-500">CertiK Verified</div>
                              </div>
                           </div>
                           <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center text-center gap-3 hover:bg-white/5 transition-colors">
                              <Users className="w-8 h-8 text-blue-400" />
                              <div>
                                 <div className="text-xs font-bold text-white mb-1">Support</div>
                                 <div className="text-xs text-gray-500">24/7 Available</div>
                              </div>
                           </div>
                        </motion.div>
                     )}
                  </motion.div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default StakingDetail;