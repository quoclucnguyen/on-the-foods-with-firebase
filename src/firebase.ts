import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSTjQrKlChioa9j04vsXvrMg5RHwh2S0M",
  authDomain: "onthefood-s.firebaseapp.com",
  databaseURL:
    "https://onthefood-s-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "onthefood-s",
  storageBucket: "onthefood-s.appspot.com",
  messagingSenderId: "521061958570",
  appId: "1:521061958570:web:1b2edfc096aec1385f21d3",
  measurementId: "G-21R742NXQ9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
connectAuthEmulator(auth, "http://localhost:9099");
connectFirestoreEmulator(db, "127.0.0.1", 8080);
