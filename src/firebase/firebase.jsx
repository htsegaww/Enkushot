import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

if (!import.meta.env.VITE_PROJECT_ID) {
  console.error("⚠️ VITE_PROJECT_ID is missing! Check your .env file");
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const projectStorage = getStorage(app);
const db = getFirestore(app);
const timestamp = serverTimestamp();

export { projectStorage, db, timestamp, auth };
