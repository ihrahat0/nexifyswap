import React from 'react';
import { MOCK_COINS } from '../constants';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import GlassCard from './ui/GlassCard';

const MarketTable: React.FC = () => {
  return (
    <section id="markets" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Market Trends</h2>
          <p className="text-gray-400">Live trends from top cryptocurrencies</p>
        </div>

        <GlassCard className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-white/5">
                <th className="p-6 font-medium">Asset</th>
                <th className="p-6 font-medium">Price</th>
                <th className="p-6 font-medium">24h Change</th>
                <th className="p-6 font-medium hidden md:table-cell">Market Cap</th>
                <th className="p-6 font-medium hidden lg:table-cell">Last 7 Days</th>
                <th className="p-6 font-medium">Trade</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_COINS.map((coin) => (
                <tr key={coin.id} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold">
                        {coin.symbol[0]}
                      </div>
                      <div>
                        <div className="font-bold">{coin.name}</div>
                        <div className="text-xs text-gray-500">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 font-mono">
                    ${coin.price.toLocaleString()}
                  </td>
                  <td className="p-6">
                    <div className={`flex items-center gap-1 ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coin.change24h >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {Math.abs(coin.change24h)}%
                    </div>
                  </td>
                  <td className="p-6 text-gray-400 font-mono hidden md:table-cell">
                    {coin.marketCap}
                  </td>
                  <td className="p-6 w-48 h-16 hidden lg:table-cell">
                    <div className="h-10 w-32">
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
                  <td className="p-6">
                    <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-indigo-600 hover:text-white text-indigo-400 border border-indigo-500/30 transition-all text-sm font-medium">
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </section>
  );
};

export default MarketTable;