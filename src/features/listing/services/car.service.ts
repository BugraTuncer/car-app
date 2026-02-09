import axios, { AxiosError } from 'axios'
import type { CarListing, CarDetail, ListingParams } from '../types'

const httpClient = axios.create({
  baseURL: '/api/v1',
  timeout: 15000
})

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(error)
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return Promise.reject(new Error('İstek zaman aşımına uğradı. Lütfen tekrar deneyin.'))
    }

    if (!error.response) {
      return Promise.reject(
        new Error('Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.')
      )
    }

    const status = error.response.status

    const statusMessages: Record<number, string> = {
      400: 'Geçersiz istek gönderildi.',
      404: 'İstenen kaynak bulunamadı.',
      429: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.',
      500: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
      503: 'Servis geçici olarak kullanılamıyor.'
    }

    const message = statusMessages[status] || `Beklenmeyen bir hata oluştu. (${status})`
    return Promise.reject(new Error(message))
  }
)

let listingController: AbortController | null = null

export async function fetchListings(params: ListingParams): Promise<CarListing[]> {
  if (listingController) {
    listingController.abort()
  }
  listingController = new AbortController()

  const { data } = await httpClient.get<CarListing[]>('/listing', {
    params,
    signal: listingController.signal
  })
  listingController = null
  return data
}

export async function fetchDetail(id: number): Promise<CarDetail> {
  const { data } = await httpClient.get<CarDetail>('/detail', { params: { id } })
  return data
}

export function resolvePhotoUrl(photoTemplate: string, resolution: string = '800x600'): string {
  return photoTemplate.replace('{0}', resolution)
}
