'use client';

import React, { useState, useEffect, memo } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { CHURCH_DATA, checkIfAdmin } from '../lib/constants';
import { ArrowRight, Loader2, Image as ImageIcon, Plus, Edit2, Settings } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useRouter } from 'next/navigation';

// ===========================================================
// Default fallback images - reliable, direct Unsplash URLs
// ===========================================================
const FALLBACK_IMAGES: Record<string, string> = {
    edu: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    worship: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    mission: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
};

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80';

// ===========================================================
// Memoized Ministry Card
// ===========================================================
const MinistryCard = memo(({ m, idx, isAdmin, onAdmin }: {
    m: any; idx: number; isAdmin: boolean; onAdmin: () => void;
}) => {
    const [imgError, setImgError] = useState(false);
    const imgSrc = imgError
        ? (FALLBACK_IMAGES[m.id] || DEFAULT_IMG)
        : (m.img || FALLBACK_IMAGES[m.id] || DEFAULT_IMG);

    return (
        <div
            className={`flex flex-col lg:items-center gap-10 lg:gap-20 ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
            style={{ animation: `fadeSlideUp 0.6s ease-out ${idx * 0.15}s both` }}
        >
            <div className="w-full lg:w-1/2">
                <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-[32px] overflow-hidden shadow-lg group border border-stone-100 bg-stone-100">
                    <img
                        src={imgSrc}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={m.name}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        onError={() => setImgError(true)}
                    />
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-500" />
                    {isAdmin && (
                        <button
                            onClick={onAdmin}
                            className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-400 hover:text-[#8B4513] shadow-xl opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Edit2 size={20} />
                        </button>
                    )}
                </div>
            </div>
            <div className="w-full lg:w-1/2 space-y-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <span className="w-14 h-[1px] bg-[#8B4513]" />
                        <span className="text-[#8B4513] font-black text-[11px] uppercase tracking-[0.4em]">{m.engName}</span>
                    </div>
                    <h2 className="font-serif text-4xl md:text-6xl font-bold text-stone-900 leading-tight tracking-tight">{m.name}</h2>
                </div>
                <div className="space-y-6 text-stone-600 text-lg font-light leading-relaxed max-w-lg">
                    <p>{m.desc}</p>
                    {m.detail && <p className="text-stone-500 text-base leading-relaxed pt-4 border-t border-stone-100">{m.detail}</p>}
                </div>
            </div>
        </div>
    );
});
MinistryCard.displayName = 'MinistryCard';

// ===========================================================
// Activity Card
// ===========================================================
const ActivityCard = memo(({ act, isAdmin, onAdmin }: {
    act: any; isAdmin: boolean; onAdmin: () => void;
}) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="break-inside-avoid group relative rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer bg-stone-100">
            {!imgError && act.imageUrl ? (
                <img
                    src={act.imageUrl}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={act.title}
                    loading="lazy"
                    decoding="async"
                    onError={() => setImgError(true)}
                />
            ) : (
                <div className="w-full aspect-video flex items-center justify-center bg-stone-200 text-stone-400">
                    <ImageIcon size={40} />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <span className="text-white/60 text-[10px] font-black tracking-widest uppercase mb-2">{act.category} | {act.date}</span>
                <h3 className="text-white text-xl font-bold mb-1">{act.title}</h3>
                <p className="text-white/80 text-sm line-clamp-3 font-light leading-relaxed">{act.description}</p>
            </div>
            {isAdmin && (
                <button
                    onClick={onAdmin}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-400 hover:text-[#8B4513] shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                    <Edit2 size={16} />
                </button>
            )}
        </div>
    );
});
ActivityCard.displayName = 'ActivityCard';

// ===========================================================
// Main Page Component
// ===========================================================
export default function MinistryPage() {
    const { user } = useAuth();
    const router = useRouter();
    const isAdmin = checkIfAdmin(user);

    // Initialize with static data immediately for instant render
    const [ministries, setMinistries] = useState<any[]>(CHURCH_DATA.ministries);
    const [activities, setActivities] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(false); // start false since we have static data

    useEffect(() => {
        if (!db) return;

        // Only show loading for activities (Firestore-only data)
        setLoading(true);

        const qMin = query(collection(db, 'ministries'), orderBy('created_at', 'desc'));
        const unsubMin = onSnapshot(qMin, (snapshot) => {
            if (!snapshot.empty) {
                setMinistries(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            }
        });

        const qAct = query(collection(db, 'ministry_activities'), orderBy('created_at', 'desc'));
        const unsubAct = onSnapshot(qAct, (snapshot) => {
            setActivities(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
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

    const goAdmin = () => router.push('/admin');

    return (
        <div className="bg-[#faf9f6] min-h-screen pt-24 font-sans selection:bg-[#8B4513] selection:text-white">
            {/* Inline CSS animation (avoids framer-motion overhead) */}
            <style jsx>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <main>
                {/* Hero Header */}
                <section className="relative py-24 md:py-32 px-6 overflow-hidden bg-white">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-[#8B4513]/5 blur-[120px] pointer-events-none" />
                    <div className="container mx-auto max-w-6xl text-center space-y-6 relative z-10">
                        <span className="text-[#8B4513] font-black tracking-[0.4em] text-[12px] uppercase"
                            style={{ animation: 'fadeSlideUp 0.6s ease-out both' }}>
                            Service & Mission
                        </span>
                        <h1 className="font-serif text-4xl md:text-7xl text-stone-900 font-bold leading-tight tracking-tight"
                            style={{ animation: 'fadeSlideUp 0.7s ease-out 0.1s both' }}>
                            {settings.ministry_title || '세상을 섬기는 사역'}
                        </h1>
                        <p className="text-stone-500 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed"
                            style={{ animation: 'fadeSlideUp 0.7s ease-out 0.2s both' }}>
                            {settings.ministry_desc || '주성교회는 모든 세대와 이웃을 향해 하나님의 사랑을 전하는 다양한 사역을 펼치고 있습니다.'}
                        </p>
                        {isAdmin && (
                            <button
                                onClick={goAdmin}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-100 rounded-full text-stone-500 text-xs font-bold hover:bg-stone-200 transition-all mt-6"
                            >
                                <Settings size={14} /> 헤더 문구 수정하기
                            </button>
                        )}
                    </div>
                </section>

                {/* Ministry List */}
                <section className="py-16 md:py-24 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-16 md:mb-24 border-b border-stone-100 pb-8 flex flex-col md:flex-row items-end justify-between gap-6">
                            <div className="space-y-3">
                                <span className="text-[#8B4513] font-black tracking-[0.4em] text-[10px] uppercase">Our Mission</span>
                                <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900">사역 소개</h2>
                                <p className="text-stone-400 font-light text-base">우리의 부름받은 사명에 대해 안내해 드립니다.</p>
                            </div>
                            {isAdmin && (
                                <button
                                    onClick={goAdmin}
                                    className="flex items-center gap-2 text-[#8B4513] font-bold text-sm hover:gap-3 transition-all underline underline-offset-8"
                                >
                                    사역 항목 관리하기 <ArrowRight size={16} />
                                </button>
                            )}
                        </div>

                        <div className="space-y-24 md:space-y-36">
                            {ministries.map((m, idx) => (
                                <MinistryCard
                                    key={m.id || idx}
                                    m={m}
                                    idx={idx}
                                    isAdmin={isAdmin}
                                    onAdmin={goAdmin}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Activities Gallery */}
                <section className="py-16 md:py-24 px-6 bg-white">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-12 text-center space-y-3">
                            <span className="text-[#8B4513] font-black tracking-[0.4em] text-[10px] uppercase">Activity Flow</span>
                            <h2 className="font-serif text-3xl md:text-5xl font-bold text-stone-900">
                                {settings.gallery_title || '사역 현장'}
                            </h2>
                            <p className="text-stone-500 text-base font-light">
                                {settings.gallery_desc || '은혜와 감동이 있는 주성교회의 사역 현장을 전해드립니다.'}
                            </p>
                            {isAdmin && activities.length > 0 && (
                                <button
                                    onClick={goAdmin}
                                    className="px-8 py-3 bg-[#8B4513] text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all mt-4 inline-flex items-center gap-2"
                                >
                                    <Plus size={20} /> 새로운 사진 등록하기
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center py-16">
                                <Loader2 className="w-8 h-8 text-[#8B4513] animate-spin" />
                            </div>
                        ) : activities.length === 0 ? (
                            <div className="bg-stone-50 rounded-[40px] py-24 text-center border border-stone-100 group">
                                <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto text-stone-200 mb-5 group-hover:scale-110 transition-transform duration-500">
                                    <ImageIcon size={36} />
                                </div>
                                <p className="text-stone-400 font-bold tracking-widest uppercase text-xs">등록된 활동 사진이 없습니다.</p>
                                {isAdmin && (
                                    <button
                                        onClick={goAdmin}
                                        className="mt-6 px-8 py-4 bg-[#8B4513] text-white rounded-full font-bold shadow-2xl hover:bg-stone-900 transition-all flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <Plus size={20} /> 첫 번째 소식 작성하기
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                                {activities.map((act) => (
                                    <ActivityCard key={act.id} act={act} isAdmin={isAdmin} onAdmin={goAdmin} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {isAdmin && (
                <div className="fixed bottom-8 right-8 z-[100]">
                    <button
                        onClick={goAdmin}
                        className="w-14 h-14 bg-stone-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all group relative"
                    >
                        <Settings className="group-hover:rotate-90 transition-transform duration-500" />
                        <span className="absolute right-full mr-3 px-3 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            관리자 대시보드
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}
