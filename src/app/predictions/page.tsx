"use client";

import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClimateStore, PredictionTimeFrame } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";
import { PREDICTION_TIMEFRAME_OPTIONS, AIR_QUALITY_CATEGORIES, TEMPERATURE_RANGES } from "@/lib/constants";
import { formatDate, formatTemperature, getCategoryForValue } from "@/lib/utils";
import { getHumanReadableWeather, getWeatherEmoji, getWeatherIconUrl } from "@/lib/weather-utils";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ThermometerIcon, Droplets, CloudFog, CloudRain, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Area, Bar } from "recharts";

export default function PredictionsPage() {
  const {
    predictionData,
    isLoadingPrediction,
    selectedPredictionTimeframe,
    setSelectedPredictionTimeframe,
    fetchPredictionData,
  } = useClimateStore();

  useEffect(() => {
    fetchPredictionData(selectedPredictionTimeframe);
  }, [fetchPredictionData, selectedPredictionTimeframe]);

  const getTemperatureChartData = () => {
    return predictionData.map(item => ({
      date: item.date,
      min: item.predictions.temperature.min,
      max: item.predictions.temperature.max,
      avg: item.predictions.temperature.avg,
    }));
  };

  const getPrecipitationChartData = () => {
    return predictionData.map(item => ({
      date: item.date,
      probability: item.predictions.precipitation.probability,
      amount: item.predictions.precipitation.amount,
    }));
  };

  const getAirQualityChartData = () => {
    return predictionData.map(item => ({
      date: item.date,
      index: item.predictions.airQuality.index,
    }));
  };

  const getHumidityChartData = () => {
    return predictionData.map(item => ({
      date: item.date,
      humidity: item.predictions.humidity,
    }));
  };

  const formatXAxis = (date: string) => {
    return formatDate(date, 'MMM dd');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI-Based Climate Predictions</h1>
          <p className="text-muted-foreground mt-1">
            Machine learning-powered forecasts of Chennai's future climate conditions
          </p>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Prediction Timeframe</label>
          <div className="max-w-md">
            <Select
              value={selectedPredictionTimeframe}
              onValueChange={(value) => setSelectedPredictionTimeframe(value as PredictionTimeFrame)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                {PREDICTION_TIMEFRAME_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoadingPrediction ? (
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[200px] w-full" />
              ))}
            </div>
          </div>
        ) : predictionData.length > 0 ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Forecasts</CardTitle>
                <CardDescription>Predictions for various climate parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="temperature" className="w-full">
                  <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
                    <TabsTrigger value="temperature">Temperature</TabsTrigger>
                    <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
                    <TabsTrigger value="airQuality">Air Quality</TabsTrigger>
                    <TabsTrigger value="humidity">Humidity</TabsTrigger>
                  </TabsList>

                  <TabsContent value="temperature">
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={getTemperatureChartData()}
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={formatXAxis}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis
                            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip formatter={(value) => [`${value.toFixed(1)}°C`, '']} />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="min"
                            fill="#93c5fd"
                            stroke="#3b82f6"
                            name="Min Temperature"
                          />
                          <Area
                            type="monotone"
                            dataKey="max"
                            fill="#fca5a5"
                            stroke="#ef4444"
                            name="Max Temperature"
                          />
                          <Line
                            type="monotone"
                            dataKey="avg"
                            stroke="#000000"
                            strokeWidth={2}
                            name="Average Temperature"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="precipitation">
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={getPrecipitationChartData()}
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={formatXAxis}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis
                            yAxisId="left"
                            orientation="left"
                            label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            label={{ value: 'Amount (mm)', angle: 90, position: 'insideRight' }}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip
                            formatter={(value, name) => {
                              if (name === "Probability") return [`${value.toFixed(0)}%`, name];
                              return [`${value.toFixed(1)} mm`, name];
                            }}
                          />
                          <Legend />
                          <Bar
                            yAxisId="right"
                            dataKey="amount"
                            fill="#3b82f6"
                            name="Amount"
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="probability"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            name="Probability"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="airQuality">
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={getAirQualityChartData()}
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={formatXAxis}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis
                            label={{ value: 'Air Quality Index', angle: -90, position: 'insideLeft' }}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip formatter={(value) => [`${value}`, 'AQI']} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="index"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            name="Air Quality Index"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="humidity">
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={getHumidityChartData()}
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={formatXAxis}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis
                            label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft' }}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Humidity']} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="humidity"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            name="Humidity"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-xl font-bold mb-4">Day-by-Day Forecast</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {predictionData.slice(0, 16).map((prediction, index) => {
                  // Get air quality category
                  const airQualityCategory = getCategoryForValue(
                    prediction.predictions.airQuality.index,
                    AIR_QUALITY_CATEGORIES
                  );

                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-base">
                              {formatDate(prediction.date, 'EEE, MMM dd')}
                            </CardTitle>
                          </div>
                          <Badge variant="outline">
                            {index === 0 ? 'Tomorrow' : `Day ${index + 1}`}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {prediction.predictions.weatherCondition && prediction.predictions.weatherCondition.icon ? (
                            <img 
                              src={getWeatherIconUrl(prediction.predictions.weatherCondition.icon)} 
                              alt="Weather icon" 
                              className="h-8 w-8" 
                            />
                          ) : (
                            <span className="text-xl">
                              {getWeatherEmoji(prediction.predictions.weatherCondition?.main)}
                            </span>
                          )}
                          <CardDescription>
                            {getHumanReadableWeather(
                              prediction.predictions.weatherCondition?.main,
                              prediction.predictions.weatherCondition?.description,
                              prediction.predictions.temperature.avg,
                              prediction.predictions.humidity,
                              prediction.predictions.precipitation.probability
                            )}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <ThermometerIcon className="h-3 w-3" />
                              <span>Temperature</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {formatTemperature(prediction.predictions.temperature.avg)}
                              </span>
                            </div>
                            <div className="flex gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center">
                                <ArrowUpCircle className="h-3 w-3 text-red-500 mr-1" />
                                {formatTemperature(prediction.predictions.temperature.max)}
                              </span>
                              <span className="flex items-center">
                                <ArrowDownCircle className="h-3 w-3 text-blue-500 mr-1" />
                                {formatTemperature(prediction.predictions.temperature.min)}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <CloudRain className="h-3 w-3" />
                              <span>Precipitation</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {prediction.predictions.precipitation.probability.toFixed(0)}%
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {prediction.predictions.precipitation.amount.toFixed(1)} mm
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <CloudFog className="h-3 w-3" />
                              <span>Air Quality</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {prediction.predictions.airQuality.index}
                              </span>
                            </div>
                            <div className="text-xs">
                              <span
                                className="px-1.5 py-0.5 rounded-sm text-white text-[10px]"
                                style={{ backgroundColor: airQualityCategory.color }}
                              >
                                {airQualityCategory.label}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Droplets className="h-3 w-3" />
                              <span>Humidity</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {prediction.predictions.humidity.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            No prediction data available
          </div>
        )}

        <div className="mt-10 bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">About Our Prediction Models</h2>
          <p className="text-muted-foreground mb-4">
            The Chennai Climate Tracer & Predictor utilizes advanced machine learning models to forecast climate conditions:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Technology</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Long Short-Term Memory (LSTM) neural networks</li>
                <li>ARIMA (AutoRegressive Integrated Moving Average)</li>
                <li>XGBoost ensemble learning algorithms</li>
                <li>Deep learning models for pattern recognition</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Data Sources</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Global Atmosphere Watch Stations (GAWS)</li>
                <li>Indian Meteorological Department historical data</li>
                <li>Chennai pollution control monitoring stations</li>
                <li>Remote sensing satellite imagery</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="italic">
              Note: Our predictions are continuously improved as new data becomes available. While we strive for accuracy, predictions beyond 7 days should be considered as trends rather than precise forecasts.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
