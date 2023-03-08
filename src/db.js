//import React from 'react';
//import { getDatabase, onValue, ref, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import firebase from 'firebase/compat/app';

// firebase.initializeApp({
//   apiKey: "AIzaSyDKCaRe6miZ1rghwxGNXjMRxUfuRF6T1tc",
//   authDomain: "zsebrief.firebaseapp.com",
//   projectId: "zsebrief",
// })

const firebaseConfig = {
    apiKey: "AIzaSyDKCaRe6miZ1rghwxGNXjMRxUfuRF6T1tc",
    authDomain: "zsebrief.firebaseapp.com",
    databaseURL: "https://zsebrief.firebaseio.com",
    projectId: "zsebrief",
    storageBucket: "zsebrief.appspot.com",
    messagingSenderId: "425788581552",
    appId: "1:425788581552:web:b3eaf8d6151e11f8023d75"
  };

const app = firebase.initializeApp(firebaseConfig);


export default app;