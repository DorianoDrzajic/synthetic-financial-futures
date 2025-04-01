
// Simple financial data generation functions
// In a real app, these would be replaced with actual GAN or VAE models

// Generate random walk price data
export const generateRandomWalk = (
  days: number,
  initialValue: number = 100,
  volatility: number = 0.02
): number[] => {
  const prices: number[] = [initialValue];
  
  for (let i = 1; i < days; i++) {
    const randomChange = (Math.random() - 0.5) * volatility;
    const lastPrice = prices[i - 1];
    const newPrice = lastPrice * (1 + randomChange);
    prices.push(parseFloat(newPrice.toFixed(2)));
  }
  
  return prices;
};

// Generate correlated price data
export const generateCorrelatedAssets = (
  days: number, 
  numAssets: number, 
  baseVolatility: number = 0.02,
  correlationStrength: number = 0.7
): number[][] => {
  // Generate base asset
  const baseAsset = generateRandomWalk(days, 100, baseVolatility);
  
  // Generate correlated assets
  const assets: number[][] = [baseAsset];
  
  for (let i = 1; i < numAssets; i++) {
    const assetPrices: number[] = [];
    const initialValue = 80 + Math.random() * 40; // Random starting point between 80 and 120
    assetPrices.push(initialValue);
    
    for (let j = 1; j < days; j++) {
      const baseChange = (baseAsset[j] / baseAsset[j-1]) - 1;
      const uncorrelatedChange = (Math.random() - 0.5) * baseVolatility;
      
      // Mix base change and uncorrelated change based on correlation strength
      const change = (baseChange * correlationStrength) + (uncorrelatedChange * (1 - correlationStrength));
      const newPrice = assetPrices[j-1] * (1 + change);
      assetPrices.push(parseFloat(newPrice.toFixed(2)));
    }
    
    assets.push(assetPrices);
  }
  
  return assets;
};

// Generate market crash scenario
export const generateCrashScenario = (
  days: number,
  initialValue: number = 100,
  crashDay: number = 50,
  crashSeverity: number = 0.15, // 15% crash
  volatility: number = 0.02
): number[] => {
  const prices: number[] = [];
  
  // Pre-crash period
  for (let i = 0; i < crashDay; i++) {
    if (i === 0) {
      prices.push(initialValue);
    } else {
      const randomChange = (Math.random() - 0.48) * volatility; // Slight upward bias
      const lastPrice = prices[i - 1];
      const newPrice = lastPrice * (1 + randomChange);
      prices.push(parseFloat(newPrice.toFixed(2)));
    }
  }
  
  // Crash over 5 days
  const crashLength = 5;
  const dailyCrashRate = 1 - Math.pow(1 - crashSeverity, 1/crashLength);
  
  for (let i = 0; i < crashLength; i++) {
    const lastPrice = prices[prices.length - 1];
    const newPrice = lastPrice * (1 - dailyCrashRate - Math.random() * 0.02); // Add randomness
    prices.push(parseFloat(newPrice.toFixed(2)));
  }
  
  // Post-crash recovery
  for (let i = crashDay + crashLength; i < days; i++) {
    const randomChange = (Math.random() - 0.45) * volatility; // Slight recovery bias
    const lastPrice = prices[i - 1];
    const newPrice = lastPrice * (1 + randomChange);
    prices.push(parseFloat(newPrice.toFixed(2)));
  }
  
  return prices;
};

// Calculate simple moving average
export const calculateSMA = (prices: number[], period: number): (number | null)[] => {
  const sma: (number | null)[] = Array(period - 1).fill(null);
  
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(parseFloat((sum / period).toFixed(2)));
  }
  
  return sma;
};

// Simple backtesting function for moving average crossover
export const backTestSMA = (
  prices: number[],
  shortPeriod: number = 10,
  longPeriod: number = 50
): { returns: number[], positions: number[] } => {
  const shortSMA = calculateSMA(prices, shortPeriod);
  const longSMA = calculateSMA(prices, longPeriod);
  const positions: number[] = Array(prices.length).fill(0);
  const returns: number[] = Array(prices.length).fill(0);
  
  let position = 0;
  
  for (let i = longPeriod; i < prices.length; i++) {
    const shortVal = shortSMA[i] as number;
    const longVal = longSMA[i] as number;
    const prevShortVal = shortSMA[i-1] as number;
    const prevLongVal = longSMA[i-1] as number;
    
    // Buy signal: short crosses above long
    if (prevShortVal <= prevLongVal && shortVal > longVal) {
      position = 1;
    }
    // Sell signal: short crosses below long
    else if (prevShortVal >= prevLongVal && shortVal < longVal) {
      position = 0;
    }
    
    positions[i] = position;
    
    // Calculate returns
    if (i > 0 && position === 1) {
      returns[i] = (prices[i] / prices[i-1]) - 1;
    } else {
      returns[i] = 0;
    }
  }
  
  return { returns, positions };
};

// Calculate cumulative returns
export const calculateCumulativeReturns = (returns: number[]): number[] => {
  const cumulativeReturns: number[] = [1]; // Start with 100% of initial capital
  
  for (let i = 0; i < returns.length; i++) {
    cumulativeReturns.push(cumulativeReturns[cumulativeReturns.length - 1] * (1 + returns[i]));
  }
  
  return cumulativeReturns;
};

// Calculate risk metrics
export const calculateRiskMetrics = (returns: number[]): {
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  sortinoRatio: number;
  valueAtRisk: number;
} => {
  const nonZeroReturns = returns.filter(r => r !== 0);
  if (nonZeroReturns.length === 0) return {
    volatility: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    sortinoRatio: 0,
    valueAtRisk: 0
  };
  
  // Volatility (standard deviation of returns)
  const mean = nonZeroReturns.reduce((sum, r) => sum + r, 0) / nonZeroReturns.length;
  const variance = nonZeroReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / nonZeroReturns.length;
  const volatility = Math.sqrt(variance);
  
  // Annualized metrics (assuming daily returns)
  const annualizedVolatility = volatility * Math.sqrt(252);
  const annualizedReturns = (1 + mean) ** 252 - 1;
  
  // Sharpe Ratio (assuming risk-free rate = 0)
  const sharpeRatio = annualizedReturns / annualizedVolatility;
  
  // Maximum Drawdown
  const cumulativeReturns = calculateCumulativeReturns(returns);
  let maxDrawdown = 0;
  let peak = cumulativeReturns[0];
  
  for (let i = 1; i < cumulativeReturns.length; i++) {
    if (cumulativeReturns[i] > peak) {
      peak = cumulativeReturns[i];
    } else {
      const drawdown = (peak - cumulativeReturns[i]) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
  }
  
  // Downside deviation (for Sortino ratio)
  const negativeReturns = nonZeroReturns.filter(r => r < 0);
  const downsideDeviation = negativeReturns.length > 0 
    ? Math.sqrt(negativeReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / negativeReturns.length)
    : 0.00001; // Avoid division by zero
  
  const sortinoRatio = annualizedReturns / (downsideDeviation * Math.sqrt(252));
  
  // Value at Risk (95% confidence)
  const sortedReturns = [...nonZeroReturns].sort((a, b) => a - b);
  const varIndex = Math.floor(0.05 * sortedReturns.length);
  const valueAtRisk = Math.abs(sortedReturns[varIndex]);
  
  return {
    volatility: parseFloat(annualizedVolatility.toFixed(4)),
    sharpeRatio: parseFloat(sharpeRatio.toFixed(4)),
    maxDrawdown: parseFloat(maxDrawdown.toFixed(4)),
    sortinoRatio: parseFloat(sortinoRatio.toFixed(4)),
    valueAtRisk: parseFloat(valueAtRisk.toFixed(4))
  };
};
