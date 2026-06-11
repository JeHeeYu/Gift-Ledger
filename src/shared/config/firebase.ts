import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  signInAnonymously,
  type Auth,
  type User,
} from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

type FirebaseClient = {
  app: FirebaseApp
  auth: Auth
  db: Firestore
}

const getEnvValue = (value: string | undefined) => value?.trim() ?? ''

const firebaseConfig = {
  apiKey: getEnvValue(import.meta.env.VITE_FIREBASE_API_KEY),
  appId: getEnvValue(import.meta.env.VITE_FIREBASE_APP_ID),
  authDomain: getEnvValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  measurementId: getEnvValue(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID),
  messagingSenderId: getEnvValue(
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  ),
  projectId: getEnvValue(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: getEnvValue(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
}

const requiredConfigKeys = [
  'apiKey',
  'appId',
  'authDomain',
  'messagingSenderId',
  'projectId',
] as const

let firebaseClient: FirebaseClient | null = null
let anonymousUserPromise: Promise<User> | null = null

export const isFirebaseConfigured = requiredConfigKeys.every(
  (key) => firebaseConfig[key].length > 0,
)

export const giftDeskEventId =
  getEnvValue(import.meta.env.VITE_GIFT_DESK_EVENT_ID) ||
  getEnvValue(import.meta.env.VITE_GIFT_EVENT_ID) ||
  'wedding-2026-06-12'

export const getFirebaseClient = (): FirebaseClient | null => {
  if (!isFirebaseConfigured) {
    return null
  }

  if (firebaseClient) {
    return firebaseClient
  }

  const app = getApps()[0] ?? initializeApp(firebaseConfig)

  firebaseClient = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
  }

  return firebaseClient
}

export const ensureAnonymousFirebaseUser = async () => {
  const client = getFirebaseClient()

  if (!client) {
    return null
  }

  if (client.auth.currentUser) {
    return client.auth.currentUser
  }

  anonymousUserPromise ??= signInAnonymously(client.auth).then(
    (credential) => credential.user,
  )

  return anonymousUserPromise
}
