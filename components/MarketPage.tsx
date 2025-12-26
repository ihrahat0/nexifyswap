import React, { useState, useMemo } from 'react';
import { MOCK_COINS } from '../constants';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Search, Star, TrendingUp } from 'lucide-react';

interface MarketPageProps {
  onTradeClick: (coinId: string) => void;
}

// Real CoinGecko logo URLs
const COIN_LOGOS: Record<string, string> = {
  'BTC': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  'ETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  'USDC': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  'BNB': 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970',
  'SOL': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  'AAVE': 'https://assets.coingecko.com/coins/images/12645/small/aave-token-round.png',
  'XRP': 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
  'DOGE': 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  'AVAX': 'https://assets.coingecko.com/coins/images/12559/standard/Avalanche_Circle_RedWhite_Trans.png?1696512369',
  'SUI': 'https://assets.coingecko.com/coins/images/12559/standard/Avalanche_Circle_RedWhite_Trans.png?1696512369',
  'LINK': 'https://assets.coingecko.com/coins/images/877/standard/Chainlink_Logo_500.png?1760023405',
  'ADA': 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
  'NEAR': 'https://assets.coingecko.com/coins/images/10365/standard/near.jpg?1696510367',
  'SHIB': 'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
  'DOT': 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
  'MATIC': 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  'LTC': 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
  'UNI': 'https://assets.coingecko.com/coins/images/12504/small/uni.jpg',
};

// Helper function to format price with proper decimal places
const formatPrice = (price: number): string => {
  if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  // For prices < 1, show up to 2 significant digits after the leading zeros
  const priceStr = price.toString();
  const match = priceStr.match(/^0\.(0*)([1-9]\d?)/);
  if (match) {
    const zeros = match[1].length;
    const significant = match[2];
    return price.toFixed(zeros + Math.min(2, significant.length));
  }
  return price.toFixed(6);
};

const MarketPage: React.FC<MarketPageProps> = ({ onTradeClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Spot');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const topGainers = useMemo(() =>
    [...MOCK_COINS].sort((a, b) => b.change24h - a.change24h).slice(0, 3),
    []
  );

  const newlyListed = useMemo(() =>
    [...MOCK_COINS].slice(0, 3),
    []
  );

  const trending = useMemo(() =>
    [...MOCK_COINS].slice(3, 6),
    []
  );

  const filteredCoins = useMemo(() => {
    return MOCK_COINS.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="pt-20 pb-12 min-h-screen bg-black">
      <div className="max-w-[1800px] mx-auto px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Markets</h1>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#2f2f2f] transition-colors"
            />
          </div>
        </div>

        {/* Main Tabs */}
        <div className="flex items-center gap-6 mb-8 border-b border-[#1f1f1f]">
          {['Favorites', 'Spot', 'Derivatives', 'TradFi', 'Newly Listed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 text-sm font-medium transition-all relative ${activeTab === tab
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
              )}
            </button>
          ))}
        </div>

        {/* Top Sections: Top Gainers, Newly Listed, Trending */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {/* Top Gainers */}
          <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" style={{ backgroundImage: 'url(/images/box-backgrounds/top-gainers.webp)' }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-black/60 to-black/80"></div>

            {/* Content */}
            <div className="relative z-10 p-4">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Gainers</h3>
              </div>

              {/* Coins List */}
              <div className="space-y-2">
                {topGainers.map((coin) => {
                  const isPositive = coin.change24h >= 0;
                  return (
                    <div
                      key={coin.id}
                      className="flex items-center gap-2 p-2 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5 hover:bg-black/40 hover:border-emerald-500/30 transition-all cursor-pointer group/item"
                      onClick={() => onTradeClick(coin.id)}
                    >
                      {/* Left: Logo & Info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={COIN_LOGOS[coin.symbol] || `https://via.placeholder.com/32/6366f1/ffffff?text=${coin.symbol[0]}`}
                          alt={coin.symbol}
                          className="w-10 h-10 rounded-full ring-2 ring-emerald-500/20 group-hover/item:ring-emerald-500/40 transition-all"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-white text-sm group-hover/item:text-emerald-400 transition-colors">{coin.symbol}</div>
                          <div className="text-xs text-gray-400 font-medium">${formatPrice(coin.price)}</div>
                        </div>
                      </div>

                      {/* Center: Mini Chart */}
                      <div className="h-12 w-20 opacity-60 group-hover/item:opacity-100 transition-opacity">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={coin.data.map((val) => ({ value: val }))}>
                            <defs>
                              <linearGradient id={`grad-gainer-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke="#10b981"
                              strokeWidth={1.5}
                              fill="url(#grad-gainer-${coin.id})"
                              dot={false}
                              isAnimationActive={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Right: Change % */}
                      <div className="text-right">
                        <div className="px-2.5 py-1 bg-emerald-500/15 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30 backdrop-blur-sm">
                          +{coin.change24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Newly Listed */}
          <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" style={{ backgroundImage: 'url(/images/box-backgrounds/newly-listed.webp)' }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-black/60 to-black/80"></div>

            {/* Content */}
            <div className="relative z-10 p-4">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10 backdrop-blur-sm border border-blue-500/20">
                  <Star className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Newly Listed</h3>
              </div>

              {/* Coins List */}
              <div className="space-y-2">
                {newlyListed.map((coin) => {
                  const isPositive = coin.change24h >= 0;
                  return (
                    <div
                      key={coin.id}
                      className="flex items-center gap-2 p-2 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5 hover:bg-black/40 hover:border-blue-500/30 transition-all cursor-pointer group/item"
                      onClick={() => onTradeClick(coin.id)}
                    >
                      {/* Left: Logo & Info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={COIN_LOGOS[coin.symbol] || `https://via.placeholder.com/32/10b981/ffffff?text=${coin.symbol[0]}`}
                          alt={coin.symbol}
                          className="w-10 h-10 rounded-full ring-2 ring-blue-500/20 group-hover/item:ring-blue-500/40 transition-all"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-white text-sm group-hover/item:text-blue-400 transition-colors">{coin.symbol}</div>
                          <div className="text-xs text-gray-400 font-medium">${formatPrice(coin.price)}</div>
                        </div>
                      </div>

                      {/* Center: Mini Chart */}
                      <div className="h-12 w-20 opacity-60 group-hover/item:opacity-100 transition-opacity">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={coin.data.map((val) => ({ value: val }))}>
                            <defs>
                              <linearGradient id={`grad-new-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.4} />
                                <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke={isPositive ? '#10b981' : '#ef4444'}
                              strokeWidth={1.5}
                              fill={`url(#grad-new-${coin.id})`}
                              dot={false}
                              isAnimationActive={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Right: Change % */}
                      <div className="text-right">
                        <div className={`px-2.5 py-1 text-xs font-bold rounded-lg border backdrop-blur-sm ${isPositive
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border-red-500/30'
                          }`}>
                          {isPositive ? '+' : ''}{coin.change24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Trending */}
          <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all duration-300 group">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" style={{ backgroundImage: 'url(/images/box-backgrounds/trending-coins.webp)' }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-black/60 to-black/80"></div>

            {/* Content */}
            <div className="relative z-10 p-4">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-orange-500/10 backdrop-blur-sm border border-orange-500/20">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Trending</h3>
              </div>

              {/* Coins List */}
              <div className="space-y-3">
                {trending.map((coin) => {
                  const isPositive = coin.change24h >= 0;
                  return (
                    <div
                      key={coin.id}
                      className="flex items-center gap-2 p-2 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5 hover:bg-black/40 hover:border-orange-500/30 transition-all cursor-pointer group/item"
                      onClick={() => onTradeClick(coin.id)}
                    >
                      {/* Left: Logo & Info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={COIN_LOGOS[coin.symbol] || `https://via.placeholder.com/32/f59e0b/ffffff?text=${coin.symbol[0]}`}
                          alt={coin.symbol}
                          className="w-10 h-10 rounded-full ring-2 ring-orange-500/20 group-hover/item:ring-orange-500/40 transition-all"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-white text-sm group-hover/item:text-orange-400 transition-colors">{coin.symbol}</div>
                          <div className="text-xs text-gray-400 font-medium">${coin.price.toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Center: Mini Chart */}
                      <div className="h-12 w-20 opacity-60 group-hover/item:opacity-100 transition-opacity">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={coin.data.map((val) => ({ value: val }))}>
                            <defs>
                              <linearGradient id={`grad-trending-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.4} />
                                <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke={isPositive ? '#10b981' : '#ef4444'}
                              strokeWidth={1.5}
                              fill={`url(#grad-trending-${coin.id})`}
                              dot={false}
                              isAnimationActive={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Right: Change % */}
                      <div className="text-right">
                        <div className={`px-2.5 py-1 text-xs font-bold rounded-lg border backdrop-blur-sm ${isPositive
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border-red-500/30'
                          }`}>
                          {isPositive ? '+' : ''}{coin.change24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Padding Wrapper for Filters and Table */}
      <div className="px-4 md:px-8">
        {/* Filter Pills - Currency */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
          {['All', 'USDT', 'USDC', 'USDP', 'MNT', 'USD1', 'EUR', 'BRL', 'PLN', 'TRY', 'SOL', 'BTC', 'ETH', 'DAI', 'XUSD', 'RLUSD'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeFilter === filter
                ? 'bg-orange-500 text-white'
                : 'bg-[#0a0a0a] text-gray-400 hover:text-white border border-[#1f1f1f]'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
          {['All', 'xBanks', '0 Fees', 'Margin Trading', 'Adventure Zone', 'SOL Ecosystem', 'ETH Ecosystem', 'BTC Ecosystem', 'AI', 'Modular-BCs', 'DeFiHi', 'LSD', 'DeF'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeCategory === cat
                ? 'bg-orange-500 text-white'
                : 'bg-[#0a0a0a] text-gray-500 hover:text-gray-300 border border-[#1f1f1f]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Table Header Labels */}
        <div className="grid grid-cols-[40px_2fr_1.2fr_1fr_1fr_1fr_1.4fr_1fr_120px] gap-6 px-4 py-3 mb-2">
          <div className="text-xs font-medium text-gray-500"></div>
          <div className="text-xs font-medium text-gray-500">Trading Pairs</div>
          <div className="text-xs font-medium text-gray-500 text-right">Last Traded Price</div>
          <div className="text-xs font-medium text-gray-500 text-right">24H Change %</div>
          <div className="text-xs font-medium text-gray-500 text-right">24H High</div>
          <div className="text-xs font-medium text-gray-500 text-right">24H Low</div>
          <div className="text-xs font-medium text-gray-500 text-right">24H Trading Volume</div>
          <div className="text-xs font-medium text-gray-500 text-center">Charts</div>
          <div className="text-xs font-medium text-gray-500 text-center">Trade</div>
        </div>

        {/* Table Rows */}
        <div className="space-y-0">
          {
            filteredCoins.map((coin, idx) => {
              const isPositive = coin.change24h >= 0;
              const high24h = coin.price * 1.05;
              const low24h = coin.price * 0.95;
              const volume24h = `${(Math.random() * 500 + 50).toFixed(2)}M(USDT)`;

              return (
                <div
                  key={coin.id}
                  onClick={() => onTradeClick(coin.id)}
                  className="grid grid-cols-[40px_2fr_1.2fr_1fr_1fr_1fr_1.4fr_1fr_120px] gap-6 px-4 py-4 hover:bg-[#0a0a0a] transition-colors cursor-pointer border-b border-[#1a1a1a] group"
                >
                  {/* Star */}
                  <div className="flex items-center">
                    <button
                      onClick={(e) => toggleFavorite(coin.id, e)}
                      className={`transition-all ${favorites.has(coin.id)
                        ? 'text-yellow-500 scale-110'
                        : 'text-gray-700 hover:text-gray-500 group-hover:text-gray-600'
                        }`}
                    >
                      <Star className="w-4 h-4" fill={favorites.has(coin.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Trading Pair with Logo */}
                  <div className="flex items-center gap-3">
                    <img
                      src={COIN_LOGOS[coin.symbol] || `https://via.placeholder.com/32/1f1f1f/ffffff?text=${coin.symbol[0]}`}
                      alt={coin.symbol}
                      className="w-7 h-7 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/32/1f1f1f/ffffff?text=${coin.symbol[0]}`;
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{coin.symbol}/USDT</span>
                      <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded">
                        10X
                      </span>
                      {idx < 3 && (
                        <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold rounded flex items-center gap-1">
                          <TrendingUp className="w-2.5 h-2.5" />
                          0 Fees
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Last Traded Price */}
                  <div className="flex items-center justify-end">
                    <span className="font-semibold text-white">
                      {coin.price.toLocaleString('en-US', {
                        minimumFractionDigits: coin.price < 1 ? 5 : 1,
                        maximumFractionDigits: coin.price < 1 ? 5 : 1
                      })}
                    </span>
                  </div>

                  {/* 24H Change */}
                  <div className="flex items-center justify-end">
                    <span className={`font-semibold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{coin.change24h.toFixed(2)}%
                    </span>
                  </div>

                  {/* 24H High */}
                  <div className="flex items-center justify-end">
                    <span className="text-gray-300 font-medium">
                      {high24h.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    </span>
                  </div>

                  {/* 24H Low */}
                  <div className="flex items-center justify-end">
                    <span className="text-gray-300 font-medium">
                      {low24h.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    </span>
                  </div>

                  {/* 24H Volume */}
                  <div className="flex items-center justify-end">
                    <span className="text-gray-300 font-medium">{volume24h}</span>
                  </div>

                  {/* Chart */}
                  <div className="flex items-center justify-center">
                    <div className="h-10 w-20">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={coin.data.map((val) => ({ value: val }))}>
                          <defs>
                            <linearGradient id={`grad-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
                              <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={isPositive ? '#10b981' : '#ef4444'}
                            strokeWidth={1.5}
                            fill={`url(#grad-${coin.id})`}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Trade Button */}
                  <div className="flex items-center justify-center">
                    <button className="px-5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40">
                      Trade
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MarketPage;