import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  withCredentials: true,
});

request.interceptors.request.use(
  (config) => config,
  (error: AxiosError) => Promise.reject(error),
);

request.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error),
);

export async function requestData<T>(config: AxiosRequestConfig) {
  const response = await request.request<{ code: number; message: string; data: T }>(config);
  return response.data.data;
}

export default request;
