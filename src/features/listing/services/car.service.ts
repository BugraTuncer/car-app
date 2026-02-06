import axios from 'axios'
import type { CarListing, ListingParams } from '../types'

const httpClient = axios.create({
  baseURL: '/api/v1'
})

export async function fetchListings(params: ListingParams): Promise<CarListing[]> {
  const { data } = await httpClient.get<CarListing[]>('/listing', { params })
  return data
}

export function resolvePhotoUrl(photoTemplate: string, resolution: string = '800x600'): string {
  return photoTemplate.replace('{0}', resolution)
}
