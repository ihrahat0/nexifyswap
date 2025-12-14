import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Wallet, BarChart3, ChevronDown, Calendar, AlertCircle, 
  ShieldCheck, HelpCircle, CheckCircle2 
} from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StakingPlan } from '../types';
import GlassCard from './ui/GlassCard';

interface StakingDetailProps {
  plan: StakingPlan;
  onBack: () => void;
}

const generateChartData = (amount: number, apy: number, days: number) => {
  const data = [];
  const effectiveDays = days === 0 ? 30 : days; // Default to 30 for visualization if flexible
  const dailyRate = apy / 100 / 365;
  for (let i = 0; i <= effectiveDays; i += Math.max(1, Math.floor(effectiveDays / 15))) {
    const interest = amount * dailyRate * i;
    data.push({
      day: `Day ${i}`,
      value: amount + interest,
      profit: interest
    });
  }
  return data;
};

const StakingDetail: React.FC<StakingDetailProps> = ({ plan, onBack }) => {
  const [stakeAmount, setStakeAmount] = useState<number>(1000);
  const [accordions, setAccordions] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const calculateReturns = () => {
    const yearly = stakeAmount * (plan.apy / 100);
    const monthly = yearly / 12;
    const term = yearly * (plan.durationDays / 365);
    return {
      monthly: monthly.toFixed(2),
      yearly: yearly.toFixed(2),
      totalTerm: term.toFixed(2)
    };
  };

  const returns = calculateReturns();
  const chartData = generateChartData(stakeAmount, plan.apy, plan.durationDays);

  const handleConfirmStake = () => {
    setTimeout(() => {
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 animate-fade-in">
      {/* Hero Banner Area */}
      <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-20`} />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        
        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-center relative z-10">
          <button 
             onClick={onBack}
             className="absolute top-8 left-6 md:left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
             <ArrowLeft className="w-5 h-5" /> Back to Plans
          </button>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-12"
          >
             <div>
                <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                      <plan.icon className="w-8 h-8" />
                   </div>
                   <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider text-white border border-white/10">
                      {plan.risk} Risk Strategy
                   </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{plan.name}</h1>
                <p className="text-gray-300 text-xl max-w-2xl leading-relaxed">{plan.description}</p>
             </div>
             
             <div className="text-right hidden md:block">
                <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Current APY</div>
                <div className={`text-6xl font-mono font-bold ${plan.color}`}>{plan.apy}%</div>
             </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
         <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Left Column: Tools & Chart */}
            <div className="lg:col-span-8 space-y-8">
               
               {/* Profit Calculator */}
               <GlassCard className="p-8">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-bold flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-indigo-400" />
                        Staking Amount
                     </h3>
                     <span className="text-sm text-gray-400">Balance: $124,532.89</span>
                  </div>

                  <div className="bg-black/40 rounded-2xl p-6 border border-white/10 mb-8">
                     <div className="flex items-center gap-4 mb-6">
                        <span className="text-2xl font-bold text-gray-500">$</span>
                        <input 
                           type="number"
                           value={stakeAmount}
                           onChange={(e) => setStakeAmount(Number(e.target.value))}
                           className="w-full bg-transparent text-5xl font-mono font-bold text-white focus:outline-none placeholder-gray-700"
                           placeholder="0.00"
                        />
                        <button 
                           onClick={() => setStakeAmount(124532)}
                           className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 text-sm font-bold rounded-lg transition-colors"
                        >
                           MAX
                        </button>
                     </div>
                     <input 
                        type="range" 
                        min={plan.minStake} 
                        max={150000} 
                        step={100}
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-sm text-gray-400 mb-1">Daily Returns</div>
                        <div className="text-xl font-mono font-bold text-white">~${(Number(returns.yearly) / 365).toFixed(2)}</div>
                     </div>
                     <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-sm text-gray-400 mb-1">Monthly Returns</div>
                        <div className="text-xl font-mono font-bold text-white">~${returns.monthly}</div>
                     </div>
                     <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-sm text-gray-400 mb-1">Total Term Returns</div>
                        <div className={`text-xl font-mono font-bold ${plan.color}`}>+${returns.totalTerm}</div>
                     </div>
                  </div>
               </GlassCard>

               {/* Growth Chart */}
               <GlassCard className="p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                     <BarChart3 className="w-5 h-5 text-indigo-400" />
                     Projected Growth Curve
                  </h3>
                  <div className="h-80 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                           <defs>
                              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                           <XAxis dataKey="day" hide />
                           <Tooltip 
                              contentStyle={{ backgroundColor: '#0F0F16', border: '1px solid #ffffff20', borderRadius: '8px' }}
                              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Balance']}
                              labelStyle={{ color: '#9ca3af' }}
                           />
                           <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#818cf8" 
                              strokeWidth={3} 
                              fill="url(#chartGradient)" 
                           />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </GlassCard>

               {/* FAQ */}
               <div className="space-y-4">
                  <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
                  {plan.faq.map((item, i) => (
                     <div key={i} className="border border-white/10 rounded-xl bg-black/20 overflow-hidden">
                        <button 
                           onClick={() => setAccordions(accordions === i ? null : i)}
                           className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-white/5 transition-colors"
                        >
                           {item.q}
                           <ChevronDown className={`w-4 h-4 transition-transform ${accordions === i ? 'rotate-180' : ''}`} />
                        </button>
                        {accordions === i && (
                           <div className="p-5 pt-0 text-sm text-gray-400 leading-relaxed border-t border-white/5">
                              <div className="pt-4">{item.a}</div>
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-4">
               <div className="sticky top-28 space-y-6">
                  <GlassCard className="p-6 border-t-4 border-t-indigo-500 shadow-2xl">
                     {!isSuccess ? (
                        <>
                           <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                           <div className="space-y-4 mb-8">
                              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                                 <span className="text-gray-400">Lock Period</span>
                                 <span className="font-bold text-white flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-indigo-400" />
                                    {plan.duration}
                                 </span>
                              </div>
                              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                                 <span className="text-gray-400">APR</span>
                                 <span className={`font-bold ${plan.color}`}>{plan.apy}%</span>
                              </div>
                              <div className="flex justify-between items-center text-sm pt-2">
                                 <span className="text-gray-400">Total Est. Return</span>
                                 <span className="font-bold text-2xl text-emerald-400 font-mono">+${returns.totalTerm}</span>
                              </div>
                           </div>
                           
                           <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-3 mb-6">
                              <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                              <p className="text-xs text-orange-200/80 leading-relaxed">
                                 Staking locks your assets. Early redemption is subject to a 2% penalty fee.
                              </p>
                           </div>

                           <button 
                              onClick={handleConfirmStake}
                              disabled={stakeAmount < plan.minStake}
                              className={`w-full py-4 rounded-xl bg-gradient-to-r ${plan.gradient} text-white font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                           >
                              {stakeAmount < plan.minStake ? `Min Stake $${plan.minStake}` : 'Confirm Stake'}
                           </button>
                        </>
                     ) : (
                        <div className="text-center py-8">
                           <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald-500/50">
                              <CheckCircle2 className="w-10 h-10" />
                           </div>
                           <h3 className="text-2xl font-bold mb-2 text-white">Success!</h3>
                           <p className="text-gray-400 mb-8 text-sm">
                              Your {plan.name} stake is now active.
                           </p>
                           <button 
                              onClick={onBack}
                              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                           >
                              View Dashboard
                           </button>
                        </div>
                     )}
                  </GlassCard>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col items-center text-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-gray-500" />
                        <span className="text-xs text-gray-500 font-medium">Audited</span>
                     </div>
                     <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col items-center text-center gap-2">
                        <HelpCircle className="w-6 h-6 text-gray-500" />
                        <span className="text-xs text-gray-500 font-medium">Support</span>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default StakingDetail;