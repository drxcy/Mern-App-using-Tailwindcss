// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // apiKey: "AIzaSyC5Sdh3i5JwaUCcSljTjWUe5XVxfTGmqFA",
  authDomain: "blog-tailwind.firebaseapp.com",
  projectId: "blog-tailwind",
  storageBucket: "blog-tailwind.appspot.com",
  messagingSenderId: "41600610716",
  appId: "1:41600610716:web:f498950779f53664bb9859"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);