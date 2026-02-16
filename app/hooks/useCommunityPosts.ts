'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from './useMainContents';
import type { ContentCard } from '../types';

export function useCommunityPosts() {
    const [posts, setPosts] = useState<ContentCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "community_posts"), orderBy("created_at", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContentCard));
            setPosts(data);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { posts, isLoading };
}
