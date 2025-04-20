import { create } from 'zustand';

export interface ClimateData {
  timestamp: string;
  temperature: number;
  humidity: number;
  airQuality: {
    pm25: number;
    pm10: number;
    co2: number;
    no2: number;
    so2: number;
    o3: number;
  };
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  pressure: number;
  visibility: number;
}

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
    weatherCondition?: {
      main: string;
      description: string;
      icon: string;
    };
  };
}

export type TimeRange = '24h' | '7d' | '1m' | '3m' | '6m' | '1y' | '5y';
export type DataParameter = 'temperature' | 'humidity' | 'airQuality' | 'windSpeed' | 'precipitation';
export type PredictionTimeFrame = '24h' | '7d' | '1m' | '3m' | '6m' | '1y';

interface ClimateStore {
  // Current data
  currentData: ClimateData | null;
  isLoadingCurrent: boolean;
  fetchCurrentData: () => Promise<void>;

  // Historical data
  historicalData: ClimateData[];
  isLoadingHistorical: boolean;
  selectedTimeRange: TimeRange;
  selectedParameter: DataParameter;
  setSelectedTimeRange: (range: TimeRange) => void;
  setSelectedParameter: (param: DataParameter) => void;
  fetchHistoricalData: (timeRange: TimeRange, parameter: DataParameter) => Promise<void>;

  // Prediction data
  predictionData: PredictionData[];
  isLoadingPrediction: boolean;
  selectedPredictionTimeframe: PredictionTimeFrame;
  setSelectedPredictionTimeframe: (timeframe: PredictionTimeFrame) => void;
  fetchPredictionData: (timeframe: PredictionTimeFrame) => Promise<void>;

  // User preferences
  userPreferences: {
    defaultLocation: string;
    favoriteParameters: DataParameter[];
    notificationEnabled: boolean;
    darkMode: boolean;
  };
  setUserPreferences: (preferences: Partial<ClimateStore['userPreferences']>) => void;
}

export const useClimateStore = create<ClimateStore>((set, get) => ({
  // Current data
  currentData: null,
  isLoadingCurrent: false,
  async fetchCurrentData() {
    set({ isLoadingCurrent: true });
    try {
      // Fetch current climate data from API
      const response = await fetch('/api/climate/current');
      if (!response.ok) {
        throw new Error('Failed to fetch current climate data');
      }
      const data: ClimateData = await response.json();
      set({ currentData: data, isLoadingCurrent: false });
    } catch (error) {
      console.error('Error fetching current data:', error);
      set({ isLoadingCurrent: false });
    }
  },

  // Historical data
  historicalData: [],
  isLoadingHistorical: false,
  selectedTimeRange: '7d',
  selectedParameter: 'temperature',
  setSelectedTimeRange: (range) => set({ selectedTimeRange: range }),
  setSelectedParameter: (param) => set({ selectedParameter: param }),
  async fetchHistoricalData(timeRange, parameter) {
    set({ isLoadingHistorical: true, selectedTimeRange: timeRange, selectedParameter: parameter });

    try {
      // Fetch historical climate data from API
      const response = await fetch(`/api/climate/historical?timeRange=${timeRange}&parameter=${parameter}`);
      if (!response.ok) {
        throw new Error('Failed to fetch historical climate data');
      }
      const data: ClimateData[] = await response.json();
      set({ historicalData: data, isLoadingHistorical: false });
    } catch (error) {
      console.error('Error fetching historical data:', error);
      set({ isLoadingHistorical: false });
    }
  },

  // Prediction data
  predictionData: [],
  isLoadingPrediction: false,
  selectedPredictionTimeframe: '7d',
  setSelectedPredictionTimeframe: (timeframe) => set({ selectedPredictionTimeframe: timeframe }),
  async fetchPredictionData(timeframe) {
    set({ isLoadingPrediction: true, selectedPredictionTimeframe: timeframe });

    try {
      // Fetch prediction climate data from API
      const response = await fetch(`/api/climate/prediction?timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prediction climate data');
      }
      const data: PredictionData[] = await response.json();
      set({ predictionData: data, isLoadingPrediction: false });
    } catch (error) {
      console.error('Error fetching prediction data:', error);
      set({ isLoadingPrediction: false });
    }
  },

  // User preferences
  userPreferences: {
    defaultLocation: 'Chennai',
    favoriteParameters: ['temperature', 'airQuality'],
    notificationEnabled: true,
    darkMode: false,
  },
  setUserPreferences: (preferences) => {
    set((state) => ({
      userPreferences: { ...state.userPreferences, ...preferences },
    }));
  },
}));
