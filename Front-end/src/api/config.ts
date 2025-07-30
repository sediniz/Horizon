import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7202/api';

export const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const apiRequest = async (
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: AxiosRequestConfig = {
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    ...options,
    url,
    method: options.method || 'GET',
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error('API Request Error:', error);
    if (error.response) {
      throw new Error(error.response.data?.message || `HTTP error! status: ${error.response.status}`);
    }
    throw error;
  }
};
