import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Service, ServiceFilter } from '@/types/service.types'
import type { Worker, ServiceCategory } from '@/types/user.types'
import { productService } from '@/services/product.service'
import { userService } from '@/services/user.service'

export const useServiceStore = defineStore('services', () => {
  const services = ref<Service[]>([])
  const workers = ref<Worker[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const filter = ref<ServiceFilter>({
    category: 'all',
    minPrice: 0,
    maxPrice: 100000,
    minRating: 0,
    sortBy: 'popular',
  })

  const filteredServices = computed(() => {
    let result = [...services.value]
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    if (filter.value.category !== 'all') {
      result = result.filter((s) => s.category === filter.value.category)
    }
    result = result.filter(
      (s) => s.basePrice >= filter.value.minPrice && s.basePrice <= filter.value.maxPrice
    )
    result = result.filter((s) => s.rating >= filter.value.minRating)
    switch (filter.value.sortBy) {
      case 'price-asc': result.sort((a, b) => a.basePrice - b.basePrice); break
      case 'price-desc': result.sort((a, b) => b.basePrice - a.basePrice); break
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      default: break
    }
    return result
  })

  const workersByCategory = computed(() => {
    return (category: ServiceCategory) =>
      workers.value.filter((w) => w.category === category && w.isAvailable)
  })

  async function fetchAll(): Promise<void> {
    isLoading.value = true
    error.value = null
    const [servicesResult, workersResult] = await Promise.all([
      productService.fetchServices(),
      userService.fetchWorkers(30),
    ])
    if (servicesResult.success) services.value = servicesResult.data
    else error.value = servicesResult.error.message
    if (workersResult.success) workers.value = workersResult.data
    isLoading.value = false
  }

  function setSearch(query: string): void {
    searchQuery.value = query
  }

  function setFilter(updates: Partial<ServiceFilter>): void {
    filter.value = { ...filter.value, ...updates }
  }

  function resetFilter(): void {
    searchQuery.value = ''
    filter.value = { category: 'all', minPrice: 0, maxPrice: 100000, minRating: 0, sortBy: 'popular' }
  }

  return {
    services, workers, isLoading, error, searchQuery, filter,
    filteredServices, workersByCategory, fetchAll, setSearch, setFilter, resetFilter,
  }
})