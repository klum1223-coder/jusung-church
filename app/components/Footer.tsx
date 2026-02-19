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
        <footer className="bg-white border-t border-stone-100 pt-32 pb-16 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-stone-50 rounded-full blur-[150px] -z-10 translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8 mb-24">
                    <div className="lg:col-span-1 space-y-10">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-[#8B4513] tracking-widest block">Time for Grace</span>
                            <h4 className="font-serif text-2xl font-extrabold text-stone-900 tracking-tight">예배 시간</h4>
                        </div>
                        <div className="space-y-6">
                            {CHURCH_DATA.worship.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center group">
                                    <span className="text-stone-500 font-medium group-hover:text-stone-900 transition-colors">{item.name}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-[1px] bg-stone-100" />
                                        <span className="font-bold text-stone-900 group-hover:text-[#8B4513] transition-colors">{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-10">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-[#8B4513] tracking-widest block">Let's Connect</span>
                            <h4 className="font-serif text-2xl font-extrabold text-stone-900 tracking-tight">연락처</h4>
                        </div>
                        <div className="space-y-8 text-stone-600">
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-stone-50 rounded-xl group-hover:bg-[#8B4513]/10 transition-colors"><MapPin size={20} className="text-[#8B4513]" /></div>
                                <p className="leading-relaxed font-light mt-1">{CHURCH_DATA.contact.address}</p>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-stone-50 rounded-xl group-hover:bg-[#8B4513]/10 transition-colors"><Phone size={20} className="text-[#8B4513]" /></div>
                                <p className="font-bold">{CHURCH_DATA.contact.phone}</p>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-stone-50 rounded-xl group-hover:bg-[#8B4513]/10 transition-colors"><Mail size={20} className="text-[#8B4513]" /></div>
                                <p className="font-medium text-stone-500">{CHURCH_DATA.contact.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 pt-6 mt-4 border-t border-stone-100">
                            <a href={CHURCH_DATA.contact.youtube} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-stone-50 rounded-[18px] flex items-center justify-center text-stone-400 hover:bg-[#FF0000] hover:text-white transition-all shadow-sm"><Youtube size={24} /></a>
                            <a href="https://blog.naver.com/joosung0416" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-stone-50 rounded-[18px] flex items-center justify-center text-stone-400 hover:bg-[#03C75A] hover:text-white transition-all shadow-sm group">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-110">
                                    <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" className="opacity-0 group-hover:opacity-100" />
                                    <path d="M15 17H12.5V11.5L10 17H7.5V7H10V12.5L12.5 7H15V17Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
                                    {/* Using a N shape for Naver */}
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-10">
                        <div className="space-y-2 text-right">
                            <span className="text-[10px] font-black uppercase text-[#8B4513] tracking-widest block">Find Our Way</span>
                            <h4 className="font-serif text-2xl font-extrabold text-stone-900 tracking-tight">지도 안내</h4>
                        </div>
                        <div
                            onClick={() => window.open(CHURCH_DATA.contact.naverMap, '_blank')}
                            className="rounded-[32px] overflow-hidden shadow-2xl h-56 bg-stone-100 border border-stone-100 cursor-pointer group relative ring-offset-8 ring-stone-950/0 hover:ring-stone-100 transition-all"
                        >
                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" alt="Map View" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60" />
                            <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors flex items-center justify-center p-6">
                                <div className="bg-white/90 backdrop-blur-xl text-stone-900 p-6 rounded-[24px] shadow-2xl flex flex-col items-center gap-3 transform group-hover:translate-y-[-10px] transition-all duration-500">
                                    <MapPin size={28} className="text-[#8B4513] animate-bounce" />
                                    <span className="font-serif text-lg font-black whitespace-nowrap">네이버 지도로 길 찾기</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-8">
                        <p className="text-stone-300 text-[10px] font-black uppercase tracking-[0.2em]">© 2024 Joosung Holiness Church. All rights reserved.</p>
                        <div className="flex gap-6 text-[11px] font-black uppercase tracking-widest text-stone-400">
                            <a href="#" className="hover:text-stone-900 transition-colors">Terms</a>
                            <a href="#" className="hover:text-stone-900 transition-colors">Privacy</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <Link
                                    href="/admin"
                                    className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all group ${isAdmin ? 'bg-[#8B4513] text-white shadow-xl' : 'bg-stone-50 text-stone-500'
                                        }`}
                                >
                                    <Settings size={14} className="group-hover:rotate-90 transition-transform" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">{isAdmin ? 'Admin Console' : 'My Account'}</span>
                                </Link>
                                <button onClick={() => logout()} className="text-stone-300 hover:text-red-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
                                    <LogOut size={14} /> Log out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => login()}
                                className="group flex items-center gap-4 px-10 py-4 bg-stone-900 text-white rounded-full font-black text-[11px] tracking-[0.3em] overflow-hidden relative shadow-2xl shadow-black/20"
                            >
                                <span className="relative z-10 flex items-center gap-2">ADMIN LOGIN <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" /></span>
                                <div className="absolute inset-0 bg-[#8B4513] translate-y-full group-hover:translate-y-0 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <div className="flex justify-center items-center gap-2 text-[#8B4513]/20">
                        <div className="w-12 h-px bg-current" />
                        <Heart size={14} fill="currentColor" />
                        <div className="w-12 h-px bg-current" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
