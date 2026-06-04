export type Locale = 'nl' | 'en'

export interface Painting {
  id: string
  title_nl: string
  title_en: string
  description_nl: string | null
  description_en: string | null
  image_url: string
  category: 'schilderij' | 'tekening'
  year: number | null
  width_cm: number | null
  height_cm: number | null
  medium_nl: string | null
  medium_en: string | null
  featured: boolean
  sort_order: number
  created_at: string
}

export interface Post {
  id: string
  title_nl: string
  title_en: string
  content_nl: string
  content_en: string
  image_url: string | null
  published_at: string
  created_at: string
}
