"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { LiveDataDashboard } from "@/components/dashboard/LiveDataDashboard";
import { HistoricalSummary } from "@/components/dashboard/HistoricalSummary";
import { PredictionSummary } from "@/components/dashboard/PredictionSummary";
import { MapPreview } from "@/components/dashboard/MapPreview";
import { AlertsBanner } from "@/components/dashboard/AlertsBanner";

export default function Home() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <AlertsBanner />
        <LiveDataDashboard />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HistoricalSummary />
          <PredictionSummary />
        </div>
        <MapPreview />
      </div>
    </AppLayout>
  );
}
