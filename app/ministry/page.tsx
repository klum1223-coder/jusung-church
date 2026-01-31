'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { CHURCH_DATA, checkIfAdmin } from '../lib/constants';
import { ArrowRight, Loader2, Image as ImageIcon, Plus, Edit2, Settings } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function MinistryPage() {
    const { user } = useAuth();
    const router = useRouter();
    const isAdmin = checkIfAdmin(user);

    const [ministries, setMinistries] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setMinistries(CHURCH_DATA.ministries);
            setLoading(false);
            return;
        }

        const qMin = query(collection(db, 'ministries'), orderBy('created_at', 'desc'));
        const unsubMin = onSnapshot(qMin, (snapshot) => {
            if (snapshot.empty) {
                setMinistries(CHURCH_DATA.ministries);
            } else {
                setMinistries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        });

        const qAct = query(collection(db, 'ministry_activities'), orderBy('created_at', 'desc'));
        const unsubAct = onSnapshot(qAct, (snapshot) => {
            setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        const unsubSett = onSnapshot(doc(db, 'settings', 'site'), (s) => {
            if (s.exists()) setSettings(s.data());
        });

        return () => {
            unsubMin();
            unsubAct();
            unsubSett();
        };
    }, []);

    return (
        <div className="bg-[#faf9f6] min-h-screen pt-24 font-sans selection:bg-[#8B4513] selection:text-white">
            <main>
                <section className="relative py-32 px-6 overflow-hidden bg-white">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-[#8B4513]/5 blur-[120px] pointer-events-none" />
                    <div className="container mx-auto max-w-6xl text-center space-y-8 relative z-10">
                        <span className="text-[#8B4513] font-black tracking-[0.4em] text-[12px] uppercase animate-in fade-in slide-in-from-bottom-4 duration-700">Service & Mission</span>
                        <h1 className="font-serif text-5xl md:text-8xl text-stone-900 font-bold leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            {settings.ministry_title || '세상을 섬기는 사역'}
                        </h1>
                        <p className="text-stone-500 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed animate-in fade-in duration-1000 delay-500">
                            {settings.ministry_desc || '주성교회는 모든 세대와 이웃을 향해 하나님의 사랑을 전하는 다양한 사역을 펼치고 있습니다.'}
                        </p>
                        {isAdmin && (
                            <button
                                onClick={() => router.push('/admin')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-100 rounded-full text-stone-500 text-xs font-bold hover:bg-stone-200 transition-all mt-8"
                            >
                                <Settings size={14} /> 헤더 문구 수정하기
                            </button>
                        )}
                    </div>
                </section>

                <section className="py-24 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-24 border-b border-stone-100 pb-12 flex flex-col md:flex-row items-end justify-between gap-6">
                            <div className="space-y-4">
                                <span className="text-[#8B4513] font-black tracking-[0.4em] text-[10px] uppercase">Our Mission</span>
                                <h2 className="font-serif text-5xl font-bold text-stone-900">사역 소개</h2>
                                <p className="text-stone-400 font-light text-lg">우리의 부름받은 사명에 대해 안내해 드립니다.</p>
                            </div>
                            {isAdmin && (
                                <button
                                    onClick={() => router.push('/admin')}
                                    className="flex items-center gap-2 text-[#8B4513] font-bold text-sm hover:gap-3 transition-all underline underline-offset-8"
                                >
                                    사역 항목 관리하기 <ArrowRight size={16} />
                                </button>
                            )}
                        </div>

                        <div className="space-y-48">
                            {ministries.map((m, idx) => (
                                <motion.div
                                    key={m.id || idx}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className={`flex flex-col lg:items-center gap-16 lg:gap-40 ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                                >
                                    <div className="w-full lg:w-1/2">
                                        <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl group border border-stone-100">
                                            <motion.img
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 1.5 }}
                                                src={m.img}
                                                className="w-full h-full object-cover"
                                                alt={m.name}
                                            />
                                            <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-700"></div>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => router.push('/admin')}
                                                    className="absolute top-10 right-10 w-14 h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-400 hover:text-[#8B4513] shadow-2xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                                                >
                                                    <Edit2 size={24} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/2 space-y-12">
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-6">
                                                <span className="w-20 h-[1px] bg-[#8B4513]"></span>
                                                <span className="text-[#8B4513] font-black text-[11px] uppercase tracking-[0.4em]">{m.engName}</span>
                                            </div>
                                            <h2 className="font-serif text-5xl md:text-7xl font-bold text-stone-900 leading-tight tracking-tight">{m.name}</h2>
                                        </div>
                                        <div className="space-y-8 text-stone-600 text-xl font-light leading-relaxed max-w-lg">
                                            <p>{m.desc}</p>
                                            {m.detail && <p className="text-stone-500 text-lg leading-relaxed pt-4 border-t border-stone-100">{m.detail}</p>}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 px-6 bg-white">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-16 text-center space-y-4">
                            <span className="text-[#8B4513] font-black tracking-[0.4em] text-[10px] uppercase">Activity Flow</span>
                            <h2 className="font-serif text-4xl md:text-6xl font-bold text-stone-900">
                                {settings.gallery_title || '사역 현장'}
                            </h2>
                            <p className="text-stone-500 text-lg font-light">
                                {settings.gallery_desc || '은혜와 감동이 있는 주성교회의 사역 현장을 전해드립니다.'}
                            </p>
                            {isAdmin && activities.length > 0 && (
                                <button
                                    onClick={() => router.push('/admin')}
                                    className="px-8 py-3 bg-[#8B4513] text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all mt-6 inline-flex items-center gap-2"
                                >
                                    <Plus size={20} /> 새로운 사진 등록하기
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center py-20">
                                <Loader2 className="w-10 h-10 text-[#8B4513] animate-spin" />
                            </div>
                        ) : activities.length === 0 ? (
                            <div className="bg-stone-50 rounded-[60px] py-32 text-center border border-stone-100 group">
                                <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto text-stone-200 mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <ImageIcon size={40} />
                                </div>
                                <p className="text-stone-400 font-bold tracking-widest uppercase text-xs">등록된 활동 사진이 없습니다.</p>
                                {isAdmin && (
                                    <button
                                        onClick={() => router.push('/admin')}
                                        className="mt-8 px-10 py-5 bg-[#8B4513] text-white rounded-full font-bold shadow-2xl hover:bg-stone-900 transition-all flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <Plus size={20} /> 첫 번째 소식 작성하기
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                                {activities.map((act) => (
                                    <motion.div
                                        key={act.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        className="break-inside-avoid group relative rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer"
                                    >
                                        <img src={act.imageUrl} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" alt={act.title} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                                            <span className="text-white/60 text-[10px] font-black tracking-widest uppercase mb-2">{act.category} | {act.date}</span>
                                            <h3 className="text-white text-2xl font-bold mb-2">{act.title}</h3>
                                            <p className="text-white/80 text-sm line-clamp-3 font-light leading-relaxed">{act.description}</p>
                                        </div>
                                        {isAdmin && (
                                            <button
                                                onClick={() => router.push('/admin')}
                                                className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-400 hover:text-[#8B4513] shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {isAdmin && (
                <div className="fixed bottom-10 right-10 z-[100]">
                    <button
                        onClick={() => router.push('/admin')}
                        className="w-16 h-16 bg-stone-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all group relative"
                    >
                        <Settings className="group-hover:rotate-90 transition-transform duration-500" />
                        <span className="absolute right-full mr-4 px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            관리자 대시보드 바로가기
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}
