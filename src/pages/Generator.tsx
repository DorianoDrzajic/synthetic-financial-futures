
import Layout from "@/components/layout/Layout";
import DataGeneratorForm from "@/components/generator/DataGeneratorForm";
import DataVisualization from "@/components/generator/DataVisualization";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Generator = () => {
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [dataType, setDataType] = useState<"normal" | "correlated" | "crash">("normal");
  
  const handleDataGenerated = (data: any, type: "normal" | "correlated" | "crash") => {
    setGeneratedData(data);
    setDataType(type);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Synthetic Data Generator</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Generate various types of synthetic financial data using parametric models
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <DataGeneratorForm onDataGenerated={handleDataGenerated} />
            
            {!generatedData && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>How to use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Select a scenario type from the dropdown</li>
                    <li>Adjust time horizon, volatility, and other parameters</li>
                    <li>Click "Generate Synthetic Data" to create the dataset</li>
                    <li>View and analyze the generated data visualization</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-4">
                    Try different parameter combinations to create diverse market scenarios.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="lg:col-span-2">
            {generatedData ? (
              <DataVisualization data={generatedData} type={dataType} />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-20">
                  <p className="text-muted-foreground text-lg">
                    Generate data using the form on the left to see visualization
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

export default Generator;
