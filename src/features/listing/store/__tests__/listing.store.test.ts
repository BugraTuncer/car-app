import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import listingModule, { type ListingState } from '../index'
import type { CarListing } from '../../types'

vi.mock('../../services/car.service', () => ({
  fetchListings: vi.fn()
}))

import { fetchListings } from '../../services/car.service'

const mockCar: CarListing = {
  id: 1,
  title: 'Test Araç',
  location: { cityName: 'İstanbul', townName: 'Kadıköy' },
  category: { id: 1, name: 'Otomobil' },
  modelName: 'Civic',
  price: 500000,
  priceFormatted: '500.000 TL',
  date: '2024-01-01',
  dateFormatted: '01.01.2024',
  photo: 'https://cdn.example.com/{0}/photo.jpg',
  properties: [{ name: 'year', value: '2020' }]
}

function createTestStore() {
  return createStore<{ listing: ListingState }>({
    modules: { listing: { ...listingModule } }
  })
}

describe('Listing Store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("başlangıç state'i doğru olmalı", () => {
    const store = createTestStore()
    const state = store.state.listing

    expect(state.items).toEqual([])
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.hasMore).toBe(true)
  })

  it("fetchListings başarılı olduğunda item'ları set etmeli", async () => {
    vi.mocked(fetchListings).mockResolvedValue([mockCar])
    const store = createTestStore()

    await store.dispatch('listing/fetchListings', { take: 20 })

    expect(store.state.listing.items).toEqual([mockCar])
    expect(store.state.listing.loading).toBe(false)
    expect(store.state.listing.error).toBeNull()
  })

  it('fetchListings hata olduğunda error mesajı set etmeli', async () => {
    vi.mocked(fetchListings).mockRejectedValue(
      new Error('Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.')
    )
    const store = createTestStore()

    await store.dispatch('listing/fetchListings', { take: 20 })

    expect(store.state.listing.items).toEqual([])
    expect(store.state.listing.loading).toBe(false)
    expect(store.state.listing.error).toBe(
      'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.'
    )
  })

  it("fetchMoreListings mevcut item'lara ekleme yapmalı", async () => {
    const secondCar = { ...mockCar, id: 2, title: 'İkinci Araç' }
    vi.mocked(fetchListings).mockResolvedValueOnce([mockCar]).mockResolvedValueOnce([secondCar])

    const store = createTestStore()

    await store.dispatch('listing/fetchListings', { take: 20 })
    await store.dispatch('listing/fetchMoreListings', { take: 20, skip: 20 })

    expect(store?.state?.listing?.items?.length).toBe(2)
    expect(store?.state?.listing?.items?.[0]?.title).toBe('Test Araç')
    expect(store?.state?.listing?.items?.[1]?.title).toBe('İkinci Araç')
  })

  it('cache süresi içinde tekrar fetch yapmamalı', async () => {
    vi.mocked(fetchListings).mockResolvedValue([mockCar])
    const store = createTestStore()
    const params = { take: 20 }

    await store.dispatch('listing/fetchListings', params)
    await store.dispatch('listing/fetchListings', params)

    expect(fetchListings).toHaveBeenCalledTimes(1)
  })
})
