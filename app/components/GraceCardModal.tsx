'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Share2, Sparkles, Heart } from 'lucide-react';
import { SCRIPTURES, Scripture } from '../lib/scriptures';

interface GraceCardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GraceCardModal({ isOpen, onClose }: GraceCardModalProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [currentScripture, setCurrentScripture] = useState<Scripture | null>(null);
    const [isShuffling, setIsShuffling] = useState(false);

    // Initialize and Reset
    useEffect(() => {
        if (isOpen) {
            setIsFlipped(false);
            setCurrentScripture(null);
            setIsShuffling(false);
        }
    }, [isOpen]);

    const drawCard = () => {
        if (isFlipped) return; // Prevent double click

        setIsShuffling(true);

        // Simulate shuffling sound or effect time
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * SCRIPTURES.length);
            setCurrentScripture(SCRIPTURES[randomIndex]);
            setIsShuffling(false);
            setIsFlipped(true);
        }, 800);
    };

    const resetCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentScripture(null);
        }, 300); // Wait for flip back animation
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md perspective-1000">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors z-[110]"
                >
                    <X size={32} />
                </button>

                {/* Card Container */}
                <div className="relative w-full aspect-[3/4] cursor-pointer group" onClick={!isFlipped ? drawCard : undefined}>
                    <motion.div
                        className="w-full h-full relative preserve-3d transition-all duration-700 ease-in-out font-serif"
                        animate={{
                            rotateY: isFlipped ? 180 : 0,
                            scale: isShuffling ? [1, 0.95, 1.05, 1] : 1
                        }}
                        transition={{
                            rotateY: { duration: 0.8, type: "spring", stiffness: 260, damping: 20 },
                            scale: { duration: 0.5 }
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front of Card (Cover) */}
                        <div className="absolute inset-0 backface-hidden rounded-[24px] shadow-2xl overflow-hidden border border-[#c5a065]/30">
                            <div className="absolute inset-0 bg-[#0f2922]">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                                {/* Decorative Elements */}
                                <div className="absolute top-0 left-0 w-full h-full border-[1px] border-[#c5a065]/20 m-2 rounded-[20px]"></div>
                                <div className="absolute top-0 left-0 w-full h-full border-[1px] border-[#c5a065]/20 m-3 rounded-[18px]"></div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                        className="mb-8"
                                    >
                                        <Sparkles size={48} className="text-[#c5a065]" />
                                    </motion.div>

                                    <h3 className="text-[#c5a065] text-sm font-black tracking-[0.3em] uppercase mb-4">Grace Draw</h3>
                                    <h2 className="text-white text-3xl font-bold font-serif leading-relaxed">
                                        오늘, 당신을 위한<br />
                                        <span className="text-[#c5a065]">하나님의 말씀</span>
                                    </h2>

                                    <div className="mt-12 px-6 py-3 bg-[#c5a065] text-[#0f2922] rounded-full font-bold text-sm tracking-widest hover:bg-white transition-colors shadow-lg shadow-black/20">
                                        {isShuffling ? "기도하는 중..." : "터치하여 뽑기"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Back of Card (Content) */}
                        <div
                            className="absolute inset-0 backface-hidden rounded-[24px] shadow-2xl overflow-hidden bg-white text-stone-900 rotate-y-180"
                            style={{ transform: 'rotateY(180deg)' }}
                        >
                            {/* Paper Texture Overlay */}
                            <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none"></div>

                            <div className="relative h-full flex flex-col items-center justify-between p-8 md:p-12 text-center">
                                <div className="w-full pt-4">
                                    <div className="w-12 h-1 bg-[#8B4513]/20 mx-auto rounded-full mb-8"></div>
                                    <Heart size={24} className="mx-auto text-[#8B4513]/40 mb-2" />
                                    <p className="text-[#8B4513]/60 text-xs font-bold tracking-widest uppercase">God's Message For You</p>
                                </div>

                                <div className="flex-1 flex items-center justify-center w-full">
                                    <div className="space-y-6">
                                        <p className="font-serif text-xl md:text-2xl font-medium leading-loose text-stone-800 break-keep">
                                            {currentScripture?.text}
                                        </p>
                                        <div className="w-full flex justify-center">
                                            <span className="inline-block w-8 h-[1px] bg-stone-300"></span>
                                        </div>
                                        <p className="text-stone-500 font-bold text-sm tracking-wide">
                                            {currentScripture?.source}
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full grid grid-cols-2 gap-3 pb-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={resetCard}
                                        className="flex items-center justify-center gap-2 py-3 bg-stone-100 rounded-xl text-stone-600 font-bold text-sm hover:bg-stone-200 transition-colors"
                                    >
                                        <RefreshCw size={16} /> 다시 뽑기
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="flex items-center justify-center gap-2 py-3 bg-[#8B4513] rounded-xl text-white font-bold text-sm hover:bg-[#723b10] transition-colors"
                                    >
                                        <Heart size={16} fill="currentColor" /> 아멘!
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {isFlipped && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-center mt-6"
                    >
                        <p className="text-white/40 text-xs">말씀을 마음에 새기고 승리하세요</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
