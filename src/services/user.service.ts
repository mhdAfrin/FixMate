import { apiService } from './api.service'
import type { DummyJsonUser, DummyJsonUsersResponse, ApiResult } from '@/types/api.types'
import type { Worker, ServiceCategory } from '@/types/user.types'
import { SERVICE_CATEGORIES } from '@/utils/seed'

const CATEGORY_LIST: ServiceCategory[] = [
  'mechanic', 'ac-technician', 'plumber', 'electrician',
  'carpenter', 'cleaner', 'painter', 'general',
]

function mapUserToWorker(user: DummyJsonUser, index: number): Worker {
  const category = CATEGORY_LIST[index % CATEGORY_LIST.length]
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    username: user.username,
    avatar: user.image,
    role: 'worker',
    city: user.address.city,
    createdAt: new Date().toISOString(),
    category,
    specializations: SERVICE_CATEGORIES[category]?.specializations ?? [],
    hourlyRate: 500 + (user.id * 50) % 1500,
    rating: 3.5 + ((user.id % 15) / 10),
    totalReviews: 10 + (user.id * 7) % 200,
    completedJobs: 5 + (user.id * 13) % 150,
    isAvailable: user.id % 3 !== 0,
    bio: `Experienced ${category} professional with ${2 + (user.id % 10)} years of expertise.`,
    yearsExperience: 2 + (user.id % 10),
    jobIds: [],
  }
}

export const userService = {
  async fetchWorkers(limit = 30): Promise<ApiResult<Worker[]>> {
    const result = await apiService.get<DummyJsonUsersResponse>(`/users?limit=${limit}`)
    if (!result.success) return result
    const workers = result.data.users.map((u, i) => mapUserToWorker(u, i))
    return { success: true, data: workers }
  },

  async fetchWorkerById(id: number): Promise<ApiResult<Worker>> {
    const result = await apiService.get<DummyJsonUser>(`/users/${id}`)
    if (!result.success) return result
    return { success: true, data: mapUserToWorker(result.data, id) }
  },
}