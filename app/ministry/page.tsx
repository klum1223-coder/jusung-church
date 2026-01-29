'use client';

import React from 'react';
import { CHURCH_DATA } from '../lib/constants';
import { ArrowRight } from 'lucide-react';

export default function MinistryPage() {
    return (
        <div className="bg-[#faf9f6] min-h-screen pt-24 font-sans selection:bg-[#8B4513] selection:text-white">
            <main>
                {/* Header Section */}
                <section className="py-24 px-6 bg-[#8B4513] text-white">
                    <div className="container mx-auto max-w-5xl text-center space-y-6">
                        <span className="text-[#F5E6D3] font-black tracking-[0.4em] text-[12px] uppercase">Service & Mission</span>
                        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight">사역 안내</h1>
                        <p className="text-white/60 text-lg md:text-xl font-light">주성교회는 모든 세대와 이웃을 향해 하나님의 사랑을 전하는 다양한 사역을 펼치고 있습니다.</p>
                    </div>
                </section>

                {/* Ministry Listing */}
                <section className="py-24 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {CHURCH_DATA.ministries.map((m, idx) => (
                                <div key={idx} className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all group group flex flex-col border border-stone-100">
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img src={m.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="p-10 flex flex-col flex-1 space-y-6">
                                        <div className="space-y-2">
                                            <span className="text-[#8B4513] font-bold text-[10px] uppercase tracking-widest">{m.engName}</span>
                                            <h2 className="font-serif text-3xl font-bold text-stone-900">{m.name}</h2>
                                        </div>
                                        <p className="text-stone-500 text-lg leading-relaxed font-light flex-1">{m.desc}</p>
                                        <div className="pt-4 flex flex-col gap-6">
                                            <div className="h-px bg-stone-100 w-12"></div>
                                            <p className="text-stone-600 text-sm leading-relaxed">{m.detail}</p>
                                            <button className="flex items-center gap-2 text-[#8B4513] font-bold text-sm tracking-widest hover:gap-4 transition-all uppercase">
                                                사역 문의하기 <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Volunteer CTA */}
                <section className="py-24 px-6 bg-stone-900 text-white overflow-hidden relative">
                    <div className="container mx-auto max-w-6xl flex flex-col items-center text-center space-y-12 relative z-10">
                        <h2 className="font-serif text-4xl md:text-6xl font-bold leading-tight">하나님 나라의 일꾼으로<br />여러분을 초대합니다.</h2>
                        <p className="text-white/40 text-lg md:text-xl max-w-2xl font-light leading-relaxed italic">"여러분의 작은 헌신이 모여 큰 감동을 만듭니다."</p>
                        <button className="px-12 py-5 bg-[#F5E6D3] text-[#8B4513] rounded-full font-bold shadow-2xl hover:bg-white transition-all active:scale-95 uppercase tracking-widest">사역 지원 신청</button>
                    </div>
                    {/* Abstract Decoration */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[#8B4513]/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                </section>
            </main>
        </div>
    );
}
