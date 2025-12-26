import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Order {
    price: string;
    amount: string;
    total: string;
    depth: number;
}

interface OrderBookProps {
    symbol: string;
    currentPrice: number;
    asks: Order[];
    bids: Order[];
    onPriceClick?: (price: string) => void;
}

const OrderBook: React.FC<OrderBookProps> = ({
    symbol,
    currentPrice,
    asks,
    bids,
    onPriceClick,
}) => {
    const [grouping, setGrouping] = useState('0.01');
    const [flashOrders, setFlashOrders] = useState<Set<string>>(new Set());

    // Simulate flash effect on order updates
    useEffect(() => {
        const newFlashes = new Set<string>();
        asks.slice(0, 2).forEach((_, i) => newFlashes.add(`ask-${i}`));
        bids.slice(0, 2).forEach((_, i) => newFlashes.add(`bid-${i}`));

        setFlashOrders(newFlashes);
        const timeout = setTimeout(() => setFlashOrders(new Set()), 300);

        return () => clearTimeout(timeout);
    }, [asks, bids]);

    const groupingOptions = ['0.01', '0.1', '1', '10'];

    return (
        <div className="flex flex-col h-full bg-[#0F0F16]">
            {/* Order Book Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/5">
                <span className="text-sm font-bold text-gray-200">Order Book</span>
                <div className="flex gap-1">
                    {groupingOptions.map((group) => (
                        <button
                            key={group}
                            onClick={() => setGrouping(group)}
                            className={`px-2 py-1 text-xs rounded transition-all ${grouping === group
                                    ? 'bg-indigo-500 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {group}
                        </button>
                    ))}
                </div>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-3 px-4 py-2 text-xs font-medium text-gray-500 border-b border-white/5">
                <span className="text-left">Price(USDT)</span>
                <span className="text-right">Amount({symbol})</span>
                <span className="text-right">Total</span>
            </div>

            {/* Asks (Sells) - Red */}
            <div className="flex-1 overflow-hidden flex flex-col justify-end custom-scrollbar">
                {asks.map((order, i) => {
                    const key = `ask-${i}`;
                    const isFlashing = flashOrders.has(key);

                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`grid grid-cols-3 px-4 py-[3px] text-xs relative group cursor-pointer hover:bg-white/5 transition-colors ${isFlashing ? 'flash-sell' : ''
                                }`}
                            onClick={() => onPriceClick?.(order.price)}
                        >
                            {/* Depth Bar */}
                            <div
                                className="absolute top-0 right-0 bottom-0 bg-red-500/10 transition-all duration-300"
                                style={{ width: `${order.depth}%` }}
                            />

                            <span className="text-red-400 font-mono relative z-10 font-medium">
                                {order.price}
                            </span>
                            <span className="text-gray-300 font-mono text-right relative z-10">
                                {order.amount}
                            </span>
                            <span className="text-gray-500 font-mono text-right relative z-10">
                                {order.total}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Current Price Banner */}
            <div className="py-3 px-4 border-y border-white/10 flex items-center justify-between bg-gradient-to-r from-transparent via-white/[0.02] to-transparent">
                <div className="flex items-center gap-2">
                    <span
                        className={`text-xl font-bold font-mono tracking-tight ${currentPrice > 0 ? 'text-green-400' : 'text-red-400'
                            }`}
                    >
                        ${currentPrice.toFixed(2)}
                    </span>
                    <motion.div
                        animate={{
                            rotate: currentPrice > 0 ? 0 : 180,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <svg
                            className={`w-3 h-3 ${currentPrice > 0 ? 'text-green-400' : 'text-red-400'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 3l7 7H3z" />
                        </svg>
                    </motion.div>
                </div>
                <span className="text-xs text-gray-500 font-medium">Oracle</span>
            </div>

            {/* Bids (Buys) - Green */}
            <div className="flex-1 overflow-hidden custom-scrollbar">
                {bids.map((order, i) => {
                    const key = `bid-${i}`;
                    const isFlashing = flashOrders.has(key);

                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`grid grid-cols-3 px-4 py-[3px] text-xs relative group cursor-pointer hover:bg-white/5 transition-colors ${isFlashing ? 'flash-buy' : ''
                                }`}
                            onClick={() => onPriceClick?.(order.price)}
                        >
                            {/* Depth Bar */}
                            <div
                                className="absolute top-0 right-0 bottom-0 bg-green-500/10 transition-all duration-300"
                                style={{ width: `${order.depth}%` }}
                            />

                            <span className="text-green-400 font-mono relative z-10 font-medium">
                                {order.price}
                            </span>
                            <span className="text-gray-300 font-mono text-right relative z-10">
                                {order.amount}
                            </span>
                            <span className="text-gray-500 font-mono text-right relative z-10">
                                {order.total}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderBook;
