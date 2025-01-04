// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDB770zA8kQZTdCMqyZ0EO52KhGA4dlV6c",
  authDomain: "web2o-34840.firebaseapp.com",
  projectId: "web2o-34840",
  storageBucket: "web2o-34840.firebasestorage.app",
  messagingSenderId: "94338182985",
  appId: "1:94338182985:web:0da6cb9c254471c4cdb498",
  measurementId: "G-WCB0FLGL1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);