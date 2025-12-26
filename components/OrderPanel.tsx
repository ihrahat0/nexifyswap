import React, { useState } from 'react';
import { Settings, Info, Percent } from 'lucide-react';
import GlowButton from './ui/GlowButton';
import LeverageSlider from './LeverageSlider';
import Tooltip from './ui/Tooltip';

interface OrderPanelProps {
    symbol: string;
    currentPrice: number;
    availableBalance: number;
    onPlaceOrder?: (order: OrderData) => void;
}

export interface OrderData {
    type: 'market' | 'limit' | 'stop-limit' | 'stop-market' | 'trailing-stop';
    side: 'buy' | 'sell';
    amount: string;
    price?: string;
    stopPrice?: string;
    takeProfitPrice?: string;
    stopLossPrice?: string;
    leverage: number;
    marginType: 'cross' | 'isolated';
    reduceOnly: boolean;
    postOnly: boolean;
    timeInForce: 'GTC' | 'IOC' | 'FOK';
}

const OrderPanel: React.FC<OrderPanelProps> = ({
    symbol,
    currentPrice,
    availableBalance,
    onPlaceOrder,
}) => {
    const [side, setSide] = useState<'buy' | 'sell'>('buy');
    const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop-limit' | 'stop-market' | 'trailing-stop'>('limit');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState(currentPrice.toString());
    const [stopPrice, setStopPrice] = useState('');
    const [leverage, setLeverage] = useState(20);
    const [marginType, setMarginType] = useState<'cross' | 'isolated'>('cross');

    // Advanced options
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [takeProfitEnabled, setTakeProfitEnabled] = useState(false);
    const [stopLossEnabled, setStopLossEnabled] = useState(false);
    const [takeProfitPrice, setTakeProfitPrice] = useState('');
    const [stopLossPrice, setStopLossPrice] = useState('');
    const [reduceOnly, setReduceOnly] = useState(false);
    const [postOnly, setPostOnly] = useState(false);
    const [timeInForce, setTimeInForce] = useState<'GTC' | 'IOC' | 'FOK'>('GTC');

    const orderTypes = [
        { value: 'market', label: 'Market' },
        { value: 'limit', label: 'Limit' },
        { value: 'stop-limit', label: 'Stop-Limit' },
        { value: 'stop-market', label: 'Stop-Market' },
    ];

    const handleAmountPercentage = (percent: number) => {
        const maxAmount = (availableBalance * leverage) / currentPrice;
        setAmount(((maxAmount * percent) / 100).toFixed(4));
    };

    const calculateTotal = () => {
        const amountNum = parseFloat(amount) || 0;
        const priceNum = orderType === 'market' ? currentPrice : parseFloat(price) || 0;
        return (amountNum * priceNum).toFixed(2);
    };

    const calculateMaxPosition = () => {
        return ((availableBalance * leverage) / currentPrice).toFixed(4);
    };

    const handlePlaceOrder = () => {
        const order: OrderData = {
            type: orderType,
            side,
            amount,
            price: orderType !== 'market' ? price : undefined,
            stopPrice: orderType.includes('stop') ? stopPrice : undefined,
            takeProfitPrice: takeProfitEnabled ? takeProfitPrice : undefined,
            stopLossPrice: stopLossEnabled ? stopLossPrice : undefined,
            leverage,
            marginType,
            reduceOnly,
            postOnly,
            timeInForce,
        };
        onPlaceOrder?.(order);
    };

    return (
        <div className="h-full flex flex-col bg-[#13131d]">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {/* Buy/Sell Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-lg shrink-0">
                    <button
                        onClick={() => setSide('buy')}
                        className={`py-2.5 text-sm font-bold rounded-md transition-all ${side === 'buy'
                            ? 'bg-green-500 text-white shadow-lg shadow-green-900/20'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Buy / Long
                    </button>
                    <button
                        onClick={() => setSide('sell')}
                        className={`py-2.5 text-sm font-bold rounded-md transition-all ${side === 'sell'
                            ? 'bg-red-500 text-white shadow-lg shadow-red-900/20'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Sell / Short
                    </button>
                </div>

                {/* Margin Type */}
                <div className="flex items-center justify-between p-3 bg-black/20 border border-white/10 rounded-lg shrink-0">
                    <span className="text-sm text-gray-400">Margin</span>
                    <div className="flex gap-2">
                        {['cross', 'isolated'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setMarginType(type as any)}
                                className={`px-3 py-1 text-xs font-medium rounded transition-all ${marginType === type
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Order Type Selection */}
                <div className="flex items-center justify-between shrink-0">
                    <div className="flex gap-3 text-sm font-medium overflow-x-auto no-scrollbar">
                        {orderTypes.map((type) => (
                            <button
                                key={type.value}
                                onClick={() => setOrderType(type.value as any)}
                                className={`transition-colors whitespace-nowrap ${orderType === type.value
                                    ? 'text-indigo-400 border-b-2 border-indigo-400 pb-0.5'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-gray-500 hover:text-white transition-colors"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                </div>

                {/* Price Inputs */}
                <div className="space-y-3 shrink-0">
                    {/* Stop Price (for stop orders) */}
                    {orderType.includes('stop') && (
                        <div className="bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 flex items-center justify-between group focus-within:border-indigo-500/50 transition-colors">
                            <span className="text-xs text-gray-500 font-medium">Stop Price</span>
                            <input
                                type="text"
                                value={stopPrice}
                                onChange={(e) => setStopPrice(e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent text-right w-32 font-mono text-sm text-white focus:outline-none"
                            />
                            <span className="text-xs text-gray-500 ml-2">USDT</span>
                        </div>
                    )}

                    {/* Price (for limit orders) */}
                    {orderType !== 'market' && orderType !== 'stop-market' && (
                        <div className="bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 flex items-center justify-between group focus-within:border-indigo-500/50 transition-colors">
                            <span className="text-xs text-gray-500 font-medium">Price</span>
                            <input
                                type="text"
                                value={orderType === 'market' ? 'Market Price' : price}
                                onChange={(e) => setPrice(e.target.value)}
                                disabled={orderType === 'market'}
                                className="bg-transparent text-right w-32 font-mono text-sm text-white focus:outline-none disabled:text-gray-500"
                            />
                            <span className="text-xs text-gray-500 ml-2">USDT</span>
                        </div>
                    )}

                    {/* Amount */}
                    <div className="bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 flex items-center justify-between group focus-within:border-indigo-500/50 transition-colors">
                        <span className="text-xs text-gray-500 font-medium">Amount</span>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="bg-transparent text-right w-32 font-mono text-sm text-white focus:outline-none"
                        />
                        <span className="text-xs text-gray-500 ml-2">{symbol}</span>
                    </div>
                </div>

                {/* Percentage Slider */}
                <div className="space-y-2 shrink-0">
                    <div className="flex justify-between gap-1">
                        {[25, 50, 75, 100].map((pct) => (
                            <button
                                key={pct}
                                onClick={() => handleAmountPercentage(pct)}
                                className="flex-1 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors font-medium"
                            >
                                {pct}%
                            </button>
                        ))}
                    </div>
                </div>

                {/* Leverage Slider */}
                <div className="shrink-0">
                    <LeverageSlider
                        value={leverage}
                        onChange={setLeverage}
                        min={1}
                        max={125}
                        entryPrice={currentPrice}
                        margin={availableBalance}
                        symbol={symbol}
                    />
                </div>

                {/* Advanced Options */}
                {showAdvanced && (
                    <div className="space-y-3 p-3 bg-black/20 border border-white/10 rounded-lg shrink-0">
                        <div className="text-xs font-bold text-gray-300 mb-2">Advanced Options</div>

                        {/* Take Profit */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={takeProfitEnabled}
                                    onChange={(e) => setTakeProfitEnabled(e.target.checked)}
                                    className="w-4 h-4 rounded bg-white/10 border-white/20"
                                />
                                <span className="text-xs text-gray-400">Take Profit</span>
                            </label>
                            {takeProfitEnabled && (
                                <input
                                    type="text"
                                    value={takeProfitPrice}
                                    onChange={(e) => setTakeProfitPrice(e.target.value)}
                                    placeholder="TP Price"
                                    className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                                />
                            )}
                        </div>

                        {/* Stop Loss */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={stopLossEnabled}
                                    onChange={(e) => setStopLossEnabled(e.target.checked)}
                                    className="w-4 h-4 rounded bg-white/10 border-white/20"
                                />
                                <span className="text-xs text-gray-400">Stop Loss</span>
                            </label>
                            {stopLossEnabled && (
                                <input
                                    type="text"
                                    value={stopLossPrice}
                                    onChange={(e) => setStopLossPrice(e.target.value)}
                                    placeholder="SL Price"
                                    className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50"
                                />
                            )}
                        </div>

                        {/* Other Flags */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={postOnly}
                                    onChange={(e) => setPostOnly(e.target.checked)}
                                    className="w-4 h-4 rounded bg-white/10 border-white/20"
                                />
                                <span className="text-xs text-gray-400">Post Only</span>
                                <Tooltip content="Order will only execute as a maker">
                                    <Info className="w-3 h-3 text-gray-600" />
                                </Tooltip>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={reduceOnly}
                                    onChange={(e) => setReduceOnly(e.target.checked)}
                                    className="w-4 h-4 rounded bg-white/10 border-white/20"
                                />
                                <span className="text-xs text-gray-400">Reduce Only</span>
                                <Tooltip content="Order will only reduce position size">
                                    <Info className="w-3 h-3 text-gray-600" />
                                </Tooltip>
                            </label>
                        </div>

                        {/* Time in Force */}
                        <div>
                            <span className="text-xs text-gray-400 block mb-2">Time in Force</span>
                            <div className="flex gap-2">
                                {['GTC', 'IOC', 'FOK'].map((tif) => (
                                    <button
                                        key={tif}
                                        onClick={() => setTimeInForce(tif as any)}
                                        className={`px-3 py-1 text-xs rounded transition-all ${timeInForce === tif
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-white/5 text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        {tif}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Rows */}
                <div className="space-y-2 shrink-0">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Available</span>
                        <span className="text-white font-mono">{availableBalance.toFixed(2)} USDT</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Max Open</span>
                        <span className="text-white font-mono">{calculateMaxPosition()} {symbol}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Cost</span>
                        <span className="text-white font-mono">{calculateTotal()} USDT</span>
                    </div>
                </div>
            </div>

            {/* Footer: Submit Button */}
            <div className="p-4 border-t border-white/5 bg-[#13131d] shrink-0">
                <GlowButton
                    variant={side === 'buy' ? 'buy' : 'sell'}
                    fullWidth
                    onClick={handlePlaceOrder}
                    className="py-4"
                >
                    {side === 'buy' ? 'Buy / Long' : 'Sell / Short'} {symbol}
                </GlowButton>
            </div>
        </div>
    );
};

export default OrderPanel;
