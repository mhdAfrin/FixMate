import { apiService } from './api.service'
import type { DummyJsonProduct, DummyJsonProductsResponse, ApiResult } from '@/types/api.types'
import type { Service } from '@/types/service.types'
import type { ServiceCategory } from '@/types/user.types'
import { SERVICE_CATEGORIES } from '@/utils/seed'

const CATEGORY_MAP: Record<string, ServiceCategory> = {
  'furniture': 'carpenter',
  'home-decoration': 'cleaner',
  'laptops': 'electrician',
  'smartphones': 'electrician',
  'automotive': 'mechanic',
  'fragrances': 'cleaner',
  'skincare': 'cleaner',
  'groceries': 'general',
  'sunglasses': 'general',
  'tops': 'general',
  'womens-dresses': 'cleaner',
  'womens-shoes': 'general',
  'mens-shirts': 'general',
  'mens-shoes': 'general',
  'mens-watches': 'general',
  'womens-watches': 'general',
  'womens-bags': 'general',
  'womens-jewellery': 'general',
  'lighting': 'electrician',
}

function mapProductToService(product: DummyJsonProduct): Service {
  const category: ServiceCategory = CATEGORY_MAP[product.category] ?? 'general'
  const categoryInfo = SERVICE_CATEGORIES[category]
  return {
    id: product.id,
    title: categoryInfo.title,
    description: categoryInfo.description,
    category,
    basePrice: Math.round(product.price * 10),
    rating: product.rating,
    thumbnail: product.thumbnail,
    workersAvailable: (product.stock % 10) + 1,
    estimatedDuration: `${1 + (product.id % 4)}–${2 + (product.id % 4)} hours`,
    tags: categoryInfo.tags,
  }
}

export const productService = {
  async fetchServices(): Promise<ApiResult<Service[]>> {
    const result = await apiService.get<DummyJsonProductsResponse>('/products?limit=50')
    if (!result.success) return result
    const services = result.data.products.map(mapProductToService)
    return { success: true, data: services }
  },
}