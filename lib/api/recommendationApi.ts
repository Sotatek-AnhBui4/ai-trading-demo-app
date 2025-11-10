import { apiClient } from './client';
import { AIRecommendation } from '@/lib/types';

/**
 * Fetch latest AI recommendation
 * This would call the AI Agent to analyze current market and generate new recommendation
 */
export async function fetchLatestRecommendation(): Promise<AIRecommendation> {
  // TODO: Replace with actual API call
  // return apiClient.get<AIRecommendation>('/api/recommendations/latest');
  
  // Mock implementation - generates a new recommendation
  const mockRecommendation: AIRecommendation = {
    id: `rec-${Date.now()}`,
    action: getRandomAction(),
    changes: generateRandomChanges(),
    reasoning: generateRandomReasoning(),
    confidence: Math.random() * 0.3 + 0.65, // 65-95%
    riskScore: Math.random() * 7 + 1, // 1-8
    marketRegime: getRandomRegime(),
    assetSignals: [
      { asset: "BTC", signal: getRandomSignal() },
      { asset: "ETH", signal: getRandomSignal() },
      { asset: "SOL", signal: getRandomSignal() },
    ],
    timestamp: new Date().toISOString(),
    status: "pending",
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockRecommendation;
}

/**
 * Fetch recommendation history
 */
export async function fetchRecommendationHistory(): Promise<AIRecommendation[]> {
  // TODO: Replace with actual API call
  // return apiClient.get<AIRecommendation[]>('/api/recommendations/history');
  
  return [];
}

/**
 * Approve a recommendation
 */
export async function approveRecommendation(id: string): Promise<void> {
  // TODO: Replace with actual API call
  // await apiClient.post(`/api/recommendations/${id}/approve`);
  
  console.log('Approving recommendation:', id);
  await new Promise(resolve => setTimeout(resolve, 500));
}

/**
 * Reject a recommendation
 */
export async function rejectRecommendation(id: string, reason?: string): Promise<void> {
  // TODO: Replace with actual API call
  // await apiClient.post(`/api/recommendations/${id}/reject`, { reason });
  
  console.log('Rejecting recommendation:', id, reason);
  await new Promise(resolve => setTimeout(resolve, 500));
}

// Helper functions for mock data
function getRandomAction(): AIRecommendation['action'] {
  const actions: AIRecommendation['action'][] = ['REBALANCE', 'BUY', 'SELL', 'HOLD', 'EXIT_TO_STABLE'];
  return actions[Math.floor(Math.random() * actions.length)];
}

function getRandomRegime(): AIRecommendation['marketRegime'] {
  const regimes: AIRecommendation['marketRegime'][] = ['bull', 'bear', 'chop'];
  return regimes[Math.floor(Math.random() * regimes.length)];
}

function getRandomSignal(): 'bullish' | 'bearish' | 'neutral' {
  const signals: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];
  return signals[Math.floor(Math.random() * signals.length)];
}

function generateRandomChanges() {
  const assets = ['BTC', 'ETH', 'SOL'];
  return assets.slice(0, Math.floor(Math.random() * 2) + 1).map(asset => ({
    asset,
    from: Math.floor(Math.random() * 20) + 10,
    to: Math.floor(Math.random() * 20) + 10,
  }));
}

function generateRandomReasoning() {
  const reasons = [
    ['Market oversold (FGI=22)', 'Whale accumulation detected', 'No fundamental issues'],
    ['Strong momentum detected', 'Institutional buying increasing', 'Technical breakout confirmed'],
    ['High volatility warning', 'Market showing signs of exhaustion', 'Consider risk management'],
    ['Market conditions favorable', 'Good risk/reward ratio', 'Aligned with current trend'],
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
}

