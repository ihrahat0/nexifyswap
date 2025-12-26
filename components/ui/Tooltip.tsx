import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    position = 'top',
    delay = 200,
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [actualPosition, setActualPosition] = useState(position);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const triggerRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            checkPosition();
        }, delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    const checkPosition = () => {
        if (!triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Smart positioning: adjust if tooltip would overflow
        let newPosition = position;

        if (position === 'top' && rect.top < 100) {
            newPosition = 'bottom';
        } else if (position === 'bottom' && rect.bottom > viewportHeight - 100) {
            newPosition = 'top';
        } else if (position === 'left' && rect.left < 200) {
            newPosition = 'right';
        } else if (position === 'right' && rect.right > viewportWidth - 200) {
            newPosition = 'left';
        }

        setActualPosition(newPosition);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const getPositionClasses = () => {
        const positions = {
            top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
            bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
            left: 'right-full top-1/2 -translate-y-1/2 mr-2',
            right: 'left-full top-1/2 -translate-y-1/2 ml-2',
        };
        return positions[actualPosition];
    };

    const getArrowClasses = () => {
        const arrows = {
            top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
            bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
            left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
            right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
        };
        return arrows[actualPosition];
    };

    const getAnimationVariants = () => {
        const variants = {
            top: {
                initial: { opacity: 0, y: 5 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 5 },
            },
            bottom: {
                initial: { opacity: 0, y: -5 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -5 },
            },
            left: {
                initial: { opacity: 0, x: 5 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: 5 },
            },
            right: {
                initial: { opacity: 0, x: -5 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -5 },
            },
        };
        return variants[actualPosition];
    };

    return (
        <div
            ref={triggerRef}
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        className={`absolute ${getPositionClasses()} z-[400] pointer-events-none`}
                        {...getAnimationVariants()}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                    >
                        <div className={`
              px-3 py-2 rounded-lg text-xs font-medium text-white whitespace-nowrap
              bg-[#1a1a24]/95 backdrop-blur-xl border border-white/10
              shadow-xl shadow-black/50
              ${className}
            `}>
                            {content}

                            {/* Arrow */}
                            <div
                                className={`
                  absolute w-0 h-0 
                  border-4 border-[#1a1a24]/95
                  ${getArrowClasses()}
                `}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tooltip;
