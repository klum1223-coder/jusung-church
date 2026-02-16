'use client';

import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { Flame, Plus, X, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrayerCandle {
    id: string;
    message: string;
    category: string;
    created_at: any;
    position: { x: number; y: number };
}

const PRAYER_CATEGORIES = [
    { id: 'healing', label: '치유', icon: '🩹' },
    { id: 'family', label: '가정', icon: '👨‍👩‍👧‍👦' },
    { id: 'study', label: '학업/시험', icon: '📚' },
    { id: 'work', label: '직장/사업', icon: '💼' },
    { id: 'faith', label: '신앙 성장', icon: '✝️' },
    { id: 'gratitude', label: '감사', icon: '🙏' },
    { id: 'other', label: '기타', icon: '💫' },
];

export default function PrayerPage() {
    const [candles, setCandles] = useState<PrayerCandle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoveredCandle, setHoveredCandle] = useState<PrayerCandle | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!db) return;

        const q = query(
            collection(db, 'prayer_candles'),
            orderBy('created_at', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results = snapshot.docs.map((doc, idx) => {
                const data = doc.data();
                // Generate position based on index for visual spread
                const angle = (idx / snapshot.docs.length) * Math.PI * 2;
                const radius = 15 + Math.random() * 25;
                return {
                    id: doc.id,
                    message: data.message || '',
                    category: data.category || 'other',
                    created_at: data.created_at,
                    position: {
                        x: 50 + Math.cos(angle) * radius + (Math.random() - 0.5) * 20,
                        y: 50 + Math.sin(angle) * radius + (Math.random() - 0.5) * 15
                    }
                };
            });
            setCandles(results);
        });

        return () => unsubscribe();
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    const getTimeAgo = (timestamp: any) => {
        if (!timestamp) return '방금 전';
        const now = new Date();
        const then = new Date(timestamp.seconds * 1000);
        const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

        if (diff < 60) return '방금 전';
        if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
        return `${Math.floor(diff / 86400)}일 전`;
    };

    const getCategoryInfo = (categoryId: string) => {
        return PRAYER_CATEGORIES.find(c => c.id === categoryId) || PRAYER_CATEGORIES[6];
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pt-20 md:pt-24 overflow-hidden relative"
            onMouseMove={handleMouseMove}
        >
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-[80px]" />
            </div>

            {/* Header Section */}
            <section className="relative z-10 py-10 md:py-16 px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-4 md:space-y-6 max-w-3xl mx-auto"
                >
                    <span className="text-amber-400/80 font-black tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-[11px] uppercase">
                        Intercessory Prayer
                    </span>
                    <h1 className="font-serif text-3xl md:text-5xl lg:text-7xl text-white font-bold leading-tight">
                        중보기도의 <span className="text-amber-400">빛</span>
                    </h1>
                    <p className="text-stone-400 text-base md:text-lg lg:text-xl font-light max-w-xl mx-auto leading-relaxed px-4">
                        촋불 하나가 켜질 때마다, 우리의 기도가 하나님께 올라갑니다.<br className="hidden md:block" />
                        함께 빛이 되어 서로를 위해 기도해 주세요.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className="mt-6 md:mt-8 inline-flex items-center gap-2 md:gap-3 px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-base md:text-lg shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
                    >
                        <Flame className="w-5 h-5 md:w-6 md:h-6" />
                        촛불 켜기
                    </motion.button>

                    <p className="text-stone-500 text-xs md:text-sm">
                        현재 <span className="text-amber-400 font-bold">{candles.length}</span>개의 촛불이 타오르고 있습니다
                    </p>
                </motion.div>
            </section>

            {/* Candles Display Area */}
            <section className="relative z-10 min-h-[50vh] md:min-h-[60vh] px-4 md:px-6">
                <div className="relative w-full max-w-5xl mx-auto h-[350px] md:h-[500px]">
                    <AnimatePresence>
                        {candles.map((candle, idx) => (
                            <motion.div
                                key={candle.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.5 }}
                                className="absolute cursor-pointer"
                                style={{
                                    left: `${candle.position.x}%`,
                                    top: `${candle.position.y}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                                onMouseEnter={() => setHoveredCandle(candle)}
                                onMouseLeave={() => setHoveredCandle(null)}
                            >
                                <CandleFlame size={hoveredCandle?.id === candle.id ? 'lg' : 'md'} />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {candles.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 mx-auto rounded-full bg-stone-800/50 flex items-center justify-center">
                                    <Flame className="w-10 h-10 text-stone-600" />
                                </div>
                                <p className="text-stone-500 font-light">
                                    첫 번째 촛불을 켜주세요
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Tooltip */}
            <AnimatePresence>
                {hoveredCandle && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="fixed z-50 pointer-events-none"
                        style={{
                            left: mousePos.x + 15,
                            top: mousePos.y + 15
                        }}
                    >
                        <div className="bg-stone-900/95 backdrop-blur-xl border border-stone-700/50 rounded-2xl p-5 shadow-2xl max-w-xs">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">{getCategoryInfo(hoveredCandle.category).icon}</span>
                                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
                                    {getCategoryInfo(hoveredCandle.category).label}
                                </span>
                                <span className="text-stone-500 text-xs ml-auto">
                                    {getTimeAgo(hoveredCandle.created_at)}
                                </span>
                            </div>
                            {hoveredCandle.message ? (
                                <p className="text-white/90 text-sm leading-relaxed font-light">
                                    "{hoveredCandle.message}"
                                </p>
                            ) : (
                                <p className="text-stone-400 text-sm italic">
                                    조용한 기도가 올려졌습니다
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Prayer Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <PrayerModal onClose={() => setIsModalOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

// Candle Flame Component with CSS Animation
const CandleFlame = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
        sm: 'w-4 h-6',
        md: 'w-6 h-10',
        lg: 'w-8 h-14'
    };

    return (
        <div className="relative flex flex-col items-center group">
            {/* Glow Effect */}
            <div className={`absolute -inset-4 bg-amber-400/20 rounded-full blur-xl transition-all duration-300 group-hover:bg-amber-400/40`} />

            {/* Flame */}
            <div className={`relative ${sizeClasses[size]} transition-all duration-300`}>
                <div className="absolute inset-0 candle-flame">
                    <div className="flame-outer" />
                    <div className="flame-inner" />
                </div>
            </div>

            {/* Candle Base */}
            <div className="w-2 h-4 bg-gradient-to-b from-amber-100 to-amber-200 rounded-b-sm shadow-lg" />

            <style jsx>{`
                .candle-flame {
                    filter: blur(0.5px);
                }
                
                .flame-outer {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to top, #f59e0b, #fbbf24, #fcd34d, transparent);
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    animation: flicker 0.8s ease-in-out infinite alternate;
                }
                
                .flame-inner {
                    position: absolute;
                    bottom: 2px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 50%;
                    height: 60%;
                    background: linear-gradient(to top, #fef3c7, #fffbeb, white);
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    animation: flicker 0.6s ease-in-out infinite alternate-reverse;
                }
                
                @keyframes flicker {
                    0% {
                        transform: translateX(-50%) scaleY(1) scaleX(1);
                        opacity: 1;
                    }
                    25% {
                        transform: translateX(-52%) scaleY(1.02) scaleX(0.98);
                    }
                    50% {
                        transform: translateX(-48%) scaleY(0.98) scaleX(1.02);
                        opacity: 0.95;
                    }
                    75% {
                        transform: translateX(-51%) scaleY(1.01) scaleX(0.99);
                    }
                    100% {
                        transform: translateX(-50%) scaleY(0.97) scaleX(1.01);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

// Prayer Modal Component
const PrayerModal = ({ onClose }: { onClose: () => void }) => {
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('other');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addDoc(collection(db, 'prayer_candles'), {
                message: message.trim(),
                category,
                created_at: serverTimestamp()
            });

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Prayer submission failed:', error);
            alert('기도를 등록하는 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-lg bg-gradient-to-b from-stone-900 to-stone-950 rounded-[32px] border border-stone-800 shadow-2xl overflow-hidden"
            >
                {isSuccess ? (
                    <div className="p-12 text-center space-y-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="w-24 h-24 mx-auto"
                        >
                            <CandleFlame size="lg" />
                        </motion.div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-serif font-bold text-white">
                                촛불이 켜졌습니다
                            </h3>
                            <p className="text-stone-400 font-light">
                                당신의 기도가 하나님께 올라갑니다 🙏
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-8 border-b border-stone-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-white">
                                    촛불 켜기
                                </h3>
                                <p className="text-stone-500 text-sm mt-1">
                                    기도 제목을 남기거나, 조용히 마음만 담아도 됩니다
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-stone-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Category Selection */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                                    기도 분류 (선택)
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {PRAYER_CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setCategory(cat.id)}
                                            className={`p-3 rounded-xl text-center transition-all ${category === cat.id
                                                ? 'bg-amber-500/20 border-amber-500/50 border text-amber-400'
                                                : 'bg-stone-800/50 border border-stone-700/50 text-stone-400 hover:bg-stone-800'
                                                }`}
                                        >
                                            <span className="text-lg block mb-1">{cat.icon}</span>
                                            <span className="text-[10px] font-bold">{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Prayer Message */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                                    기도 제목 (선택)
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="마음을 담아 기도 제목을 남겨주세요... (비워두셔도 됩니다)"
                                    rows={4}
                                    maxLength={200}
                                    className="w-full bg-stone-800/50 border border-stone-700/50 rounded-2xl p-4 text-white placeholder:text-stone-600 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none"
                                />
                                <p className="text-right text-stone-600 text-xs">
                                    {message.length}/200
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Flame className="w-5 h-5" />
                                        촛불 켜기
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};
