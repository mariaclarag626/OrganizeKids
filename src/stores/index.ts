import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UIState {
  isLoading: boolean
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  setLoading: (loading: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isLoading: false,
      sidebarOpen: false,
      theme: 'light',
      setLoading: (loading) => set({ isLoading: loading }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-store',
    }
  )
)

interface UserState {
  currentHouseholdId: string | null
  setCurrentHousehold: (id: string | null) => void
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      currentHouseholdId: null,
      setCurrentHousehold: (id) => set({ currentHouseholdId: id }),
    }),
    {
      name: 'user-store',
    }
  )
)