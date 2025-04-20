"use client";

import { useEffect } from "react";
import { useClimateStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { calculateAQI, formatTemperature, getCategoryForValue, formatDateTime } from "@/lib/utils";
import { AIR_QUALITY_CATEGORIES, TEMPERATURE_RANGES, HUMIDITY_RANGES, WIND_SPEED_RANGES, PRECIPITATION_RANGES } from "@/lib/constants";
import {
  ThermometerIcon,
  Droplets,
  Wind,
  CloudRain,
  Gauge,
  Eye,
  RefreshCw,
  CloudFog
} from "lucide-react";

export function LiveDataDashboard() {
  const { currentData, isLoadingCurrent, fetchCurrentData } = useClimateStore();

  useEffect(() => {
    if (!currentData) {
      fetchCurrentData();
    }
  }, [currentData, fetchCurrentData]);

  const handleRefresh = () => {
    fetchCurrentData();
  };

  // Calculate AQI from pollutants
  const airQualityIndex = currentData
    ? calculateAQI(currentData.airQuality)
    : 0;

  // Get AQI category
  const airQualityCategory = airQualityIndex
    ? getCategoryForValue(airQualityIndex, AIR_QUALITY_CATEGORIES)
    : { label: "Unknown", color: "#9ca3af" };

  // Get temperature category
  const temperatureCategory = currentData?.temperature
    ? getCategoryForValue(currentData.temperature, TEMPERATURE_RANGES)
    : { label: "Unknown", color: "#9ca3af" };

  // Get humidity category
  const humidityCategory = currentData?.humidity
    ? getCategoryForValue(currentData.humidity, HUMIDITY_RANGES)
    : { label: "Unknown", color: "#9ca3af" };

  // Get wind speed category
  const windSpeedCategory = currentData?.windSpeed
    ? getCategoryForValue(currentData.windSpeed, WIND_SPEED_RANGES)
    : { label: "Unknown", color: "#9ca3af" };

  // Get precipitation category
  const precipitationCategory = currentData?.precipitation
    ? getCategoryForValue(currentData.precipitation, PRECIPITATION_RANGES)
    : { label: "Unknown", color: "#9ca3af" };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Live Climate Data</h2>
          <p className="text-muted-foreground">Current conditions in Chennai</p>
        </div>
        <div className="flex items-center gap-2">
          {currentData && (
            <p className="text-sm text-muted-foreground">
              Last updated: {formatDateTime(currentData.timestamp)}
            </p>
          )}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            disabled={isLoadingCurrent}
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingCurrent ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-muted-foreground">Temperature</CardTitle>
              <ThermometerIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingCurrent || !currentData ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {formatTemperature(currentData.temperature)}
                  </span>
                </div>
                <Badge
                  className="font-normal"
                  style={{ backgroundColor: temperatureCategory.color, color: '#fff' }}
                >
                  {temperatureCategory.label}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Humidity Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-muted-foreground">Humidity</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingCurrent || !currentData ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {currentData.humidity.toFixed(1)}%
                  </span>
                </div>
                <Badge
                  className="font-normal"
                  style={{ backgroundColor: humidityCategory.color, color: '#fff' }}
                >
                  {humidityCategory.label}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Air Quality Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-muted-foreground">Air Quality</CardTitle>
              <CloudFog className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingCurrent || !currentData ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {airQualityIndex}
                  </span>
                  <span className="text-sm text-muted-foreground">AQI</span>
                </div>
                <Badge
                  className="font-normal"
                  style={{ backgroundColor: airQualityCategory.color, color: '#fff' }}
                >
                  {airQualityCategory.label}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wind Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-muted-foreground">Wind</CardTitle>
              <Wind className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingCurrent || !currentData ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {currentData.windSpeed.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">km/h {currentData.windDirection}</span>
                </div>
                <Badge
                  className="font-normal"
                  style={{ backgroundColor: windSpeedCategory.color, color: '#fff' }}
                >
                  {windSpeedCategory.label}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary data row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Precipitation Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-muted-foreground">Precipitation</CardTitle>
              <CloudRain className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingCurrent || !currentData ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold">
                    {currentData.precipitation.toFixed(1)} mm
                  </span>
                </div>
                <Badge
                  className="font-normal text-xs"
                  style={{ backgroundColor: precipitationCategory.color, color: precipitationCategory.color === '#ffffff' ? '#000' : '#fff' }}
                >
                  {precipitationCategory.label}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pressure Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-muted-foreground">Barometric Pressure</CardTitle>
              <Gauge className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingCurrent || !currentData ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold">
                  {currentData.pressure.toFixed(1)} hPa
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visibility Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-muted-foreground">Visibility</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingCurrent || !currentData ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold">
                  {currentData.visibility.toFixed(1)} km
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Air Quality Panel */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Detailed Air Quality Parameters</CardTitle>
          <CardDescription>Individual pollutant measurements</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCurrent || !currentData ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                <span className="text-muted-foreground text-sm mb-1">PM2.5</span>
                <span className="text-xl font-semibold">{currentData.airQuality.pm25.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">μg/m³</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                <span className="text-muted-foreground text-sm mb-1">PM10</span>
                <span className="text-xl font-semibold">{currentData.airQuality.pm10.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">μg/m³</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                <span className="text-muted-foreground text-sm mb-1">CO₂</span>
                <span className="text-xl font-semibold">{currentData.airQuality.co2.toFixed(0)}</span>
                <span className="text-xs text-muted-foreground">ppm</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                <span className="text-muted-foreground text-sm mb-1">NO₂</span>
                <span className="text-xl font-semibold">{currentData.airQuality.no2.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">ppb</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                <span className="text-muted-foreground text-sm mb-1">SO₂</span>
                <span className="text-xl font-semibold">{currentData.airQuality.so2.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">ppb</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                <span className="text-muted-foreground text-sm mb-1">O₃</span>
                <span className="text-xl font-semibold">{currentData.airQuality.o3.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">ppb</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
