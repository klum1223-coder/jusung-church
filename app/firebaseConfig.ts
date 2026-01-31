import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB98qH2nyna5oWNveAqPM6fRWhXc0ne7PE",
    authDomain: "church-homepage-antigravity.firebaseapp.com",
    projectId: "church-homepage-antigravity",
    storageBucket: "church-homepage-antigravity.firebasestorage.app",
    messagingSenderId: "717500251657",
    appId: "1:717500251657:web:392685bcc9fd2debfa02d8",
    measurementId: "G-TQ363KTYKR"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
