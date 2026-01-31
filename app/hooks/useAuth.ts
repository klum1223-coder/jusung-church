'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import type { AppUser } from '../types';

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyB98qH2nyna5oWNveAqPM6fRWhXc0ne7PE",
    authDomain: "church-homepage-antigravity.firebaseapp.com",
    projectId: "church-homepage-antigravity",
    storageBucket: "church-homepage-antigravity.firebasestorage.app",
    messagingSenderId: "717500251657",
    appId: "1:717500251657:web:392685bcc9fd2debfa02d8",
    measurementId: "G-TQ363KTYKR"
};

// Initialize Firebase (singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export function useAuth() {
    const [user, setUser] = useState<AppUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL
                });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = useCallback(async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }, []);

    const isAdmin = user?.email === "klum3@naver.com";

    return {
        user,
        isLoading,
        isAdmin,
        login,
        logout
    };
}

export { auth, app };
