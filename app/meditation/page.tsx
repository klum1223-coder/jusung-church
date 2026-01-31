'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { CHURCH_DATA } from '../lib/constants';
import { Calendar, Quote } from 'lucide-react';

export default function MeditationPage() {
    const [meditations, setMeditations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMeditations = async () => {
            try {
                if (!db) return;
                const q = query(
                    collection(db, 'main_contents'),
                    where('type', '==', 'meditation'),
                    orderBy('created_at', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMeditations(results);
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMeditations();
    }, []);

    return (
        <div className="bg-[#faf9f6] min-h-screen pt-24 font-sans selection:bg-[#8B4513] selection:text-white">
            <main>
                <section className="py-24 px-6 relative overflow-hidden">
                    <div className="container mx-auto max-w-5xl text-center space-y-6 relative z-10">
                        <span className="text-[#8B4513] font-black tracking-[0.4em] text-[12px] uppercase">Daily Word & Meditation</span>
                        <h1 className="font-serif text-5xl md:text-8xl font-bold tracking-tight text-stone-900">매일 묵상</h1>
                        <p className="text-stone-500 text-lg md:text-xl font-light max-w-2xl mx-auto">말씀의 깊은 은혜를 매일 아침 성도님들과 함께 나눕니다.</p>
                    </div>
                    <Quote className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-stone-100/50 -z-0" size={400} />
                </section>

                <section className="py-24 px-6 bg-white min-h-[60vh]">
                    <div className="container mx-auto max-w-4xl">
                        {loading ? (
                            <div className="flex flex-col items-center py-32 space-y-4">
                                <div className="w-12 h-12 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">Loading Word...</p>
                            </div>
                        ) : meditations.length === 0 ? (
                            <div className="py-32 text-center text-stone-300 font-bold uppercase tracking-widest">첫 번째 묵상을 기다리고 있습니다.</div>
                        ) : (
                            <div className="space-y-24">
                                {meditations.map((item, idx) => (
                                    <article key={item.id} className="relative group">
                                        <div className="flex flex-col md:flex-row gap-12 items-start">
                                            <div className="w-full md:w-32 shrink-0 space-y-2">
                                                <span className="text-[#8B4513] font-serif text-5xl font-black block">
                                                    {item.created_at ? new Date(item.created_at.seconds * 1000).getDate() : '??'}
                                                </span>
                                                <span className="text-stone-400 font-bold text-[10px] uppercase tracking-widest">
                                                    {item.created_at ? new Date(item.created_at.seconds * 1000).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Date Unknown'}
                                                </span>
                                            </div>
                                            <div className="flex-1 space-y-8">
                                                <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 group-hover:text-[#8B4513] transition-colors leading-tight">
                                                    "{item.title}"
                                                </h2>
                                                <div className="w-12 h-px bg-stone-100"></div>
                                                <p className="text-stone-600 text-xl font-light italic leading-relaxed whitespace-pre-line">
                                                    {item.description}
                                                </p>
                                                <div className="pt-4 flex items-center gap-2 text-stone-400 font-bold text-xs uppercase tracking-widest">
                                                    <Calendar size={14} /> Posted by Pastor {CHURCH_DATA.pastor.name}
                                                </div>
                                            </div>
                                        </div>
                                        {idx !== meditations.length - 1 && (
                                            <div className="mt-24 h-px bg-stone-50 w-full"></div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
