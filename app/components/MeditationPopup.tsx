'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { X, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MeditationPopup() {
    const [meditation, setMeditation] = useState<any>(null);
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        // Check if user already dismissed today
        const dismissed = localStorage.getItem('meditation_popup_dismissed');
        if (dismissed) {
            const dismissedDate = new Date(dismissed).toDateString();
            const today = new Date().toDateString();
            if (dismissedDate === today) return; // Already dismissed today
        }

        const fetchLatest = async () => {
            try {
                if (!db) return;
                const q = query(
                    collection(db, 'main_contents'),
                    where('type', '==', 'meditation'),
                    orderBy('created_at', 'desc'),
                    limit(1)
                );
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    setMeditation({ id: doc.id, ...doc.data() });
                    // Small delay for page load
                    setTimeout(() => setVisible(true), 800);
                }
            } catch (err) {
                console.error('Meditation popup fetch failed:', err);
            }
        };
        fetchLatest();
    }, []);

    const handleClose = () => {
        setClosing(true);
        localStorage.setItem('meditation_popup_dismissed', new Date().toISOString());
        setTimeout(() => setVisible(false), 400);
    };

    if (!visible || !meditation) return null;

    const date = meditation.created_at
        ? new Date(meditation.created_at.seconds * 1000)
        : new Date();

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 transition-all duration-500 ${closing ? 'opacity-0' : 'opacity-100'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/70 backdrop-blur-md"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className={`relative w-full max-w-lg bg-[#faf9f6] rounded-[32px] shadow-2xl overflow-hidden transition-all duration-500 ${closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
                {/* Header decoration */}
                <div className="h-2 bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#D2691E]" />

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-5 right-5 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-white transition-all shadow-sm"
                >
                    <X size={18} />
                </button>

                {/* Content */}
                <div className="p-8 md:p-10 space-y-6">
                    {/* Icon & Label */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#8B4513] rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <BookOpen size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B4513]">Daily Meditation</p>
                            <p className="text-stone-400 text-xs">
                                {date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 leading-snug">
                        &quot;{meditation.title}&quot;
                    </h2>

                    {/* Divider */}
                    <div className="w-16 h-px bg-[#8B4513]/30" />

                    {/* Content */}
                    <p className="text-stone-600 text-base md:text-lg font-light italic leading-relaxed whitespace-pre-line line-clamp-6">
                        {meditation.description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Link
                            href="/meditation"
                            className="flex-1 py-4 bg-[#8B4513] text-white rounded-2xl font-bold text-center shadow-lg hover:bg-stone-900 transition-all flex items-center justify-center gap-2"
                        >
                            묵상 페이지로 이동 <ArrowRight size={18} />
                        </Link>
                        <button
                            onClick={handleClose}
                            className="flex-1 py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold text-center hover:bg-stone-200 transition-all"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
