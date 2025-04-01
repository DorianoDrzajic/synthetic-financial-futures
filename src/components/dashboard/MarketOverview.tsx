
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { generateRandomWalk, generateCrashScenario } from "@/utils/synthDataUtils";
import { useState, useEffect } from "react";

const MarketOverview = () => {
  const [chartData, setChartData] = useState<Array<{ day: number; normalMarket: number; stressScenario: number }>>([]);
  
  useEffect(() => {
    const days = 180; // 6 months of trading days
    const normalMarket = generateRandomWalk(days, 100, 0.015);
    const stressScenario = generateCrashScenario(days, 100, 90, 0.25);
    
    const formattedData = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      normalMarket: normalMarket[i],
      stressScenario: stressScenario[i]
    }));
    
    setChartData(formattedData);
  }, []);

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Synthetic Market Scenarios</CardTitle>
        <Badge variant="outline" className="bg-muted">Last 180 Days</Badge>
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
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Line
                type="monotone"
                dataKey="normalMarket"
                name="Normal Market"
                stroke="#2196F3"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="stressScenario"
                name="Stress Scenario"
                stroke="#F44336"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
