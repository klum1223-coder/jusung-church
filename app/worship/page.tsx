'use client';

import React from 'react';
import { CHURCH_DATA } from '../lib/constants';
import { Clock, MapPin, Phone } from 'lucide-react';

export default function WorshipPage() {
    return (
        <div className="bg-[#faf9f6] min-h-screen pt-24 font-sans selection:bg-[#8B4513] selection:text-white">
            <main>
                <section className="py-24 px-6 bg-stone-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                        <img src="https://images.unsplash.com/photo-1548625361-195fe576b7bc?auto=format&fit=crop&q=80" className="w-full h-full object-cover" />
                    </div>
                    <div className="container mx-auto max-w-5xl relative z-10 text-center space-y-8">
                        <span className="text-[#F5E6D3] font-black tracking-[0.4em] text-[12px] uppercase">Worship & Meeting</span>
                        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight">예배 및 안내</h1>
                        <p className="text-white/60 text-lg md:text-xl font-light max-w-2xl mx-auto">하나님을 높여 드리는 거룩한 예배의 자리로 성도님들을 초대합니다.</p>
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
                                <div key={idx} className="flex items-center gap-8 p-10 bg-stone-50 rounded-[40px] border border-stone-100 hover:bg-white hover:shadow-xl transition-all group">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#8B4513] shadow-md group-hover:scale-110 transition-transform"><Clock size={28} /></div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-stone-900 mb-2">{w.name}</h3>
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

                            <div
                                onClick={() => window.open(CHURCH_DATA.contact.naverMap, '_blank')}
                                className="aspect-square bg-stone-100 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white cursor-pointer group relative"
                            >
                                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" alt="Map" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-4">
                                    <div className="w-16 h-16 bg-[#8B4513] text-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                        <MapPin size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-2xl font-bold text-stone-900">네이버 지도에서 보기</p>
                                        <p className="text-stone-500 text-sm">지도를 클릭하시면 상세 위치와<br />길찾기 화면으로 연결됩니다.</p>
                                    </div>
                                    <div className="mt-4 px-8 py-3 bg-[#8B4513] text-white rounded-full font-bold shadow-lg group-hover:bg-stone-900 transition-colors">
                                        길찾기 바로가기
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
