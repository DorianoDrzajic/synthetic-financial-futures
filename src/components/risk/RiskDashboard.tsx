
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { generateRandomWalk, generateCrashScenario, calculateRiskMetrics } from "@/utils/synthDataUtils";

const generateHistogram = (data: number[], bins: number = 20): { x: number; count: number }[] => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const binWidth = range / bins;
  
  const histogram = Array(bins).fill(0).map((_, i) => ({
    x: min + i * binWidth + binWidth / 2,
    count: 0
  }));
  
  data.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
    histogram[binIndex].count++;
  });
  
  return histogram;
};

const RiskDashboard = () => {
  const [tab, setTab] = useState("metrics");
  
  // Generate multiple synthetic datasets
  const numScenarios = 10;
  const scenarioLength = 252; // 1 year of trading days
  
  const scenarios = Array(numScenarios).fill(0).map((_, i) => {
    const volatility = 0.01 + (i / numScenarios) * 0.03;
    return generateRandomWalk(scenarioLength, 100, volatility);
  });
  
  // Generate a crash scenario
  const crashScenario = generateCrashScenario(scenarioLength, 100, 120, 0.3);
  
  // Calculate returns for all scenarios
  const calculateDailyReturns = (prices: number[]): number[] => {
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] / prices[i-1]) - 1);
    }
    return returns;
  };
  
  const scenarioReturns = scenarios.map(scenario => calculateDailyReturns(scenario));
  const crashReturns = calculateDailyReturns(crashScenario);
  
  // Calculate risk metrics for all scenarios
  const scenarioMetrics = scenarioReturns.map(returns => calculateRiskMetrics(returns));
  const crashMetrics = calculateRiskMetrics(crashReturns);
  
  // Return distribution visualization
  const allReturns = scenarioReturns.flat();
  const returnDistribution = generateHistogram(allReturns, 30);
  
  // VaR and ES data
  const sortedReturns = [...allReturns].sort((a, b) => a - b);
  const varLevels = [0.9, 0.95, 0.99];
  const varValues = varLevels.map(level => {
    const index = Math.floor((1 - level) * sortedReturns.length);
    return {
      confidence: `${(level * 100).toFixed(0)}%`,
      var: Math.abs(sortedReturns[index]) * 100
    };
  });
  
  // Correlation data for scatter plot
  const correlationData = scenarioMetrics.map((metrics, i) => ({
    volatility: metrics.volatility,
    sharpe: metrics.sharpeRatio,
    maxDrawdown: metrics.maxDrawdown * 100,
    scenario: `Scenario ${i + 1}`
  }));
  
  // Stress test comparison data
  const stressComparisonData = [
    {
      name: 'Volatility',
      normal: scenarioMetrics[0].volatility,
      stress: crashMetrics.volatility
    },
    {
      name: 'Sharpe Ratio',
      normal: scenarioMetrics[0].sharpeRatio,
      stress: crashMetrics.sharpeRatio
    },
    {
      name: 'Max Drawdown',
      normal: scenarioMetrics[0].maxDrawdown * 100,
      stress: crashMetrics.maxDrawdown * 100
    },
    {
      name: 'VaR (95%)',
      normal: scenarioMetrics[0].valueAtRisk * 100,
      stress: crashMetrics.valueAtRisk * 100
    },
    {
      name: 'Sortino Ratio',
      normal: scenarioMetrics[0].sortinoRatio,
      stress: crashMetrics.sortinoRatio
    }
  ];
  
  // Radar data for risk profile
  const radarData = [
    { 
      subject: 'Volatility', 
      normal: scenarioMetrics[0].volatility / crashMetrics.volatility * 100, 
      stress: 100,
      fullMark: 100 
    },
    { 
      subject: 'Max Drawdown', 
      normal: scenarioMetrics[0].maxDrawdown / crashMetrics.maxDrawdown * 100, 
      stress: 100,
      fullMark: 100 
    },
    { 
      subject: 'Value at Risk', 
      normal: scenarioMetrics[0].valueAtRisk / crashMetrics.valueAtRisk * 100, 
      stress: 100,
      fullMark: 100 
    },
    { 
      subject: 'Skewness', 
      normal: 40, 
      stress: 100, 
      fullMark: 100 
    },
    { 
      subject: 'Kurtosis', 
      normal: 30, 
      stress: 100, 
      fullMark: 100 
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Risk Analysis Dashboard</CardTitle>
          <CardDescription>
            Comprehensive risk metrics and stress testing visualizations for synthetic market scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="metrics">Risk Metrics</TabsTrigger>
              <TabsTrigger value="distributions">Return Distributions</TabsTrigger>
              <TabsTrigger value="correlations">Risk Correlations</TabsTrigger>
              <TabsTrigger value="stress">Stress Testing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="metrics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Value at Risk (VaR)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={varValues} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="confidence" tick={{ fill: '#6B7280' }} />
                          <YAxis
                            label={{ 
                              value: 'Value at Risk (%)', 
                              angle: -90, 
                              position: 'insideLeft',
                              fill: '#6B7280'
                            }}
                            tick={{ fill: '#6B7280' }}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#4B5563' }}
                            itemStyle={{ color: '#E5E7EB' }}
                            formatter={(value) => [`${value.toFixed(2)}%`, 'VaR']}
                          />
                          <Bar dataKey="var" fill="#9C27B0">
                            {varValues.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={['#4CAF50', '#2196F3', '#F44336'][index]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Profile Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                          <PolarGrid stroke="#374151" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280' }}/>
                          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6B7280' }} />
                          <Radar
                            name="Normal Market"
                            dataKey="normal"
                            stroke="#2196F3"
                            fill="#2196F3"
                            fillOpacity={0.5}
                          />
                          <Radar
                            name="Stress Scenario"
                            dataKey="stress"
                            stroke="#F44336"
                            fill="#F44336"
                            fillOpacity={0.5}
                          />
                          <Legend />
                          <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#4B5563' }}
                            itemStyle={{ color: '#E5E7EB' }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="distributions">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Return Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={returnDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis
                            dataKey="x"
                            domain={['auto', 'auto']}
                            tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                            tick={{ fill: '#6B7280' }}
                            label={{ 
                              value: 'Return', 
                              position: 'insideBottom', 
                              offset: -10,
                              fill: '#6B7280'
                            }}
                          />
                          <YAxis
                            label={{ 
                              value: 'Frequency', 
                              angle: -90, 
                              position: 'insideLeft',
                              fill: '#6B7280'
                            }}
                            tick={{ fill: '#6B7280' }}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#4B5563' }}
                            itemStyle={{ color: '#E5E7EB' }}
                            formatter={(value, name, props) => [
                              value,
                              `Return: ${(props.payload.x * 100).toFixed(2)}%`,
                            ]}
                            labelFormatter={() => ''}
                          />
                          <Bar dataKey="count" name="Frequency" fill="#2196F3">
                            {returnDistribution.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.x < 0 ? '#F44336' : '#4CAF50'} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="correlations">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Metric Relationships</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis
                            type="number"
                            dataKey="volatility"
                            name="Volatility"
                            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                            tick={{ fill: '#6B7280' }}
                            label={{ 
                              value: 'Volatility (%)', 
                              position: 'insideBottom', 
                              offset: -5,
                              fill: '#6B7280'
                            }}
                          />
                          <YAxis
                            type="number"
                            dataKey="sharpe"
                            name="Sharpe Ratio"
                            tick={{ fill: '#6B7280' }}
                            label={{ 
                              value: 'Sharpe Ratio', 
                              angle: -90, 
                              position: 'insideLeft',
                              fill: '#6B7280'
                            }}
                          />
                          <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#4B5563' }}
                            itemStyle={{ color: '#E5E7EB' }}
                            formatter={(value, name) => [
                              name === 'Volatility' ? `${(value * 100).toFixed(2)}%` : value.toFixed(2),
                              name
                            ]}
                          />
                          <Scatter
                            name="Scenarios"
                            data={correlationData}
                            fill="#2196F3"
                          >
                            {correlationData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.sharpe > 0.8 ? '#4CAF50' : entry.sharpe < 0.5 ? '#F44336' : '#FF9800'}
                              />
                            ))}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="stress">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Normal vs Stress Scenario Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={stressComparisonData}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            type="number"
                            tick={{ fill: '#6B7280' }}
                          />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            tick={{ fill: '#6B7280' }} 
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#4B5563' }}
                            itemStyle={{ color: '#E5E7EB' }}
                            formatter={(value) => [`${value.toFixed(2)}`, '']}
                          />
                          <Legend />
                          <Bar dataKey="normal" name="Normal Market" fill="#2196F3" />
                          <Bar dataKey="stress" name="Stress Scenario" fill="#F44336" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskDashboard;
