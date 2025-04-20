/**
 * Utility functions for weather data formatting and human-readable descriptions
 */

import { TEMPERATURE_RANGES, HUMIDITY_RANGES, PRECIPITATION_RANGES } from './constants';

/**
 * Get a human-readable description of the weather based on various parameters
 * @param weatherMain The main weather condition from OpenWeather API
 * @param weatherDescription The detailed weather description from OpenWeather API
 * @param temperature The temperature in Celsius
 * @param humidity The humidity percentage
 * @param precipProbability The precipitation probability percentage
 * @returns A human-readable weather description
 */
export function getHumanReadableWeather(
  weatherMain?: string,
  weatherDescription?: string,
  temperature?: number,
  humidity?: number,
  precipProbability?: number
): string {
  // If we have a weather description from the API, use it as the base
  if (weatherDescription) {
    // Capitalize first letter
    return weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
  }
  
  // If we have the main weather condition, use it as a fallback
  if (weatherMain) {
    return weatherMain;
  }
  
  // If no weather condition is available, generate a description based on other parameters
  const descriptions: string[] = [];
  
  // Add temperature description if available
  if (typeof temperature === 'number') {
    const tempRange = TEMPERATURE_RANGES.find(
      range => temperature >= range.range[0] && temperature <= range.range[1]
    );
    if (tempRange) {
      descriptions.push(tempRange.label);
    }
  }
  
  // Add humidity description if available
  if (typeof humidity === 'number') {
    const humidityRange = HUMIDITY_RANGES.find(
      range => humidity >= range.range[0] && humidity <= range.range[1]
    );
    if (humidityRange && humidityRange.label !== 'Comfortable') {
      descriptions.push(humidityRange.label);
    }
  }
  
  // Add precipitation description if probability is high
  if (typeof precipProbability === 'number' && precipProbability > 30) {
    if (precipProbability > 70) {
      descriptions.push('Rain expected');
    } else if (precipProbability > 30) {
      descriptions.push('Chance of rain');
    }
  }
  
  // If we have descriptions, join them
  if (descriptions.length > 0) {
    return descriptions.join(', ');
  }
  
  // Default fallback
  return 'Normal conditions';
}

/**
 * Get a weather icon based on the weather condition and time of day
 * @param iconCode The icon code from OpenWeather API
 * @returns The URL to the weather icon
 */
export function getWeatherIconUrl(iconCode?: string): string {
  if (!iconCode) {
    return 'https://openweathermap.org/img/wn/01d.png'; // Default to clear sky
  }
  
  return `https://openweathermap.org/img/wn/${iconCode}.png`;
}

/**
 * Get a simple weather emoji based on the weather condition
 * @param weatherMain The main weather condition from OpenWeather API
 * @returns An emoji representing the weather condition
 */
export function getWeatherEmoji(weatherMain?: string): string {
  if (!weatherMain) return '🌤️';
  
  const condition = weatherMain.toLowerCase();
  
  if (condition.includes('thunderstorm')) return '⛈️';
  if (condition.includes('drizzle')) return '🌦️';
  if (condition.includes('rain')) return '🌧️';
  if (condition.includes('snow')) return '❄️';
  if (condition.includes('mist') || condition.includes('fog')) return '🌫️';
  if (condition.includes('clear')) return '☀️';
  if (condition.includes('clouds')) {
    if (condition.includes('few') || condition.includes('scattered')) return '🌤️';
    return '☁️';
  }
  
  return '🌤️'; // Default
}