'use client';

import { useState, useEffect } from 'react';
import type { BlogPost } from '../types';

export function useBlogPosts() {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const res = await fetch('/api/naver-rss');
                const data = await res.json();
                if (!data.error) setBlogPosts(data);
            } catch (e) {
                console.error("Fetch Blog Error:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlogPosts();
    }, []);

    return { blogPosts, isLoading };
}
