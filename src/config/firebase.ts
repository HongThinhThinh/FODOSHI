// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBm-BrbJ5sjAKmAQ_-CI8xK96k1dcVIJmM",
  authDomain: "swd392-502ec.firebaseapp.com",
  projectId: "swd392-502ec",
  storageBucket: "swd392-502ec.appspot.com",
  messagingSenderId: "905643072609",
  appId: "1:905643072609:web:85a550a63272e4876b1e20",
  measurementId: "G-LKYKV5LJFM",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
export const ggProvider = new GoogleAuthProvider();
