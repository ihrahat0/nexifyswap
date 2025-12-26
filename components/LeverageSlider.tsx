import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import Tooltip from './ui/Tooltip';

interface LeverageSliderProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    entryPrice?: number;
    margin?: number;
    symbol?: string;
}

const LeverageSlider: React.FC<LeverageSliderProps> = ({
    value,
    onChange,
    min = 1,
    max = 125,
    entryPrice = 0,
    margin = 0,
    symbol = 'BTC',
}) => {
    const [liquidationPrice, setLiquidationPrice] = useState(0);
    const quickLevels = [5, 10, 25, 50, 100];

    // Calculate liquidation price
    useEffect(() => {
        if (entryPrice && margin && value > 0) {
            // Simplified liquidation calculation (for long position)
            const liqPrice = entryPrice * (1 - 0.9 / value);
            setLiquidationPrice(liqPrice);
        }
    }, [value, entryPrice, margin]);

    const getRiskLevel = (leverage: number): { color: string; label: string; warning: boolean } => {
        if (leverage <= 10) return { color: 'green', label: 'Low Risk', warning: false };
        if (leverage <= 25) return { color: 'yellow', label: 'Medium Risk', warning: false };
        if (leverage <= 50) return { color: 'orange', label: 'High Risk', warning: true };
        return { color: 'red', label: 'Extreme Risk', warning: true };
    };

    const risk = getRiskLevel(value);
    const progressPercent = ((value - min) / (max - min)) * 100;

    const getGradientColor = () => {
        if (value <= 10) return 'from-green-500 to-emerald-400';
        if (value <= 25) return 'from-yellow-500 to-yellow-400';
        if (value <= 50) return 'from-orange-500 to-orange-400';
        return 'from-red-500 to-red-400';
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Leverage</span>
                    <Tooltip content="Higher leverage increases both potential profit and risk of liquidation">
                        <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-xs text-gray-400 cursor-help">
                            ?
                        </div>
                    </Tooltip>
                </div>

                <div className="flex items-center gap-2">
                    {risk.warning && <AlertTriangle className="w-4 h-4 text-orange-400" />}
                    <span className={`text-xs font-medium text-${risk.color}-400`}>
                        {risk.label}
                    </span>
                </div>
            </div>

            {/* Current Value Display */}
            <div className="flex items-center justify-center">
                <div className={`
          relative px-6 py-3 rounded-xl
          bg-gradient-to-r ${getGradientColor()}
          shadow-lg
        `}>
                    <div className="text-3xl font-bold text-white text-center font-mono">
                        {value}x
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent" />
                </div>
            </div>

            {/* Quick Level Buttons */}
            <div className="flex gap-2">
                {quickLevels.map((level) => (
                    <button
                        key={level}
                        onClick={() => onChange(level)}
                        className={`
              flex-1 py-2 text-xs font-bold rounded-lg transition-all
              ${value === level
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }
            `}
                    >
                        {level}x
                    </button>
                ))}
            </div>

            {/* Slider */}
            <div className="relative pt-2">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-white
                     [&::-webkit-slider-thumb]:shadow-lg
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-indigo-500
                     [&::-moz-range-thumb]:w-5
                     [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-white
                     [&::-moz-range-thumb]:border-2
                     [&::-moz-range-thumb]:border-indigo-500
                     [&::-moz-range-thumb]:cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, 
              ${value <= 10 ? '#10b981' : value <= 25 ? '#f59e0b' : value <= 50 ? '#f97316' : '#ef4444'} 0%, 
              ${value <= 10 ? '#10b981' : value <= 25 ? '#f59e0b' : value <= 50 ? '#f97316' : '#ef4444'} ${progressPercent}%, 
              #374151 ${progressPercent}%, 
              #374151 100%)`
                    }}
                />

                {/* Min/Max Labels */}
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{min}x</span>
                    <span>{max}x</span>
                </div>
            </div>

            {/* Risk Metrics */}
            {liquidationPrice > 0 && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/5">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Est. Liq. Price</div>
                        <div className={`text-sm font-mono font-bold ${risk.warning ? 'text-red-400' : 'text-gray-300'}`}>
                            ${liquidationPrice.toFixed(2)}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Max Position</div>
                        <div className="text-sm font-mono font-bold text-gray-300">
                            {margin && entryPrice ? ((margin * value) / entryPrice).toFixed(4) : '0.0000'} {symbol}
                        </div>
                    </div>
                </div>
            )}

            {/* Warning Message */}
            {risk.warning && (
                <></>
                // <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                //     <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                //     <p className="text-xs text-orange-400">
                //         {value > 50
                //             ? 'Extreme leverage! Small price movements can lead to liquidation.'
                //             : 'High leverage increases liquidation risk. Trade with caution.'}
                //     </p>
                // </div>
            )}
        </div>
    );
};

export default LeverageSlider;
