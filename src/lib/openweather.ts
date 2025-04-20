// OpenWeather API configuration and utility functions

// Weather condition interface
export interface WeatherCondition {
  main: string;
  description: string;
  icon: string;
}

// Temperature prediction interface
export interface TemperaturePrediction {
  min: number;
  max: number;
  avg: number;
}

// Precipitation prediction interface
export interface PrecipitationPrediction {
  probability: number;
  amount: number;
}

// Air quality prediction interface
export interface AirQualityPrediction {
  index: number;
}

// Weather prediction interface
export interface WeatherPrediction {
  date: string;
  predictions: {
    temperature: TemperaturePrediction;
    precipitation: PrecipitationPrediction;
    airQuality: AirQualityPrediction;
    humidity: number;
    weatherCondition?: WeatherCondition;
  };
}

export interface OpenWeatherConfig {
  apiKey: string;
  baseUrl: string;
  units: string;
  location: {
    lat: number;
    lon: number;
    name: string;
  };
}

// OpenWeather API configuration
// Using a demo API key for development purposes
export const openWeatherConfig: OpenWeatherConfig = {
  apiKey: '1d3a2f0e0f5b8c9d6a3e2f1d0c7b4a5e', // Updated API key
  baseUrl: 'https://api.openweathermap.org/data/2.5',
  units: 'metric', // Use metric units (Celsius, meters/sec, etc.)
  location: {
    lat: 13.0827, // Chennai latitude
    lon: 80.2707, // Chennai longitude
    name: 'Chennai, Tamil Nadu, India'
  }
};

// OpenWeather API endpoints
export const openWeatherEndpoints = {
  current: '/weather',
  forecast: '/forecast',
  airPollution: '/air_pollution',
  historicalData: '/onecall/timemachine',
  oneCall: '/onecall'
};

// Function to build OpenWeather API URL with parameters
export function buildOpenWeatherUrl(endpoint: string, params: Record<string, string | number | boolean> = {}): string {
  const url = new URL(`${openWeatherConfig.baseUrl}${endpoint}`);
  
  // Add API key and default parameters
  url.searchParams.append('appid', openWeatherConfig.apiKey);
  url.searchParams.append('units', openWeatherConfig.units);
  
  // Add location parameters if not already specified in params
  if (!params.lat && !params.lon && !params.q) {
    url.searchParams.append('lat', openWeatherConfig.location.lat.toString());
    url.searchParams.append('lon', openWeatherConfig.location.lon.toString());
  }
  
  // Add additional parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });
  
  return url.toString();
}

// Function to convert OpenWeather timestamp to ISO string
export function convertTimestampToISOString(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString();
}

// Function to get wind direction as compass direction
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}