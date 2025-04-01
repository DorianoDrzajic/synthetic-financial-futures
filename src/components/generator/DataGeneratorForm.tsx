
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { generateRandomWalk, generateCorrelatedAssets, generateCrashScenario } from "@/utils/synthDataUtils";

type ScenarioType = "normal" | "correlated" | "crash";

interface DataGeneratorFormProps {
  onDataGenerated: (data: any, type: ScenarioType) => void;
}

const DataGeneratorForm: React.FC<DataGeneratorFormProps> = ({ onDataGenerated }) => {
  const { toast } = useToast();
  const [scenarioType, setScenarioType] = useState<ScenarioType>("normal");
  const [days, setDays] = useState(180);
  const [volatility, setVolatility] = useState(0.02);
  const [numAssets, setNumAssets] = useState(5);
  const [correlation, setCorrelation] = useState(0.7);
  const [crashDay, setCrashDay] = useState(90);
  const [crashSeverity, setCrashSeverity] = useState(0.2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [includeOutliers, setIncludeOutliers] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate some processing time
    setTimeout(() => {
      try {
        let data;
        
        switch (scenarioType) {
          case "normal":
            data = generateRandomWalk(days, 100, volatility * (includeOutliers ? 1.5 : 1));
            break;
          case "correlated":
            data = generateCorrelatedAssets(days, numAssets, volatility, correlation);
            break;
          case "crash":
            data = generateCrashScenario(days, 100, crashDay, crashSeverity, volatility);
            break;
        }
        
        onDataGenerated(data, scenarioType);
        
        toast({
          title: "Data Generated",
          description: `Successfully created synthetic ${scenarioType} scenario data.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate data. Please try again.",
        });
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Synthetic Data Generator</CardTitle>
        <CardDescription>
          Configure parameters to generate synthetic market data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="scenarioType">Scenario Type</Label>
            <Select 
              value={scenarioType} 
              onValueChange={(value) => setScenarioType(value as ScenarioType)}
            >
              <SelectTrigger id="scenarioType">
                <SelectValue placeholder="Select scenario type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal Market</SelectItem>
                <SelectItem value="correlated">Correlated Assets</SelectItem>
                <SelectItem value="crash">Market Crash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Time Horizon (Days): {days}</Label>
            <Slider 
              value={[days]} 
              min={30} 
              max={1000} 
              step={10} 
              onValueChange={(value) => setDays(value[0])} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Volatility: {volatility.toFixed(3)}</Label>
            <Slider 
              value={[volatility * 100]} 
              min={0.5} 
              max={5} 
              step={0.1} 
              onValueChange={(value) => setVolatility(value[0] / 100)} 
            />
          </div>
          
          {scenarioType === "correlated" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="numAssets">Number of Assets</Label>
                <Input 
                  id="numAssets" 
                  type="number" 
                  value={numAssets} 
                  onChange={(e) => setNumAssets(parseInt(e.target.value))}
                  min={2}
                  max={10}
                />
              </div>
              <div className="space-y-2">
                <Label>Correlation: {correlation.toFixed(2)}</Label>
                <Slider 
                  value={[correlation * 100]} 
                  min={-100} 
                  max={100} 
                  step={5} 
                  onValueChange={(value) => setCorrelation(value[0] / 100)} 
                />
              </div>
            </>
          )}
          
          {scenarioType === "crash" && (
            <>
              <div className="space-y-2">
                <Label>Crash Day: {crashDay}</Label>
                <Slider 
                  value={[crashDay]} 
                  min={10} 
                  max={days - 10} 
                  step={1} 
                  onValueChange={(value) => setCrashDay(value[0])} 
                />
              </div>
              <div className="space-y-2">
                <Label>Crash Severity: {(crashSeverity * 100).toFixed(0)}%</Label>
                <Slider 
                  value={[crashSeverity * 100]} 
                  min={5} 
                  max={60} 
                  step={1} 
                  onValueChange={(value) => setCrashSeverity(value[0] / 100)} 
                />
              </div>
            </>
          )}
          
          <div className="flex items-center space-x-2">
            <Switch
              id="include-outliers"
              checked={includeOutliers}
              onCheckedChange={setIncludeOutliers}
            />
            <Label htmlFor="include-outliers">Include Extreme Outliers</Label>
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating} 
            className="w-full"
          >
            {isGenerating ? "Generating..." : "Generate Synthetic Data"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataGeneratorForm;
