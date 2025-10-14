'use client'

// LocalStorage utility for persisting data
export class StorageManager {
  private static getKey(userId: string, key: string): string {
    return `organizekids_${userId}_${key}`
  }

  static save<T>(userId: string, key: string, data: T): void {
    try {
      if (typeof window !== 'undefined') {
        const storageKey = this.getKey(userId, key)
        localStorage.setItem(storageKey, JSON.stringify(data))
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  static load<T>(userId: string, key: string, defaultValue: T): T {
    try {
      if (typeof window !== 'undefined') {
        const storageKey = this.getKey(userId, key)
        const item = localStorage.getItem(storageKey)
        return item ? JSON.parse(item) : defaultValue
      }
      return defaultValue
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return defaultValue
    }
  }

  static remove(userId: string, key: string): void {
    try {
      if (typeof window !== 'undefined') {
        const storageKey = this.getKey(userId, key)
        localStorage.removeItem(storageKey)
      }
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  }

  static clear(userId: string): void {
    try {
      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage)
        const userKeys = keys.filter(key => key.startsWith(`organizekids_${userId}_`))
        userKeys.forEach(key => localStorage.removeItem(key))
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

// Auto-save hook for debouncing saves
export function useAutoSave<T>(
  userId: string,
  key: string,
  data: T,
  delay: number = 1000
): (() => void) | void {
  if (typeof window === 'undefined') return

  const timeoutId = setTimeout(() => {
    StorageManager.save(userId, key, data)
  }, delay)

  return () => clearTimeout(timeoutId)
}
