'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { CHURCH_DATA } from '../lib/constants';
import { Play, Youtube, Calendar, Clock } from 'lucide-react';

export default function SermonPage() {
    const [sermons, setSermons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSermons = async () => {
            try {
                const youtubeRes = await fetch('/api/youtube');
                let youtubeVideos: any[] = [];
                if (youtubeRes.ok) {
                    youtubeVideos = await youtubeRes.json();
                }

                if (!db) {
                    setSermons(youtubeVideos);
                    return;
                }

                const q = query(
                    collection(db, 'main_contents'),
                    where('type', '==', 'sermon'),
                    orderBy('created_at', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const firestoreSermons = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const allSermons = [...youtubeVideos, ...firestoreSermons];
                setSermons(allSermons);

            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSermons();
    }, []);

    return (
        <div className="bg-[#faf9f6] min-h-screen pt-20 md:pt-24 font-sans selection:bg-[#8B4513] selection:text-white">
            <main>
                <section className="py-12 md:py-24 px-4 md:px-6 bg-stone-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <img src="https://images.unsplash.com/photo-1544427928-c49cdfebf194?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="배경" />
                    </div>
                    <div className="container mx-auto max-w-5xl relative z-10 text-center space-y-4 md:space-y-8">
                        <span className="text-[#F5E6D3] font-black tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-[12px] uppercase">Online Worship</span>
                        <h1 className="font-serif text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight">설교 말씀</h1>
                        <p className="text-white/60 text-base md:text-lg lg:text-xl font-light max-w-2xl mx-auto px-4">언제 어디서나 하나님의 말씀을 통해 영적 회복과 평안을 누리시기 바랍니다.</p>

                        <div className="pt-4 md:pt-6">
                            <a
                                href={CHURCH_DATA.contact.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 md:gap-3 px-5 md:px-8 py-3 md:py-4 bg-[#FF0000] text-white rounded-full font-bold text-sm md:text-base shadow-2xl hover:bg-[#cc0000] transition-all hover:scale-105"
                            >
                                <Youtube size={20} className="md:w-6 md:h-6" /> <span className="hidden sm:inline">주성교회</span> 유튜브 채널
                            </a>
                        </div>
                    </div>
                </section>

                <section className="py-12 md:py-24 px-4 md:px-6">
                    <div className="container mx-auto max-w-6xl">
                        {loading ? (
                            <div className="flex flex-col items-center py-16 md:py-32 space-y-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">Loading Sermons...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                                {sermons.map((sermon, idx) => {
                                    const getYoutubeId = (url: string) => {
                                        if (!url) return null;
                                        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                        const match = url.match(regExp);
                                        return (match && match[2].length === 11) ? match[2] : null;
                                    };
                                    const youtubeId = sermon.id?.length === 11 ? sermon.id : getYoutubeId(sermon.linkUrl);

                                    return (
                                        <div
                                            key={sermon.id || idx}
                                            className="bg-white rounded-[24px] md:rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all group border border-stone-100 cursor-pointer"
                                            onClick={() => !youtubeId && sermon.linkUrl && window.open(sermon.linkUrl, '_blank')}
                                        >
                                            <div className="aspect-video relative overflow-hidden bg-stone-900">
                                                {youtubeId ? (
                                                    <iframe
                                                        className="w-full h-full"
                                                        src={`https://www.youtube.com/embed/${youtubeId}`}
                                                        title={sermon.title}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                ) : (
                                                    <>
                                                        {sermon.imageUrl || sermon.thumbnail ? (
                                                            <img src={sermon.imageUrl || sermon.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                                                <Play size={48} />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#8B4513] shadow-xl">
                                                                <Play size={24} className="ml-1" fill="currentColor" />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="p-6 md:p-10 space-y-3 md:space-y-4">
                                                <div className="flex items-center gap-2 md:gap-3 text-stone-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                                                    <Calendar size={12} className="md:w-3.5 md:h-3.5" />
                                                    {sermon.publishedAt ? new Date(sermon.publishedAt).toLocaleDateString() : (sermon.created_at ? new Date(sermon.created_at.seconds * 1000).toLocaleDateString() : 'Recent')}
                                                </div>
                                                <h3 className="font-serif text-xl md:text-2xl font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-[#8B4513] transition-colors">{sermon.title}</h3>
                                                <p className="text-stone-500 text-sm line-clamp-2 font-light hidden md:block">{sermon.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
