"use client";

import { useEffect } from "react";
import { useClimateStore, PredictionTimeFrame } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PREDICTION_TIMEFRAME_OPTIONS, AIR_QUALITY_CATEGORIES } from "@/lib/constants";
import { formatDate, formatTemperature, getCategoryForValue } from "@/lib/utils";
import Link from "next/link";
import { ExternalLink, CalendarIcon, ThermometerIcon, Droplets, CloudFog, CloudRain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PredictionSummary() {
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

  // Get first 3 prediction days for the summary
  const predictionSummary = predictionData.slice(0, 3);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Future Predictions</CardTitle>
          <CardDescription>AI-powered climate forecasts</CardDescription>
        </div>
        <Link
          href="/predictions"
          className="text-sm text-primary flex items-center gap-1 hover:underline"
        >
          View All Predictions <ExternalLink className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Timeframe</label>
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

          {isLoadingPrediction ? (
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <Skeleton key={index} className="h-32 w-full" />
              ))}
            </div>
          ) : predictionSummary.length > 0 ? (
            <div className="space-y-4">
              {predictionSummary.map((prediction, index) => {
                // Get air quality category
                const airQualityCategory = getCategoryForValue(
                  prediction.predictions.airQuality.index,
                  AIR_QUALITY_CATEGORIES
                );

                return (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">
                          {formatDate(prediction.date, 'PPP')}
                        </h3>
                      </div>
                      <Badge variant="outline">
                        {index === 0 ? 'Tomorrow' : index === 1 ? 'In 2 days' : 'In 3 days'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <ThermometerIcon className="h-3 w-3" />
                          <span>Temperature</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-semibold">
                            {formatTemperature(prediction.predictions.temperature.avg)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTemperature(prediction.predictions.temperature.min)} - {formatTemperature(prediction.predictions.temperature.max)}
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <CloudRain className="h-3 w-3" />
                          <span>Precipitation</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-semibold">
                            {prediction.predictions.precipitation.probability.toFixed(0)}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {prediction.predictions.precipitation.amount.toFixed(1)} mm
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <CloudFog className="h-3 w-3" />
                          <span>Air Quality</span>
                        </div>
                        <div className="flex items-baseline gap-1">
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

                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <Droplets className="h-3 w-3" />
                          <span>Humidity</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-semibold">
                            {prediction.predictions.humidity.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No prediction data available
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center mt-2">
            Predictions based on advanced machine learning models using historical GAWS data
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
