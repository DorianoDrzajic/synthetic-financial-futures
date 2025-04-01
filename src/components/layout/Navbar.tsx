
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { BarChart2, Settings, HelpCircle } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const currentTab = location.pathname.split('/')[1] || 'dashboard';
  
  const handleTabChange = (value: string) => {
    navigate(`/${value}`);
  };
  
  const handleSettings = () => {
    toast({
      title: "Settings",
      description: "Settings panel will be available in the next update.",
    });
  };
  
  const handleHelp = () => {
    toast({
      title: "Help",
      description: "Documentation and help resources will be available in the next update.",
    });
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-muted">
      <div className="flex items-center">
        <BarChart2 className="w-6 h-6 text-primary mr-2" />
        <h1 className="text-xl font-bold">SynthFinData</h1>
      </div>
      
      <Tabs value={currentTab} onValueChange={handleTabChange} className="mx-auto">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="generator">Data Generator</TabsTrigger>
          <TabsTrigger value="backtesting">Backtesting</TabsTrigger>
          <TabsTrigger value="risk">Risk Modeling</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={handleSettings}>
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleHelp}>
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
