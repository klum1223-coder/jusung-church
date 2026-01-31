'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    getFirestore,
    collection,
    onSnapshot,
    query,
    orderBy,
    limit
} from "firebase/firestore";
import { app } from './useAuth';
import type { ContentCard } from '../types';

const db = getFirestore(app);

export function useMainContents() {
    const [cards, setCards] = useState<ContentCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "main_contents"),
            orderBy("created_at", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ContentCard));
            setCards(data);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return {
        cards,
        sermons: cards.filter(c => c.type === 'sermon'),
        meditations: cards.filter(c => c.type === 'meditation'),
        latestSermon: cards.find(c => c.type === 'sermon'),
        latestMeditation: cards.find(c => c.type === 'meditation'),
        isLoading
    };
}

export { db };
