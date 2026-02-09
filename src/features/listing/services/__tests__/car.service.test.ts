import { describe, it, expect } from 'vitest'
import { resolvePhotoUrl } from '../car.service'

describe('resolvePhotoUrl', () => {
  it('varsayılan çözünürlük ile URL oluşturur', () => {
    const template = 'https://cdn.example.com/photos/{0}/image.jpg'
    const result = resolvePhotoUrl(template)

    expect(result).toBe('https://cdn.example.com/photos/800x600/image.jpg')
  })

  it('özel çözünürlük ile URL oluşturur', () => {
    const template = 'https://cdn.example.com/photos/{0}/image.jpg'
    const result = resolvePhotoUrl(template, '1920x1080')

    expect(result).toBe('https://cdn.example.com/photos/1920x1080/image.jpg')
  })
})
