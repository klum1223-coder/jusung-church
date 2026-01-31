// =================================================================
// 📦 TYPE DEFINITIONS
// =================================================================

import { User as FirebaseUser } from "firebase/auth";

// Content Types
export type ContentType = 'newcomer' | 'sermon' | 'notice' | 'bulletin' | 'meditation';

export interface ContentCard {
    id: string;
    type: ContentType;
    title: string;
    description?: string;
    imageUrl?: string;
    linkUrl?: string;
    isPinned?: boolean;
    created_at?: {
        seconds: number;
        nanoseconds: number;
    };
    authorName?: string;
    authorId?: string;
}

// Page Navigation
export type PageType = 'home' | 'about' | 'worship' | 'sermon' | 'meditation' | 'community';

// Router Context
export interface RouterContextType {
    currentPage: PageType;
    navigate: (page: PageType) => void;
}

// User Type (Firebase User의 필요한 필드만)
export interface AppUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

// Blog Post (Naver RSS)
export interface BlogPost {
    id: string;
    title: string;
    link: string;
    description: string;
    pubDate: string;
}

// Church Data Configuration
export interface WorshipSchedule {
    name: string;
    time: string;
    place: string;
}

export interface ChurchContact {
    address: string;
    phone: string;
    email: string;
    blog: string;
}

export interface PastorInfo {
    name: string;
    role: string;
    imgUrl: string;
    message: string;
    education: string[];
    career: string[];
}

export interface ChurchSlogan {
    main: string;
    sub: string;
    desc: string;
}

export interface ChurchImages {
    hero: string;
}

export interface ChurchData {
    name: string;
    engName: string;
    slogan: ChurchSlogan;
    pastor: PastorInfo;
    images: ChurchImages;
    contact: ChurchContact;
    worship: WorshipSchedule[];
}
