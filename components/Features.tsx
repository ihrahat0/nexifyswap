import React from 'react';
import { Shield, Zap, Globe, Wallet } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import GlowingBorder from './ui/GlowingBorder';

const features = [
  {
    title: 'Bank-Grade Security',
    description: 'Your assets are protected by offline cold storage and multi-signature technology.',
    icon: Shield,
    color: 'text-emerald-400',
    colSpan: 'md:col-span-2',
    glow: true
  },
  {
    title: 'Lightning Execution',
    description: 'Zero latency trading engine handling 100k+ TPS.',
    icon: Zap,
    color: 'text-yellow-400',
    colSpan: 'md:col-span-1',
    glow: false
  },
  {
    title: 'Global Access',
    description: 'Trade from anywhere in the world with 24/7 multilingual support.',
    icon: Globe,
    color: 'text-blue-400',
    colSpan: 'md:col-span-1',
    glow: false
  },
  {
    title: 'Smart Wallet',
    description: 'Integrated DeFi wallet to manage your portfolio effortlessly.',
    icon: Wallet,
    color: 'text-purple-400',
    colSpan: 'md:col-span-2',
    glow: true
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 relative">
       {/* Background accent */}
       <div className="absolute inset-0 bg-gradient-radial from-indigo-900/10 to-transparent opacity-50 pointer-events-none" />

       <div className="max-w-7xl mx-auto px-6">
         <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Zyntra?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Built for pros, designed for everyone. We combine institutional-grade tools with a user-friendly interface.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              // Inner content function to avoid repetition
              const InnerContent = () => (
                 <div className="flex flex-col h-full justify-between">
                    <div className={`p-3 w-fit rounded-xl bg-white/5 mb-6 ${feature.color}`}>
                       <feature.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-300 transition-colors text-white">{feature.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                    </div>
                    <div className="mt-8 flex items-center text-sm font-medium text-white/40 group-hover:text-white transition-colors">
                       Learn more <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                 </div>
              );

              return (
                 <div key={idx} className={`${feature.colSpan} h-full`}>
                    {feature.glow ? (
                       <GlowingBorder className="h-full">
                          <div className="p-8 h-full group cursor-pointer">
                             <InnerContent />
                          </div>
                       </GlowingBorder>
                    ) : (
                       <GlassCard className="p-8 h-full group cursor-pointer" hoverEffect={true}>
                          <InnerContent />
                       </GlassCard>
                    )}
                 </div>
              );
            })}
         </div>
       </div>
    </section>
  );
};

export default Features;