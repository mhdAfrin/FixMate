import type { ServiceCategory } from './user.types'

export interface Service {
  id: number
  title: string
  description: string
  category: ServiceCategory
  basePrice: number
  rating: number
  thumbnail: string
  workersAvailable: number
  estimatedDuration: string
  tags: string[]
}

export interface ServiceFilter {
  category: ServiceCategory | 'all'
  minPrice: number
  maxPrice: number
  minRating: number
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'popular'
}