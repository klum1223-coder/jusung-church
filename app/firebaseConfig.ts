import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: any;
let auth: any;
let db: any;
let storage: any;

try {
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }

    // Auth & DB are usually safe to initialize on server
    auth = getAuth(app);
    db = getFirestore(app);

    // Storage often requires browser environment (window/fetch)
    if (typeof window !== 'undefined') {
        storage = getStorage(app);
    } else {
        storage = null;
    }

} catch (error) {
    console.error("Firebase initialization error:", error);
    // Fallback objects to prevent crash
    app = null;
    auth = null;
    db = null;
    storage = null;
}

export { app, auth, db, storage };
