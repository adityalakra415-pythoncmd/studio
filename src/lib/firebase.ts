// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "studio-189676346-44d4a",
  appId: "1:83594295844:web:2a2de78d3d80da19ed76b1",
  storageBucket: "studio-189676346-44d4a.firebasestorage.app",
  apiKey: "AIzaSyBtpROJVktJNPHODn7SbYlRbJzFgjX54qQ",
  authDomain: "studio-189676346-44d4a.firebaseapp.com",
  messagingSenderId: "83594295844",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
