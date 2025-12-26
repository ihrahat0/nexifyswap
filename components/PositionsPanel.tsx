import React, { useState } from 'react';
import { X, Share2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import AnimatedNumber from './ui/AnimatedNumber';
import GlowButton from './ui/GlowButton';
import Tooltip from './ui/Tooltip';

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

interface PositionsPanelProps {
    positions: Position[];
    onClosePosition?: (id: string) => void;
    onAddMargin?: (id: string) => void;
    onSharePosition?: (id: string) => void;
}

const PositionsPanel: React.FC<PositionsPanelProps> = ({
    positions,
    onClosePosition,
    onAddMargin,
    onSharePosition,
}) => {
    const [selectedTab, setSelectedTab] = useState<'positions' | 'orders' | 'history'>('positions');

    const totalUnrealizedPnL = positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);

    if (positions.length === 0 && selectedTab === 'positions') {
        return (
            <div className="bg-[#0F0F16] border-t border-white/5 p-8">
                <div className="flex flex-col items-center justify-center text-gray-500 gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-sm font-medium">No open positions</p>
                    <p className="text-xs text-gray-600">Open a position to see it here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0F0F16] border-t border-white/5 flex flex-col">
            {/* Header with Tabs */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex gap-1">
                    {[
                        { key: 'positions', label: `Positions (${positions.length})` },
                        { key: 'orders', label: 'Open Orders (0)' },
                        { key: 'history', label: 'Order History' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setSelectedTab(tab.key as any)}
                            className={`px-4 py-2 text-sm font-medium transition-all rounded-lg ${selectedTab === tab.key
                                    ? 'text-indigo-400 bg-indigo-500/10'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Total PnL */}
                {totalUnrealizedPnL !== 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                        <span className="text-xs text-gray-400">Total PnL:</span>
                        <AnimatedNumber
                            value={totalUnrealizedPnL}
                            format="currency"
                            decimals={2}
                            prefix="$"
                            showSign
                            colorize
                            className="text-sm font-bold"
                        />
                    </div>
                )}
            </div>

            {/* Positions Table */}
            {selectedTab === 'positions' && (
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 text-xs border-b border-white/5">
                                <th className="px-4 py-3 text-left font-medium">Symbol</th>
                                <th className="px-4 py-3 text-left font-medium">Side</th>
                                <th className="px-4 py-3 text-right font-medium">Size</th>
                                <th className="px-4 py-3 text-right font-medium">Entry Price</th>
                                <th className="px-4 py-3 text-right font-medium">Mark Price</th>
                                <th className="px-4 py-3 text-right font-medium">Liq. Price</th>
                                <th className="px-4 py-3 text-right font-medium">Margin</th>
                                <th className="px-4 py-3 text-right font-medium">PnL (ROE%)</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {positions.map((position) => {
                                const isLong = position.side === 'long';
                                const isProfitable = position.unrealizedPnL >= 0;
                                const isNearLiquidation = position.marginRatio > 80;

                                return (
                                    <tr
                                        key={position.id}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        {/* Symbol */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-white">{position.symbol}/USDT</span>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-indigo-300 border border-white/5">
                                                    {position.leverage}x
                                                </span>
                                            </div>
                                        </td>

                                        {/* Side */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${isLong
                                                        ? 'bg-green-500/10 text-green-400'
                                                        : 'bg-red-500/10 text-red-400'
                                                    }`}
                                            >
                                                {isLong ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                {isLong ? 'LONG' : 'SHORT'}
                                            </span>
                                        </td>

                                        {/* Size */}
                                        <td className="px-4 py-3 text-right font-mono text-white">
                                            {position.size.toFixed(4)}
                                        </td>

                                        {/* Entry Price */}
                                        <td className="px-4 py-3 text-right font-mono text-gray-300">
                                            ${position.entryPrice.toLocaleString()}
                                        </td>

                                        {/* Mark Price */}
                                        <td className="px-4 py-3 text-right font-mono text-white">
                                            ${position.markPrice.toLocaleString()}
                                        </td>

                                        {/* Liquidation Price */}
                                        <td className="px-4 py-3 text-right">
                                            <Tooltip content="Price at which your position will be liquidated">
                                                <span
                                                    className={`font-mono ${isNearLiquidation ? 'text-red-400 font-bold' : 'text-gray-400'
                                                        }`}
                                                >
                                                    ${position.liquidationPrice.toLocaleString()}
                                                </span>
                                            </Tooltip>
                                        </td>

                                        {/* Margin */}
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-mono text-white">${position.margin.toFixed(2)}</span>
                                                <span
                                                    className={`text-xs font-medium ${isNearLiquidation ? 'text-red-400' : 'text-gray-500'
                                                        }`}
                                                >
                                                    {position.marginRatio.toFixed(1)}%
                                                </span>
                                            </div>
                                        </td>

                                        {/* PnL */}
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex flex-col items-end">
                                                <AnimatedNumber
                                                    value={position.unrealizedPnL}
                                                    format="currency"
                                                    decimals={2}
                                                    prefix="$"
                                                    showSign
                                                    colorize
                                                    className="font-bold"
                                                />
                                                <AnimatedNumber
                                                    value={position.unrealizedPnLPercent}
                                                    format="percentage"
                                                    decimals={2}
                                                    showSign
                                                    colorize
                                                    className="text-xs"
                                                />
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                {isNearLiquidation && (
                                                    <Tooltip content="Add margin to reduce liquidation risk">
                                                        <button
                                                            onClick={() => onAddMargin?.(position.id)}
                                                            className="p-1.5 rounded bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors"
                                                        >
                                                            <AlertTriangle className="w-4 h-4" />
                                                        </button>
                                                    </Tooltip>
                                                )}

                                                <Tooltip content="Share position">
                                                    <button
                                                        onClick={() => onSharePosition?.(position.id)}
                                                        className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                                    >
                                                        <Share2 className="w-4 h-4" />
                                                    </button>
                                                </Tooltip>

                                                <button
                                                    onClick={() => onClosePosition?.(position.id)}
                                                    className="px-3 py-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-bold"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Other Tabs (Placeholder) */}
            {selectedTab !== 'positions' && (
                <div className="flex-1 flex items-center justify-center p-8">
                    <p className="text-sm text-gray-500">No {selectedTab} found</p>
                </div>
            )}
        </div>
    );
};

export default PositionsPanel;
