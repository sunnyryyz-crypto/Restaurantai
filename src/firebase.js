import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - using environment variables or defaults
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "medpractice-pro.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "medpractice-pro",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "medpractice-pro.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication helper functions
export const signInAnonymouslyUser = async () => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error;
  }
};

export const signInWithToken = async (token) => {
  try {
    const result = await signInWithCustomToken(auth, token);
    return result.user;
  } catch (error) {
    console.error('Error signing in with token:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export { auth, db };
export default app;