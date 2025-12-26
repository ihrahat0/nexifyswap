import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import AnimatedNumber from './ui/AnimatedNumber';
import InfoTooltip from './ui/Tooltip';

interface FundingRateWidgetProps {
    symbol: string;
}

const FundingRateWidget: React.FC<FundingRateWidgetProps> = ({ symbol }) => {
    const [currentRate, setCurrentRate] = useState(0.0100);
    const [nextFundingIn, setNextFundingIn] = useState({ hours: 3, minutes: 45, seconds: 12 });
    const [historicalRates, setHistoricalRates] = useState<{ time: string; rate: number }[]>([]);

    // Initialize historical data
    useEffect(() => {
        const data = [];
        for (let i = 23; i >= 0; i--) {
            data.push({
                time: `${i}h`,
                rate: 0.01 + (Math.random() - 0.5) * 0.02,
            });
        }
        setHistoricalRates(data);
    }, []);

    // Countdown timer
    useEffect(() => {
        const interval = setInterval(() => {
            setNextFundingIn((prev) => {
                let { hours, minutes, seconds } = prev;

                seconds--;
                if (seconds < 0) {
                    seconds = 59;
                    minutes--;
                }
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                }
                if (hours < 0) {
                    hours = 7;
                    minutes = 59;
                    seconds = 59;
                }

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (num: number) => String(num).padStart(2, '0');
    const isPositive = currentRate >= 0;
    const avg7d = 0.0085;
    const avg30d = 0.0092;

    return (
        <div className="bg-[#0F0F16] border border-white/5 rounded-xl p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    Funding Rate
                </h3>
                <InfoTooltip content="Funding rates are periodic payments between long and short traders">
                    <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-xs text-gray-400 cursor-help">
                        ?
                    </div>
                </InfoTooltip>
            </div>

            {/* Current Rate Display */}
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Current Rate</div>
                    <div className="flex items-center gap-2">
                        <AnimatedNumber
                            value={currentRate}
                            format="percentage"
                            decimals={4}
                            showSign
                            colorize
                            className="text-2xl font-bold"
                        />
                        {isPositive ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Next in{' '}
                        <span className="text-orange-400 font-mono font-medium">
                            {formatTime(nextFundingIn.hours)}:{formatTime(nextFundingIn.minutes)}:
                            {formatTime(nextFundingIn.seconds)}
                        </span>
                    </div>
                </div>

                {/* Avg Rates */}
                <div className="text-right space-y-1">
                    <div className="text-xs">
                        <span className="text-gray-500">7d Avg:</span>{' '}
                        <span className={`font-mono font-medium ${avg7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {avg7d >= 0 ? '+' : ''}
                            {(avg7d * 100).toFixed(4)}%
                        </span>
                    </div>
                    <div className="text-xs">
                        <span className="text-gray-500">30d Avg:</span>{' '}
                        <span className={`font-mono font-medium ${avg30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {avg30d >= 0 ? '+' : ''}
                            {(avg30d * 100).toFixed(4)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Historical Chart */}
            <div className="h-20 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalRates}>
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={['dataMin', 'dataMax']} />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload || !payload.length) return null;
                                const rate = payload[0].value as number;
                                return (
                                    <div className="bg-[#1a1a24]/95 backdrop-blur-xl border border-white/10 rounded px-2 py-1 text-xs">
                                        <span className={rate >= 0 ? 'text-green-400' : 'text-red-400'}>
                                            {(rate * 100).toFixed(4)}%
                                        </span>
                                    </div>
                                );
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="rate"
                            stroke={isPositive ? '#10b981' : '#ef4444'}
                            strokeWidth={2}
                            dot={false}
                            animationDuration={500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Info Text */}
            <div className="text-xs text-gray-500 bg-white/[0.02] rounded-lg p-2 border border-white/5">
                {isPositive ? (
                    <span>
                        Longs pay shorts <span className="text-green-400 font-medium">{(currentRate * 100).toFixed(4)}%</span> every 8h
                    </span>
                ) : (
                    <span>
                        Shorts pay longs <span className="text-red-400 font-medium">{(Math.abs(currentRate) * 100).toFixed(4)}%</span> every 8h
                    </span>
                )}
            </div>
        </div>
    );
};

export default FundingRateWidget;
