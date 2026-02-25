'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Settings, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHURCH_DATA, checkIfAdmin } from '../lib/constants';
import { useAuth } from '../lib/AuthContext';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, login, logout } = useAuth();
    const pathname = usePathname();
    const isHome = pathname === '/';
    const isAdmin = checkIfAdmin(user);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: '교회소개', eng: 'History', href: '/intro' },
        { name: '예배안내', eng: 'Worship', href: '/worship' },
        { name: '설교말씀', eng: 'Sermons', href: '/sermon' },
        { name: '사역안내', eng: 'Ministry', href: '/ministry' },
        { name: '중보기도', eng: 'Prayer', href: '/prayer' },
        { name: '마음쉼터', eng: 'Soul Rest', href: '/counselor' },
        { name: '말씀나눔', eng: 'Sharing', href: '/sharing' },
    ];

    // Hamburger icon animation variants
    const topLine = {
        closed: { rotate: 0, y: 0 },
        open: { rotate: 45, y: 6 }
    };
    const middleLine = {
        closed: { opacity: 1 },
        open: { opacity: 0 }
    };
    const bottomLine = {
        closed: { rotate: 0, y: 0 },
        open: { rotate: -45, y: -6 }
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-700 ${scrolled || !isHome
            ? 'glass py-4 shadow-2xl shadow-black/10 border-b border-white/20'
            : 'bg-transparent py-8'
            }`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-4 group">
                    <motion.div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-serif font-black text-2xl transition-all duration-500 ${scrolled || !isHome
                            ? 'bg-gradient-to-br from-[#d4af37] to-[#8B4513] text-white shadow-lg shadow-[#8B4513]/30'
                            : 'bg-white/40 backdrop-blur-md text-stone-900 border border-stone-200'
                            }`}
                        whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.3 }}
                    >J</motion.div>
                    <div className="flex flex-col">
                        <h1 className={`text-2xl font-serif font-black tracking-tight transition-colors duration-500 ${scrolled || !isHome ? 'text-stone-900' : 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                            }`}>
                            {CHURCH_DATA.name}
                        </h1>
                        <span className={`text-[9px] uppercase tracking-[0.4em] font-black transition-colors duration-500 ${scrolled || !isHome ? 'text-[#8B4513]' : 'text-yellow-500/80 drop-shadow-[0_0_2px_rgba(250,204,21,0.5)]'
                            }`}>
                            {CHURCH_DATA.engName}
                        </span>
                    </div>
                </Link>

                <nav className="hidden lg:flex items-center gap-0.5">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`px-3 py-2 rounded-full flex flex-col items-center group relative transition-all duration-300 ${pathname === item.href
                                ? (scrolled || !isHome ? 'bg-gradient-to-r from-[#8B4513]/10 to-[#d4af37]/10' : 'bg-white/15 backdrop-blur-md')
                                : 'hover:bg-white/10'
                                }`}
                        >
                            <span className={`text-[17px] font-bold transition-colors whitespace-nowrap ${pathname === item.href
                                ? '#8B4513'
                                : (scrolled || !isHome ? 'text-stone-600 group-hover:text-[#8B4513]' : 'text-stone-300 group-hover:text-white')
                                } ${pathname === item.href && (scrolled || !isHome ? 'text-[#8B4513]' : 'text-white')}`}>
                                {item.name}
                            </span>
                            <span className={`text-[11px] uppercase tracking-widest font-black transition-opacity whitespace-nowrap ${pathname === item.href ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                                } ${scrolled || !isHome ? 'text-[#8B4513]' : 'text-stone-300'}`}>
                                {item.eng}
                            </span>
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="flex items-center gap-4 group">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${scrolled || !isHome ? 'text-stone-400' : 'text-white/60'
                                    }`}>
                                    {isAdmin ? 'Administrator' : 'Member'}
                                </span>
                                <span className={`text-sm font-bold ${scrolled || !isHome ? 'text-stone-900' : 'text-white'
                                    }`}>{user.displayName || '성도'}님</span>
                            </div>
                            <div className="relative">
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${scrolled || !isHome
                                            ? 'bg-stone-900 text-white hover:bg-[#8B4513] shadow-lg shadow-black/10'
                                            : 'glass text-stone-900 hover:bg-white'
                                            }`}
                                    >
                                        <Settings size={20} className="hover:rotate-90 transition-transform duration-500" />
                                    </Link>
                                )}
                            </div>
                            <button
                                onClick={logout}
                                className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${scrolled || !isHome
                                    ? 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20'
                                    }`}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <motion.button
                            onClick={login}
                            className={`px-10 py-3.5 rounded-full font-black text-[11px] tracking-widest transition-all flex items-center gap-2 relative overflow-hidden ${scrolled || !isHome
                                ? 'bg-gradient-to-r from-[#8b4513] to-[#d4af37] text-white shadow-2xl shadow-[#8b4513]/30'
                                : 'glass text-white hover:bg-white/20 shadow-lg bg-white/10'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                            />
                            <Sparkles size={14} className="relative z-10" />
                            <span className="relative z-10">LOGIN</span>
                        </motion.button>
                    )}

                    {/* Animated Hamburger Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`lg:hidden w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-colors ${scrolled || !isHome ? 'bg-stone-100 text-stone-900' : 'glass text-stone-900'
                            }`}
                    >
                        <motion.span
                            animate={isMenuOpen ? "open" : "closed"}
                            variants={topLine}
                            className={`block w-5 h-0.5 ${scrolled || !isHome ? 'bg-stone-900' : 'bg-white'}`}
                        />
                        <motion.span
                            animate={isMenuOpen ? "open" : "closed"}
                            variants={middleLine}
                            className={`block w-5 h-0.5 ${scrolled || !isHome ? 'bg-stone-900' : 'bg-white'}`}
                        />
                        <motion.span
                            animate={isMenuOpen ? "open" : "closed"}
                            variants={bottomLine}
                            className={`block w-5 h-0.5 ${scrolled || !isHome ? 'bg-stone-900' : 'bg-white'}`}
                        />
                    </button>
                </div>
            </div>

            {/* Mobile Menu with Framer Motion */}
            <AnimatePresence>
                {isMenuOpen && (
                    <div className="fixed inset-0 z-[100] lg:hidden">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-stone-950/60 backdrop-blur-md"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute right-0 top-0 h-full w-full max-w-[360px] bg-gradient-to-br from-white to-stone-50 shadow-2xl p-10 flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-12">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#8B4513] to-[#A0522D] text-white rounded-2xl flex items-center justify-center text-xl font-bold font-serif shadow-lg">J</div>
                                    <div>
                                        <p className="font-serif font-black text-stone-900">주성교회</p>
                                        <p className="text-[8px] uppercase tracking-widest text-stone-400">Menu</p>
                                    </div>
                                </motion.div>
                                <motion.button
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-11 h-11 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-all"
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex flex-col gap-3 flex-1">
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 + index * 0.05 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center justify-between py-4 px-4 rounded-2xl group transition-all ${pathname === item.href
                                                ? 'bg-gradient-to-r from-[#8B4513]/10 to-transparent border-l-4 border-[#8B4513]'
                                                : 'hover:bg-stone-100'
                                                }`}
                                        >
                                            <div className="flex flex-col">
                                                <span className={`text-xl font-serif font-black ${pathname === item.href ? 'text-[#8B4513]' : 'text-stone-800'
                                                    }`}>
                                                    {item.name}
                                                </span>
                                                <span className="text-[9px] uppercase font-black tracking-widest text-stone-400">{item.eng}</span>
                                            </div>
                                            <ArrowRight size={18} className={`transition-all group-hover:translate-x-1 ${pathname === item.href ? 'text-[#8B4513]' : 'text-stone-300 group-hover:text-stone-500'
                                                }`} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            {/* Footer */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="pt-6 border-t border-stone-100"
                            >
                                <p className="text-center text-xs text-stone-400">
                                    <Sparkles size={10} className="inline mr-1 text-amber-500" />
                                    세상을 비추는 거룩한 울림
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
