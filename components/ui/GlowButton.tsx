import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface GlowButtonProps {
    children: React.ReactNode;
    variant?: 'buy' | 'sell' | 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

const GlowButton: React.FC<GlowButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon,
    onClick,
    className = '',
}) => {
    const baseClasses = 'relative font-bold rounded-xl transition-all duration-200 transform active:scale-[0.98] overflow-hidden';

    const variantClasses = {
        buy: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:brightness-110',
        sell: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:brightness-110',
        primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:brightness-110',
        secondary: 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20',
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

    return (
        <motion.button
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
            onClick={!disabled && !loading ? onClick : undefined}
            disabled={disabled || loading}
        >
            {/* Animated Glow Background */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            </div>

            {/* Content */}
            <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : icon ? (
                    icon
                ) : null}
                {children}
            </span>
        </motion.button>
    );
};

export default GlowButton;
