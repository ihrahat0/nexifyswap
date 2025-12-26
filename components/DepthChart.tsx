import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface DepthChartProps {
    symbol: string;
    currentPrice: number;
}

interface DepthData {
    price: number;
    bidVolume: number;
    askVolume: number;
}

const DepthChart: React.FC<DepthChartProps> = ({ symbol, currentPrice }) => {
    const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);

    // Generate mock depth data
    const depthData = useMemo(() => {
        const data: DepthData[] = [];
        const spread = currentPrice * 0.02; // 2% spread
        const points = 50;

        // Generate bid side (left of current price)
        for (let i = points; i >= 0; i--) {
            const price = currentPrice - (spread * i) / points;
            const volume = Math.pow(points - i + 1, 1.5) * (10 + Math.random() * 5);
            data.push({
                price: parseFloat(price.toFixed(2)),
                bidVolume: parseFloat(volume.toFixed(2)),
                askVolume: 0,
            });
        }

        // Generate ask side (right of current price)
        for (let i = 1; i <= points; i++) {
            const price = currentPrice + (spread * i) / points;
            const volume = Math.pow(i + 1, 1.5) * (10 + Math.random() * 5);
            data.push({
                price: parseFloat(price.toFixed(2)),
                bidVolume: 0,
                askVolume: parseFloat(volume.toFixed(2)),
            });
        }

        return data;
    }, [currentPrice]);

    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload || !payload.length) return null;

        const data = payload[0].payload;
        const isBid = data.bidVolume > 0;

        return (
            <div className="bg-[#1a1a24]/95 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 shadow-xl">
                <div className="text-xs space-y-1">
                    <div className="text-gray-400">
                        Price: <span className="text-white font-mono">${data.price}</span>
                    </div>
                    <div className="text-gray-400">
                        Volume:{' '}
                        <span className={`font-mono ${isBid ? 'text-green-400' : 'text-red-400'}`}>
                            {(isBid ? data.bidVolume : data.askVolume).toFixed(2)} {symbol}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full w-full bg-[#0F0F16] rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-200">Market Depth</h3>
                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500/30 rounded-sm" />
                        <span className="text-gray-400">Bids</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500/30 rounded-sm" />
                        <span className="text-gray-400">Asks</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="90%">
                <AreaChart
                    data={depthData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    onMouseMove={(e: any) => {
                        if (e && e.activePayload && e.activePayload[0]) {
                            setHoveredPrice(e.activePayload[0].payload.price);
                        }
                    }}
                    onMouseLeave={() => setHoveredPrice(null)}
                >
                    <defs>
                        <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <XAxis
                        dataKey="price"
                        stroke="#4b5563"
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: '#1f2937' }}
                    />

                    <YAxis
                        stroke="#4b5563"
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: '#1f2937' }}
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6b7280', strokeDasharray: '3 3' }} />

                    {/* Current Price Line */}
                    <ReferenceLine
                        x={currentPrice}
                        stroke="#6366f1"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        label={{
                            value: `$${currentPrice.toFixed(2)}`,
                            fill: '#6366f1',
                            fontSize: 12,
                            fontWeight: 'bold',
                            position: 'top',
                        }}
                    />

                    {/* Bid Area */}
                    <Area
                        type="stepAfter"
                        dataKey="bidVolume"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#bidGradient)"
                        isAnimationActive={true}
                        animationDuration={500}
                    />

                    {/* Ask Area */}
                    <Area
                        type="stepBefore"
                        dataKey="askVolume"
                        stroke="#ef4444"
                        strokeWidth={2}
                        fill="url(#askGradient)"
                        isAnimationActive={true}
                        animationDuration={500}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {hoveredPrice && (
                <div className="mt-2 text-center text-xs text-gray-400">
                    Spread: <span className="text-white font-mono">
                        {((Math.abs(hoveredPrice - currentPrice) / currentPrice) * 100).toFixed(3)}%
                    </span>
                </div>
            )}
        </div>
    );
};

export default DepthChart;
