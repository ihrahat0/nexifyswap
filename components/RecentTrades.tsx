import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Trade {
    price: string;
    amount: string;
    time: string;
    side: 'buy' | 'sell';
    id: string;
}

interface RecentTradesProps {
    symbol: string;
    initialTrades?: Trade[];
}

const RecentTrades: React.FC<RecentTradesProps> = ({ symbol, initialTrades = [] }) => {
    const [trades, setTrades] = useState<Trade[]>(initialTrades);
    const [newTradeIds, setNewTradeIds] = useState<Set<string>>(new Set());
    const containerRef = useRef<HTMLDivElement>(null);

    // Simulate new trades
    useEffect(() => {
        const interval = setInterval(() => {
            const newTrade: Trade = {
                id: `trade-${Date.now()}`,
                price: (45000 + Math.random() * 1000).toFixed(2),
                amount: (Math.random() * 0.5).toFixed(4),
                time: new Date().toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }),
                side: Math.random() > 0.5 ? 'buy' : 'sell',
            };

            setTrades((prev) => [newTrade, ...prev.slice(0, 49)]);
            setNewTradeIds((prev) => new Set(prev).add(newTrade.id));

            // Remove flash effect after animation
            setTimeout(() => {
                setNewTradeIds((prev) => {
                    const next = new Set(prev);
                    next.delete(newTrade.id);
                    return next;
                });
            }, 500);
        }, 2000 + Math.random() * 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-full bg-[#0F0F16]">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/5">
                <span className="text-sm font-bold text-gray-200">Recent Trades</span>
                <span className="text-xs text-gray-500">{symbol}/USDT</span>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-3 px-4 py-2 text-xs font-medium text-gray-500 border-b border-white/5">
                <span className="text-left">Price(USDT)</span>
                <span className="text-right">Amount({symbol})</span>
                <span className="text-right">Time</span>
            </div>

            {/* Trades List */}
            <div ref={containerRef} className="flex-1 overflow-y-auto custom-scrollbar">
                <AnimatePresence initial={false}>
                    {trades.map((trade) => {
                        const isNew = newTradeIds.has(trade.id);
                        const isBuy = trade.side === 'buy';

                        return (
                            <motion.div
                                key={trade.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`
                  grid grid-cols-3 px-4 py-[3px] text-xs relative
                  ${isNew ? (isBuy ? 'flash-buy' : 'flash-sell') : ''}
                  hover:bg-white/5 transition-colors cursor-pointer
                `}
                            >
                                {/* Side Indicator */}
                                <div className="flex items-center gap-1.5">
                                    {isBuy ? (
                                        <ArrowUp className="w-3 h-3 text-green-400" />
                                    ) : (
                                        <ArrowDown className="w-3 h-3 text-red-400" />
                                    )}
                                    <span
                                        className={`font-mono font-medium ${isBuy ? 'text-green-400' : 'text-red-400'
                                            }`}
                                    >
                                        {trade.price}
                                    </span>
                                </div>

                                <span className="text-gray-300 font-mono text-right">
                                    {trade.amount}
                                </span>

                                <span className="text-gray-500 font-mono text-right">
                                    {trade.time}
                                </span>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RecentTrades;
