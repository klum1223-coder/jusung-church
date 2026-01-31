'use client';

import { useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, setDoc, increment, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';

export default function VisitorTracker() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!db) return;

        const trackVisit = async () => {
            try {
                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
                const storedDate = localStorage.getItem('last_visit_date');
                const isUnique = storedDate !== today;

                const docRef = doc(db, 'daily_stats', today);

                // Use setDoc with merge: true to handle document creation automatically
                // Note: increment(1) works with setDoc merge
                await setDoc(docRef, {
                    date: today,
                    total_views: increment(1),
                    unique_visitors: isUnique ? increment(1) : increment(0),
                    updated_at: serverTimestamp(),
                }, { merge: true });

                if (isUnique) {
                    localStorage.setItem('last_visit_date', today);
                }
            } catch (error) {
                console.error("Error tracking visit:", error);
            }
        };

        trackVisit();
    }, []);

    return null; // This component doesn't render anything
}
