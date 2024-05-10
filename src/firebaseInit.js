// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTUJJU1vrs77-Z-o16xhXiaMoLN5s3AdU",
  authDomain: "blog-app-82cae.firebaseapp.com",
  projectId: "blog-app-82cae",
  storageBucket: "blog-app-82cae.appspot.com",
  messagingSenderId: "464002189196",
  appId: "1:464002189196:web:f073f5449404eae862f8a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);