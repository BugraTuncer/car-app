export function onImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = 'https://arbimg1.mncdn.com/ilanfotograflari/noImage/01/01/1/noimage5_240x180.jpg'
}
