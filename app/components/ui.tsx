'use client';

import React from 'react';

export function Card({ children, className = "", onClick }: any) {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-3xl p-8 border border-stone-100 shadow-sm transition-all hover:shadow-xl ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''} ${className}`}
        >
            {children}
        </div>
    );
}

export function Skeleton({ className = "" }: any) {
    return <div className={`animate-pulse bg-stone-200 rounded-2xl ${className}`} />;
}

export function HomePageSkeleton() {
    return (
        <div className="py-20 px-6 container mx-auto max-w-7xl animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 h-[500px] bg-stone-100 rounded-[2rem]" />
                <div className="lg:col-span-5 space-y-6">
                    <div className="h-40 bg-stone-100 rounded-3xl" />
                    <div className="h-40 bg-stone-100 rounded-3xl" />
                    <div className="h-40 bg-stone-100 rounded-3xl" />
                </div>
            </div>
        </div>
    );
}
