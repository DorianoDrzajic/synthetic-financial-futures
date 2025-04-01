
import Layout from "@/components/layout/Layout";
import MarketOverview from "@/components/dashboard/MarketOverview";
import MetricsSummary from "@/components/dashboard/MetricsSummary";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Synthetic Financial Data Dashboard</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Generate and analyze synthetic market scenarios for backtesting and risk modeling
        </p>
        
        <MetricsSummary />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarketOverview />
          
          <Card>
            <CardHeader>
              <CardTitle>About Synthetic Financial Data</CardTitle>
              <CardDescription>Powered by generative AI models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This platform uses advanced generative models to create synthetic financial 
                data for more robust backtesting and risk assessment.
              </p>
              <h3 className="font-semibold text-lg">Key Features:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Generate realistic market scenarios beyond historical data</li>
                <li>Stress test trading strategies in extreme environments</li>
                <li>Analyze how strategies perform in multiple synthetic worlds</li>
                <li>Prepare for market conditions that have never existed before</li>
                <li>Evaluate risk metrics across normal and extreme scenarios</li>
              </ul>
              
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Note:</span> This application demonstrates the concept 
                  of synthetic data generation for financial modeling. In a production environment, 
                  more sophisticated GANs and transformer models would be employed for even more realistic 
                  data generation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
