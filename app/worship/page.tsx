'use client';

import React from 'react';
import { CHURCH_DATA } from '../lib/constants';
import { Clock, MapPin, Phone } from 'lucide-react';

export default function WorshipPage() {
    return (
        <div className="bg-[#faf9f6] min-h-screen pt-24 font-sans selection:bg-[#8B4513] selection:text-white">
            <main>
                <section className="py-24 px-6 relative overflow-hidden bg-stone-900 border-b border-[#8B4513]/20">
                    <div className="absolute inset-0 opacity-30 mix-blend-luminosity">
                        <img src="https://images.unsplash.com/photo-1548625361-195fe576b7bc?w=1200&q=80" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
                    <div className="container mx-auto max-w-5xl relative z-10 text-center space-y-8">
                        <span className="text-[#d4af37] font-black tracking-[0.4em] text-[12px] uppercase">Worship & Meeting</span>
                        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">예배 및 안내</h1>
                        <p className="text-white/80 text-lg md:text-xl font-light max-w-2xl mx-auto">하나님을 높여 드리는 거룩한 예배의 자리로 성도님들을 초대합니다.</p>
                    </div>
                </section>

                <section className="py-24 px-6 bg-white">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-20">
                            <h2 className="font-serif text-4xl font-bold text-stone-900">예배 시간표</h2>
                            <div className="w-12 h-1 bg-[#8B4513] mx-auto mt-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {CHURCH_DATA.worship.map((w, idx) => (
                                <div key={idx} className="flex items-center gap-8 p-10 bg-white rounded-3xl border border-stone-200/60 hover:border-[#8B4513]/20 hover:shadow-xl hover:shadow-[#8B4513]/5 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#8B4513]/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none" />
                                    <div className="relative z-10 w-14 h-14 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-center text-[#8B4513] shadow-sm group-hover:scale-110 transition-transform"><Clock size={28} /></div>
                                    <div className="flex-1 relative z-10">
                                        <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-[#8B4513] transition-colors">{w.name}</h3>
                                        <p className="text-[#8B4513] font-serif text-3xl font-bold">{w.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                            <div className="space-y-10 text-stone-800">
                                <div className="space-y-4">
                                    <span className="text-[#8B4513] font-black tracking-widest text-xs uppercase">Location</span>
                                    <h2 className="font-serif text-4xl font-bold">찾아오시는 길</h2>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 shrink-0"><MapPin size={20} /></div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-lg">주소</p>
                                            <p className="text-stone-500 font-light text-lg leading-relaxed">{CHURCH_DATA.contact.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 shrink-0"><Phone size={20} /></div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-lg">전화번호</p>
                                            <p className="text-stone-500 font-light text-lg">{CHURCH_DATA.contact.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* 카카오 지도 임베드 */}
                                <div className="aspect-square bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-stone-200/50 border-8 border-white group/map relative">
                                    <a
                                        href={CHURCH_DATA.contact.naverMap}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full h-full bg-stone-100 cursor-pointer overflow-hidden"
                                    >
                                        <img
                                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
                                            alt="지도로 보기"
                                            className="w-full h-full object-cover opacity-80 group-hover/map:scale-105 transition-transform duration-700 blur-[2px] group-hover/map:blur-none"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#8B4513]/40 to-transparent group-hover/map:opacity-0 transition-opacity duration-500" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#8B4513] shadow-xl group-hover/map:scale-110 group-hover/map:-translate-y-2 transition-all duration-300 border border-stone-100">
                                                <MapPin size={32} />
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                {/* 네이버 지도 길찾기 버튼 */}
                                <a
                                    href={CHURCH_DATA.contact.naverMap}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-5 bg-[#8B4513] text-white rounded-full font-bold text-sm shadow-xl shadow-[#8B4513]/20 hover:bg-stone-900 hover:shadow-2xl hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-[#8B4513]/30"
                                >
                                    <MapPin size={18} />
                                    네이버 지도에서 길찾기
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
