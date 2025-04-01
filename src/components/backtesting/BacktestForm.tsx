
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

interface BacktestFormProps {
  onRunBacktest: (params: BacktestParams) => void;
}

export interface BacktestParams {
  dataType: string;
  timeHorizon: number;
  shortSMA: number;
  longSMA: number;
  includeStressTests: boolean;
}

const BacktestForm: React.FC<BacktestFormProps> = ({ onRunBacktest }) => {
  const { toast } = useToast();
  const [dataType, setDataType] = useState("historical");
  const [timeHorizon, setTimeHorizon] = useState(180);
  const [shortSMA, setShortSMA] = useState(10);
  const [longSMA, setLongSMA] = useState(50);
  const [includeStressTests, setIncludeStressTests] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunBacktest = () => {
    if (shortSMA >= longSMA) {
      toast({
        variant: "destructive",
        title: "Invalid Parameters",
        description: "Short SMA period must be less than Long SMA period.",
      });
      return;
    }

    setIsRunning(true);
    
    // Simulate processing time
    setTimeout(() => {
      try {
        onRunBacktest({
          dataType,
          timeHorizon,
          shortSMA,
          longSMA,
          includeStressTests
        });
        
        toast({
          title: "Backtest Complete",
          description: "Successfully ran backtest with the selected parameters.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to run backtest. Please try again.",
        });
      } finally {
        setIsRunning(false);
      }
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backtest Configuration</CardTitle>
        <CardDescription>
          Configure strategy parameters to backtest on synthetic data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dataType">Data Source</Label>
            <Select 
              value={dataType} 
              onValueChange={setDataType}
            >
              <SelectTrigger id="dataType">
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="synthetic">Synthetic Normal Market</SelectItem>
                <SelectItem value="historical">Synthetic Historical Scenarios</SelectItem>
                <SelectItem value="extreme">Synthetic Extreme Events</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Time Horizon (Days): {timeHorizon}</Label>
            <Slider 
              value={[timeHorizon]} 
              min={30} 
              max={1000} 
              step={10} 
              onValueChange={(value) => setTimeHorizon(value[0])} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Short SMA Period: {shortSMA}</Label>
            <Slider 
              value={[shortSMA]} 
              min={3} 
              max={50} 
              step={1} 
              onValueChange={(value) => setShortSMA(value[0])} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Long SMA Period: {longSMA}</Label>
            <Slider 
              value={[longSMA]} 
              min={10} 
              max={200} 
              step={5} 
              onValueChange={(value) => setLongSMA(value[0])} 
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="stress-tests"
              checked={includeStressTests}
              onCheckedChange={setIncludeStressTests}
            />
            <Label htmlFor="stress-tests">Include Stress Test Scenarios</Label>
          </div>
          
          <Button 
            onClick={handleRunBacktest} 
            disabled={isRunning} 
            className="w-full"
          >
            {isRunning ? "Running Backtest..." : "Run Backtest"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BacktestForm;
