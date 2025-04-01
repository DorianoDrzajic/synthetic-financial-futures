
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { BacktestParams } from "./BacktestForm";
import { generateRandomWalk, generateCrashScenario, backTestSMA, calculateRiskMetrics } from "@/utils/synthDataUtils";

interface BacktestResultsProps {
  params: BacktestParams | null;
}

const BacktestResults: React.FC<BacktestResultsProps> = ({ params }) => {
  if (!params) return null;
  
  // Generate synthetic data based on parameters
  const normalMarket = generateRandomWalk(params.timeHorizon, 100, 0.015);
  const stressMarket = params.includeStressTests 
    ? generateCrashScenario(params.timeHorizon, 100, Math.floor(params.timeHorizon * 0.6), 0.25)
    : null;
  
  // Run backtest on normal market data
  const normalBacktest = backTestSMA(normalMarket, params.shortSMA, params.longSMA);
  
  // Run backtest on stress market data if included
  const stressBacktest = stressMarket 
    ? backTestSMA(stressMarket, params.shortSMA, params.longSMA) 
    : null;
  
  // Calculate risk metrics
  const normalMetrics = calculateRiskMetrics(normalBacktest.returns);
  const stressMetrics = stressBacktest 
    ? calculateRiskMetrics(stressBacktest.returns) 
    : null;
  
  // Format chart data
  const chartData = normalMarket.map((price, idx) => {
    const dataPoint: any = {
      day: idx + 1,
      normalPrice: price,
      normalPosition: normalBacktest.positions[idx] === 1,
    };
    
    if (stressMarket) {
      dataPoint.stressPrice = stressMarket[idx];
      dataPoint.stressPosition = stressBacktest?.positions[idx] === 1;
    }
    
    return dataPoint;
  });
  
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Backtest Results: SMA({params.shortSMA},{params.longSMA}) Strategy</CardTitle>
          <Badge variant="outline" className="bg-muted">
            {params.timeHorizon} days
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="day" 
                  label={{ value: 'Days', position: 'insideBottom', offset: -5, fill: '#6B7280' }} 
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#4B5563' }}
                  itemStyle={{ color: '#E5E7EB' }}
                  labelStyle={{ color: '#9CA3AF' }}
                  formatter={(value, name) => {
                    if (name === 'normalPosition' || name === 'stressPosition') {
                      return [value ? 'In Position' : 'No Position', name.includes('normal') ? 'Normal Market Position' : 'Stress Market Position'];
                    }
                    return [value, name.includes('normal') ? 'Normal Market' : 'Stress Market'];
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                
                <Line
                  type="monotone"
                  dataKey="normalPrice"
                  name="Normal Market"
                  stroke="#2196F3"
                  strokeWidth={2}
                  dot={false}
                />
                
                {chartData.map((entry, index) => {
                  if (index > 0 && entry.normalPosition !== chartData[index - 1].normalPosition) {
                    return (
                      <ReferenceLine 
                        key={`normal-signal-${index}`} 
                        x={entry.day} 
                        stroke="#4CAF50" 
                        strokeDasharray="3 3" 
                      />
                    );
                  }
                  return null;
                })}
                
                {stressMarket && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="stressPrice"
                      name="Stress Market"
                      stroke="#F44336"
                      strokeWidth={2}
                      dot={false}
                    />
                    
                    {chartData.map((entry, index) => {
                      if (index > 0 && entry.stressPosition !== chartData[index - 1].stressPosition) {
                        return (
                          <ReferenceLine 
                            key={`stress-signal-${index}`} 
                            x={entry.day} 
                            stroke="#FF9800" 
                            strokeDasharray="3 3" 
                          />
                        );
                      }
                      return null;
                    })}
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Normal Market Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Volatility</p>
                  <p className="text-2xl font-semibold">{normalMetrics.volatility.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sharpe Ratio</p>
                  <p className="text-2xl font-semibold">{normalMetrics.sharpeRatio.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Max Drawdown</p>
                  <p className="text-2xl font-semibold">{(normalMetrics.maxDrawdown * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Value at Risk (95%)</p>
                  <p className="text-2xl font-semibold">{(normalMetrics.valueAtRisk * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {stressMetrics && (
          <Card>
            <CardHeader>
              <CardTitle>Stress Scenario Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Volatility</p>
                    <p className="text-2xl font-semibold">{stressMetrics.volatility.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sharpe Ratio</p>
                    <p className="text-2xl font-semibold">{stressMetrics.sharpeRatio.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Max Drawdown</p>
                    <p className="text-2xl font-semibold text-loss">{(stressMetrics.maxDrawdown * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Value at Risk (95%)</p>
                    <p className="text-2xl font-semibold text-loss">{(stressMetrics.valueAtRisk * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BacktestResults;
