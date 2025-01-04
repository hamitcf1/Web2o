import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDB770zA8kQZTdCMqyZ0EO52KhGA4dlV6c",
    authDomain: "web2o-34840.firebaseapp.com",
    databaseURL: "https://web2o-34840-default-rtdb.firebaseio.com",
    projectId: "web2o-34840",
    storageBucket: "web2o-34840.appspot.com",
    messagingSenderId: "94338182985",
    appId: "1:94338182985:web:0da6cb9c254471c4cdb498",
    measurementId: "G-WCB0FLGL1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database }; 