'use client';

import React from 'react';

export function Skeleton({ className = "" }: any) {
    return <div className={`animate-pulse bg-stone-200 rounded-2xl ${className}`} />;
}

export function HomePageSkeleton() {
    return (
        <div className="py-20 px-6 container mx-auto max-w-7xl animate-pulse space-y-12">
            <div className="h-[70vh] bg-stone-100 rounded-[3rem]" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="h-64 bg-stone-100 rounded-3xl" />
                <div className="h-64 bg-stone-100 rounded-3xl" />
                <div className="h-64 bg-stone-100 rounded-3xl" />
            </div>
        </div>
    );
}

export function SermonPageSkeleton() {
    return (
        <div className="py-20 px-6 container mx-auto max-w-7xl animate-pulse grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-stone-100 rounded-3xl" />)}
        </div>
    );
}

export function CommunityPageSkeleton() {
    return (
        <div className="py-20 px-6 container mx-auto max-w-5xl animate-pulse space-y-8">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-stone-100 rounded-3xl" />)}
        </div>
    );
}
