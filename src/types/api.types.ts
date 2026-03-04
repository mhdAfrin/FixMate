export interface DummyJsonUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  username: string
  password: string
  image: string
  address: { address: string; city: string; state: string }
  company: { name: string; department: string }
  age: number
  gender: string
}

export interface DummyJsonUsersResponse {
  users: DummyJsonUser[]
  total: number
  skip: number
  limit: number
}

export interface DummyJsonProduct {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
}

export interface DummyJsonProductsResponse {
  products: DummyJsonProduct[]
  total: number
  skip: number
  limit: number
}

export interface DummyJsonAuthResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token: string
  refreshToken: string
}

export interface ApiError {
  message: string
  status: number
}

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError }