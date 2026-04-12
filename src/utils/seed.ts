import type { ServiceCategory } from '@/types/user.types'

interface CategoryMeta {
  title: string
  description: string
  icon: string
  color: string
  bgColor: string
  specializations: string[]
  tags: string[]
}

export const SERVICE_CATEGORIES: Record<ServiceCategory, CategoryMeta> = {
  mechanic: {
    title: 'Vehicle Mechanic',
    description: 'Expert vehicle repair and maintenance services',
    icon: '🔧',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    specializations: ['Engine Repair', 'Brake Service', 'Oil Change', 'AC Repair'],
    tags: ['mechanic', 'vehicle', 'repair', 'car', 'engine', 'brake', 'oil', 'automobile'],
  },
  'ac-technician': {
    title: 'AC Technician',
    description: 'Air conditioning installation, repair and maintenance',
    icon: '❄️',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    specializations: ['AC Installation', 'AC Cleaning', 'Gas Refill', 'Duct Cleaning'],
    tags: ['ac', 'cooling', 'hvac', 'air conditioning', 'refrigeration', 'installation'],
  },
  plumber: {
    title: 'Plumber',
    description: 'Plumbing installation, repair and maintenance',
    icon: '🪠',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
    specializations: ['Pipe Repair', 'Drain Cleaning', 'Water Heater', 'Leak Fix'],
    tags: ['plumber', 'plumbing', 'pipes', 'water', 'drain', 'leak', 'heater'],
  },
  electrician: {
    title: 'Electrician',
    description: 'Electrical installation, wiring and repair services',
    icon: '⚡',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    specializations: ['Wiring', 'Switchboard', 'Fan Installation', 'Solar Panel'],
    tags: ['electrician', 'electrical', 'wiring', 'power', 'switch', 'fan', 'solar', 'light'],
  },
  carpenter: {
    title: 'Carpenter',
    description: 'Custom furniture, woodwork and installation',
    icon: '🪚',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    specializations: ['Furniture Making', 'Door Repair', 'Cabinet Install', 'Flooring'],
    tags: ['carpenter', 'woodwork', 'furniture', 'door', 'cabinet', 'floor', 'wood'],
  },
  cleaner: {
    title: 'Home Cleaner',
    description: 'Professional deep cleaning and sanitization',
    icon: '🧹',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    specializations: ['Deep Cleaning', 'Sofa Cleaning', 'Carpet Wash', 'Window Clean'],
    tags: ['cleaner', 'cleaning', 'sanitize', 'hygiene', 'sofa', 'carpet', 'window', 'deep clean'],
  },
  painter: {
    title: 'Painter',
    description: 'Interior and exterior painting services',
    icon: '🎨',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    specializations: ['Interior Paint', 'Exterior Paint', 'Waterproofing', 'Texture Work'],
    tags: ['painter', 'painting', 'decor', 'walls', 'interior', 'exterior', 'waterproof', 'texture'],
  },
  general: {
    title: 'General Worker',
    description: 'Handyman and general home maintenance',
    icon: '🔨',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50 dark:bg-slate-700/30',
    specializations: ['Handyman', 'Moving Help', 'Assembly', 'Garden Maintenance'],
    tags: ['handyman', 'general', 'maintenance', 'moving', 'assembly', 'garden', 'repair'],
  },
}

// Advertisement banners for home page
export interface Advertisement {
  id: number
  title: string
  subtitle: string
  badge: string
  bgFrom: string
  bgTo: string
  icon: string
  action: string
  category: ServiceCategory
}

export const ADVERTISEMENTS: Advertisement[] = [
  {
    id: 1,
    title: 'AC Service Special',
    subtitle: 'Get your AC cleaned & gas refilled this summer. Book now!',
    badge: '20% OFF',
    bgFrom: 'from-blue-500',
    bgTo: 'to-cyan-600',
    icon: '❄️',
    action: 'Book Now',
    category: 'ac-technician',
  },
  {
    id: 2,
    title: 'Home Deep Cleaning',
    subtitle: 'Professional cleaning for your entire home. Satisfaction guaranteed!',
    badge: 'Popular',
    bgFrom: 'from-green-500',
    bgTo: 'to-emerald-600',
    icon: '🧹',
    action: 'Book Now',
    category: 'cleaner',
  },
  {
    id: 3,
    title: 'Electrical Safety Check',
    subtitle: 'Full home wiring inspection by certified electricians.',
    badge: 'New',
    bgFrom: 'from-yellow-500',
    bgTo: 'to-orange-500',
    icon: '⚡',
    action: 'Learn More',
    category: 'electrician',
  },
  {
    id: 4,
    title: 'Plumbing Emergency?',
    subtitle: 'Available 24/7 for urgent pipe leaks and drain issues.',
    badge: '24/7',
    bgFrom: 'from-cyan-500',
    bgTo: 'to-blue-600',
    icon: '🪠',
    action: 'Call Now',
    category: 'plumber',
  },
]

// Quick stats for home page
export const PLATFORM_STATS = [
  { label: 'Happy Customers', value: '12,500+', icon: '😊' },
  { label: 'Expert Workers', value: '850+', icon: '👷' },
  { label: 'Services Done', value: '45,000+', icon: '✅' },
  { label: 'Cities Covered', value: '25+', icon: '📍' },
]

// Testimonials
export interface Testimonial {
  id: number
  name: string
  role: string
  comment: string
  rating: number
  avatar: string
  service: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Fernando',
    role: 'Homeowner',
    comment: 'The AC technician arrived on time and did an excellent job. My AC works perfectly now!',
    rating: 5,
    avatar: 'https://i.pravatar.cc/100?img=1',
    service: 'AC Service',
  },
  {
    id: 2,
    name: 'Kamal Perera',
    role: 'Business Owner',
    comment: 'Hired a plumber through FixMate for an emergency leak. Fast response and great work!',
    rating: 5,
    avatar: 'https://i.pravatar.cc/100?img=3',
    service: 'Plumbing',
  },
  {
    id: 3,
    name: 'Amara Silva',
    role: 'Homeowner',
    comment: 'Deep cleaning service was amazing. The team was professional and thorough.',
    rating: 4,
    avatar: 'https://i.pravatar.cc/100?img=5',
    service: 'Home Cleaning',
  },
]

