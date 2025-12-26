import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
    symbol: string;
    theme?: 'dark' | 'light';
    autosize?: boolean;
    interval?: string;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
    symbol,
    theme = 'dark',
    autosize = true,
    interval = "15"
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Clear previous content
        container.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "autosize": autosize,
            "symbol": `BINANCE:${symbol}USDT`,
            "interval": interval,
            "timezone": "Etc/UTC",
            "theme": theme,
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "backgroundColor": "rgba(0, 0, 0, 1)",
            "gridColor": "rgba(124, 58, 237, 0.08)",
            "hide_top_toolbar": false,
            "save_image": false,
            "calendar": false,
            "hide_volume": false,
            "support_host": "https://www.tradingview.com"
        });

        container.appendChild(script);

        // Cleanup function (optional but good practice)
        return () => {
            if (container) {
                container.innerHTML = "";
            }
        };
    }, [symbol, theme, autosize, interval]);

    return (
        <div className="absolute inset-0" ref={containerRef} id="tradingview_widget"></div>
    );
};

export default memo(TradingViewWidget);
