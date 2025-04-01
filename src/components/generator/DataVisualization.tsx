
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";

interface DataVisualizationProps {
  data: any;
  type: "normal" | "correlated" | "crash";
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data, type }) => {
  if (!data) return null;
  
  const formatChartData = () => {
    if (type === "normal" || type === "crash") {
      return Array.from({ length: data.length }, (_, i) => ({
        day: i + 1,
        price: data[i]
      }));
    } else if (type === "correlated") {
      return Array.from({ length: data[0].length }, (_, i) => {
        const point: { [key: string]: number } = { day: i + 1 };
        for (let j = 0; j < data.length; j++) {
          point[`asset${j + 1}`] = data[j][i];
        }
        return point;
      });
    }
    return [];
  };
  
  const chartData = formatChartData();
  
  const renderTitle = () => {
    switch (type) {
      case "normal":
        return "Normal Market Scenario";
      case "correlated":
        return "Correlated Assets Scenario";
      case "crash":
        return "Market Crash Scenario";
    }
  };
  
  const lineColors = [
    "#2196F3", // Blue
    "#9C27B0", // Purple
    "#009688", // Teal
    "#FF9800", // Orange
    "#00BCD4", // Cyan
    "#3F51B5", // Indigo
    "#4CAF50", // Green
    "#F44336", // Red
    "#FFEB3B", // Yellow
    "#795548"  // Brown
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{renderTitle()}</CardTitle>
        <Badge variant="outline" className="bg-muted">
          {chartData.length} days
        </Badge>
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
              
              {type === "normal" || type === "crash" ? (
                <Line
                  type="monotone"
                  dataKey="price"
                  name="Asset Price"
                  stroke={type === "normal" ? "#2196F3" : "#F44336"}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ) : (
                data.map((_, index) => (
                  <Line
                    key={`asset-${index + 1}`}
                    type="monotone"
                    dataKey={`asset${index + 1}`}
                    name={`Asset ${index + 1}`}
                    stroke={lineColors[index % lineColors.length]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
