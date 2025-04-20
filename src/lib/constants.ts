// Application constants

// Default location coordinates for Chennai
export const DEFAULT_LOCATION = {
  latitude: 13.0827,
  longitude: 80.2707,
  label: 'Chennai, Tamil Nadu, India',
};

// Time range options for data visualization
export const TIME_RANGE_OPTIONS = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '1m', label: 'Last Month' },
  { value: '3m', label: 'Last 3 Months' },
  { value: '6m', label: 'Last 6 Months' },
  { value: '1y', label: 'Last Year' },
  { value: '5y', label: 'Last 5 Years' },
];

// Climate parameters for data visualization
export const CLIMATE_PARAMETER_OPTIONS = [
  { value: 'temperature', label: 'Temperature' },
  { value: 'humidity', label: 'Humidity' },
  { value: 'airQuality', label: 'Air Quality' },
  { value: 'windSpeed', label: 'Wind Speed' },
  { value: 'precipitation', label: 'Precipitation' },
];

// Prediction timeframe options
export const PREDICTION_TIMEFRAME_OPTIONS = [
  { value: '24h', label: 'Next 24 Hours' },
  { value: '7d', label: 'Next 7 Days' },
  { value: '1m', label: 'Next Month' },
  { value: '3m', label: 'Next 3 Months' },
  { value: '6m', label: 'Next 6 Months' },
  { value: '1y', label: 'Next Year' },
];

// Air quality index categories
export const AIR_QUALITY_CATEGORIES = [
  { range: [0, 50], label: 'Good', color: '#4ade80' },
  { range: [51, 100], label: 'Moderate', color: '#fbbf24' },
  { range: [101, 150], label: 'Unhealthy for Sensitive Groups', color: '#f97316' },
  { range: [151, 200], label: 'Unhealthy', color: '#ef4444' },
  { range: [201, 300], label: 'Very Unhealthy', color: '#7c3aed' },
  { range: [301, 500], label: 'Hazardous', color: '#831843' },
];

// Temperature comfort ranges (in Celsius)
export const TEMPERATURE_RANGES = [
  { range: [-Infinity, 15], label: 'Cold', color: '#93c5fd' },
  { range: [15, 22], label: 'Cool', color: '#60a5fa' },
  { range: [22, 26], label: 'Comfortable', color: '#4ade80' },
  { range: [26, 30], label: 'Warm', color: '#fbbf24' },
  { range: [30, 35], label: 'Hot', color: '#f97316' },
  { range: [35, Infinity], label: 'Very Hot', color: '#ef4444' },
];

// Humidity comfort ranges (in percentage)
export const HUMIDITY_RANGES = [
  { range: [0, 30], label: 'Dry', color: '#fde68a' },
  { range: [30, 50], label: 'Comfortable', color: '#4ade80' },
  { range: [50, 70], label: 'Moderately Humid', color: '#60a5fa' },
  { range: [70, 100], label: 'Very Humid', color: '#3b82f6' },
];

// Wind speed categories (in km/h)
export const WIND_SPEED_RANGES = [
  { range: [0, 5], label: 'Calm', color: '#d9f99d' },
  { range: [5, 15], label: 'Light Breeze', color: '#4ade80' },
  { range: [15, 25], label: 'Moderate', color: '#60a5fa' },
  { range: [25, 35], label: 'Fresh', color: '#3b82f6' },
  { range: [35, 50], label: 'Strong', color: '#f97316' },
  { range: [50, 65], label: 'Gale', color: '#f43f5e' },
  { range: [65, Infinity], label: 'Storm', color: '#7c3aed' },
];

// Precipitation intensity (in mm/h)
export const PRECIPITATION_RANGES = [
  { range: [0, 0.1], label: 'None', color: '#ffffff' },
  { range: [0.1, 2.5], label: 'Light', color: '#93c5fd' },
  { range: [2.5, 7.5], label: 'Moderate', color: '#60a5fa' },
  { range: [7.5, 15], label: 'Heavy', color: '#3b82f6' },
  { range: [15, Infinity], label: 'Very Heavy', color: '#1d4ed8' },
];

// Alert types for subscription
export const ALERT_TYPES = [
  { value: 'extreme_temperature', label: 'Extreme Temperature' },
  { value: 'heavy_rainfall', label: 'Heavy Rainfall' },
  { value: 'poor_air_quality', label: 'Poor Air Quality' },
  { value: 'high_humidity', label: 'High Humidity' },
  { value: 'strong_winds', label: 'Strong Winds' },
  { value: 'weekly_summary', label: 'Weekly Summary' },
];

// Data sources for about page
export const DATA_SOURCES = [
  { name: 'GAWS (Global Atmosphere Watch Station)', url: 'https://gaw.kishou.go.jp/' },
  { name: 'Indian Meteorological Department', url: 'https://mausam.imd.gov.in/' },
  { name: 'Central Pollution Control Board', url: 'https://cpcb.nic.in/' },
  { name: 'Tamil Nadu Pollution Control Board', url: 'https://tnpcb.gov.in/' },
];
