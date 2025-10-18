import { initializeApp } from "firebase/app";
//storage
import { getStorage } from "firebase/storage";
//database
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

// Debug logging for production
console.log("[Firebase] Config check:", {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  projectId: firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId,
});

if (!import.meta.env.VITE_PROJECT_ID) {
  console.error("⚠️ VITE_PROJECT_ID is missing! Check your .env file or Vercel environment variables");
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//initialize storage and database
const projectStorage = getStorage(app);
const db = getFirestore(app);
const timestamp = serverTimestamp();

export { projectStorage, db, timestamp, auth };
