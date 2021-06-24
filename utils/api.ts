import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'

const axosConfig: AxiosRequestConfig = {
  baseURL: 'https://www.asos.com/',
  timeout: Number(process.env.NODE_APP_TIMEOUT_LIMIT) || 15000,
  headers: {}
}

export const axos: AxiosInstance = axios.create({
  ...axosConfig
})

export default () => {}
