'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';

export default function GlowingCross() {
    return (
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
            {/* Background Glow */}
            <motion.div
                className="absolute inset-0 bg-amber-500/20 rounded-full blur-[40px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Rotating Light Rays */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
                <div className="w-[1px] h-[150%] bg-gradient-to-t from-transparent via-amber-100/20 to-transparent" />
                <div className="absolute w-[150%] h-[1px] bg-gradient-to-r from-transparent via-amber-100/20 to-transparent" />
            </motion.div>

            {/* Cross Icon */}
            <div className="relative z-10 drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M12 2V22M4 8H20" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 4V20M6 8H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-90" />
                </svg>

                {/* Inner Shine */}
                <motion.div
                    className="absolute inset-0 bg-amber-100/30 blur-md rounded-full"
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>

            {/* Floating Stars */}
            <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
            >
                <Sparkles className="text-yellow-200 w-8 h-8 opacity-80" />
            </motion.div>

            <motion.div
                className="absolute top-1/2 -left-8"
                animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            >
                <Star className="text-amber-100 w-4 h-4 fill-amber-100" />
            </motion.div>
        </div>
    );
}
