"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XIcon, AlertTriangleIcon, InfoIcon, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type AlertType = "warning" | "info" | "danger" | "success";

interface ClimateAlert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: string;
}

// Mock climate alerts
const mockAlerts: ClimateAlert[] = [
  {
    id: "1",
    type: "warning",
    title: "High Temperature Alert",
    message: "Temperatures expected to exceed 38°C in Chennai today. Stay hydrated and avoid direct sun exposure.",
    timestamp: new Date().toISOString(),
  },
  {
    id: "2",
    type: "info",
    title: "Air Quality Update",
    message: "Air quality index currently at 'Moderate' levels. Sensitive groups should consider limiting prolonged outdoor exertion.",
    timestamp: new Date().toISOString(),
  },
  {
    id: "3",
    type: "danger",
    title: "Heavy Rainfall Warning",
    message: "Heavy rainfall predicted for Chennai and surrounding areas in the next 24-48 hours. Potential for localized flooding.",
    timestamp: new Date().toISOString(),
  },
];

export function AlertsBanner() {
  const [alerts, setAlerts] = useState<ClimateAlert[]>([]);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch active alerts from an API
    setAlerts(mockAlerts);

    // Rotate through alerts every 8 seconds
    const interval = setInterval(() => {
      if (alerts.length > 1) {
        setCurrentAlertIndex((prevIndex) => (prevIndex + 1) % alerts.length);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [alerts.length]);

  const dismissAlert = () => {
    setVisible(false);
  };

  if (!visible || alerts.length === 0) {
    return null;
  }

  const currentAlert = alerts[currentAlertIndex];

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case "warning":
        return <AlertTriangleIcon className="h-5 w-5" />;
      case "info":
        return <InfoIcon className="h-5 w-5" />;
      case "danger":
        return <AlertCircleIcon className="h-5 w-5" />;
      case "success":
        return <InfoIcon className="h-5 w-5" />;
      default:
        return <InfoIcon className="h-5 w-5" />;
    }
  };

  const getAlertClass = (type: AlertType) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200";
      case "danger":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200";
      case "success":
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200";
      default:
        return "";
    }
  };

  return (
    <Alert className={`flex items-center justify-between ${getAlertClass(currentAlert.type)}`}>
      <div className="flex items-start gap-4">
        {getAlertIcon(currentAlert.type)}
        <div>
          <AlertTitle className="text-base">{currentAlert.title}</AlertTitle>
          <AlertDescription className="text-sm mt-1">{currentAlert.message}</AlertDescription>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {alerts.length > 1 && (
          <span className="text-xs">
            {currentAlertIndex + 1} of {alerts.length}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={dismissAlert}
          aria-label="Dismiss alert"
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
