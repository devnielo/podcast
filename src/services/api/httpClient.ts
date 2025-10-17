import axios, { AxiosInstance, AxiosError } from 'axios'
import { handleApiError } from '@utils'

const createHttpClient = (): AxiosInstance => {
  const client = axios.create({
    timeout: 10000,
  })

  client.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      handleApiError(error, {
        endpoint: error.config?.url,
        status: error.response?.status,
      })
      return Promise.reject(error)
    }
  )

  return client
}

export const httpClient = createHttpClient()
