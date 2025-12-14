import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Users, DollarSign, Trophy, ArrowRight, Gift, CheckCircle } from 'lucide-react';
import GlowingBorder from './ui/GlowingBorder';
import GlassCard from './ui/GlassCard';

interface ReferralProps {
  onBack?: () => void;
}

const Referral: React.FC<ReferralProps> = ({ onBack }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://zyntra.com/ref/johndoe";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Invite Friends. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Earn Crypto Together.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Get up to 40% commission on every trade your friends make. 
            Forever. No caps, no limits.
          </motion.p>
        </div>

        {/* Link Generator */}
        <div className="max-w-3xl mx-auto mb-20">
          <GlowingBorder>
             <div className="p-8 md:flex items-center gap-6">
                <div className="flex-1 mb-4 md:mb-0">
                   <label className="text-sm text-gray-400 mb-2 block font-medium">Your Default Referral Link</label>
                   <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white overflow-hidden text-ellipsis">
                      {referralLink}
                   </div>
                </div>
                <button 
                  onClick={handleCopy}
                  className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                   {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                   {copied ? 'Copied!' : 'Copy Link'}
                </button>
             </div>
          </GlowingBorder>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
           <GlassCard className="p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                 <DollarSign className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                 <div className="text-gray-400 mb-1">Total Earnings</div>
                 <div className="text-4xl font-bold font-mono text-emerald-400">$1,240.52</div>
                 <div className="mt-4 text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded w-fit">+12% this week</div>
              </div>
           </GlassCard>

           <GlassCard className="p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                 <Users className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                 <div className="text-gray-400 mb-1">Friends Invited</div>
                 <div className="text-4xl font-bold font-mono text-indigo-400">42</div>
                 <div className="mt-4 text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded w-fit">Active Traders: 18</div>
              </div>
           </GlassCard>

           <GlassCard className="p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                 <Trophy className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                 <div className="text-gray-400 mb-1">Commission Tier</div>
                 <div className="text-4xl font-bold font-mono text-yellow-400">Gold</div>
                 <div className="mt-4 text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded w-fit">30% Kickback</div>
              </div>
           </GlassCard>
        </div>

        {/* Tier System */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
           <div>
              <h2 className="text-3xl font-bold mb-6">Commission Tiers</h2>
              <div className="space-y-4">
                 {[
                    { name: 'Bronze', req: '0 - 5 Friends', comm: '10%', active: false },
                    { name: 'Silver', req: '6 - 20 Friends', comm: '20%', active: false },
                    { name: 'Gold', req: '21 - 100 Friends', comm: '30%', active: true },
                    { name: 'Platinum', req: '100+ Friends', comm: '40%', active: false },
                 ].map((tier, i) => (
                    <div 
                       key={i} 
                       className={`p-4 rounded-xl border flex justify-between items-center ${
                          tier.active 
                             ? 'bg-gradient-to-r from-indigo-900/40 to-indigo-800/20 border-indigo-500/50' 
                             : 'bg-white/5 border-white/5 opacity-60'
                       }`}
                    >
                       <div>
                          <div className={`font-bold ${tier.active ? 'text-white' : 'text-gray-400'}`}>{tier.name}</div>
                          <div className="text-xs text-gray-500">{tier.req}</div>
                       </div>
                       <div className="text-xl font-mono font-bold">{tier.comm}</div>
                    </div>
                 ))}
              </div>
           </div>

           <div>
              <GlowingBorder gradient="from-purple-500 to-pink-500">
                 <div className="p-8 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 h-full flex flex-col justify-center text-center">
                    <Gift className="w-16 h-16 text-pink-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Mystery Box Airdrop</h3>
                    <p className="text-gray-300 mb-8">
                       Invite 3 friends this week and unlock a mystery crypto box worth up to $500.
                    </p>
                    <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                       View Rewards
                    </button>
                 </div>
              </GlowingBorder>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Referral;