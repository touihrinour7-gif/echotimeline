import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Theme store
export const useThemeStore = create(
  persist(
    (set) => ({
      dark: false,
      toggleDark: () => set((state) => ({ dark: !state.dark })),
      setDark: (dark) => set({ dark }),
    }),
    {
      name: 'echotimeline-theme',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration
        if (state.dark) {
          document.documentElement.classList.add('dark')
        }
      }
    }
  )
)

// Auth store
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'echotimeline-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Timeline store
export const useTimelineStore = create((set) => ({
  timelines: [],
  currentTimeline: null,
  photos: [],
  loading: false,
  
  setTimelines: (timelines) => set({ timelines }),
  setCurrentTimeline: (timeline) => set({ currentTimeline: timeline }),
  setPhotos: (photos) => set({ photos }),
  addPhoto: (photo) => set((state) => ({
    photos: [...state.photos, photo]
  })),
  updatePhoto: (id, updates) => set((state) => ({
    photos: state.photos.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  deletePhoto: (id) => set((state) => ({
    photos: state.photos.filter(p => p.id !== id)
  })),
  setLoading: (loading) => set({ loading }),
}))

// UI store
export const useUIStore = create((set) => ({
  toasts: [],
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { id: Date.now(), ...toast }]
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}))
