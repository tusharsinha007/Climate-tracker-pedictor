import axios from 'axios';
import { ClimateData, PredictionData, TimeRange, DataParameter, PredictionTimeFrame } from './store';

// Base API URL - would be replaced with real API in production
const API_BASE_URL = '/api';

// API endpoints
const ENDPOINTS = {
  CURRENT_DATA: `${API_BASE_URL}/climate/current`,
  HISTORICAL_DATA: `${API_BASE_URL}/climate/historical`,
  PREDICTION_DATA: `${API_BASE_URL}/climate/prediction`,
  ALERTS: `${API_BASE_URL}/alerts`,
  USER_PREFERENCES: `${API_BASE_URL}/user/preferences`,
};

// User preferences interface
export interface UserPreferences {
  defaultLocation: string;
  favoriteParameters: DataParameter[];
  notificationEnabled: boolean;
  darkMode: boolean;
  emailAlerts?: boolean;
  alertThresholds?: {
    temperature?: { min?: number; max?: number };
    airQuality?: { index?: number };
    precipitation?: { amount?: number };
  };
}

// API service
export const apiService = {
  // Get current climate data
  async getCurrentData(): Promise<ClimateData> {
    try {
      const response = await axios.get(ENDPOINTS.CURRENT_DATA);
      return response.data;
    } catch (error) {
      console.error('Error fetching current data:', error);
      throw error;
    }
  },

  // Get historical climate data
  async getHistoricalData(timeRange: TimeRange, parameter: DataParameter): Promise<ClimateData[]> {
    try {
      const response = await axios.get(ENDPOINTS.HISTORICAL_DATA, {
        params: { timeRange, parameter },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  },

  // Get prediction data
  async getPredictionData(timeframe: PredictionTimeFrame): Promise<PredictionData[]> {
    try {
      const response = await axios.get(ENDPOINTS.PREDICTION_DATA, {
        params: { timeframe },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching prediction data:', error);
      throw error;
    }
  },

  // Subscribe to alerts
  async subscribeToAlerts(email: string, alertTypes: string[]): Promise<{ success: boolean }> {
    try {
      const response = await axios.post(ENDPOINTS.ALERTS + '/subscribe', {
        email,
        alertTypes,
      });
      return response.data;
    } catch (error) {
      console.error('Error subscribing to alerts:', error);
      throw error;
    }
  },

  // Unsubscribe from alerts
  async unsubscribeFromAlerts(email: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.post(ENDPOINTS.ALERTS + '/unsubscribe', {
        email,
      });
      return response.data;
    } catch (error) {
      console.error('Error unsubscribing from alerts:', error);
      throw error;
    }
  },

  // Get user preferences
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const response = await axios.get(ENDPOINTS.USER_PREFERENCES, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  },

  // Update user preferences
  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<{ success: boolean }> {
    try {
      const response = await axios.put(ENDPOINTS.USER_PREFERENCES, {
        userId,
        preferences,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  },

  // Export data as CSV
  async exportDataAsCSV(timeRange: TimeRange, parameters: DataParameter[]): Promise<Blob> {
    try {
      const response = await axios.get(`${API_BASE_URL}/export/csv`, {
        params: { timeRange, parameters },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting data as CSV:', error);
      throw error;
    }
  },

  // Export data as JSON
  async exportDataAsJSON(timeRange: TimeRange, parameters: DataParameter[]): Promise<Blob> {
    try {
      const response = await axios.get(`${API_BASE_URL}/export/json`, {
        params: { timeRange, parameters },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting data as JSON:', error);
      throw error;
    }
  },
};
