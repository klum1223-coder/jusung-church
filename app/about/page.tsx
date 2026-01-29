'use client';

import React from 'react';
import { CHURCH_DATA } from '../lib/constants';
import { Quote } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-[#faf9f6] min-h-screen pt-24 font-sans selection:bg-[#8B4513] selection:text-white">
            <main>
                {/* Intro Hero */}
                <section className="relative py-32 px-6 overflow-hidden">
                    <div className="container mx-auto max-w-6xl">
                        <div className="flex flex-col items-center text-center space-y-8">
                            <span className="text-[#8B4513] font-black tracking-[0.4em] text-[12px] uppercase animate-in fade-in slide-in-from-bottom-4 duration-700">Deep Tradition & Future Vision</span>
                            <h1 className="font-serif text-5xl md:text-8xl text-stone-900 font-bold leading-none tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                우리는 하나님을<br />사랑하는 <span className="text-[#8B4513]">주성교회</span>입니다.
                            </h1>
                            <p className="text-stone-500 text-xl md:text-2xl max-w-3xl font-light leading-relaxed animate-in fade-in duration-1000 delay-500">
                                1990년 시작된 주성교회는 지금까지 복음의 본질을 지키며 지역사회와 함께 성장해 왔습니다. 하나님의 사랑이 흐르는 건강한 공동체를 꿈꿉니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Pastor Detail Section */}
                <section className="py-32 px-6 bg-white">
                    <div className="container mx-auto max-w-6xl">
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            <div className="w-full lg:w-1/2">
                                <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
                                    <img src={CHURCH_DATA.pastor.imgUrl} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-stone-900/10"></div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 space-y-12">
                                <div className="space-y-6">
                                    <span className="text-[#8B4513] font-bold text-sm uppercase tracking-widest block">Pastor's Welcome</span>
                                    <h2 className="font-serif text-4xl md:text-6xl text-stone-900 font-bold leading-tight">말씀과 기도로<br />세상을 변화시킵니다.</h2>
                                    <div className="w-20 h-1 bg-[#8B4513]"></div>
                                </div>

                                <div className="space-y-8 text-stone-600 text-lg leading-relaxed font-light">
                                    <p>안녕하십니까. 주성교회 담임목사 {CHURCH_DATA.pastor.name}입니다. </p>
                                    <p>우리 주성교회는 '하나님이 기뻐하시는 교회, 성도가 행복한 교회'를 지향합니다. 갈수록 소란하고 복잡해지는 세상 속에서 그리스도의 평안을 누리는 안식처가 되고자 합니다.</p>
                                    <p>이곳에 오시는 모든 분들이 살아있는 하나님의 말씀을 경험하고, 성령의 충만함으로 삶의 진정한 의미와 사명을 발견하시기를 간절히 소원합니다.</p>
                                </div>

                                <div className="p-10 bg-stone-50 rounded-[40px] border border-stone-100 relative">
                                    <Quote className="absolute top-8 left-8 text-stone-200" size={60} />
                                    <p className="relative z-10 text-stone-800 text-xl font-serif font-bold italic py-8">
                                        "주성교회는 여러분의 신앙 여정에 따뜻한 동반자가 되어 드릴 것입니다."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vision & Mission */}
                <section className="py-32 px-6">
                    <div className="container mx-auto max-w-6xl text-center space-y-24">
                        <h2 className="font-serif text-4xl md:text-5xl font-bold">교회 비전과 핵심 가치</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { title: '말씀의 본질', desc: '타협하지 않는 성경적 가치관을 세우고 실천합니다.', num: '01' },
                                { title: '사랑의 교제', desc: '그리스도 안에서 한 가족 됨을 경험하는 공동체입니다.', num: '02' },
                                { title: '세상의 빛', desc: '이웃을 섬기고 복음을 전하는 선교적 사명을 다합니다.', num: '03' },
                            ].map((v, i) => (
                                <div key={i} className="group p-12 bg-white rounded-[40px] shadow-sm hover:shadow-2xl transition-all border border-stone-100 flex flex-col items-center space-y-6">
                                    <span className="text-5xl font-serif text-stone-100 group-hover:text-[#8B4513]/10 transition-colors font-black leading-none">{v.num}</span>
                                    <h3 className="text-2xl font-bold text-stone-900 font-serif">{v.title}</h3>
                                    <p className="text-stone-500 leading-relaxed font-light">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
