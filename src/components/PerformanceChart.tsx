import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar, BarChart, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// A flexible data type for our charts
type ChartData = {
  name: string;
  views?: number;
  value?: number;
}[];

interface PerformanceChartProps {
  title: string;
  data?: ChartData;
  type?: 'line' | 'bar' | 'doughnut';
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export function PerformanceChart({ title, data = [], type = 'line' }: PerformanceChartProps) {

  const renderChart = () => {
    // This guard clause prevents the component from crashing if data is empty or undefined
    if (!data || data.length === 0) {
      return <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No data to display</div>;
    }

    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="views" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'doughnut':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Unsupported chart type</div>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}