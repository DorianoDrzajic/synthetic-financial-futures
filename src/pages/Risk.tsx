
import Layout from "@/components/layout/Layout";
import RiskDashboard from "@/components/risk/RiskDashboard";

const Risk = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Risk Modeling</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Analyze and visualize risk metrics based on synthetic market scenarios
        </p>
        
        <RiskDashboard />
      </div>
    </Layout>
  );
};

export default Risk;
