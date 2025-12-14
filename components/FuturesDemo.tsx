import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, TrendingDown, RefreshCcw, Info } from 'lucide-react';
import GlowingBorder from './ui/GlowingBorder';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

const FuturesDemo: React.FC = () => {
  const [leverage, setLeverage] = useState(125);
  const [position, setPosition] = useState<'long' | 'short'>('long');
  const [collateral, setCollateral] = useState(100);
  const [price, setPrice] = useState(64250);
  
  // Simulated Price Movement
  const [chartData, setChartData] = useState<{v: number}[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prev => prev + (Math.random() - 0.5) * 50);
      setChartData(prev => {
        const newData = [...prev, { v: Math.random() * 100 }];
        if (newData.length > 20) newData.shift();
        return newData;
      });
    }, 1000);
    
    // Fill initial chart
    const initial = Array.from({ length: 20 }, () => ({ v: Math.random() * 100 }));
    setChartData(initial);

    return () => clearInterval(interval);
  }, []);

  const positionSize = collateral * leverage;
  const fees = positionSize * 0.0002;
  const pnl = (positionSize * (Math.random() * 0.02 * (position === 'long' ? 1 : -1))).toFixed(2);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 text-indigo-400 font-bold mb-4 tracking-wider uppercase text-sm">
              <Zap className="w-4 h-4" />
              <span>Futures 2.0</span>
            </div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Amplify your potential <br />
              with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">150x Leverage</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Trade with the industry's deepest liquidity and lowest slippage. 
              Our advanced matching engine ensures your orders are executed instantly, even in volatile markets.
            </p>

            <div className="space-y-4">
              {[
                { title: "Cross & Isolated Margin", desc: "Full control over your risk management." },
                { title: "Multi-Asset Collateral", desc: "Use BTC, ETH, or USDT as margin." },
                { title: "Protection Fund", desc: "$500M SAFU fund protecting your wins." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1 h-12 bg-white/10 rounded-full" />
                  <div>
                    <h4 className="text-white font-bold">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Interactive Demo Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <GlowingBorder className="bg-[#0F0F16]">
              <div className="p-6">
                {/* Header: BTC/USDT */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-sm">₿</div>
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        BTC/USDT 
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">Perp</span>
                      </div>
                      <div className="text-2xl font-mono font-bold text-white">${price.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="h-10 w-24">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                           <Area type="monotone" dataKey="v" stroke="#10b981" fill="#10b98120" strokeWidth={2} />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                  {/* Leverage Slider */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Leverage</span>
                      <span className="text-indigo-400 font-bold font-mono">{leverage}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="150" 
                      value={leverage}
                      onChange={(e) => setLeverage(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-2 font-mono">
                      <span>1x</span>
                      <span>50x</span>
                      <span>100x</span>
                      <span>150x</span>
                    </div>
                  </div>

                  {/* Position Toggle */}
                  <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl">
                    <button 
                      onClick={() => setPosition('long')}
                      className={`py-2 rounded-lg text-sm font-bold transition-all ${position === 'long' ? 'bg-green-500/20 text-green-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      Buy / Long
                    </button>
                    <button 
                      onClick={() => setPosition('short')}
                      className={`py-2 rounded-lg text-sm font-bold transition-all ${position === 'short' ? 'bg-red-500/20 text-red-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      Sell / Short
                    </button>
                  </div>

                  {/* Calculations */}
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Margin Required</span>
                      <span className="text-white font-mono">${collateral.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Position Size</span>
                      <span className="text-indigo-400 font-bold font-mono text-lg">${positionSize.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-400">Est. Fees</span>
                       <span className="text-gray-400 font-mono">${fees.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                       <span className="text-gray-400 text-sm">Unrealized PNL (Sim)</span>
                       <span className={`font-mono font-bold ${Number(pnl) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {Number(pnl) > 0 ? '+' : ''}{pnl} USDT
                       </span>
                    </div>
                  </div>

                  <button className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${position === 'long' ? 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-green-900/20' : 'bg-gradient-to-r from-red-600 to-orange-600 shadow-red-900/20'}`}>
                    {position === 'long' ? 'Open Long' : 'Open Short'} BTC
                  </button>
                </div>

              </div>
            </GlowingBorder>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FuturesDemo;