import firebase from "firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyCmXwCxGm9_mKFHKyRlwU1LXGmzFCroe8U",
    authDomain: "api-restaurants-65984.firebaseapp.com",
    databaseURL: "https://api-restaurants-65984.firebaseio.com",
    projectId: "api-restaurants-65984",
    storageBucket: "api-restaurants-65984.appspot.com",
    messagingSenderId: "2010360009",
    appId: "1:2010360009:web:d19885dcabd5955fcd4518"
  };
  
  export const firebaseApp = firebase.initializeApp(firebaseConfig);