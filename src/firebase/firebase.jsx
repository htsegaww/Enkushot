import { initializeApp } from "firebase/app";
//storage
import { getStorage } from "firebase/storage";
//database
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnaf05SQCfYpxjU18ZP_l3y-H0ZBaAkbI",
  authDomain: "henogram-4f9e9.firebaseapp.com",
  projectId: "henogram-4f9e9",
  storageBucket: "henogram-4f9e9.appspot.com",
  messagingSenderId: "329948263375",
  appId: "1:329948263375:web:ed8824b2161442b63318ba",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//initialize storage and database
const projectStorage = getStorage(app);
const db = getFirestore(app);
const timestamp = serverTimestamp();

export { projectStorage, db, timestamp, auth };
