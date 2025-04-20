"use client";

import { useState } from "react";
import { useClimateStore, DataParameter } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_LOCATION } from "@/lib/constants";
import Link from "next/link";
import { ExternalLink, MapPinIcon } from "lucide-react";

export function MapPreview() {
  const { currentData } = useClimateStore();
  const [selectedView, setSelectedView] = useState<"temperature" | "airQuality" | "precipitation">("temperature");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Geospatial View</CardTitle>
          <CardDescription>Climate parameters across Chennai region</CardDescription>
        </div>
        <Link
          href="/maps"
          className="text-sm text-primary flex items-center gap-1 hover:underline"
        >
          Explore Full Maps <ExternalLink className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Tabs
            value={selectedView}
            onValueChange={(value: string) => {
              setSelectedView(value as "temperature" | "airQuality" | "precipitation");
            }}
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="airQuality">Air Quality</TabsTrigger>
              <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
            </TabsList>

            <TabsContent value="temperature" className="mt-4">
              <div className="aspect-video relative overflow-hidden rounded-md">
                <MapPreviewPlaceholder
                  title="Temperature Heatmap"
                  parameter="temperature"
                  currentValue={currentData?.temperature}
                  unit="°C"
                />
              </div>
            </TabsContent>

            <TabsContent value="airQuality" className="mt-4">
              <div className="aspect-video relative overflow-hidden rounded-md">
                <MapPreviewPlaceholder
                  title="Air Quality Index"
                  parameter="airQuality"
                  currentValue={currentData?.airQuality.pm25}
                  unit="AQI"
                />
              </div>
            </TabsContent>

            <TabsContent value="precipitation" className="mt-4">
              <div className="aspect-video relative overflow-hidden rounded-md">
                <MapPreviewPlaceholder
                  title="Precipitation Level"
                  parameter="precipitation"
                  currentValue={currentData?.precipitation}
                  unit="mm"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-xs text-muted-foreground mt-2">
            Data is sourced from multiple monitoring stations across Chennai. Click "Explore Full Maps" for interactive maps.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Placeholder component until we implement the actual map
function MapPreviewPlaceholder({
  title,
  parameter,
  currentValue,
  unit
}: {
  title: string;
  parameter: DataParameter;
  currentValue?: number;
  unit: string;
}) {
  const getGradientForParameter = (param: DataParameter) => {
    switch (param) {
      case "temperature":
        return "from-blue-500 via-yellow-500 to-red-500";
      case "airQuality":
        return "from-green-500 via-yellow-500 to-red-500";
      case "precipitation":
        return "from-blue-200 via-blue-400 to-blue-700";
      case "humidity":
        return "from-blue-300 via-blue-500 to-blue-700";
      case "windSpeed":
        return "from-green-300 via-green-500 to-green-700";
      default:
        return "from-blue-500 via-purple-500 to-pink-500";
    }
  };

  return (
    <div className="h-[400px] flex items-center justify-center relative bg-accent/10">
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradientForParameter(parameter)} opacity-20`} />

      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-3 rounded-md shadow-md">
        <h3 className="text-sm font-bold">{title}</h3>
        <div className="flex items-center mt-1 gap-1">
          <MapPinIcon className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{DEFAULT_LOCATION.label}</span>
        </div>
        {currentValue !== undefined && (
          <p className="text-lg font-bold mt-1">
            {currentValue.toFixed(1)} {unit}
          </p>
        )}
      </div>

      <div className="text-center">
        <p className="text-base font-medium">Interactive Map Coming Soon</p>
        <p className="text-xs text-muted-foreground mt-1">Visit the Maps page for detailed view</p>
      </div>
    </div>
  );
}
