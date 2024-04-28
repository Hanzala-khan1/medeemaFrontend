import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBpuO0Ld7tJp7x4gq4KJt321Bpd5YZdtOE",
  authDomain: "medemaa-495d8.firebaseapp.com",
  projectId: "medemaa-495d8",
  storageBucket: "medemaa-495d8.appspot.com",
  messagingSenderId: "118416916073",
  appId: "1:118416916073:web:3263cf4e3907db90efecf8",
  measurementId: "G-SXSQTLVZNC"
};

const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
