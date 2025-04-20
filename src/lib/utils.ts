import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import {
  AIR_QUALITY_CATEGORIES,
  TEMPERATURE_RANGES,
  HUMIDITY_RANGES,
  WIND_SPEED_RANGES,
  PRECIPITATION_RANGES,
} from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date with a specified format
export function formatDate(date: string, formatStr: string = "PP"): string {
  try {
    return format(parseISO(date), formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return date;
  }
}

// Format temperature with unit
export function formatTemperature(temp: number, unit: "C" | "F" = "C"): string {
  if (unit === "F") {
    return `${(temp * 9 / 5 + 32).toFixed(1)}°F`;
  }
  return `${temp.toFixed(1)}°C`;
}

// Get category and color for a value based on ranges
export function getCategoryForValue(
  value: number,
  ranges: typeof AIR_QUALITY_CATEGORIES |
          typeof TEMPERATURE_RANGES |
          typeof HUMIDITY_RANGES |
          typeof WIND_SPEED_RANGES |
          typeof PRECIPITATION_RANGES
): { label: string; color: string } {
  const category = ranges.find(
    (range) => value >= range.range[0] && value <= range.range[1]
  );

  return category || { label: "Unknown", color: "#9ca3af" };
}

// Calculate air quality index from individual pollutants
export function calculateAQI(pollutants: {
  pm25?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  o3?: number;
  co2?: number;
}): number {
  // This is a simplified AQI calculation
  // In a real application, this would use standard EPA or similar calculations

  // Weights for different pollutants
  const weights = {
    pm25: 0.35,
    pm10: 0.25,
    no2: 0.15,
    so2: 0.10,
    o3: 0.15,
    co2: 0,
  };

  // Reference values (approximate "100" AQI level for each pollutant)
  const references = {
    pm25: 35,
    pm10: 150,
    no2: 100,
    so2: 75,
    o3: 70,
    co2: 1000,
  };

  let weightedSum = 0;
  let totalWeight = 0;

  // Calculate weighted index
  Object.entries(pollutants).forEach(([key, value]) => {
    if (value !== undefined && key in weights && key in references) {
      const k = key as keyof typeof weights;
      const weight = weights[k];
      const reference = references[k as keyof typeof references];
      weightedSum += (value / reference) * 100 * weight;
      totalWeight += weight;
    }
  });

  // Return AQI rounded to nearest integer
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

// Convert wind direction in degrees to cardinal direction
export function degreesToCardinal(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Format date for display
export function formatDateTime(dateStr: string, includeTime: boolean = true): string {
  try {
    if (includeTime) {
      return format(parseISO(dateStr), "PPp"); // e.g. "Apr 29, 2023, 3:45 PM"
    }
    return format(parseISO(dateStr), "PP"); // e.g. "Apr 29, 2023"
  } catch (error) {
    console.error("Error formatting date time:", error);
    return dateStr;
  }
}

// Truncate text to a certain length
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Linear interpolation between two values
export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

// Format numbers with thousand separators
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Download data as a file
export function downloadAsFile(data: Blob, filename: string): void {
  const url = URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
