import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123:web:abc123'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app

// Firestore helper functions
export const collections = {
  users: 'users',
  timelines: 'timelines',
  photos: 'photos',
  invites: 'invites',
}

// Auth helpers
export const signInWithGoogle = () => {
  return auth.signInWithPopup(googleProvider)
}

export const signInWithEmail = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password)
}

export const signUpWithEmail = (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password)
}

export const signOut = () => {
  return auth.signOut()
}

export const onAuthChange = (callback) => {
  return auth.onAuthStateChanged(callback)
}
