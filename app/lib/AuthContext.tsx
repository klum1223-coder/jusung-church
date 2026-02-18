'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'; // Firestore imports added
import { auth, db } from '../firebaseConfig'; // db import added

// Define UserData type
export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: 'guest' | 'member' | 'admin'; // Role-based access
    status: 'pending' | 'approved' | 'rejected'; // Approval status
    createdAt: any;
    lastLoginAt: any;
}

interface AuthContextType {
    user: User | null;
    userData: UserData | null; // Database user data
    loading: boolean;
    error: string | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    loading: true,
    error: null,
    login: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!auth) {
            setError("Firebase Auth not initialized. Check your environment variables.");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            setUser(u);

            if (u && db) {
                // Sync with Firestore
                try {
                    const userRef = doc(db, 'users', u.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        // Existing user: Update last login and fetch data
                        await setDoc(userRef, {
                            lastLoginAt: serverTimestamp(),
                            email: u.email,
                            displayName: u.displayName,
                            photoURL: u.photoURL
                        }, { merge: true });
                        setUserData(userSnap.data() as UserData);
                    } else {
                        // New user: Create document with 'pending' status
                        const newUser: UserData = {
                            uid: u.uid,
                            email: u.email || '',
                            displayName: u.displayName || 'Anonymous',
                            photoURL: u.photoURL || '',
                            role: 'guest',
                            status: 'pending', // Default status
                            createdAt: serverTimestamp(),
                            lastLoginAt: serverTimestamp()
                        };
                        await setDoc(userRef, newUser);
                        setUserData(newUser);
                    }
                } catch (err) {
                    console.error("Error syncing user data:", err);
                    // Don't block auth, just log error
                }
            } else {
                setUserData(null);
            }

            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async () => {
        setError(null);
        if (!auth) {
            const msg = "Firebase Authentication 서비스가 초기화되지 않았습니다. 환경변수를 확인해주세요.";
            setError(msg);
            alert(msg);
            return;
        }

        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            await signInWithPopup(auth, provider);
        } catch (error: any) {
            if (error.code !== 'auth/cancelled-popup-request') {
                console.error("Login failed:", error);
                const errorMessage = `로그인 실패: ${error.message} (${error.code})`;
                setError(errorMessage);
                alert(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        if (!auth) return;
        await signOut(auth);
        setUserData(null);
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
