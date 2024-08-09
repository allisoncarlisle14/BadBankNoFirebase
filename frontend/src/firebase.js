// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqJrCCkqAIfGQZxr807f8iruLnYTHo6x8",
  authDomain: "badbank-432bc.firebaseapp.com",
  projectId: "badbank-432bc",
  storageBucket: "badbank-432bc.appspot.com",
  messagingSenderId: "431167746471",
  appId: "1:431167746471:web:65a3b3df888b806e410682"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
    
    
 