
import Layout from "@/components/layout/Layout";
import BacktestForm, { BacktestParams } from "@/components/backtesting/BacktestForm";
import BacktestResults from "@/components/backtesting/BacktestResults";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const Backtesting = () => {
  const [backtestParams, setBacktestParams] = useState<BacktestParams | null>(null);

  const handleRunBacktest = (params: BacktestParams) => {
    setBacktestParams(params);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Strategy Backtesting</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Backtest trading strategies using synthetic market data
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <BacktestForm onRunBacktest={handleRunBacktest} />
          </div>
          
          <div className="lg:col-span-2">
            {backtestParams ? (
              <BacktestResults params={backtestParams} />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-20">
                  <p className="text-muted-foreground text-lg">
                    Configure and run a backtest to see results
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Backtesting;
