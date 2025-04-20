import { NextResponse } from 'next/server';
import { PredictionTimeFrame } from '@/lib/store';
import { fetchWeatherForecast } from '@/lib/openweather-service';

export async function GET(request: Request) {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get('timeframe') as PredictionTimeFrame || '7d';

  try {
    // Get prediction data from OpenWeather API
    const predictionData = await fetchWeatherForecast(timeframe);
    
    return NextResponse.json(predictionData);
  } catch (error) {
    console.error('Error generating prediction data:', error);
    return NextResponse.json(
      { error: 'Failed to generate prediction data' },
      { status: 500 }
    );
  }
}
