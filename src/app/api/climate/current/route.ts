import { NextResponse } from 'next/server';
import { ClimateData } from '@/lib/store';
import { fetchCurrentWeather } from '@/lib/openweather-service';

export async function GET() {
  try {
    // Get current climate data from OpenWeather API
    const currentData = await fetchCurrentWeather();
    
    return NextResponse.json(currentData);
  } catch (error) {
    console.error('Error fetching current climate data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch current climate data' },
      { status: 500 }
    );
  }
}
