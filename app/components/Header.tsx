'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Settings, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
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
        { name: '교회소개', eng: 'History', href: '/about' },
        { name: '예배안내', eng: 'Worship', href: '/worship' },
        { name: '설교말씀', eng: 'Sermons', href: '/sermon' },
        { name: '사역안내', eng: 'Ministry', href: '/ministry' },
        { name: '중보기도', eng: 'Prayer', href: '/prayer' },
        { name: '마음쉼터', eng: 'Soul Rest', href: '/counselor' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-700 ${scrolled || !isHome
            ? 'glass py-4 shadow-xl shadow-black/5'
            : 'bg-transparent py-8'
            }`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-serif font-black text-2xl transition-all duration-500 ${scrolled || !isHome
                        ? 'bg-[#8B4513] text-white shadow-lg'
                        : 'bg-white/10 backdrop-blur-md text-white border border-white/20'
                        }`}>J</div>
                    <div className="flex flex-col">
                        <h1 className={`text-2xl font-serif font-black tracking-tight transition-colors duration-500 ${scrolled || !isHome ? 'text-stone-900' : 'text-white drop-shadow-lg'
                            }`}>
                            {CHURCH_DATA.name}
                        </h1>
                        <span className={`text-[9px] uppercase tracking-[0.4em] font-black transition-colors duration-500 ${scrolled || !isHome ? 'text-[#8B4513]' : 'text-white/70'
                            }`}>
                            {CHURCH_DATA.engName}
                        </span>
                    </div>
                </Link>

                <nav className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`px-5 py-2 rounded-full flex flex-col items-center group relative transition-all duration-300 ${pathname === item.href
                                ? (scrolled || !isHome ? 'bg-[#8B4513]/5' : 'bg-white/10')
                                : 'hover:bg-white/5'
                                }`}
                        >
                            <span className={`text-[13px] font-bold transition-colors ${pathname === item.href
                                ? '#8B4513'
                                : (scrolled || !isHome ? 'text-stone-600 group-hover:text-[#8B4513]' : 'text-white group-hover:text-white/100 text-white/80')
                                } ${pathname === item.href && (scrolled || !isHome ? 'text-[#8B4513]' : 'text-white')}`}>
                                {item.name}
                            </span>
                            <span className={`text-[8px] uppercase tracking-widest font-black transition-opacity ${pathname === item.href ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                                } ${scrolled || !isHome ? 'text-[#8B4513]' : 'text-white'}`}>
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
                        <button
                            onClick={login}
                            className={`px-10 py-3.5 rounded-full font-black text-[11px] tracking-widest transition-all transform active:scale-95 flex items-center gap-2 ${scrolled || !isHome
                                ? 'bg-stone-900 text-white hover:bg-[#8B4513] shadow-2xl'
                                : 'glass text-stone-900 hover:bg-white shadow-lg'
                                }`}
                        >
                            <Sparkles size={14} />
                            LOGIN
                        </button>
                    )}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className={`lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${scrolled || !isHome ? 'bg-stone-100 text-stone-900' : 'glass text-stone-900'
                            }`}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-md transition-opacity duration-500" onClick={() => setIsMenuOpen(false)} />
                    <div className="absolute right-0 top-0 h-full w-full max-w-[360px] bg-white shadow-2xl p-12 flex flex-col transform transition-transform duration-500 animate-in slide-in-from-right">
                        <div className="flex justify-between items-center mb-16">
                            <div className="w-12 h-12 bg-[#8B4513] text-white rounded-2xl flex items-center justify-center text-2xl font-bold font-serif">✝</div>
                            <button onClick={() => setIsMenuOpen(false)} className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 hover:text-stone-900 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center justify-between py-4 border-b border-stone-50 group px-2 rounded-xl transition-all ${pathname === item.href ? 'bg-stone-50' : 'hover:bg-stone-50'
                                        }`}
                                >
                                    <div className="flex flex-col">
                                        <span className={`text-2xl font-serif font-black ${pathname === item.href ? 'text-[#8B4513]' : 'text-stone-800'
                                            }`}>
                                            {item.name}
                                        </span>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-stone-400">{item.eng}</span>
                                    </div>
                                    <ArrowRight size={20} className={`transition-transform group-hover:translate-x-2 ${pathname === item.href ? 'text-[#8B4513]' : 'text-stone-200'
                                        }`} />
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
