import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PerformanceChartProps {
  title: string;
  data?: number[];
  labels?: string[];
  type?: 'line' | 'bar' | 'doughnut';
}

export function PerformanceChart({ title, data = [], labels = [], type = 'line' }: PerformanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple canvas drawing for demo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (type === 'line') {
      drawLineChart(ctx, data, canvas.width, canvas.height);
    } else if (type === 'bar') {
      drawBarChart(ctx, data, canvas.width, canvas.height);
    } else if (type === 'doughnut') {
      drawDoughnutChart(ctx, data, canvas.width, canvas.height);
    }
  }, [data, type]);

  const drawLineChart = (ctx: CanvasRenderingContext2D, data: number[], width: number, height: number) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((value - min) / range) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  };

  const drawBarChart = (ctx: CanvasRenderingContext2D, data: number[], width: number, height: number) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const max = Math.max(...data);
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;
    
    ctx.fillStyle = '#6366F1';
    
    data.forEach((value, index) => {
      const x = padding + index * (barWidth + barSpacing);
      const barHeight = (value / max) * chartHeight;
      const y = padding + chartHeight - barHeight;
      
      ctx.fillRect(x, y, barWidth, barHeight);
    });
  };

  const drawDoughnutChart = (ctx: CanvasRenderingContext2D, data: number[], width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    const innerRadius = radius * 0.6;
    
    const total = data.reduce((sum, value) => sum + value, 0);
    const colors = ['#FF0000', '#FF0050', '#8B5CF6'];
    
    let currentAngle = -Math.PI / 2;
    
    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      ctx.fillStyle = colors[index] || '#6366F1';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fill();
      
      currentAngle += sliceAngle;
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {type === 'line' && (
          <Select defaultValue="7">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={200}
          className="w-full h-auto"
        />
      </CardContent>
    </Card>
  );
}
