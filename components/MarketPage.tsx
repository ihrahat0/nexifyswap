import React, { useState } from 'react';
import { MOCK_COINS } from '../constants';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Search, Filter, Star, Zap } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import { motion } from 'framer-motion';

interface MarketPageProps {
  onTradeClick: (coinId: string) => void;
}

const MarketPage: React.FC<MarketPageProps> = ({ onTradeClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredCoins = MOCK_COINS.filter(coin => 
    (filter === 'All' || true) && // Simplified filter logic for mock
    (coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Market Stats Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
           <GlassCard className="p-6">
              <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">Global Market Cap</div>
              <div className="text-2xl font-mono font-bold text-white flex items-end gap-2">
                 $2.43T <span className="text-sm text-green-400 mb-1">+1.2%</span>
              </div>
           </GlassCard>
           <GlassCard className="p-6">
              <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">24h Volume</div>
              <div className="text-2xl font-mono font-bold text-white">
                 $84.2B
              </div>
           </GlassCard>
           <GlassCard className="p-6">
              <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">BTC Dominance</div>
              <div className="text-2xl font-mono font-bold text-white">
                 52.4%
              </div>
           </GlassCard>
           <GlassCard className="p-6">
              <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">ETH Gas</div>
              <div className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                 <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 12 Gwei
              </div>
           </GlassCard>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
           <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {['All', 'Favorites', 'Metaverse', 'Gaming', 'DeFi', 'Layer 1', 'AI'].map(tab => (
                 <button 
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                       filter === tab 
                       ? 'bg-white text-black' 
                       : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                 >
                    {tab}
                 </button>
              ))}
           </div>

           <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                 type="text" 
                 placeholder="Search coins..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
           </div>
        </div>

        {/* Table */}
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/5">
                   <th className="p-6 font-medium">Name</th>
                   <th className="p-6 font-medium text-right">Price</th>
                   <th className="p-6 font-medium text-right">24h Change</th>
                   <th className="p-6 font-medium text-right hidden md:table-cell">24h Volume</th>
                   <th className="p-6 font-medium text-right hidden lg:table-cell">Market Cap</th>
                   <th className="p-6 font-medium w-48 hidden lg:table-cell">Last 7 Days</th>
                   <th className="p-6 font-medium text-right">Action</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredCoins.map((coin, idx) => (
                   <motion.tr 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.05 }}
                     key={coin.id} 
                     className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                   >
                     <td className="p-6">
                       <div className="flex items-center gap-3">
                         <button className="text-gray-600 hover:text-yellow-400 transition-colors">
                            <Star className="w-4 h-4" />
                         </button>
                         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold ring-1 ring-white/10">
                           {coin.symbol[0]}
                         </div>
                         <div>
                           <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">{coin.name}</div>
                           <div className="text-xs text-gray-500">{coin.symbol}</div>
                         </div>
                       </div>
                     </td>
                     <td className="p-6 font-mono font-medium text-right">
                       ${coin.price.toLocaleString()}
                     </td>
                     <td className="p-6 text-right">
                       <div className={`inline-flex items-center gap-1 ${coin.change24h >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'} px-2 py-1 rounded-lg text-xs font-bold`}>
                         {coin.change24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                         {Math.abs(coin.change24h)}%
                       </div>
                     </td>
                     <td className="p-6 text-gray-400 font-mono text-right hidden md:table-cell">
                       {coin.volume}
                     </td>
                     <td className="p-6 text-gray-400 font-mono text-right hidden lg:table-cell">
                       {coin.marketCap}
                     </td>
                     <td className="p-6 w-48 h-16 hidden lg:table-cell">
                       <div className="h-10 w-32 ml-auto">
                         <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={coin.data.map((val, i) => ({ value: val, index: i }))}>
                             <Line 
                               type="monotone" 
                               dataKey="value" 
                               stroke={coin.change24h >= 0 ? '#10b981' : '#ef4444'} 
                               strokeWidth={2} 
                               dot={false} 
                             />
                           </LineChart>
                         </ResponsiveContainer>
                       </div>
                     </td>
                     <td className="p-6 text-right">
                       <button 
                         onClick={() => onTradeClick(coin.id)}
                         className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-500/20"
                       >
                         Trade
                       </button>
                     </td>
                   </motion.tr>
                 ))}
               </tbody>
             </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default MarketPage;