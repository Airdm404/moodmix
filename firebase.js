import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "moodmix-96fb6.firebaseapp.com",
  projectId: "moodmix-96fb6",
  storageBucket: "moodmix-96fb6.appspot.com",
  messagingSenderId: "621317650856",
  appId: "1:621317650856:web:409c45099c3908b428459d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app); 
export {app, firestore, storage}