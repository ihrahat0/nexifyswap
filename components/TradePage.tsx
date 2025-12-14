import React, { useState, useEffect, useRef } from 'react';
import { MOCK_COINS } from '../constants';
import { ArrowLeft, Settings, Wallet, ChevronDown, Percent } from 'lucide-react';

interface TradePageProps {
  coinId: string;
  onBack?: () => void;
}

interface Order {
  price: string;
  amount: string;
  total: string;
  depth: number; // For background bar width
}

const TradePage: React.FC<TradePageProps> = ({ coinId, onBack }) => {
  const coin = MOCK_COINS.find(c => c.id === coinId) || MOCK_COINS[0];
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [currentPrice, setCurrentPrice] = useState(coin.price);
  const [leverage, setLeverage] = useState(20);
  const [orderType, setOrderType] = useState('Limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [priceInput, setPriceInput] = useState(coin.price.toString());
  
  // Order Book State
  const [asks, setAsks] = useState<Order[]>([]);
  const [bids, setBids] = useState<Order[]>([]);

  // TradingView Widget
  useEffect(() => {
    if (containerRef.current) {
        containerRef.current.innerHTML = "";
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
          "autosize": true,
          "symbol": `BINANCE:${coin.symbol}USDT`,
          "interval": "15",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "backgroundColor": "rgba(10, 10, 15, 1)",
          "gridColor": "rgba(255, 255, 255, 0.05)",
          "hide_top_toolbar": false,
          "save_image": false,
          "calendar": false,
          "hide_volume": true,
          "support_host": "https://www.tradingview.com"
        });
        containerRef.current.appendChild(script);
    }
  }, [coin.symbol]);

  // Order Book Simulation Logic
  useEffect(() => {
    const generateBook = (basePrice: number) => {
      const newAsks: Order[] = [];
      const newBids: Order[] = [];
      
      // Generate Asks (Price > Current) - Displayed from High to Low (closest to spread at bottom)
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

      // Generate Bids (Price < Current) - Displayed from High (closest to spread) to Low
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
       // Micro movements in price
       const drift = (Math.random() - 0.5) * (currentPrice * 0.001);
       const newPrice = currentPrice + drift;
       setCurrentPrice(newPrice);
       
       // Update Inputs if market is moving and user hasn't typed (optional UX)
       if (orderType === 'Market') {
         // In a real app we might not update this, but for visual effect:
       }

       const { newAsks, newBids } = generateBook(newPrice);
       setAsks(newAsks);
       setBids(newBids);
    };

    const interval = setInterval(updateBook, 1000);
    // Initial run
    updateBook();

    return () => clearInterval(interval);
  }, []); // Intentionally no dependencies to keep loop simple for demo

  return (
    <div className="pt-20 min-h-screen bg-[#050505] flex flex-col h-screen overflow-hidden text-sm">
      
      {/* Top Header */}
      <div className="h-16 border-b border-white/5 px-4 flex items-center justify-between bg-[#0F0F16] shrink-0">
         <div className="flex items-center gap-6">
            {onBack && (
               <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
               </button>
            )}
            <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-500/20">
                  {coin.symbol[0]}
               </div>
               <div>
                  <div className="font-bold text-white flex items-center gap-2 text-base">
                     {coin.symbol}/USDT 
                     <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-indigo-300 border border-white/5">PERP</span>
                  </div>
                  <div className="text-xs text-indigo-400 font-medium cursor-pointer hover:text-indigo-300">Bitcoin Perpetual</div>
               </div>
            </div>
            
            <div className="hidden md:block w-px h-8 bg-white/10 mx-2" />
            
            <div className="hidden md:flex items-center gap-8">
               <div>
                  <div className={`font-mono font-bold text-lg leading-none mb-1 ${currentPrice >= coin.price ? 'text-green-400' : 'text-red-400'}`}>
                     ${currentPrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400 font-medium flex gap-2">
                     Mark <span className="text-gray-200">${currentPrice.toFixed(2)}</span>
                  </div>
               </div>
               <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">24h Change</div>
                  <div className={`text-sm font-mono font-medium ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                     {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
                  </div>
               </div>
               <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">24h Volume</div>
                  <div className="text-sm font-mono font-medium text-white">{coin.volume}</div>
               </div>
               <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">Funding / Countdown</div>
                  <div className="text-sm font-mono font-medium text-orange-400">0.0100% / 03:45:12</div>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-4">
             <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
               <Settings className="w-5 h-5" />
             </button>
         </div>
      </div>

      {/* Main Layout Grid */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* Left: Chart & Bottom Panels */}
         <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0f] border-r border-white/5">
            {/* Chart Area */}
            <div className="flex-1 relative w-full" ref={containerRef} id="tradingview_widget"></div>
            
            {/* Asset/History Panel */}
            <div className="h-72 border-t border-white/5 bg-[#0F0F16] flex flex-col">
               <div className="flex items-center gap-1 px-2 border-b border-white/5 overflow-x-auto no-scrollbar">
                  {['Positions', 'Open Orders (0)', 'Order History', 'Trade History', 'Transaction History', 'Assets'].map((tab, i) => (
                     <button key={tab} className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${i === 0 ? 'text-indigo-400 border-indigo-400' : 'text-gray-400 border-transparent hover:text-white hover:border-white/10'}`}>
                        {tab}
                     </button>
                  ))}
               </div>
               <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                     <Wallet className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-sm font-medium">No open positions</p>
               </div>
            </div>
         </div>

         {/* Right: Order Book & Trade Form */}
         <div className="w-[320px] lg:w-[360px] flex flex-col bg-[#0F0F16] border-l border-white/5 shrink-0">
            
            {/* Order Book */}
            <div className="flex-1 flex flex-col min-h-0">
               {/* Order Book Header */}
               <div className="flex justify-between items-center p-3 border-b border-white/5">
                  <span className="text-sm font-bold text-gray-200">Order Book</span>
                  <div className="flex gap-2 text-xs text-gray-400">
                     <span className="hover:text-white cursor-pointer">0.1</span>
                     <span className="hover:text-white cursor-pointer">0.01</span>
                  </div>
               </div>
               
               {/* Column Headers */}
               <div className="grid grid-cols-3 px-3 py-2 text-xs font-medium text-gray-500">
                  <span className="text-left">Price(USDT)</span>
                  <span className="text-right">Amount({coin.symbol})</span>
                  <span className="text-right">Total</span>
               </div>

               {/* Asks (Sells) - Red */}
               <div className="flex-1 overflow-hidden flex flex-col justify-end">
                  {asks.map((order, i) => (
                     <div key={`ask-${i}`} className="grid grid-cols-3 px-3 py-[2px] text-xs relative group cursor-pointer hover:bg-white/5">
                        <div className="absolute top-0 right-0 bottom-0 bg-red-500/10 transition-all duration-300" style={{ width: `${order.depth}%` }} />
                        <span className="text-red-400 font-mono relative z-10">{order.price}</span>
                        <span className="text-gray-300 font-mono text-right relative z-10">{order.amount}</span>
                        <span className="text-gray-500 font-mono text-right relative z-10">{order.total}</span>
                     </div>
                  ))}
               </div>

               {/* Current Price Banner */}
               <div className="py-3 px-4 border-y border-white/5 flex items-center justify-center gap-2 bg-white/[0.02]">
                  <span className={`text-xl font-bold font-mono tracking-tight ${currentPrice >= coin.price ? 'text-green-400' : 'text-red-400'}`}>
                     ${currentPrice.toFixed(2)}
                  </span>
                  <ArrowLeft className={`w-3 h-3 rotate-90 ${currentPrice >= coin.price ? 'text-green-400' : 'text-red-400'}`} />
               </div>

               {/* Bids (Buys) - Green */}
               <div className="flex-1 overflow-hidden">
                  {bids.map((order, i) => (
                     <div key={`bid-${i}`} className="grid grid-cols-3 px-3 py-[2px] text-xs relative group cursor-pointer hover:bg-white/5">
                        <div className="absolute top-0 right-0 bottom-0 bg-green-500/10 transition-all duration-300" style={{ width: `${order.depth}%` }} />
                        <span className="text-green-400 font-mono relative z-10">{order.price}</span>
                        <span className="text-gray-300 font-mono text-right relative z-10">{order.amount}</span>
                        <span className="text-gray-500 font-mono text-right relative z-10">{order.total}</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Order Entry Form */}
            <div className="p-4 border-t border-white/10 bg-[#13131d]">
               {/* Buy/Sell Tabs */}
               <div className="grid grid-cols-2 gap-2 mb-4 p-1 bg-black/40 rounded-lg">
                  <button 
                     onClick={() => setSide('buy')} 
                     className={`py-2 text-sm font-bold rounded-md transition-all ${side === 'buy' ? 'bg-green-500 text-white shadow-lg shadow-green-900/20' : 'text-gray-400 hover:text-white'}`}
                  >
                     Buy
                  </button>
                  <button 
                     onClick={() => setSide('sell')} 
                     className={`py-2 text-sm font-bold rounded-md transition-all ${side === 'sell' ? 'bg-red-500 text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:text-white'}`}
                  >
                     Sell
                  </button>
               </div>

               {/* Order Type */}
               <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-4 text-sm font-medium text-gray-400">
                     {['Limit', 'Market', 'Stop'].map(type => (
                        <button 
                           key={type}
                           onClick={() => setOrderType(type)}
                           className={`transition-colors ${orderType === type ? 'text-indigo-400 border-b border-indigo-400 pb-0.5' : 'hover:text-white'}`}
                        >
                           {type}
                        </button>
                     ))}
                  </div>
                  <button className="text-gray-500 hover:text-white">
                     <Settings className="w-4 h-4" />
                  </button>
               </div>

               {/* Inputs */}
               <div className="space-y-3 mb-4">
                  <div className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 flex items-center justify-between group focus-within:border-indigo-500/50 transition-colors">
                     <span className="text-xs text-gray-500 font-medium">Price</span>
                     <input 
                        type="text" 
                        value={orderType === 'Market' ? 'Market Price' : priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        disabled={orderType === 'Market'}
                        className="bg-transparent text-right w-32 font-mono text-sm text-white focus:outline-none disabled:text-gray-500"
                     />
                     <span className="text-xs text-gray-500 ml-2">USDT</span>
                  </div>

                  <div className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 flex items-center justify-between group focus-within:border-indigo-500/50 transition-colors">
                     <span className="text-xs text-gray-500 font-medium">Amount</span>
                     <input 
                        type="text" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-transparent text-right w-32 font-mono text-sm text-white focus:outline-none"
                     />
                     <span className="text-xs text-gray-500 ml-2">{coin.symbol}</span>
                  </div>
               </div>

               {/* Percentage Slider */}
               <div className="mb-4">
                  <div className="flex justify-between gap-1 mb-2">
                     {[25, 50, 75, 100].map(pct => (
                        <button key={pct} className="flex-1 py-1 text-[10px] bg-white/5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                           {pct}%
                        </button>
                     ))}
                  </div>
               </div>

               {/* Leverage */}
               <div className="mb-6">
                  <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                     <span>Leverage</span>
                     <span className="text-white bg-white/10 px-1.5 py-0.5 rounded font-mono">{leverage}x</span>
                  </div>
                  <input 
                     type="range" min="1" max="125" 
                     value={leverage}
                     onChange={(e) => setLeverage(Number(e.target.value))}
                     className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
               </div>

               {/* Info Rows */}
               <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                     <span className="text-gray-500">Avail</span>
                     <span className="text-white font-mono">124,532.89 USDT</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="text-gray-500">Max Open</span>
                     <span className="text-white font-mono">2.5 BTC</span>
                  </div>
               </div>

               {/* Submit Button */}
               <button 
                  className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transform active:scale-[0.98] transition-all ${
                     side === 'buy' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/20 hover:brightness-110' 
                        : 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/20 hover:brightness-110'
                  }`}
               >
                  {side === 'buy' ? 'Buy / Long' : 'Sell / Short'} {coin.symbol}
               </button>
            </div>

         </div>

      </div>
    </div>
  );
};

export default TradePage;