"use client";

import { ReactNode } from "react";
import { MainNav } from "./MainNav";
import { Footer } from "./Footer";
import { useClimateStore } from "@/lib/store";
import { useEffect } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { fetchCurrentData } = useClimateStore();

  // Fetch current data on initial load
  useEffect(() => {
    fetchCurrentData();

    // Set up a polling interval to refresh data every 5 minutes
    const pollingInterval = setInterval(() => {
      fetchCurrentData();
    }, 5 * 60 * 1000);

    return () => clearInterval(pollingInterval);
  }, [fetchCurrentData]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container py-4">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
