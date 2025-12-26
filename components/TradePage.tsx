import React, { useState, useEffect, useRef } from 'react';
import { MOCK_COINS } from '../constants';
import { X, Maximize2, Minimize2, Settings, Bell, Zap, TrendingUp, TrendingDown, BarChart3, Activity, ChevronDown } from 'lucide-react';
import OrderBook from './OrderBook';
import RecentTrades from './RecentTrades';
import DepthChart from './DepthChart';
import FundingRateWidget from './FundingRateWidget';
import PositionsPanel from './PositionsPanel';
import OrderPanel from './OrderPanel';
import AnimatedNumber from './ui/AnimatedNumber';
import { motion, AnimatePresence } from 'framer-motion';

import TradingViewWidget from './TradingViewWidget';

interface TradePageProps {
   coinId: string;
   onBack?: () => void;
}

interface Order {
   price: string;
   amount: string;
   total: string;
   depth: number;
}

interface Position {
   id: string;
   symbol: string;
   side: 'long' | 'short';
   size: number;
   entryPrice: number;
   markPrice: number;
   liquidationPrice: number;
   leverage: number;
   margin: number;
   unrealizedPnL: number;
   unrealizedPnLPercent: number;
   marginRatio: number;
}

const TradePage: React.FC<TradePageProps> = ({ coinId, onBack }) => {
   const coin = MOCK_COINS.find(c => c.id === coinId) || MOCK_COINS[0];

   // State
   const [currentPrice, setCurrentPrice] = useState(coin.price);
   const [markPrice, setMarkPrice] = useState(coin.price);
   const [indexPrice, setIndexPrice] = useState(coin.price * 0.9995);
   const [high24h, setHigh24h] = useState(coin.price * 1.05);
   const [low24h, setLow24h] = useState(coin.price * 0.95);
   const [activeChart, setActiveChart] = useState<'price' | 'depth' | 'funding'>('price');
   const [isFullscreen, setIsFullscreen] = useState(false);

   // Order Book State
   const [asks, setAsks] = useState<Order[]>([]);
   const [bids, setBids] = useState<Order[]>([]);

   // Positions State
   const [positions, setPositions] = useState<Position[]>([
      {
         id: '1',
         symbol: coin.symbol,
         side: 'long',
         size: 0.5432,
         entryPrice: 45234.50,
         markPrice: coin.price,
         liquidationPrice: 42100.00,
         leverage: 20,
         margin: 1250.00,
         unrealizedPnL: 156.75,
         unrealizedPnLPercent: 12.54,
         marginRatio: 45.3,
      }
   ]);

   // Order Book Simulation
   useEffect(() => {
      const generateBook = (basePrice: number) => {
         const newAsks: Order[] = [];
         const newBids: Order[] = [];

         for (let i = 14; i >= 0; i--) {
            const price = basePrice + (i + 1) * (basePrice * 0.0005) + (Math.random() * basePrice * 0.0002);
            const qty = Math.random() * 2 + 0.1;
            newAsks.push({
               price: price.toFixed(2),
               amount: qty.toFixed(4),
               total: (price * qty).toFixed(2),
               depth: Math.random() * 100
            });
         }

         for (let i = 0; i < 15; i++) {
            const price = basePrice - (i + 1) * (basePrice * 0.0005) - (Math.random() * basePrice * 0.0002);
            const qty = Math.random() * 2 + 0.1;
            newBids.push({
               price: price.toFixed(2),
               amount: qty.toFixed(4),
               total: (price * qty).toFixed(2),
               depth: Math.random() * 100
            });
         }
         return { newAsks, newBids };
      };

      const updateBook = () => {
         const drift = (Math.random() - 0.5) * (currentPrice * 0.001);
         const newPrice = currentPrice + drift;
         setCurrentPrice(newPrice);
         setMarkPrice(newPrice * (1 + (Math.random() - 0.5) * 0.0001));
         setIndexPrice(newPrice * 0.9995);

         const { newAsks, newBids } = generateBook(newPrice);
         setAsks(newAsks);
         setBids(newBids);

         setPositions(prev => prev.map(pos => ({
            ...pos,
            markPrice: newPrice,
            unrealizedPnL: (newPrice - pos.entryPrice) * pos.size * (pos.side === 'long' ? 1 : -1),
            unrealizedPnLPercent: ((newPrice - pos.entryPrice) / pos.entryPrice) * 100 * (pos.side === 'long' ? 1 : -1) * pos.leverage,
         })));
      };

      const interval = setInterval(updateBook, 1000);
      updateBook();

      return () => clearInterval(interval);
   }, []);

   const handlePriceClick = (price: string) => {
      console.log('Price clicked:', price);
   };

   const handleClosePosition = (id: string) => {
      setPositions(prev => prev.filter(p => p.id !== id));
   };

   return (
      <div className="min-h-screen bg-black mesh-bg flex flex-col h-screen overflow-hidden pt-[100px]">

         {/* Main Trading Interface - Fixed Height Layout */}
         <div className="flex-1 flex overflow-hidden px-2 pb-2 h-full gap-2">

            {/* Left: Chart & Positions */}
            <div className="flex-1 flex flex-col gap-2 min-w-0 h-full">

               {/* Chart Panel */}
               <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col relative group"
               >
                  {/* Gradient Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  {/* Chart Header: Coin Info (Left) & Tabs (Right) */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 relative z-10 w-full">

                     {/* Left: Coin Info & Stats */}
                     <div className="flex items-center gap-6">
                        {/* Symbol & Badge */}
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-2">
                              <img
                                 src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coinId === 'bitcoin' ? '1' : coinId === 'ethereum' ? '1027' : coinId === 'solana' ? '5426' : '1'}.png`}
                                 onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/32/6366f1/ffffff?text=${coin.symbol[0]}`;
                                 }}
                                 alt={coin.symbol}
                                 className="w-8 h-8 rounded-full"
                              />
                              <div>
                                 <div className="flex items-center gap-2">
                                    <span className="font-bold text-white text-lg">{coin.symbol}/USDT</span>
                                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">PERP</span>
                                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">20x</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Price & Change */}
                        <div className="flex items-center gap-4 border-l border-white/10 pl-4">
                           <AnimatedNumber
                              value={currentPrice}
                              format="currency"
                              decimals={2}
                              prefix="$"
                              colorize
                              className="text-2xl font-bold font-mono leading-none tracking-tight"
                           />
                           <div className="flex flex-col">
                              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">24h Change</span>
                              <span className={`text-xs font-bold ${coin.change24h >= 0 ? 'text-[#00ff88]' : 'text-[#ff3366]'}`}>
                                 {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
                              </span>
                           </div>
                        </div>

                        {/* Additional Stats (Hidden on small screens) */}
                        <div className="hidden lg:flex items-center gap-4 border-l border-white/10 pl-4">
                           <div className="flex flex-col">
                              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">24h High</span>
                              <span className="text-xs font-bold text-gray-300 transform transition-colors hover:text-[#00ff88] cursor-default">
                                 ${high24h.toFixed(2)}
                              </span>
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">24h Low</span>
                              <span className="text-xs font-bold text-gray-300 transform transition-colors hover:text-[#ff3366] cursor-default">
                                 ${low24h.toFixed(2)}
                              </span>
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Funding</span>
                              <span className="text-xs font-bold text-orange-400">0.0100%</span>
                           </div>
                        </div>
                     </div>

                     {/* Right: Chart Tabs */}
                     <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                        {[
                           { value: 'price', label: 'Price', icon: Activity },
                           { value: 'depth', label: 'Depth', icon: BarChart3 },
                           { value: 'funding', label: 'Funding', icon: TrendingUp },
                        ].map(({ value, label, icon: Icon }) => (
                           <button
                              key={value}
                              onClick={() => setActiveChart(value as any)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeChart === value
                                 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                 : 'text-gray-400 hover:text-white hover:bg-white/5'
                                 }`}
                           >
                              <Icon className="w-3.5 h-3.5" />
                              {label}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Chart Content */}
                  <div className="flex-1 relative bg-black/50">
                     {/* Persist TradingView Widget - Never Unmount */}
                     <div className={activeChart === 'price' ? 'absolute inset-0 z-10' : 'hidden'}>
                        <TradingViewWidget symbol={coin.symbol} />
                     </div>

                     <AnimatePresence mode="wait">
                        {activeChart === 'depth' && (
                           <motion.div
                              key="depth"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 p-4 z-20"
                           >
                              <DepthChart symbol={coin.symbol} currentPrice={currentPrice} />
                           </motion.div>
                        )}
                        {activeChart === 'funding' && (
                           <motion.div
                              key="funding"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 p-8 overflow-auto custom-scrollbar z-20"
                           >
                              <div className="max-w-2xl mx-auto">
                                 <FundingRateWidget symbol={coin.symbol} />
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </motion.div>

               {/* Positions Panel */}
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-64 glass-panel rounded-2xl overflow-hidden"
               >
                  <PositionsPanel
                     positions={positions}
                     onClosePosition={handleClosePosition}
                     onAddMargin={(id) => console.log('Add margin:', id)}
                     onSharePosition={(id) => console.log('Share position:', id)}
                  />
               </motion.div>
            </div>

            {/* Center: Order Book & Trades - Height Adjusted */}
            <div className="w-80 lg:w-96 flex flex-col gap-2 h-full">
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="h-[60%] glass-panel rounded-2xl overflow-hidden"
               >
                  <OrderBook
                     symbol={coin.symbol}
                     currentPrice={currentPrice}
                     asks={asks}
                     bids={bids}
                     onPriceClick={handlePriceClick}
                  />
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="h-[40%] glass-panel rounded-2xl overflow-hidden"
               >
                  <RecentTrades symbol={coin.symbol} />
               </motion.div>
            </div>

            {/* Right: Order Panel - Fixed Height */}
            <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="w-[340px] lg:w-[380px] glass-panel rounded-2xl overflow-y-auto custom-scrollbar h-full flex flex-col"
            >
               <OrderPanel
                  symbol={coin.symbol}
                  currentPrice={currentPrice}
                  availableBalance={124532.89}
                  onPlaceOrder={(order) => console.log('Order placed:', order)}
               />
            </motion.div>

         </div>
      </div>
   );
};

export default TradePage;