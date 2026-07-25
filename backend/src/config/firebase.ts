import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

try {
  if (!getApps().length) {
    initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'campus-cartel-dev'
    });
  }
} catch (error) {
  console.error("Firebase admin initialization error", error);
}

let firestoreDb: FirebaseFirestore.Firestore | null = null;

export const getDb = () => {
  if (!firestoreDb) {
    firestoreDb = getFirestore();
  }
  return firestoreDb;
};
