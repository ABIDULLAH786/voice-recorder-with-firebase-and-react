// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCwB7cs-sPAnDzIsZtkS8qWjjaXqvsFsTA",
//     authDomain: "audio-recorder-61e57.firebaseapp.com",
//     projectId: "audio-recorder-61e57",
//     storageBucket: "audio-recorder-61e57.appspot.com",
//     messagingSenderId: "303901112950",
//     appId: "1:303901112950:web:f866c0a3b4433ac9b6bd57"
// };

const firebaseConfig = {
    apiKey: "AIzaSyCmSr9ZwxqA9DoMnbYEUPEx4Dc19BNLF_E",
    authDomain: "voice-recorder-5ed48.firebaseapp.com",
    projectId: "voice-recorder-5ed48",
    storageBucket: "voice-recorder-5ed48.appspot.com",
    messagingSenderId: "347560616835",
    appId: "1:347560616835:web:0242e7c21160e5e8038cb6"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export {storage,db};