'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { CHURCH_DATA } from '../lib/constants';
import { FileText, Download, Calendar, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BulletinPage() {
    const [bulletins, setBulletins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBulletins = async () => {
            if (!db) return;

            try {
                const q = query(
                    collection(db, 'main_contents'),
                    where('type', '==', 'bulletin'),
                    orderBy('created_at', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBulletins(data);
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBulletins();
    }, []);

    return (
        <div className="bg-[#faf9f6] min-h-screen pt-20 md:pt-24 font-sans selection:bg-[#8B4513] selection:text-white">
            <main>
                {/* Hero Section */}
                <section className="py-24 px-6 bg-stone-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                        <img
                            src="https://images.unsplash.com/photo-1507692049790-de58293a4697?auto=format&fit=crop&q=80"
                            className="w-full h-full object-cover"
                            alt="Weekly Bulletin"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent" />

                    <div className="container mx-auto max-w-5xl relative z-10 text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <span className="text-amber-400 font-black tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-[12px] uppercase">
                                Weekly News & Worship Guide
                            </span>
                            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">주보 보기</h1>
                            <p className="text-white/70 text-lg md:text-xl font-light max-w-2xl mx-auto px-4 leading-relaxed">
                                주성교회의 예배 순서와 한 주간의 소식을 확인하실 수 있습니다.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-20 px-4 md:px-6">
                    <div className="container mx-auto max-w-5xl">
                        {loading ? (
                            <div className="flex flex-col items-center py-20 space-y-4">
                                <Loader2 className="w-10 h-10 text-[#8B4513] animate-spin" />
                                <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">Loading Bulletins...</p>
                            </div>
                        ) : bulletins.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-[40px] border border-stone-200 border-dashed">
                                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FileText className="text-stone-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2">등록된 주보가 없습니다</h3>
                                <p className="text-stone-500">아직 업로드된 주보가 없습니다. 나중에 다시 확인해주세요.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {bulletins.map((b, idx) => (
                                    <motion.div
                                        key={b.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group bg-white rounded-[32px] p-8 border border-stone-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden cursor-pointer"
                                        onClick={() => b.linkUrl && window.open(b.linkUrl, '_blank')}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[100px] transition-transform group-hover:scale-150 duration-700 pointer-events-none" />

                                        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center">
                                            <div className="w-16 h-16 bg-[#8B4513]/5 rounded-2xl flex items-center justify-center text-[#8B4513] group-hover:bg-[#8B4513] group-hover:text-white transition-colors">
                                                <FileText size={32} />
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-wider">
                                                    <Calendar size={14} />
                                                    {b.created_at ? new Date(b.created_at.seconds * 1000).toLocaleDateString() : 'Unknown Date'}
                                                </div>
                                                <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-[#8B4513] transition-colors">
                                                    {b.title}
                                                </h3>
                                                {b.description && (
                                                    <p className="text-stone-500 text-sm line-clamp-1">{b.description}</p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-center w-12 h-12 rounded-full border border-stone-200 text-stone-300 group-hover:border-[#8B4513] group-hover:text-[#8B4513] transition-all">
                                                {b.linkUrl ? <Download size={20} /> : <ChevronRight size={20} />}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
