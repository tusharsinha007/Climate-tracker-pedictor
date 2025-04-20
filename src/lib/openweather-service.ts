// OpenWeather API service functions
import { openWeatherConfig, openWeatherEndpoints, buildOpenWeatherUrl, getWindDirection, convertTimestampToISOString } from './openweather';
import { ClimateData, PredictionData, TimeRange, PredictionTimeFrame } from './store';
import { chennaiHistoricalData, chennaiMonthlyAverages } from '../data/chennai_climate';

// Interface for OpenWeather current weather response
interface OpenWeatherCurrentResponse {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
}

// Interface for OpenWeather air pollution response
interface OpenWeatherAirPollutionResponse {
  list: Array<{
    dt: number;
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }>;
}

// Interface for OpenWeather forecast response
interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
    rain?: {
      "3h"?: number;
    };
    clouds: {
      all: number;
    };
    visibility: number;
    pop: number; // Probability of precipitation
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    dt_txt: string;
  }>;
}

// Function to get current climate data from local dataset
function getCurrentClimateDataFromLocal(): ClimateData {
  // Get current month (0-11)
  const currentMonth = new Date().getMonth();
  
  // Use monthly average data for the current month
  const monthData = chennaiMonthlyAverages[currentMonth];
  
  // Create a climate data object from the monthly average
  return {
    timestamp: new Date().toISOString(),
    temperature: monthData.meanTemp,
    humidity: monthData.humidity,
    airQuality: {
      pm25: monthData.airQuality.pm25,
      pm10: monthData.airQuality.pm10,
      co2: 400, // Default value
      no2: 20,  // Default value
      so2: 10,  // Default value
      o3: 30    // Default value
    },
    windSpeed: monthData.windSpeed,
    windDirection: getRandomWindDirection(),
    precipitation: monthData.precipitation / 30, // Daily average
    pressure: monthData.pressure,
    visibility: 10 // Default good visibility in km
  };
}

// Helper function to get a random wind direction
function getRandomWindDirection(): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.floor(Math.random() * directions.length)];
}

// Function to fetch current weather data from OpenWeather
export async function fetchCurrentWeather(): Promise<ClimateData> {
  try {
    // Fetch current weather data
    const weatherUrl = buildOpenWeatherUrl(openWeatherEndpoints.current);
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      console.warn(`Failed to fetch current weather: ${weatherResponse.statusText}. Using local data instead.`);
      return getCurrentClimateDataFromLocal();
    }
    const weatherData: OpenWeatherCurrentResponse = await weatherResponse.json();
    
    // Fetch current air pollution data
    const airPollutionUrl = buildOpenWeatherUrl(openWeatherEndpoints.airPollution);
    const airPollutionResponse = await fetch(airPollutionUrl);
    if (!airPollutionResponse.ok) {
      console.warn(`Failed to fetch air pollution: ${airPollutionResponse.statusText}. Using local data instead.`);
      return getCurrentClimateDataFromLocal();
    }
    const airPollutionData: OpenWeatherAirPollutionResponse = await airPollutionResponse.json();
    
    // Transform the data to match our ClimateData interface
    const currentData: ClimateData = {
      timestamp: convertTimestampToISOString(weatherData.dt),
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      airQuality: {
        pm25: airPollutionData.list[0].components.pm2_5,
        pm10: airPollutionData.list[0].components.pm10,
        co2: 400, // OpenWeather doesn't provide CO2 data, using default value
        no2: airPollutionData.list[0].components.no2,
        so2: airPollutionData.list[0].components.so2,
        o3: airPollutionData.list[0].components.o3
      },
      windSpeed: weatherData.wind.speed,
      windDirection: getWindDirection(weatherData.wind.deg),
      precipitation: weatherData.rain?.['1h'] || 0,
      pressure: weatherData.main.pressure,
      visibility: weatherData.visibility / 1000 // Convert from meters to kilometers
    };
    
    return currentData;
  } catch (error) {
    console.error('Error fetching current weather data:', error);
    // Fallback to local data if API call fails
    return getCurrentClimateDataFromLocal();
  }
}

// Function to get historical climate data from local dataset
function getHistoricalClimateDataFromLocal(timeRange: TimeRange): ClimateData[] {
  // Filter historical data based on time range
  const now = new Date();
  const result: ClimateData[] = [];
  
  // Determine how far back to go based on timeRange
  let daysToGoBack = 7; // Default to 7 days
  
  switch(timeRange) {
    case '24h':
      daysToGoBack = 1;
      break;
    case '7d':
      daysToGoBack = 7;
      break;
    case '1m':
      daysToGoBack = 30;
      break;
    case '3m':
      daysToGoBack = 90;
      break;
    case '6m':
      daysToGoBack = 180;
      break;
    case '1y':
      daysToGoBack = 365;
      break;
    case '5y':
      daysToGoBack = 1825;
      break;
  }
  
  // Use a subset of the historical data or generate synthetic data if needed
  const dataPoints = Math.min(chennaiHistoricalData.length, 12); // Limit to 12 data points
  const interval = Math.max(1, Math.floor(daysToGoBack / dataPoints));
  
  for (let i = 0; i < dataPoints; i++) {
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - (i * interval));
    
    // Get data from historical dataset or use monthly average with some randomization
    const historicalIndex = i % chennaiHistoricalData.length;
    const baseData = chennaiHistoricalData[historicalIndex];
    
    // Add some randomization to make data look more realistic
    const randomFactor = 0.9 + Math.random() * 0.2; // Random factor between 0.9 and 1.1
    
    result.push({
      timestamp: pastDate.toISOString(),
      temperature: baseData.meanTemp * randomFactor,
      humidity: baseData.humidity * randomFactor,
      airQuality: {
        pm25: (baseData.airQuality?.pm25 || 35) * randomFactor,
        pm10: (baseData.airQuality?.pm10 || 65) * randomFactor,
        co2: 400,
        no2: (baseData.airQuality?.no2 || 20) * randomFactor,
        so2: (baseData.airQuality?.so2 || 10) * randomFactor,
        o3: (baseData.airQuality?.o3 || 30) * randomFactor
      },
      windSpeed: baseData.windSpeed * randomFactor,
      windDirection: baseData.windDirection || getRandomWindDirection(),
      precipitation: baseData.precipitation * randomFactor,
      pressure: baseData.pressure * randomFactor,
      visibility: baseData.visibility * randomFactor
    });
  }
  
  // Sort by timestamp (oldest first)
  return result.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

// Function to fetch historical weather data from OpenWeather
export async function fetchHistoricalWeather(timeRange: TimeRange): Promise<ClimateData[]> {
  try {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const historicalData: ClimateData[] = [];
    
    // Determine time points to fetch based on the time range
    const timePoints: number[] = [];
    const currentDate = new Date();
    
    switch(timeRange) {
      case '24h':
        // Get data for every 3 hours in the last 24 hours
        for (let i = 1; i <= 8; i++) {
          const pastTime = new Date(currentDate);
          pastTime.setHours(currentDate.getHours() - (i * 3));
          timePoints.push(Math.floor(pastTime.getTime() / 1000));
        }
        break;
      case '7d':
        // Get data for each day in the last 7 days
        for (let i = 1; i <= 7; i++) {
          const pastTime = new Date(currentDate);
          pastTime.setDate(currentDate.getDate() - i);
          timePoints.push(Math.floor(pastTime.getTime() / 1000));
        }
        break;
      case '1m':
        // Get data for every 3 days in the last month
        for (let i = 1; i <= 10; i++) {
          const pastTime = new Date(currentDate);
          pastTime.setDate(currentDate.getDate() - (i * 3));
          timePoints.push(Math.floor(pastTime.getTime() / 1000));
        }
        break;
      case '3m':
        // Get data for every week in the last 3 months
        for (let i = 1; i <= 12; i++) {
          const pastTime = new Date(currentDate);
          pastTime.setDate(currentDate.getDate() - (i * 7));
          timePoints.push(Math.floor(pastTime.getTime() / 1000));
        }
        break;
      case '6m':
        // Get data for every 2 weeks in the last 6 months
        for (let i = 1; i <= 12; i++) {
          const pastTime = new Date(currentDate);
          pastTime.setDate(currentDate.getDate() - (i * 14));
          timePoints.push(Math.floor(pastTime.getTime() / 1000));
        }
        break;
      case '1y':
        // Get data for every month in the last year
        for (let i = 1; i <= 12; i++) {
          const pastTime = new Date(currentDate);
          pastTime.setMonth(currentDate.getMonth() - i);
          timePoints.push(Math.floor(pastTime.getTime() / 1000));
        }
        break;
      case '5y':
        // Get data for every 6 months in the last 5 years
        for (let i = 1; i <= 10; i++) {
          const pastTime = new Date(currentDate);
          pastTime.setMonth(currentDate.getMonth() - (i * 6));
          timePoints.push(Math.floor(pastTime.getTime() / 1000));
        }
        break;
      default:
        // Default to 7 days
        for (let i = 1; i <= 7; i++) {
          const pastTime = new Date(currentDate);
          pastTime.setDate(currentDate.getDate() - i);
          timePoints.push(Math.floor(pastTime.getTime() / 1000));
        }
    }
    
    // Try to fetch data from API, but if it fails, use local data
    try {
      // Fetch data for each time point
      for (const timestamp of timePoints) {
        // OpenWeather's historical data API requires a paid subscription
        // For this implementation, we'll use the current weather API with simulated historical data
        // In a real implementation, you would use the historical API with a paid subscription
        
        // Simulate historical data based on current weather with some variations
        const currentData = await fetchCurrentWeather();
        
        // Add random variations to simulate historical data
        const randomFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
        
        const historicalRecord: ClimateData = {
          ...currentData,
          timestamp: convertTimestampToISOString(timestamp),
          temperature: currentData.temperature * randomFactor,
          humidity: Math.min(100, currentData.humidity * randomFactor),
          precipitation: currentData.precipitation * randomFactor,
          windSpeed: currentData.windSpeed * randomFactor,
          pressure: currentData.pressure * (0.95 + Math.random() * 0.1), // Random factor between 0.95 and 1.05
          airQuality: {
            ...currentData.airQuality,
            pm25: currentData.airQuality.pm25 * randomFactor,
            pm10: currentData.airQuality.pm10 * randomFactor,
            no2: currentData.airQuality.no2 * randomFactor,
            so2: currentData.airQuality.so2 * randomFactor,
            o3: currentData.airQuality.o3 * randomFactor,
          }
        };
        
        historicalData.push(historicalRecord);
      }
    } catch (error) {
      console.error('Error fetching API data for historical weather:', error);
      // If API fails, use local data
      return getHistoricalClimateDataFromLocal(timeRange);
    }
    
    // Sort by timestamp (oldest first)
    return historicalData.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error fetching historical weather data:', error);
    // Fallback to local data if API call fails
    return getHistoricalClimateDataFromLocal(timeRange);
  }
}

// Function to get prediction data from local dataset
function getPredictionDataFromLocal(timeframe: PredictionTimeFrame): PredictionData[] {
  const result: PredictionData[] = [];
  const now = new Date();
  
  // Determine how many days to predict
  let daysToPredict = 5; // Default to 5 days
  
  switch(timeframe) {
    case '24h':
      daysToPredict = 1;
      break;
    case '7d':
      daysToPredict = 5;
      break;
    case '1m':
      daysToPredict = 5; // Limited to 5 days in free tier
      break;
    case '3m':
      daysToPredict = 5; // Limited to 5 days in free tier
      break;
    case '6m':
      daysToPredict = 5; // Limited to 5 days in free tier
      break;
    case '1y':
      daysToPredict = 5; // Limited to 5 days in free tier
      break;
  }
  
  // Generate prediction data for each day
  for (let i = 0; i < daysToPredict; i++) {
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + i);
    const monthIndex = futureDate.getMonth();
    
    // Use monthly average data with some randomization
    const monthData = chennaiMonthlyAverages[monthIndex];
    const randomFactor = 0.9 + Math.random() * 0.2; // Random factor between 0.9 and 1.1
    
    // Calculate AQI index and category
    const aqiIndex = Math.round((monthData.airQuality.pm25 + monthData.airQuality.pm10) / 2);
    let aqiCategory = 'Good';
    if (aqiIndex > 150) aqiCategory = 'Unhealthy';
    else if (aqiIndex > 100) aqiCategory = 'Unhealthy for Sensitive Groups';
    else if (aqiIndex > 50) aqiCategory = 'Moderate';
    
    // Generate weather condition
    const weatherConditions = [
      { main: 'Clear', description: 'clear sky', icon: '01d' },
      { main: 'Clouds', description: 'scattered clouds', icon: '03d' },
      { main: 'Rain', description: 'light rain', icon: '10d' }
    ];
    const weatherCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    result.push({
      date: futureDate.toISOString().split('T')[0],
      predictions: {
        temperature: {
          min: Math.round((monthData.minTemp - 2 + Math.random() * 4) * 10) / 10,
          max: Math.round((monthData.maxTemp - 2 + Math.random() * 4) * 10) / 10,
          avg: Math.round(monthData.meanTemp * randomFactor * 10) / 10
        },
        precipitation: {
          probability: Math.round(Math.random() * 100),
          amount: Math.round((monthData.precipitation / 30) * randomFactor * 10) / 10
        },
        airQuality: {
          index: aqiIndex,
          category: aqiCategory
        },
        humidity: Math.round(monthData.humidity * randomFactor),
        weatherCondition: weatherCondition
      }
    });
  }
  
  return result;
}

// Function to fetch weather forecast data from OpenWeather
export async function fetchWeatherForecast(timeframe: PredictionTimeFrame): Promise<PredictionData[]> {
  try {
    // Fetch 5-day forecast data (max available in free tier)
    const forecastUrl = buildOpenWeatherUrl(openWeatherEndpoints.forecast);
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) {
      console.warn(`Failed to fetch forecast: ${forecastResponse.statusText}. Using local data instead.`);
      return getPredictionDataFromLocal(timeframe);
    }
    const forecastData: OpenWeatherForecastResponse = await forecastResponse.json();
    
    // Fetch air pollution forecast
    const airPollutionUrl = buildOpenWeatherUrl(openWeatherEndpoints.airPollution, { start: Math.floor(Date.now() / 1000), end: Math.floor(Date.now() / 1000) + (5 * 24 * 60 * 60) });
    const airPollutionResponse = await fetch(airPollutionUrl);
    if (!airPollutionResponse.ok) {
      console.warn(`Failed to fetch air pollution forecast: ${airPollutionResponse.statusText}. Using local data instead.`);
      return getPredictionDataFromLocal(timeframe);
    }
    const airPollutionData: OpenWeatherAirPollutionResponse = await airPollutionResponse.json();
    
    // Process forecast data
    const dailyForecasts: Map<string, {
      temps: number[];
      minTemp: number;
      maxTemp: number;
      humidity: number[];
      precipitation: number;
      precipProbability: number;
      date: string;
      weatherCondition?: {
        main: string;
        description: string;
        icon: string;
      };
    }> = new Map();
    
    // Group forecast data by day
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, {
          temps: [],
          minTemp: item.main.temp_min,
          maxTemp: item.main.temp_max,
          humidity: [],
          precipitation: 0,
          precipProbability: 0,
          date,
          // Store weather condition information
          weatherCondition: item.weather[0] ? {
            main: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon
          } : undefined
        });
      }
      
      const dayData = dailyForecasts.get(date)!;
      dayData.temps.push(item.main.temp);
      dayData.minTemp = Math.min(dayData.minTemp, item.main.temp_min);
      dayData.maxTemp = Math.max(dayData.maxTemp, item.main.temp_max);
      dayData.humidity.push(item.main.humidity);
      dayData.precipitation += item.rain?.['3h'] || 0;
      dayData.precipProbability = Math.max(dayData.precipProbability, item.pop * 100);
      
      // Update weather condition with the most significant one for the day
      // Prioritize extreme weather conditions (thunderstorm, rain, snow) over clear/clouds
      if (item.weather[0]) {
        const currentMain = item.weather[0].main.toLowerCase();
        const currentDesc = item.weather[0].description;
        const currentIcon = item.weather[0].icon;
        
        const existingMain = dayData.weatherCondition?.main.toLowerCase();
        
        // Priority order: Thunderstorm > Snow > Rain > Drizzle > Atmosphere > Clouds > Clear
        const weatherPriority = {
          'thunderstorm': 7,
          'snow': 6,
          'rain': 5,
          'drizzle': 4,
          'atmosphere': 3, // fog, mist, etc.
          'clouds': 2,
          'clear': 1
        };
        
        const currentPriority = weatherPriority[currentMain] || 0;
        const existingPriority = existingMain ? (weatherPriority[existingMain] || 0) : 0;
        
        if (currentPriority > existingPriority) {
          dayData.weatherCondition = {
            main: item.weather[0].main,
            description: currentDesc,
            icon: currentIcon
          };
        }
      }
    });
    
    // Convert to PredictionData array
    const predictions: PredictionData[] = Array.from(dailyForecasts.values()).map(day => {
      // Calculate average temperature
      const avgTemp = day.temps.reduce((sum, temp) => sum + temp, 0) / day.temps.length;
      
      // Calculate average humidity
      const avgHumidity = day.humidity.reduce((sum, hum) => sum + hum, 0) / day.humidity.length;
      
      // Find matching air quality data (using the first entry of the day as an approximation)
      const dayStart = new Date(day.date + 'T00:00:00Z').getTime() / 1000;
      const dayEnd = new Date(day.date + 'T23:59:59Z').getTime() / 1000;
      
      const dayAirQuality = airPollutionData.list.find(item => 
        item.dt >= dayStart && item.dt <= dayEnd
      );
      
      // Calculate AQI index and category
      let aqiIndex = 0;
      let aqiCategory = 'Good';
      
      if (dayAirQuality) {
        // Use PM2.5 and PM10 for AQI calculation (simplified)
        aqiIndex = Math.round((dayAirQuality.components.pm2_5 + dayAirQuality.components.pm10) / 2);
        
        // Determine AQI category
        if (aqiIndex > 150) aqiCategory = 'Unhealthy';
        else if (aqiIndex > 100) aqiCategory = 'Unhealthy for Sensitive Groups';
        else if (aqiIndex > 50) aqiCategory = 'Moderate';
      }
      
      return {
        date: day.date,
        predictions: {
          temperature: {
            min: Math.round(day.minTemp * 10) / 10,
            max: Math.round(day.maxTemp * 10) / 10,
            avg: Math.round(avgTemp * 10) / 10
          },
          precipitation: {
            probability: Math.round(day.precipProbability),
            amount: Math.round(day.precipitation * 10) / 10
          },
          airQuality: {
            index: aqiIndex,
            category: aqiCategory
          },
          humidity: Math.round(avgHumidity),
          weatherCondition: day.weatherCondition
        }
      };
    });
    
    // Limit the number of days based on the requested timeframe
    const daysToInclude = timeframe === '24h' ? 1 :
                         timeframe === '7d' ? 5 : // Limited by free API to 5 days
                         5; // Default to 5 days (max available in free tier)
    
    return predictions.slice(0, daysToInclude);
  } catch (error) {
    console.error('Error fetching weather forecast data:', error);
    // Fallback to local data if API call fails
    return getPredictionDataFromLocal(timeframe);
  }
}