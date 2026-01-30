'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { CHURCH_DATA, checkIfAdmin } from '../lib/constants';
import { useAuth } from '../lib/AuthContext';
import { Settings, ShieldCheck } from 'lucide-react';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, login, logout } = useAuth();
    const pathname = usePathname();
    const isHome = pathname === '/';
    const isAdmin = checkIfAdmin(user);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: '교회소개', eng: 'About', href: '/about' },
        { name: '예배안내', eng: 'Worship', href: '/worship' },
        { name: '설교말씀', eng: 'Sermons', href: '/sermon' },
        { name: '사역안내', eng: 'Ministry', href: '/ministry' },
        { name: '매일묵상', eng: 'Meditation', href: '/meditation' },
        { name: '커뮤니티', eng: 'Community', href: '/community' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || !isHome ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-all ${scrolled || !isHome ? 'bg-[#8B4513] text-white shadow-lg' : 'bg-white text-[#8B4513]'}`}>✝</div>
                    <div className="flex flex-col">
                        <h1 className={`text-xl font-bold tracking-tighter transition-colors ${scrolled || !isHome ? 'text-stone-900' : 'text-white'}`}>
                            {CHURCH_DATA.name}
                        </h1>
                        <span className={`text-[8px] uppercase tracking-[0.3em] font-medium transition-colors ${scrolled || !isHome ? 'text-stone-400' : 'text-white/60'}`}>
                            {CHURCH_DATA.engName}
                        </span>
                    </div>
                </Link>

                <nav className={`hidden lg:flex items-center gap-10 font-bold text-[13px] ${scrolled || !isHome ? 'text-stone-600' : 'text-white/90'}`}>
                    {navItems.map((item) => (
                        <Link key={item.name} href={item.href} className="flex flex-col items-center group">
                            <span className={`transition-colors ${pathname === item.href ? 'text-[#8B4513]' : 'group-hover:text-[#8B4513]'}`}>{item.name}</span>
                            <span className="text-[9px] uppercase tracking-widest opacity-50 font-medium">{item.eng}</span>
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1.5">
                                    {isAdmin && <ShieldCheck size={12} className="text-[#8B4513]" />}
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${scrolled || !isHome ? 'text-stone-400' : 'text-white/60'}`}>
                                        {isAdmin ? 'Administrator' : 'Welcome'}
                                    </span>
                                </div>
                                <span className={`text-xs font-bold ${scrolled || !isHome ? 'text-stone-900' : 'text-white'}`}>{user.displayName || '성도'}님</span>
                            </div>
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${scrolled || !isHome ? 'bg-stone-100 text-[#8B4513] hover:bg-[#8B4513] hover:text-white' : 'bg-white/10 text-white hover:bg-white hover:text-[#8B4513]'}`}
                                    title="관리자 대시보드"
                                >
                                    <Settings size={18} />
                                </Link>
                            )}
                            <button onClick={logout} className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${scrolled || !isHome ? 'border-stone-200 text-stone-600 hover:bg-stone-50' : 'border-white/30 text-white hover:bg-white/10'}`}>LOGOUT</button>
                        </div>
                    ) : (
                        <button onClick={login} className={`px-6 py-2 rounded-full font-bold text-xs transition-all shadow-md active:scale-95 ${scrolled || !isHome ? 'bg-[#8B4513] text-white hover:bg-[#6d360f]' : 'bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-[#8B4513]'}`}>
                            LOGIN
                        </button>
                    )}
                    <button onClick={() => setIsMenuOpen(true)} className={`lg:hidden transition-colors ${scrolled || !isHome ? 'text-stone-900' : 'text-white'}`}>
                        <Menu size={28} />
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="absolute right-0 top-0 h-full w-[300px] bg-white shadow-2xl p-10 flex flex-col animate-in slide-in-from-right duration-500">
                        <button onClick={() => setIsMenuOpen(false)} className="self-end text-stone-400 hover:text-stone-900 mb-10"><X size={32} /></button>
                        <nav className="flex flex-col gap-8 font-bold text-xl text-stone-800">
                            {navItems.map((item) => (
                                <Link key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between">
                                    {item.name} <span className="text-[10px] text-stone-400">{item.eng}</span>
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
