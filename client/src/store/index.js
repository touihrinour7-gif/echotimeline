import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Theme store
export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light'
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(newTheme)
        return { theme: newTheme }
      }),
      setTheme: (theme) => {
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(theme)
        set({ theme })
      },
    }),
    {
      name: 'echotimeline-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark')
        }
      }
    }
  )
)

// Auth store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      setUser: (user) => set({ user, loading: false }),
      setLoading: (loading) => set({ loading }),
      logout: () => {
        set({ user: null })
        localStorage.removeItem('echotimeline-auth')
      },
    }),
    {
      name: 'echotimeline-auth',
    }
  )
)

// Timeline store
export const useTimelineStore = create((set, get) => ({
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
    photos: state.photos.map(p => 
      p.id === id ? { ...p, ...updates } : p
    )
  })),
  
  deletePhoto: (id) => set((state) => ({
    photos: state.photos.filter(p => p.id !== id)
  })),
  
  reorderPhotos: (photos) => set({ photos }),
  
  sortPhotosByDate: () => set((state) => ({
    photos: [...state.photos].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    )
  })),
  
  setLoading: (loading) => set({ loading }),
}))

// Upload store
export const useUploadStore = create((set, get) => ({
  queue: [],
  uploading: false,
  progress: {},
  
  addToQueue: (files) => set((state) => ({
    queue: [...state.queue, ...files.map(file => ({
      id: crypto.randomUUID(),
      file,
      status: 'pending',
      preview: URL.createObjectURL(file)
    }))]
  })),
  
  removeFromQueue: (id) => set((state) => ({
    queue: state.queue.filter(item => item.id !== id),
    progress: { ...state.progress, [id]: undefined }
  })),
  
  updateItemStatus: (id, status, data) => set((state) => ({
    queue: state.queue.map(item => 
      item.id === id ? { ...item, status, ...data } : item
    )
  })),
  
  setUploading: (uploading) => set({ uploading }),
  
  updateProgress: (id, progress) => set((state) => ({
    progress: { ...state.progress, [id]: progress }
  })),
  
  clearQueue: () => set({ queue: [], progress: {} }),
  
  getPendingCount: () => {
    const state = get()
    return state.queue.filter(item => item.status === 'pending').length
  }
}))
