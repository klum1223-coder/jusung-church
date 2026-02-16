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
                            <div className="max-w-2xl mx-auto space-y-12">
                                <article className="relative group">
                                    <div className="flex flex-col md:flex-row gap-12 items-start">
                                        <div className="w-full md:w-32 shrink-0 space-y-2">
                                            <span className="text-[#8B4513] font-serif text-5xl font-black block">
                                                {new Date().getDate()}
                                            </span>
                                            <span className="text-stone-400 font-bold text-[10px] uppercase tracking-widest">
                                                {new Date().toLocaleString('ko-KR', { month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex-1 space-y-8">
                                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
                                                &quot;여호와는 나의 목자시니 내게 부족함이 없으리로다&quot;
                                            </h2>
                                            <div className="w-12 h-px bg-stone-200"></div>
                                            <p className="text-stone-600 text-xl font-light italic leading-relaxed">
                                                그가 나를 푸른 풀밭에 누이시며{'\n'}쉴 만한 물 가으로 인도하시는도다.{'\n'}내 영혼을 소생시키시고{'\n'}자기 이름을 위하여 의의 길로 인도하시는도다.
                                            </p>
                                            <div className="pt-4 flex items-center gap-2 text-stone-400 font-bold text-xs uppercase tracking-widest">
                                                <Calendar size={14} /> 시편 23:1-3
                                            </div>
                                        </div>
                                    </div>
                                </article>
                                <div className="text-center pt-8">
                                    <p className="text-stone-300 text-sm">관리자가 새로운 묵상을 등록하면 여기에 표시됩니다.</p>
                                </div>
                            </div>
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
