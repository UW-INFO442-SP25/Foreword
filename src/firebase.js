// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBk0k00Ch81lS3Rch30HUzma6m9BpcE6EE",
  authDomain: "foreword-647d3.firebaseapp.com",
  projectId: "foreword-647d3",
  storageBucket: "foreword-647d3.firebasestorage.app",
  messagingSenderId: "108279751845",
  appId: "1:108279751845:web:61b80561d2b52003f2194c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };