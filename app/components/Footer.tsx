'use client';

import React from 'react';
import { Mail, Phone, MapPin, Youtube, Instagram, ArrowRight, LogOut, Settings, Heart } from 'lucide-react';
import { CHURCH_DATA, checkIfAdmin } from '../lib/constants';
import { useAuth } from '../lib/AuthContext';
import Link from 'next/link';

const Footer = () => {
    const { user, login, logout } = useAuth();
    const isAdmin = checkIfAdmin(user);

    return (
        <footer className="bg-[#CABFAB] border-t border-[#CABFAB] py-24 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8 mb-24">
                    <div className="lg:col-span-1 space-y-8 flex flex-col items-center">
                        <div className="space-y-2 text-center">
                            <span className="text-[10px] font-bold uppercase text-stone-700 tracking-widest block">Time for Grace</span>
                            <h4 className="font-serif text-2xl font-bold text-[#1A1A1A] tracking-tight">예배 시간</h4>
                        </div>
                        <div className="space-y-4 pt-2 w-full max-w-sm">
                            {CHURCH_DATA.worship.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center group border-b border-[#1A1A1A]/10 pb-3 last:border-0 last:pb-0">
                                    <span className="text-stone-800 text-sm font-medium group-hover:text-[#1A1A1A] transition-colors">{item.name}</span>
                                    <span className="font-bold text-[#1A1A1A] transition-colors">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-8 flex flex-col items-center">
                        <div className="space-y-2 text-center">
                            <span className="text-[10px] font-bold uppercase text-stone-700 tracking-widest block">Let's Connect</span>
                            <h4 className="font-serif text-2xl font-bold text-[#1A1A1A] tracking-tight">연락처</h4>
                        </div>
                        <div className="space-y-6 text-stone-800 w-fit mx-auto">
                            <div className="flex items-start gap-4">
                                <MapPin size={20} className="text-stone-700 mt-0.5 shrink-0" />
                                <p className="leading-relaxed text-sm font-medium text-left break-keep">{CHURCH_DATA.contact.address}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone size={20} className="text-stone-700 shrink-0" />
                                <p className="font-bold text-sm text-[#1A1A1A] tracking-wide text-left">{CHURCH_DATA.contact.phone}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail size={20} className="text-stone-700 shrink-0" />
                                <p className="text-sm font-medium text-left">{CHURCH_DATA.contact.email}</p>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 pt-2 mt-2 w-full max-w-sm">
                            <a href={CHURCH_DATA.contact.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-[#1A1A1A]/10 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-stone-50 hover:border-black/20 transition-all"><Youtube size={18} /></a>
                            <a href="https://blog.naver.com/joosung0416" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-[#1A1A1A]/10 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-stone-50 hover:border-black/20 transition-all">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 17H12.5V11.5L10 17H7.5V7H10V12.5L12.5 7H15V17Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-8 flex flex-col items-center">
                        <div className="space-y-2 text-center">
                            <span className="text-[10px] font-bold uppercase text-stone-700 tracking-widest block">Find Our Way</span>
                            <h4 className="font-serif text-2xl font-bold text-[#1A1A1A] tracking-tight">지도 안내</h4>
                        </div>
                        <div
                            onClick={() => window.open(CHURCH_DATA.contact.naverMap, '_blank')}
                            className="rounded-3xl overflow-hidden h-48 bg-stone-100 border border-[#1A1A1A]/10 cursor-pointer group relative w-full max-w-sm"
                        >
                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" alt="Map View" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" />
                            <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors flex items-center justify-center p-6">
                                <div className="bg-white/90 backdrop-blur-sm text-[#1A1A1A] p-4 rounded-xl border border-[#1A1A1A]/10 flex flex-col items-center gap-2 transform group-hover:-translate-y-2 transition-transform duration-300">
                                    <MapPin size={24} />
                                    <span className="text-xs font-bold whitespace-nowrap">네이버 지도로 길 찾기</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-[#1A1A1A]/10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <p className="text-stone-800 text-xs text-center md:text-left font-medium">© {new Date().getFullYear()} Joosung Holiness Church. All rights reserved.</p>
                        <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-stone-700">
                            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Terms</a>
                            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Privacy</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 px-4 py-2 border border-[#1A1A1A]/10 rounded-full hover:bg-stone-50 transition-colors text-xs font-bold uppercase tracking-widest text-[#1A1A1A]"
                                >
                                    <Settings size={14} />
                                    <span>{isAdmin ? 'Admin Console' : 'My Account'}</span>
                                </Link>
                                <button onClick={() => logout()} className="text-stone-700 hover:text-red-700 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors">
                                    <LogOut size={14} /> Log out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => login()}
                                className="flex items-center gap-2 px-4 py-2 border border-[#1A1A1A]/10 rounded-full text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:bg-stone-50 transition-colors"
                            >
                                <span>Admin Login</span> <ArrowRight size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-16 pb-8 text-center flex justify-center text-stone-500">
                    <Heart size={14} fill="currentColor" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
