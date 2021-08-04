import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'

const axosConfig: AxiosRequestConfig = {
  baseURL: `${process.env.BLOB_URL}`,
  timeout: 3000000,
  headers: {}
}

export const blob: AxiosInstance = axios.create({
  ...axosConfig
})
