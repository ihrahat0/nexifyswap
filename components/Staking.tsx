import React from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle2 } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import GlowingBorder from './ui/GlowingBorder';
import { STAKING_PLANS } from '../constants';

interface StakingProps {
  onSelectPlan: (planId: string) => void;
}

const Staking: React.FC<StakingProps> = ({ onSelectPlan }) => {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
          >
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-sm font-bold text-indigo-200 tracking-wide uppercase">High Yield Staking Live</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-sans mb-8"
          >
            Staking <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Vaults
            </span>
          </motion.h1>
          
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Choose your investment strategy. From flexible savings to high-yield lockups, 
            earn passive income on your crypto assets with institutional-grade security.
          </motion.p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
           {[
             { label: 'Total Value Locked', val: '$248,593,102', color: 'text-white' },
             { label: 'Total Rewards Paid', val: '$12,842,093', color: 'text-emerald-400' },
             { label: 'Active Stakers', val: '145,203', color: 'text-indigo-400' },
           ].map((stat, i) => (
             <GlassCard key={i} className="p-8 text-center">
                <div className="text-sm text-gray-500 font-medium uppercase tracking-widest mb-2">{stat.label}</div>
                <div className={`text-3xl font-mono font-bold ${stat.color}`}>{stat.val}</div>
             </GlassCard>
           ))}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {STAKING_PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <GlowingBorder className="h-full">
                <div className="h-full p-8 flex flex-col relative z-10">
                   {/* Badge */}
                   {plan.badge && (
                     <div className="absolute top-0 right-0">
                       <div className={`px-4 py-1.5 bg-gradient-to-r ${plan.gradient} text-white text-xs font-bold rounded-bl-xl shadow-lg`}>
                         {plan.badge}
                       </div>
                     </div>
                   )}

                   {/* Icon Header */}
                   <div className="flex items-start justify-between mb-8">
                      <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${plan.color} ${plan.shadow}`}>
                         <plan.icon className="w-8 h-8" />
                      </div>
                      <div className="text-right">
                         <div className={`text-4xl font-bold font-mono tracking-tighter ${plan.color}`}>
                            {plan.apy}%
                         </div>
                         <div className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Fixed APY</div>
                      </div>
                   </div>

                   {/* Plan Info */}
                   <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed min-h-[40px]">{plan.description}</p>
                   </div>

                   {/* Pool Status */}
                   <div className="mb-8 space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                         <span className="text-gray-500">Pool Capacity</span>
                         <span className={plan.poolFilled > 90 ? 'text-orange-400' : 'text-gray-300'}>{plan.poolFilled}% Filled</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                         <div 
                           className={`h-full bg-gradient-to-r ${plan.gradient}`} 
                           style={{ width: `${plan.poolFilled}%` }} 
                         />
                      </div>
                   </div>

                   {/* Features */}
                   <div className="space-y-4 mb-8 flex-grow">
                      {plan.features.slice(0, 3).map((feat, i) => (
                         <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                            <CheckCircle2 className={`w-4 h-4 ${plan.color} shrink-0`} />
                            {feat}
                         </div>
                      ))}
                   </div>

                   {/* Action */}
                   <button 
                     onClick={() => onSelectPlan(plan.id)}
                     className={`w-full py-4 rounded-xl border border-white/10 hover:border-transparent font-bold text-sm uppercase tracking-wide transition-all hover:bg-gradient-to-r ${plan.gradient} text-white shadow-lg`}
                   >
                     View Details
                   </button>
                </div>
              </GlowingBorder>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Staking;