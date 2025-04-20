"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClimateStore, TimeRange, DataParameter } from "@/lib/store";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TIME_RANGE_OPTIONS, CLIMATE_PARAMETER_OPTIONS } from "@/lib/constants";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps, Legend, AreaChart, Area, BarChart, Bar } from "recharts";
import { formatDate } from "@/lib/utils";

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

export default function HistoricalPage() {
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
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("line");

  // Fetch historical data on load and parameter/time range change
  useEffect(() => {
    fetchHistoricalData(selectedTimeRange, selectedParameter);
  }, [fetchHistoricalData, selectedTimeRange, selectedParameter]);

  // Process data for chart when historicalData changes
  useEffect(() => {
    if (historicalData.length > 0) {
      const sampleSize = Math.min(historicalData.length, 120); // Show more data points on the detailed page
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
                      (selectedTimeRange === '7d' ? 'EEE, HH:mm' : 'MMM dd');
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
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Historical Trends</h1>
          <p className="text-muted-foreground mt-1">
            Analyze Chennai climate data over time to identify patterns and trends
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Climate Parameter Analysis</CardTitle>
              <CardDescription>Visualize how climate parameters have changed over different time periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap gap-4 md:items-end">
                  <div className="w-full md:w-auto md:flex-1">
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

                  <div className="w-full md:w-auto md:flex-1">
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

                  <div className="w-full md:w-auto md:flex-1">
                    <label className="text-sm font-medium mb-1 block">Chart Type</label>
                    <Select
                      value={chartType}
                      onValueChange={(value) => setChartType(value as "line" | "area" | "bar")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select chart type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="h-[500px] w-full">
                  {isLoadingHistorical ? (
                    <div className="flex items-center justify-center h-full">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : chartData.length > 0 ? (
                    <Tabs defaultValue="chart" className="w-full">
                      <TabsList>
                        <TabsTrigger value="chart">Chart</TabsTrigger>
                        <TabsTrigger value="data">Data</TabsTrigger>
                      </TabsList>
                      <TabsContent value="chart" className="h-[500px]">
                        {chartType === "line" && (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={chartData}
                              margin={{
                                top: 20,
                                right: 20,
                                left: 20,
                                bottom: 60,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                              <XAxis
                                dataKey="timestamp"
                                tickFormatter={formatXAxis}
                                tick={{ fontSize: 12 }}
                                stroke="#a1a1aa"
                                angle={-45}
                                textAnchor="end"
                                height={50}
                              />
                              <YAxis
                                tick={{ fontSize: 12 }}
                                stroke="#a1a1aa"
                                width={60}
                              />
                              <Tooltip content={customTooltip} />
                              <Legend />
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
                        )}

                        {chartType === "area" && (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={chartData}
                              margin={{
                                top: 20,
                                right: 20,
                                left: 20,
                                bottom: 60,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                              <XAxis
                                dataKey="timestamp"
                                tickFormatter={formatXAxis}
                                tick={{ fontSize: 12 }}
                                stroke="#a1a1aa"
                                angle={-45}
                                textAnchor="end"
                                height={50}
                              />
                              <YAxis
                                tick={{ fontSize: 12 }}
                                stroke="#a1a1aa"
                                width={60}
                              />
                              <Tooltip content={customTooltip} />
                              <Legend />
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke={getParameterColor(selectedParameter)}
                                fill={`${getParameterColor(selectedParameter)}40`}
                                name={CLIMATE_PARAMETER_OPTIONS.find(p => p.value === selectedParameter)?.label}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}

                        {chartType === "bar" && (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={chartData}
                              margin={{
                                top: 20,
                                right: 20,
                                left: 20,
                                bottom: 60,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                              <XAxis
                                dataKey="timestamp"
                                tickFormatter={formatXAxis}
                                tick={{ fontSize: 12 }}
                                stroke="#a1a1aa"
                                angle={-45}
                                textAnchor="end"
                                height={50}
                              />
                              <YAxis
                                tick={{ fontSize: 12 }}
                                stroke="#a1a1aa"
                                width={60}
                              />
                              <Tooltip content={customTooltip} />
                              <Legend />
                              <Bar
                                dataKey="value"
                                fill={getParameterColor(selectedParameter)}
                                name={CLIMATE_PARAMETER_OPTIONS.find(p => p.value === selectedParameter)?.label}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </TabsContent>
                      <TabsContent value="data">
                        <div className="h-[500px] overflow-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-muted">
                                <th className="border p-2 text-left">Date & Time</th>
                                <th className="border p-2 text-left">
                                  {CLIMATE_PARAMETER_OPTIONS.find(p => p.value === selectedParameter)?.label}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {chartData.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                                  <td className="border p-2">{formatDate(item.timestamp, 'PPpp')}</td>
                                  <td className="border p-2">{`${item.value.toFixed(2)} ${item.unit}`}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No historical data available
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
