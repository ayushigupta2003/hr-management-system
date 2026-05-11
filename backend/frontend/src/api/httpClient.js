import axios from 'axios';
import { env } from '../config/env';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { storage } from '../utils/storage';

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const token = storage.get(STORAGE_KEYS.authToken);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const response = error.response?.data;
    const message = error.code === 'ECONNABORTED'
      ? 'The server is taking too long to respond. Please check the backend and database connection.'
      : response?.message ?? 'Something went wrong. Please try again.';

    return Promise.reject({
      message,
      errors: response?.errors ?? null,
      status: error.response?.status,
    });
  },
);
