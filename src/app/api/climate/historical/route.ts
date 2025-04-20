import { NextResponse } from 'next/server';
import { TimeRange, DataParameter, ClimateData } from '@/lib/store';
import { fetchHistoricalWeather } from '@/lib/openweather-service';

export async function GET(request: Request) {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('timeRange') as TimeRange || '7d';
  const parameter = searchParams.get('parameter') as DataParameter || 'temperature';

  try {
    // Get historical data from OpenWeather API
    const historicalData = await fetchHistoricalWeather(timeRange);
    
    return NextResponse.json(historicalData);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical climate data' },
      { status: 500 }
    );
  }
}
