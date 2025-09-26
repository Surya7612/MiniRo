import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function getRandomColor(): string {
  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500',
    'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-cyan-500'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
