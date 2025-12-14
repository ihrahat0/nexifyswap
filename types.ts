import React from 'react';

export interface CryptoCoin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume: string;
  data: number[]; // For sparkline
}

export interface FeatureProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface StakingPlan {
  id: string;
  name: string;
  badge?: string;
  apy: number;
  duration: string;
  durationDays: number;
  minStake: number;
  poolFilled: number; // Percentage
  participants: number;
  features: string[];
  color: string;
  // We will store the icon name or pass component in constant, 
  // but for simplicity in shared constant with react components:
  icon: React.ElementType; 
  gradient: string;
  shadow: string;
  risk: 'Low' | 'Medium' | 'High';
  description: string;
  faq: { q: string; a: string }[];
}