import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedNumberProps {
    value: number;
    format?: 'number' | 'currency' | 'percentage';
    decimals?: number;
    prefix?: string;
    suffix?: string;
    showSign?: boolean;
    colorize?: boolean;
    className?: string;
    duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
    value,
    format = 'number',
    decimals = 2,
    prefix = '',
    suffix = '',
    showSign = false,
    colorize = false,
    className = '',
    duration = 500,
}) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [direction, setDirection] = useState<'up' | 'down' | 'none'>('none');
    const prevValueRef = useRef(value);

    useEffect(() => {
        const prevValue = prevValueRef.current;

        if (value > prevValue) {
            setDirection('up');
        } else if (value < prevValue) {
            setDirection('down');
        }

        // Animate the number
        const startValue = displayValue;
        const endValue = value;
        const startTime = Date.now();
        const changeInValue = endValue - startValue;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + changeInValue * easeOut;

            setDisplayValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(endValue);
                // Reset direction after animation
                setTimeout(() => setDirection('none'), 300);
            }
        };

        requestAnimationFrame(animate);
        prevValueRef.current = value;
    }, [value, duration]);

    const formatNumber = (num: number): string => {
        let formatted = '';

        switch (format) {
            case 'currency':
                formatted = num.toLocaleString('en-US', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                });
                break;
            case 'percentage':
                formatted = num.toFixed(decimals);
                break;
            default:
                formatted = num.toFixed(decimals);
        }

        return formatted;
    };

    const getColorClass = () => {
        if (!colorize) return '';

        if (direction === 'up') return 'text-green-400';
        if (direction === 'down') return 'text-red-400';

        return value >= 0 ? 'text-green-400' : 'text-red-400';
    };

    const getSign = () => {
        if (!showSign) return '';
        return value > 0 ? '+' : '';
    };

    const formattedValue = formatNumber(displayValue);
    const sign = getSign();
    const colorClass = getColorClass();

    return (
        <motion.span
            className={`inline-block font-mono transition-colors duration-200 ${colorClass} ${className}`}
            animate={{
                scale: direction !== 'none' ? [1, 1.05, 1] : 1,
            }}
            transition={{
                duration: 0.3,
                ease: 'easeOut',
            }}
        >
            {prefix}
            {sign}
            {formattedValue}
            {suffix}
            {format === 'percentage' && '%'}
        </motion.span>
    );
};

export default AnimatedNumber;
