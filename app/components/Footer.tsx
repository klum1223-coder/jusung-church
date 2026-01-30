'use client';

import React from 'react';
import { Mail, Phone, MapPin, Youtube, Instagram, Facebook, ChevronRight, LogOut, Settings } from 'lucide-react';
import { CHURCH_DATA, checkIfAdmin } from '../lib/constants';
import { useAuth } from '../lib/AuthContext';

const Footer = () => {
    const { user, login, logout } = useAuth();
    const isAdmin = checkIfAdmin(user);

    return (
        <footer className="bg-stone-50 border-t border-stone-100 pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#8B4513] text-white rounded-full flex items-center justify-center font-bold text-xl">✝</div>
                            <h2 className="text-xl font-bold tracking-tighter text-stone-900">주성교회</h2>
                        </div>
                        <p className="text-stone-500 text-sm leading-relaxed max-w-xs">{CHURCH_DATA.slogan}</p>
                        <div className="flex gap-4">
                            <a href={CHURCH_DATA.contact.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-stone-400 hover:text-[#FF0000] transition-colors"><Youtube size={20} /></a>
                            <a href="#" className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-stone-400 hover:text-[#E1306C] transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-stone-400 hover:text-[#1877F2] transition-colors"><Facebook size={20} /></a>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="font-bold text-stone-900 text-sm uppercase tracking-widest">Service Times</h4>
                        <div className="space-y-4">
                            {CHURCH_DATA.worship.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm border-b border-stone-100 pb-2">
                                    <span className="text-stone-500">{item.name}</span>
                                    <span className="font-bold text-stone-900">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="font-bold text-stone-900 text-sm uppercase tracking-widest">Contact Us</h4>
                        <div className="space-y-4 text-sm text-stone-600">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-[#8B4513] shrink-0 mt-1" />
                                <p className="leading-relaxed">{CHURCH_DATA.contact.address}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-[#8B4513] shrink-0" />
                                <p>{CHURCH_DATA.contact.phone}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-[#8B4513] shrink-0" />
                                <p>{CHURCH_DATA.contact.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="font-bold text-stone-900 text-sm uppercase tracking-widest">Location</h4>
                        <div
                            onClick={() => window.open(CHURCH_DATA.contact.naverMap, '_blank')}
                            className="rounded-2xl overflow-hidden shadow-sm h-48 bg-stone-100 border border-stone-100 cursor-pointer group relative"
                        >
                            <img src="/images/map_placeholder.png" alt="Map" className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-70" />
                            <div className="absolute inset-0 bg-[#8B4513]/5 group-hover:bg-[#8B4513]/10 transition-colors flex items-center justify-center">
                                <span className="bg-white/90 backdrop-blur-md text-[#8B4513] px-4 py-2 rounded-full font-bold text-xs shadow-md flex items-center gap-2 group-hover:scale-110 transition-transform">
                                    <MapPin size={14} /> 네이버 지도로 보기
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-stone-400 text-xs">© 2024 Joosung Holiness Church. All rights reserved.</p>
                    <div className="flex gap-8 text-stone-400 text-xs items-center">
                        <a href="#" className="hover:text-stone-900 transition-colors">이용약관</a>
                        <a href="#" className="hover:text-stone-900 transition-colors">개인정보처리방침</a>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className={`${isAdmin ? 'text-[#8B4513] font-bold' : ''}`}>
                                    {isAdmin ? '[관리자] ' : ''}{user.displayName}님
                                </span>
                                <button onClick={() => logout()} className="hover:text-red-500 flex items-center gap-1">
                                    <LogOut size={12} /> 로그아웃
                                </button>
                                {isAdmin && (
                                    <a href="/admin" className="text-white bg-[#8B4513] px-3 py-1 rounded-full font-bold flex items-center gap-1 hover:bg-stone-900 transition-colors">
                                        <Settings size={10} /> 대시보드
                                    </a>
                                )}
                            </div>
                        ) : (
                            <button onClick={() => login()} className="hover:text-stone-900 flex items-center gap-1 font-bold">
                                관리자 로그인
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
