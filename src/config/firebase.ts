// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADA2v4Fb_rSZEWePtjb19Xes5Quj-Q0nY",
  authDomain: "diemswd-41e30.firebaseapp.com",
  projectId: "diemswd-41e30",
  storageBucket: "diemswd-41e30.appspot.com",
  messagingSenderId: "1047827181333",
  appId: "1:1047827181333:web:f593d33dbe06e9900e431c",
  measurementId: "G-8NVSYC6CWJ",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
export const ggProvider = new GoogleAuthProvider();
