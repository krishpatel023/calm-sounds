// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {GoogleAuthProvider, getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCa1ZW0K1K3sgq1IxlbgSx43CNxbd1KcWI",
  authDomain: "earnest-smoke-333907.firebaseapp.com",
  projectId: "earnest-smoke-333907",
  storageBucket: "earnest-smoke-333907.appspot.com",
  messagingSenderId: "766135530424",
  appId: "1:766135530424:web:8ac7904def7374c6a0954d",
  measurementId: "G-Z2S2ZRFX7Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);
