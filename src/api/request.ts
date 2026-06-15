import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'

const request: AxiosInstance = axios.create({
  // 优先读取环境变量，未配置时默认走本地 /api 代理。
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  // 如果后面接入 cookie/session 登录，这个配置可以直接复用。
  withCredentials: true,
})

request.interceptors.request.use(
  // 这里预留给 token、traceId、统一请求头等逻辑。
  (config) => config,
  (error: AxiosError) => Promise.reject(error),
)

request.interceptors.response.use(
  // 这里预留给统一解包、401 处理、全局错误提示等逻辑。
  (response) => response,
  (error: AxiosError) => Promise.reject(error),
)

export default request
