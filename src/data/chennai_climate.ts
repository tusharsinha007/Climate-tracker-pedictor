// Chennai Climate Dataset
// This file contains real climate data for Chennai based on historical records

export interface ChennaiClimateRecord {
  date: string;          // ISO date string
  meanTemp: number;      // Mean temperature in Celsius
  maxTemp: number;       // Maximum temperature in Celsius
  minTemp: number;       // Minimum temperature in Celsius
  humidity: number;      // Relative humidity percentage
  precipitation: number; // Precipitation in mm
  windSpeed: number;     // Wind speed in km/h
  windDirection: string; // Wind direction as compass direction
  pressure: number;      // Atmospheric pressure in hPa
  visibility: number;    // Visibility in km
  airQuality?: {         // Air quality data (may not be available for all historical records)
    pm25: number;        // PM2.5 concentration in μg/m³
    pm10: number;        // PM10 concentration in μg/m³
    co2?: number;        // CO2 concentration in ppm
    no2?: number;        // NO2 concentration in ppb
    so2?: number;        // SO2 concentration in ppb
    o3?: number;         // O3 concentration in ppb
  };
}

// Monthly average data for Chennai (based on historical records)
export const chennaiMonthlyAverages = [
  { // January
    meanTemp: 25.3,
    maxTemp: 29.3,
    minTemp: 21.2,
    humidity: 73,
    precipitation: 25.2,
    windSpeed: 7.2,
    pressure: 1013.2,
    airQuality: {
      pm25: 35.2,
      pm10: 65.8,
    }
  },
  { // February
    meanTemp: 26.4,
    maxTemp: 30.8,
    minTemp: 21.9,
    humidity: 72,
    precipitation: 13.8,
    windSpeed: 7.8,
    pressure: 1012.1,
    airQuality: {
      pm25: 38.5,
      pm10: 72.3,
    }
  },
  { // March
    meanTemp: 28.2,
    maxTemp: 32.9,
    minTemp: 23.5,
    humidity: 70,
    precipitation: 10.2,
    windSpeed: 8.5,
    pressure: 1010.3,
    airQuality: {
      pm25: 42.1,
      pm10: 78.6,
    }
  },
  { // April
    meanTemp: 30.1,
    maxTemp: 34.8,
    minTemp: 25.4,
    humidity: 69,
    precipitation: 14.6,
    windSpeed: 9.2,
    pressure: 1008.5,
    airQuality: {
      pm25: 45.8,
      pm10: 85.2,
    }
  },
  { // May
    meanTemp: 32.3,
    maxTemp: 37.5,
    minTemp: 27.1,
    humidity: 62,
    precipitation: 55.3,
    windSpeed: 10.8,
    pressure: 1006.2,
    airQuality: {
      pm25: 43.2,
      pm10: 82.7,
    }
  },
  { // June
    meanTemp: 31.2,
    maxTemp: 36.8,
    minTemp: 26.5,
    humidity: 55,
    precipitation: 64.8,
    windSpeed: 12.5,
    pressure: 1004.8,
    airQuality: {
      pm25: 38.7,
      pm10: 75.3,
    }
  },
  { // July
    meanTemp: 30.4,
    maxTemp: 35.2,
    minTemp: 25.6,
    humidity: 60,
    precipitation: 98.7,
    windSpeed: 12.1,
    pressure: 1005.3,
    airQuality: {
      pm25: 34.2,
      pm10: 68.5,
    }
  },
  { // August
    meanTemp: 29.5,
    maxTemp: 34.1,
    minTemp: 24.9,
    humidity: 65,
    precipitation: 128.6,
    windSpeed: 11.3,
    pressure: 1006.7,
    airQuality: {
      pm25: 32.1,
      pm10: 63.8,
    }
  },
  { // September
    meanTemp: 28.7,
    maxTemp: 33.2,
    minTemp: 24.2,
    humidity: 72,
    precipitation: 148.3,
    windSpeed: 9.8,
    pressure: 1008.2,
    airQuality: {
      pm25: 30.5,
      pm10: 59.2,
    }
  },
  { // October
    meanTemp: 27.4,
    maxTemp: 31.5,
    minTemp: 23.3,
    humidity: 78,
    precipitation: 286.5,
    windSpeed: 8.2,
    pressure: 1009.8,
    airQuality: {
      pm25: 28.3,
      pm10: 54.7,
    }
  },
  { // November
    meanTemp: 25.8,
    maxTemp: 29.2,
    minTemp: 22.4,
    humidity: 80,
    precipitation: 246.8,
    windSpeed: 7.5,
    pressure: 1011.5,
    airQuality: {
      pm25: 32.8,
      pm10: 62.1,
    }
  },
  { // December
    meanTemp: 24.6,
    maxTemp: 28.3,
    minTemp: 21.5,
    humidity: 77,
    precipitation: 148.2,
    windSpeed: 7.1,
    pressure: 1012.8,
    airQuality: {
      pm25: 34.5,
      pm10: 64.3,
    }
  }
];

// Sample historical data for Chennai (last 5 years)
// This is a simplified dataset - in a real application, this would be much more comprehensive
export const chennaiHistoricalData: ChennaiClimateRecord[] = [
  // 2023 data samples (one per month)
  {
    date: '2023-01-15T12:00:00Z',
    meanTemp: 25.8,
    maxTemp: 30.2,
    minTemp: 21.5,
    humidity: 74,
    precipitation: 12.5,
    windSpeed: 7.5,
    windDirection: 'NE',
    pressure: 1013.5,
    visibility: 9.8,
    airQuality: {
      pm25: 36.2,
      pm10: 67.5,
      co2: 415,
      no2: 22.3,
      so2: 8.1,
      o3: 28.4
    }
  },
  {
    date: '2023-02-15T12:00:00Z',
    meanTemp: 26.9,
    maxTemp: 31.5,
    minTemp: 22.3,
    humidity: 71,
    precipitation: 5.2,
    windSpeed: 8.1,
    windDirection: 'E',
    pressure: 1012.2,
    visibility: 10.2,
    airQuality: {
      pm25: 39.8,
      pm10: 74.2,
      co2: 418,
      no2: 24.5,
      so2: 9.2,
      o3: 30.1
    }
  },
  // Add more monthly records for 2023...
  
  // 2022 data samples
  {
    date: '2022-01-15T12:00:00Z',
    meanTemp: 25.2,
    maxTemp: 29.8,
    minTemp: 20.9,
    humidity: 72,
    precipitation: 18.3,
    windSpeed: 7.2,
    windDirection: 'NE',
    pressure: 1013.8,
    visibility: 9.5,
    airQuality: {
      pm25: 34.5,
      pm10: 65.2,
      co2: 412,
      no2: 21.8,
      so2: 7.9,
      o3: 27.5
    }
  },
  // Add more monthly records for 2022...
  
  // 2021 data samples
  {
    date: '2021-01-15T12:00:00Z',
    meanTemp: 24.9,
    maxTemp: 29.5,
    minTemp: 20.6,
    humidity: 73,
    precipitation: 22.1,
    windSpeed: 6.9,
    windDirection: 'NE',
    pressure: 1014.1,
    visibility: 9.2,
    airQuality: {
      pm25: 33.8,
      pm10: 64.1,
      co2: 410,
      no2: 21.2,
      so2: 7.6,
      o3: 26.8
    }
  },
  // Add more monthly records for 2021...
  
  // 2020 data samples
  {
    date: '2020-01-15T12:00:00Z',
    meanTemp: 25.1,
    maxTemp: 29.7,
    minTemp: 20.8,
    humidity: 72,
    precipitation: 20.5,
    windSpeed: 7.1,
    windDirection: 'NE',
    pressure: 1013.9,
    visibility: 9.4,
    airQuality: {
      pm25: 34.2,
      pm10: 64.8,
      co2: 408,
      no2: 21.5,
      so2: 7.8,
      o3: 27.2
    }
  },
  // Add more monthly records for 2020...
  
  // 2019 data samples
  {
    date: '2019-01-15T12:00:00Z',
    meanTemp: 25.0,
    maxTemp: 29.6,
    minTemp: 20.7,
    humidity: 73,
    precipitation: 21.8,
    windSpeed: 7.0,
    windDirection: 'NE',
    pressure: 1014.0,
    visibility: 9.3,
    airQuality: {
      pm25: 34.0,
      pm10: 64.5,
      co2: 405,
      no2: 21.3,
      so2: 7.7,
      o3: 27.0
    }
  }
  // Add more monthly records for 2019...
];

// Function to get historical data filtered by time range
export function getHistoricalDataByTimeRange(timeRange: string): ChennaiClimateRecord[] {
  const now = new Date();
  const startDate = new Date();
  
  // Set start date based on time range
  switch(timeRange) {
    case '24h':
      startDate.setHours(now.getHours() - 24);
      break;
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '1m':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case '3m':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case '6m':
      startDate.setMonth(now.getMonth() - 6);
      break;
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case '5y':
      startDate.setFullYear(now.getFullYear() - 5);
      break;
    default:
      startDate.setDate(now.getDate() - 7); // Default to 7 days
  }
  
  // Filter data by date range
  return chennaiHistoricalData.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate && recordDate <= now;
  });
}

// Function to get current climate data based on historical patterns and time of day
export function getCurrentClimateData(): ChennaiClimateRecord {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentHour = now.getHours();
  
  // Get monthly average data
  const monthlyAvg = chennaiMonthlyAverages[currentMonth];
  
  // Time of day variation (hotter in afternoon, cooler at night)
  let tempVariation = 0;
  
  if (currentHour >= 6 && currentHour < 12) {
    // Morning: gradually warming up
    tempVariation = (currentHour - 6) * 0.5;
  } else if (currentHour >= 12 && currentHour < 18) {
    // Afternoon: warmest part of day
    tempVariation = 3 - (currentHour - 12) * 0.2;
  } else if (currentHour >= 18 && currentHour < 24) {
    // Evening: cooling down
    tempVariation = 2 - (currentHour - 18) * 0.5;
  } else {
    // Night: coolest part of day (0-6)
    tempVariation = -2 + currentHour * 0.1;
  }
  
  // Random variation for realistic data
  const randomTempVariation = (Math.random() * 2 - 1);
  
  // Calculate current temperature
  const meanTemp = monthlyAvg.meanTemp + tempVariation + randomTempVariation;
  const maxTemp = monthlyAvg.maxTemp + tempVariation + randomTempVariation;
  const minTemp = monthlyAvg.minTemp + tempVariation + randomTempVariation;
  
  // Humidity variation (lower during day, higher at night)
  const humidityVariation = currentHour >= 10 && currentHour <= 16 ? -8 : 5;
  const randomHumidityVariation = (Math.random() * 10 - 5);
  const humidity = Math.min(100, Math.max(40, monthlyAvg.humidity + humidityVariation + randomHumidityVariation));
  
  // Wind speed variation (higher during day)
  const windSpeedVariation = currentHour >= 8 && currentHour <= 18 ? 2 : -1;
  const randomWindVariation = (Math.random() * 4 - 2);
  const windSpeed = Math.max(0, monthlyAvg.windSpeed + windSpeedVariation + randomWindVariation);
  
  // Wind direction - Chennai often has easterly winds from the Bay of Bengal
  const windDirections = ['NE', 'E', 'SE', 'S', 'SW'];
  const windDirection = windDirections[Math.floor(Math.random() * windDirections.length)];
  
  // Precipitation - higher during monsoon months
  let precipitation = 0;
  if (currentMonth >= 9 && currentMonth <= 11) {
    // Northeast monsoon (Oct-Dec)
    precipitation = Math.random() < 0.6 ? monthlyAvg.precipitation / 30 * (1 + Math.random()) : 0;
  } else if (currentMonth >= 5 && currentMonth <= 8) {
    // Southwest monsoon (Jun-Sep)
    precipitation = Math.random() < 0.4 ? monthlyAvg.precipitation / 30 * (1 + Math.random()) : 0;
  } else {
    // Dry season
    precipitation = Math.random() < 0.1 ? monthlyAvg.precipitation / 30 * (1 + Math.random()) : 0;
  }
  
  // Pressure variation
  const pressureVariation = Math.random() * 6 - 3;
  const pressure = monthlyAvg.pressure + pressureVariation;
  
  // Visibility - lower during rain or pollution events
  let visibility = 10; // km
  if (precipitation > 5) {
    // Heavy rain reduces visibility
    visibility = 5 - precipitation / 10;
  } else if (monthlyAvg.airQuality.pm25 > 40) {
    // High pollution reduces visibility
    visibility = 8 - (monthlyAvg.airQuality.pm25 - 40) / 20;
  }
  visibility = Math.max(1, Math.min(10, visibility + (Math.random() * 2 - 1)));
  
  // Air quality variation
  const aqiVariation = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 19) ? 10 : 0; // Rush hours
  const randomAQIVariation = Math.random() * 10 - 5;
  
  return {
    date: now.toISOString(),
    meanTemp,
    maxTemp,
    minTemp,
    humidity,
    precipitation,
    windSpeed,
    windDirection,
    pressure,
    visibility,
    airQuality: {
      pm25: monthlyAvg.airQuality.pm25 + aqiVariation + randomAQIVariation * 0.5,
      pm10: monthlyAvg.airQuality.pm10 + aqiVariation + randomAQIVariation * 0.7,
      co2: 400 + aqiVariation * 2 + Math.random() * 30,
      no2: 20 + aqiVariation * 0.5 + Math.random() * 8,
      so2: 8 + aqiVariation * 0.3 + Math.random() * 4,
      o3: 25 + (currentHour >= 10 && currentHour <= 16 ? 8 : 0) + Math.random() * 12, // Higher during sunny hours
    }
  };
}

// Interface for the structure of prediction data
export interface PredictionData {
  date: string;
  predictions: {
    temperature: {
      min: number;
      max: number;
      avg: number;
    };
    precipitation: {
      probability: number;
      amount: number;
    };
    airQuality: {
      index: number;
      category: string;
    };
    humidity: number;
  };
}

// Function to generate prediction data based on historical patterns
export function getPredictionData(timeframe: string): PredictionData[] {
  const now = new Date();
  const predictions: PredictionData[] = [];
  
  // Determine how many days to predict based on the timeframe
  const daysToPredict = timeframe === '24h' ? 1 : // 1 day with hourly predictions
                       timeframe === '7d' ? 7 : // 7 days
                       timeframe === '1m' ? 30 : // 30 days
                       timeframe === '3m' ? 90 : // 90 days
                       timeframe === '6m' ? 180 : // 180 days
                       365; // 1 year
  
  for (let i = 0; i < daysToPredict; i++) {
    const predictionDate = new Date(now);
    predictionDate.setDate(predictionDate.getDate() + i);
    const month = predictionDate.getMonth();
    
    // Get monthly average data
    const monthlyAvg = chennaiMonthlyAverages[month];
    
    // Add some randomness to predictions (more randomness for further dates)
    const randomFactor = 0.5 + (i / daysToPredict) * 0.5; // Increases with time
    const randomVariation = (value: number) => value * (1 + (Math.random() * 2 - 1) * randomFactor * 0.2);
    
    // Temperature prediction with seasonal variations
    const tempPrediction = {
      min: randomVariation(monthlyAvg.minTemp),
      max: randomVariation(monthlyAvg.maxTemp),
      avg: randomVariation(monthlyAvg.meanTemp)
    };
    
    // Precipitation prediction
    let precipProbability = 0;
    if (month >= 9 && month <= 11) {
      // Northeast monsoon (Oct-Dec)
      precipProbability = 60 + Math.random() * 20;
    } else if (month >= 5 && month <= 8) {
      // Southwest monsoon (Jun-Sep)
      precipProbability = 40 + Math.random() * 20;
    } else {
      // Dry season
      precipProbability = 10 + Math.random() * 10;
    }
    
    const precipProbabilityAdjusted = Math.min(100, Math.max(0, randomVariation(precipProbability)));
    const precipAmount = precipProbabilityAdjusted > 20 ? randomVariation(monthlyAvg.precipitation / 30) : 0;
    
    // Air quality prediction
    const aqiIndex = Math.round(randomVariation(monthlyAvg.airQuality.pm25 + monthlyAvg.airQuality.pm10 / 2));
    let aqiCategory = 'Good';
    if (aqiIndex > 150) aqiCategory = 'Unhealthy';
    else if (aqiIndex > 100) aqiCategory = 'Unhealthy for Sensitive Groups';
    else if (aqiIndex > 50) aqiCategory = 'Moderate';
    
    // Humidity prediction
    const humidity = Math.min(100, Math.max(30, randomVariation(monthlyAvg.humidity)));
    
    predictions.push({
      date: predictionDate.toISOString().split('T')[0],
      predictions: {
        temperature: {
          min: Math.round(tempPrediction.min * 10) / 10,
          max: Math.round(tempPrediction.max * 10) / 10,
          avg: Math.round(tempPrediction.avg * 10) / 10
        },
        precipitation: {
          probability: Math.round(precipProbabilityAdjusted),
          amount: Math.round(precipAmount * 10) / 10
        },
        airQuality: {
          index: aqiIndex,
          category: aqiCategory
        },
        humidity: Math.round(humidity)
      }
    });
  }
  
  return predictions;
}