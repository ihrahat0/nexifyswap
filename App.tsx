import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarketTable from './components/MarketTable';
import FuturesDemo from './components/FuturesDemo';
import Staking from './components/Staking';
import StakingDetail from './components/StakingDetail';
import Referral from './components/Referral';
import MarketPage from './components/MarketPage';
import TradePage from './components/TradePage';
import Features from './components/Features';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { STAKING_PLANS } from './constants';

export type PageView = 'home' | 'staking' | 'staking-detail' | 'referral' | 'market' | 'trade' | 'login' | 'signup';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedCoinId, setSelectedCoinId] = useState<string>('bitcoin');

  // Navigation Handler
  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Plan Handler
  const handleSelectPlan = (id: string) => {
    setSelectedPlanId(id);
    handleNavigate('staking-detail');
  };

  // Select Coin for Trading
  const handleTradeCoin = (id: string) => {
    setSelectedCoinId(id);
    handleNavigate('trade');
  };

  const selectedPlan = STAKING_PLANS.find(p => p.id === selectedPlanId);

  // Auth pages handle their own layout without footer/navbar/ai assistant
  if (currentView === 'login') {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  if (currentView === 'signup') {
    return <SignupPage onNavigate={handleNavigate} />;
  }

  return (
    <div className="bg-nova-bg min-h-screen text-white font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden">
      {/* Global Background Image - Enhanced Visibility (Only on non-trade pages for clarity) */}
      {/* Global Background Image - Enhanced Visibility */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-normal"
          style={{ backgroundImage: `url('/images/background.gif')` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar currentView={currentView} onNavigate={handleNavigate} />

        <main className="flex-grow">
          {currentView === 'home' && (
            <>
              <Hero onCtaClick={() => handleNavigate('staking')} />
              <FuturesDemo />
              <MarketTable />
              {/* Teaser Staking Section for Home */}
              <section className="py-20 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto text-center">
                  <h2 className="text-4xl font-bold mb-6">Earn While You Hold</h2>
                  <p className="text-gray-400 mb-8 max-w-2xl mx-auto">Discover our institutional-grade staking vaults. Up to 32.4% APY available now.</p>
                  <button
                    onClick={() => handleNavigate('staking')}
                    className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                  >
                    View Staking Vaults
                  </button>
                </div>
              </section>
              <Features />

              {/* Call to Action Section */}
              <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden bg-indigo-900/20 border border-indigo-500/20 text-center py-20 px-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-3xl -z-10" />
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to start your journey?</h2>
                  <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
                    Join millions of users worldwide and trade with the lowest fees and highest security standards.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => handleNavigate('signup')}
                      className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105"
                    >
                      Create Free Account
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {currentView === 'market' && (
            <MarketPage onTradeClick={handleTradeCoin} />
          )}

          {currentView === 'trade' && (
            <TradePage coinId={selectedCoinId} onBack={() => handleNavigate('market')} />
          )}

          {currentView === 'staking' && (
            <Staking onSelectPlan={handleSelectPlan} />
          )}

          {currentView === 'staking-detail' && selectedPlan && (
            <StakingDetail plan={selectedPlan} onBack={() => handleNavigate('staking')} />
          )}

          {currentView === 'referral' && (
            <Referral />
          )}
        </main>

        {currentView !== 'trade' && <Footer />}
        {currentView !== 'trade' && <AIAssistant />}
      </div>
    </div>
  );
};

export default App;