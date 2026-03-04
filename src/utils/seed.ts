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
    icon: '🔧', color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20',
    specializations: ['Engine Repair', 'Brake Service', 'Oil Change', 'AC Repair'],
    tags: ['mechanic', 'vehicle', 'repair'],
  },
  'ac-technician': {
    title: 'AC Technician',
    description: 'Air conditioning installation, repair and maintenance',
    icon: '❄️', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    specializations: ['AC Installation', 'AC Cleaning', 'Gas Refill', 'Duct Cleaning'],
    tags: ['ac', 'cooling', 'hvac'],
  },
  plumber: {
    title: 'Plumber',
    description: 'Plumbing installation, repair and maintenance',
    icon: '🪠', color: 'text-cyan-600', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
    specializations: ['Pipe Repair', 'Drain Cleaning', 'Water Heater', 'Leak Fix'],
    tags: ['plumbing', 'pipes', 'water'],
  },
  electrician: {
    title: 'Electrician',
    description: 'Electrical installation, wiring and repair services',
    icon: '⚡', color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    specializations: ['Wiring', 'Switchboard', 'Fan Installation', 'Solar Panel'],
    tags: ['electrical', 'wiring', 'power'],
  },
  carpenter: {
    title: 'Carpenter',
    description: 'Custom furniture, woodwork and installation',
    icon: '🪚', color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    specializations: ['Furniture Making', 'Door Repair', 'Cabinet Install', 'Flooring'],
    tags: ['woodwork', 'furniture', 'carpenter'],
  },
  cleaner: {
    title: 'Home Cleaner',
    description: 'Professional deep cleaning and sanitization',
    icon: '🧹', color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20',
    specializations: ['Deep Cleaning', 'Sofa Cleaning', 'Carpet Wash', 'Window Clean'],
    tags: ['cleaning', 'sanitize', 'hygiene'],
  },
  painter: {
    title: 'Painter',
    description: 'Interior and exterior painting services',
    icon: '🎨', color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    specializations: ['Interior Paint', 'Exterior Paint', 'Waterproofing', 'Texture Work'],
    tags: ['painting', 'decor', 'walls'],
  },
  general: {
    title: 'General Worker',
    description: 'Handyman and general home maintenance',
    icon: '🔨', color: 'text-slate-600', bgColor: 'bg-slate-50 dark:bg-slate-700/30',
    specializations: ['Handyman', 'Moving Help', 'Assembly', 'Garden Maintenance'],
    tags: ['handyman', 'general', 'maintenance'],
  },
}