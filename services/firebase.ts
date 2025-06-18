import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Firebase configuration - Use environment variables in production
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "campus-exchange-demo.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "campus-exchange-demo",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "campus-exchange-demo.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "demo-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence for React Native
let auth;
try {
  if (Platform.OS === 'web') {
    // Use default auth for web
    const { getAuth } = require('firebase/auth');
    auth = getAuth(app);
  } else {
    // Use AsyncStorage persistence for React Native
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
} catch (error) {
  console.error('Error initializing Firebase Auth:', error);
  // Fallback to default auth
  const { getAuth } = require('firebase/auth');
  auth = getAuth(app);
}

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export { auth };

export default app;