
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Activity, TrendingDown, AlertTriangle } from "lucide-react";

const MetricsSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Generated Datasets</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">+2 from last session</p>
          <div className="flex items-center pt-1 text-gain text-xs">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            <span>Normal, Stress & Extreme Scenarios</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg. Synthetic Sharpe</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0.87</div>
          <p className="text-xs text-muted-foreground">Across all generated scenarios</p>
          <div className="flex items-center pt-1 text-loss text-xs">
            <ArrowDownRight className="h-3 w-3 mr-1" />
            <span>-0.12 from benchmark</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Maximum Drawdown</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">-32.5%</div>
          <p className="text-xs text-muted-foreground">In extreme scenario #4</p>
          <div className="flex items-center pt-1 text-loss text-xs">
            <ArrowDownRight className="h-3 w-3 mr-1" />
            <span>High risk in crash scenarios</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Strategy Performance</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+8.2%</div>
          <p className="text-xs text-muted-foreground">Avg. annual return</p>
          <div className="flex items-center pt-1 text-gain text-xs">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            <span>+3.1% above benchmark</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsSummary;
