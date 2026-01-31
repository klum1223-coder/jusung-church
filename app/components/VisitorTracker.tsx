'use client';

import { useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';

export default function VisitorTracker() {
    useEffect(() => {
        const trackVisit = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const lastVisit = localStorage.getItem('jusung_last_visit');

                if (lastVisit === today) return;

                const statsRef = doc(db, 'daily_stats', today);
                const statsDoc = await getDoc(statsRef);

                if (!statsDoc.exists()) {
                    await setDoc(statsRef, { date: today, total_views: 1, unique_visitors: 1 });
                } else {
                    await setDoc(statsRef, {
                        total_views: increment(1),
                        unique_visitors: increment(1)
                    }, { merge: true });
                }

                localStorage.setItem('jusung_last_visit', today);
            } catch (error) {
                console.error('Failed to track visitor:', error);
            }
        };

        if (db) trackVisit();
    }, []);

    return null;
}
