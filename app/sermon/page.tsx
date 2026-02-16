'use client';

import React, { useState, useEffect } from 'react';
import { CHURCH_DATA } from '../lib/constants';
import { Play, Youtube, Calendar, ExternalLink } from 'lucide-react';

interface Playlist {
    id: string;
    label: string;
    engLabel: string;
    videos: Video[];
}

interface Video {
    id: string;
    title: string;
    linkUrl: string;
    publishedAt: string;
    thumbnail: string;
    description: string;
    type: string;
}

export default function SermonPage() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSermons = async () => {
            try {
                const res = await fetch('/api/youtube');
                if (res.ok) {
                    const data = await res.json();
                    setPlaylists(data);
                }
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSermons();
    }, []);

    // 재생목록 분리
    const sundaySermons = playlists.find(p => p.engLabel === 'Sunday Sermon');
    const shorts = playlists.find(p => p.engLabel === 'Sermon Shorts');
    const faithQA = playlists.find(p => p.engLabel === 'Faith Q&A');

    return (
        <div className="bg-[#faf9f6] min-h-screen pt-20 md:pt-24 font-sans selection:bg-[#8B4513] selection:text-white">
            <style jsx>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .scroll-row {
                    display: flex;
                    gap: 16px;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                    padding-bottom: 8px;
                }
                .scroll-row::-webkit-scrollbar { display: none; }
                .scroll-row > * { scroll-snap-align: start; flex-shrink: 0; }
            `}</style>

            <main>
                {/* Hero */}
                <section className="py-12 md:py-20 px-4 md:px-6 bg-stone-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <img
                            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&q=80"
                            className="w-full h-full object-cover"
                            alt="배경"
                            loading="eager"
                        />
                    </div>
                    <div className="container mx-auto max-w-5xl relative z-10 text-center space-y-4 md:space-y-6">
                        <span className="text-[#F5E6D3] font-black tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-[12px] uppercase">
                            Online Worship
                        </span>
                        <h1 className="font-serif text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight">
                            설교 말씀
                        </h1>
                        <p className="text-white/60 text-sm md:text-lg font-light max-w-2xl mx-auto px-4">
                            언제 어디서나 하나님의 말씀을 통해 영적 회복과 평안을 누리시기 바랍니다.
                        </p>
                        <div className="pt-3 md:pt-6">
                            <a
                                href={CHURCH_DATA.contact.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 md:px-8 py-3 md:py-4 bg-[#FF0000] text-white rounded-full font-bold text-sm shadow-2xl hover:bg-[#cc0000] transition-all hover:scale-105"
                            >
                                <Youtube size={18} />
                                유튜브 채널 바로가기
                            </a>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="py-10 md:py-20 px-4 md:px-6">
                    <div className="container mx-auto max-w-6xl">
                        {loading ? (
                            <div className="flex flex-col items-center py-20 space-y-4">
                                <div className="w-10 h-10 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin" />
                                <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">Loading...</p>
                            </div>
                        ) : (
                            <div className="space-y-16 md:space-y-24">

                                {/* ========== 1. 주일설교 (3개, 가로 카드) ========== */}
                                {sundaySermons && (
                                    <div style={{ animation: 'fadeUp 0.6s ease-out both' }}>
                                        <SectionHeader
                                            label={sundaySermons.label}
                                            engLabel={sundaySermons.engLabel}
                                            playlistId={sundaySermons.id}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {sundaySermons.videos.map((v, i) => (
                                                <SermonCard key={v.id} video={v} index={i} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ========== 2. 숏츠 (6개, 가로 스크롤 일렬) ========== */}
                                {shorts && shorts.videos.length > 0 && (
                                    <div style={{ animation: 'fadeUp 0.6s ease-out 0.15s both' }}>
                                        <SectionHeader
                                            label={shorts.label}
                                            engLabel={shorts.engLabel}
                                            playlistId={shorts.id}
                                        />
                                        <div className="scroll-row">
                                            {shorts.videos.map((v, i) => (
                                                <ShortCard key={v.id} video={v} index={i} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ========== 3. 기독교에 관한 질문 (3개) ========== */}
                                {faithQA && faithQA.videos.length > 0 && (
                                    <div style={{ animation: 'fadeUp 0.6s ease-out 0.3s both' }}>
                                        <SectionHeader
                                            label={faithQA.label}
                                            engLabel={faithQA.engLabel}
                                            playlistId={faithQA.id}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {faithQA.videos.map((v, i) => (
                                                <SermonCard key={v.id} video={v} index={i} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

// =============================================
// Section Header
// =============================================
function SectionHeader({ label, engLabel, playlistId }: { label: string; engLabel: string; playlistId: string }) {
    return (
        <div className="mb-6 md:mb-10 flex items-end justify-between border-b border-stone-200 pb-4">
            <div className="space-y-1">
                <span className="text-[#8B4513] font-black tracking-[0.3em] text-[9px] uppercase">{engLabel}</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900">{label}</h2>
            </div>
            <a
                href={`https://www.youtube.com/playlist?list=${playlistId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#8B4513] font-bold text-xs hover:gap-2.5 transition-all whitespace-nowrap"
            >
                전체 보기 <ExternalLink size={12} />
            </a>
        </div>
    );
}

// =============================================
// 주일설교 / 기독교 Q&A 카드 (가로형)
// =============================================
function SermonCard({ video, index }: { video: Video; index: number }) {
    const [playing, setPlaying] = useState(false);
    const [imgErr, setImgErr] = useState(false);

    return (
        <div
            className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-stone-100"
            style={{ animation: `fadeUp 0.5s ease-out ${index * 0.08}s both` }}
        >
            <div className="aspect-video relative overflow-hidden bg-stone-900">
                {playing ? (
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div className="w-full h-full cursor-pointer relative" onClick={() => setPlaying(true)}>
                        {!imgErr && video.thumbnail ? (
                            <img
                                src={video.thumbnail}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt={video.title}
                                loading="lazy"
                                onError={() => setImgErr(true)}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                                <Youtube size={36} className="text-white/20" />
                            </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-[#8B4513] shadow-xl opacity-80 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
                                <Play size={22} className="ml-0.5" fill="currentColor" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-stone-400 text-[9px] font-black uppercase tracking-widest">
                    <Calendar size={10} />
                    {video.publishedAt
                        ? new Date(video.publishedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
                        : '최신'}
                </div>
                <h3 className="font-serif text-base md:text-lg font-bold text-stone-900 leading-snug group-hover:text-[#8B4513] transition-colors line-clamp-2">
                    {video.title}
                </h3>
            </div>
        </div>
    );
}

// =============================================
// 숏츠 카드 (세로형, 일렬 가로 스크롤)
// =============================================
function ShortCard({ video, index }: { video: Video; index: number }) {
    const [imgErr, setImgErr] = useState(false);

    return (
        <a
            href={`https://www.youtube.com/shorts/${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-[160px] md:w-[180px] group"
            style={{ animation: `fadeUp 0.4s ease-out ${index * 0.06}s both` }}
        >
            {/* 세로 썸네일 */}
            <div className="aspect-[9/16] rounded-[16px] overflow-hidden bg-stone-900 relative shadow-sm group-hover:shadow-xl transition-all">
                {!imgErr && video.thumbnail ? (
                    <img
                        src={video.thumbnail}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={video.title}
                        loading="lazy"
                        onError={() => setImgErr(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-b from-stone-700 to-stone-900 flex items-center justify-center">
                        <Youtube size={28} className="text-white/20" />
                    </div>
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-[#FF0000] opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
                        <Play size={16} className="ml-0.5" fill="currentColor" />
                    </div>
                </div>
                {/* Shorts 뱃지 */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#FF0000] text-white text-[8px] font-black rounded-full uppercase tracking-wider">
                    Shorts
                </div>
            </div>
            {/* 제목 */}
            <p className="mt-2 text-xs font-bold text-stone-700 line-clamp-2 leading-tight group-hover:text-[#8B4513] transition-colors">
                {video.title}
            </p>
        </a>
    );
}
