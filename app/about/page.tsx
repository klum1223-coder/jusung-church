'use client';

import React, { useState, useEffect } from 'react';
import { CHURCH_DATA } from '../lib/constants';
import { Quote, Loader2 } from 'lucide-react';
import { db } from '../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

export default function AboutPage() {
    const [settings, setSettings] = useState<any>({});

    // 로딩 상태 제거하여 페이지가 즉시 표시되도록 최적화
    useEffect(() => {
        if (!db) return;
        const unsub = onSnapshot(doc(db, 'settings', 'site'), (s) => {
            if (s.exists()) setSettings(s.data());
        });
        return () => unsub();
    }, []);

    const pastorName = "김선우";
    // 담임목사님 사진 링크 적용
    const pastorImg = "https://firebasestorage.googleapis.com/v0/b/church-homepage-antigravity.firebasestorage.app/o/%ED%99%88%ED%8E%98%EC%9D%B4%EC%A7%80%20%EA%B8%B0%EB%B3%B8%20%EC%82%AC%EC%A7%84%2F%EB%84%A4%EC%9D%B4%EB%B9%84%20%EB%AA%A8%EB%8D%98%20%EB%AF%B8%EB%8B%88%EB%A9%80%EB%A6%AC%EC%8A%A4%ED%8A%B8%20%EA%B5%90%ED%9A%8C%20%EC%84%B1%EB%8B%B9%20%EA%B8%B0%EB%8F%84%20%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EC%8D%B8%EB%84%A4%EC%9D%BC.png?alt=media";
    const welcomeTitle = "담임목사 인사";
    const welcomeText = settings.about_welcome_text || (
        <>
            <p>우리교회 이름은 <strong>주성교회</strong>입니다. 한자로 <span className="text-[#8B4513] font-bold">주인 주(主)</span>자에 <span className="text-[#8B4513] font-bold">이를 성(成)</span>자를 씁니다. '하나님이 이루어 가시는 교회'를 꿈꾸며 세워진 교회이기에 붙여진 이름입니다.</p>
            <p className="mt-4">은혜를 경험하는 삶의 다른 표현은 '주어지는 것'이라 생각됩니다. 우리의 태어남도 주어진 것입니다. 우리의 죽음도 주어진 결과입니다. 우리의 인생 여정은 아무리 발버둥쳐도 탄생과 죽음 안에서 이루어져 갑니다. 예수님은 성도가 자신 안에서 살아갈 때 삶의 열매가 이루어져 감을 말씀하십니다.</p>
            <p className="mt-4">물질 만능주의의 파도가 우리의 삶과 영혼을 덮친 시대를 살아가고 있습니다. 이런 시대이지만 하나님의 은혜를 경험하는 성도와 교회가 되고 싶습니다. 성삼위 하나님의 은혜 가운데 <strong>'되어지는 인생, 되어지는 성도'</strong>가 되시길 바랍니다.</p>
            <p className="mt-8 font-serif text-xl font-bold text-stone-900 text-right">- 주성교회 담임목사 김선우 -</p>
        </>
    );

    return (
        <div className="bg-[#faf9f6] min-h-screen pt-24 font-sans selection:bg-[#8B4513] selection:text-white">
            <main>
                {/* Intro Section - Compact Padding */}
                <section className="relative py-20 px-6 overflow-hidden">
                    <div className="container mx-auto max-w-5xl">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <span className="text-[#8B4513] font-black tracking-[0.4em] text-[10px] uppercase animate-in fade-in slide-in-from-bottom-4 duration-700">Deep Tradition & Future Vision</span>
                            <h1 className="font-serif text-4xl md:text-6xl text-stone-900 font-bold leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                하나님이 <span className="text-[#8B4513] inline-block relative">
                                    이루어 가시는
                                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#8B4513]/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                    </svg>
                                </span><br />
                                주성교회
                            </h1>
                            <p className="text-stone-500 text-lg md:text-xl max-w-2xl font-light leading-relaxed animate-in fade-in duration-1000 delay-500 pt-4">
                                <strong>주(主)님이 이루시는(成) 교회</strong>, 주성교회는 하나님의 은혜로<br className="hidden md:block" /> '되어지는 인생'을 고백하는 믿음의 공동체입니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Pastor Welcome Section - Compact & Image Fixed */}
                <section className="py-20 px-6 bg-white">
                    <div className="container mx-auto max-w-6xl">
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                            <div className="w-full lg:w-1/2">
                                <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl group">
                                    <img
                                        src={pastorImg}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt="Pastor Kim Sunwoo"
                                    />
                                    {/* Gradient overlay for better text visibility if needed */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent"></div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 space-y-8">
                                <div className="space-y-4">
                                    <span className="text-[#8B4513] font-bold text-xs uppercase tracking-widest block">Pastor's Welcome</span>
                                    <h2 className="font-serif text-3xl md:text-5xl text-stone-900 font-bold leading-tight">{welcomeTitle}</h2>
                                    <div className="w-16 h-1 bg-[#8B4513]"></div>
                                </div>

                                <div className="space-y-6 text-stone-600 text-lg leading-relaxed font-light whitespace-pre-wrap">
                                    {typeof welcomeText === 'string' ? welcomeText : welcomeText}
                                </div>

                                {/* Removed Quote Section as requested */}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vision Section - Compact & Text Updated */}
                <section className="py-20 px-6">
                    <div className="container mx-auto max-w-6xl text-center space-y-16">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold">교회 비전과 핵심 가치</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: '말씀의 본질', desc: '타협하지 않는 성경적 가치관을 세우고 실천합니다.', num: '01' },
                                { title: '사랑의 교제', desc: '그리스도 안에서 한 가족 됨을 경험하는 공동체입니다.', num: '02' },
                                { title: '세상의 빛', desc: '컨텐츠를 생산하는 성도가 되어 세상의 리더가 됩니다.', num: '03' },
                            ].map((v, i) => (
                                <div key={i} className="group p-10 bg-white rounded-[32px] shadow-sm hover:shadow-xl transition-all border border-stone-100 flex flex-col items-center space-y-4">
                                    <span className="text-4xl font-serif text-stone-100 group-hover:text-[#8B4513]/10 transition-colors font-black leading-none">{v.num}</span>
                                    <h3 className="text-xl font-bold text-stone-900 font-serif">{v.title}</h3>
                                    <p className="text-stone-500 leading-relaxed font-light text-sm md:text-md break-keep">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
// Re-deploy trigger
