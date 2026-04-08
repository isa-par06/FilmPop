// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACHdVAmR-RIXgbgVwRCtRj1qxpAk2Vg6c",
  authDomain: "filmpop-3fb37.firebaseapp.com",
  projectId: "filmpop-3fb37",
  storageBucket: "filmpop-3fb37.firebasestorage.app",
  messagingSenderId: "975254601211",
  appId: "1:975254601211:web:fa24fb1c5d6b1d05c89f5e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);