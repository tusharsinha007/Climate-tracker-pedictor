"use client";

import { useEffect, useState } from "react";
import { useClimateStore, TimeRange, DataParameter } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TIME_RANGE_OPTIONS, CLIMATE_PARAMETER_OPTIONS } from "@/lib/constants";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps } from "recharts";
import { formatDate, formatTemperature } from "@/lib/utils";
import Link from "next/link";
import { BarChart, ExternalLink } from "lucide-react";

// Interfaces for chart data
interface ChartDataPoint {
  timestamp: string;
  value: number;
  unit: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ChartDataPoint;
  }>;
  label?: string;
}

export function HistoricalSummary() {
  const {
    historicalData,
    isLoadingHistorical,
    selectedTimeRange,
    selectedParameter,
    setSelectedTimeRange,
    setSelectedParameter,
    fetchHistoricalData,
  } = useClimateStore();

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Fetch historical data on load and parameter/time range change
  useEffect(() => {
    fetchHistoricalData(selectedTimeRange, selectedParameter);
  }, [fetchHistoricalData, selectedTimeRange, selectedParameter]);

  // Process data for chart when historicalData changes
  useEffect(() => {
    if (historicalData.length > 0) {
      const sampleSize = Math.min(historicalData.length, 50); // Limit to 50 data points for better rendering
      const skipFactor = Math.ceil(historicalData.length / sampleSize);

      const processedData = historicalData
        .filter((_, index) => index % skipFactor === 0)
        .map((data) => {
          let value: number;
          let unit: string;

          switch (selectedParameter) {
            case "temperature":
              value = data.temperature;
              unit = "°C";
              break;
            case "humidity":
              value = data.humidity;
              unit = "%";
              break;
            case "airQuality":
              // Using PM2.5 as representative of air quality
              value = data.airQuality.pm25;
              unit = "μg/m³";
              break;
            case "windSpeed":
              value = data.windSpeed;
              unit = "km/h";
              break;
            case "precipitation":
              value = data.precipitation;
              unit = "mm";
              break;
            default:
              value = data.temperature;
              unit = "°C";
          }

          return {
            timestamp: data.timestamp,
            value,
            unit,
          };
        })
        .reverse(); // Reverse to show oldest to newest

      setChartData(processedData);
    }
  }, [historicalData, selectedParameter]);

  const formatXAxis = (timestamp: string) => {
    const dateFormat = selectedTimeRange === '24h' ? 'HH:mm' :
                      (selectedTimeRange === '7d' ? 'EEE' : 'dd MMM');
    return formatDate(timestamp, dateFormat);
  };

  const customTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded p-2 shadow-md">
          <p className="text-sm">{formatDate(label || '', 'PPpp')}</p>
          <p className="text-sm font-semibold">
            {`${payload[0].value.toFixed(1)}${payload[0].payload.unit}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const getParameterColor = (parameter: DataParameter) => {
    switch (parameter) {
      case "temperature":
        return "#ef4444";
      case "humidity":
        return "#3b82f6";
      case "airQuality":
        return "#8b5cf6";
      case "windSpeed":
        return "#10b981";
      case "precipitation":
        return "#0ea5e9";
      default:
        return "#6b7280";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Historical Trends</CardTitle>
          <CardDescription>Climate data over time</CardDescription>
        </div>
        <Link
          href="/historical"
          className="text-sm text-primary flex items-center gap-1 hover:underline"
        >
          View Full Analysis <ExternalLink className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 md:items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">Parameter</label>
              <Select
                value={selectedParameter}
                onValueChange={(value) => setSelectedParameter(value as DataParameter)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parameter" />
                </SelectTrigger>
                <SelectContent>
                  {CLIMATE_PARAMETER_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">Time Range</label>
              <Select
                value={selectedTimeRange}
                onValueChange={(value) => setSelectedTimeRange(value as TimeRange)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_RANGE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="h-64 w-full">
            {isLoadingHistorical ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-full w-full" />
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 20,
                    left: 10,
                    bottom: 15,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatXAxis}
                    tick={{ fontSize: 12 }}
                    stroke="#a1a1aa"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#a1a1aa"
                    width={40}
                  />
                  <Tooltip content={customTooltip} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={getParameterColor(selectedParameter)}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name={CLIMATE_PARAMETER_OPTIONS.find(p => p.value === selectedParameter)?.label}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <BarChart className="h-8 w-8 mr-2" />
                <span>No historical data available</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
