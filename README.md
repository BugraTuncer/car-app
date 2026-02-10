# Car App

Vue 3 ve TypeScript ile geliştirilmiş araç ilan listeleme ve detay görüntüleme

## Teknolojiler

- **Vue 3** + **TypeScript**
- **Vuex** (state management)
- **Vue Router** (routing)
- **Vite** (build tool)
- **Axios** (HTTP client)
- **Vitest** (unit test)
- **ESLint** + **Prettier** (kod kalitesi)

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env
```

## Kullanım

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview

# Testleri çalıştır
npm run test

# Lint kontrolü
npm run lint

# Kod formatlama
npm run format
```

## Ortam Değişkenleri

| Değişken            | Açıklama     |
| ------------------- | ------------ |
| `VITE_API_BASE_URL` | API base URL |

## Proje Yapısı

```
src/
├── app/            # Global yapılandırma (router, store, ortak bileşenler)
├── features/
│   ├── listing/    # İlan listeleme (bileşenler, servis, store, tipler)
│   └── detail/     # İlan detay (fotoğraf galerisi, modal)
├── composables/    # Composition fonksiyonları (infinite scroll, mobil algılama)
├── utils/          # Yardımcı fonksiyonlar
└── assets/         # Statik dosyalar
```

## Özellikler

- Araç ilan listeleme (kart ve tablo görünümü)
- Filtreleme
- Mobil için Infinite scroll
- Fotoğraf galerisi ve tam ekran modal
- Mobil uyumlu tasarım
- Global hata yönetimi
