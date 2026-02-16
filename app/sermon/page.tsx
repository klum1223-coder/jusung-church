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
                const res = await fetch('/api/youtube?maxResults=3');
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

    return (
        <div className="bg-[#faf9f6] min-h-screen pt-20 md:pt-24 font-sans selection:bg-[#8B4513] selection:text-white">
            <style jsx>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <main>
                {/* Hero Section */}
                <section className="py-12 md:py-24 px-4 md:px-6 bg-stone-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <img
                            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&q=80"
                            className="w-full h-full object-cover"
                            alt="배경"
                            loading="eager"
                        />
                    </div>
                    <div className="container mx-auto max-w-5xl relative z-10 text-center space-y-4 md:space-y-8">
                        <span className="text-[#F5E6D3] font-black tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-[12px] uppercase">
                            Online Worship
                        </span>
                        <h1 className="font-serif text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight">
                            설교 말씀
                        </h1>
                        <p className="text-white/60 text-base md:text-lg lg:text-xl font-light max-w-2xl mx-auto px-4">
                            언제 어디서나 하나님의 말씀을 통해 영적 회복과 평안을 누리시기 바랍니다.
                        </p>
                        <div className="pt-4 md:pt-6">
                            <a
                                href={CHURCH_DATA.contact.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 md:gap-3 px-5 md:px-8 py-3 md:py-4 bg-[#FF0000] text-white rounded-full font-bold text-sm md:text-base shadow-2xl hover:bg-[#cc0000] transition-all hover:scale-105"
                            >
                                <Youtube size={20} className="md:w-6 md:h-6" />
                                <span className="hidden sm:inline">주성교회</span> 유튜브 채널
                            </a>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="py-12 md:py-20 px-4 md:px-6">
                    <div className="container mx-auto max-w-6xl">
                        {loading ? (
                            <div className="flex flex-col items-center py-16 md:py-32 space-y-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin" />
                                <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">Loading Sermons...</p>
                            </div>
                        ) : (
                            <div className="space-y-16 md:space-y-24">
                                {playlists.map((playlist, pIdx) => (
                                    <div key={playlist.id} style={{ animation: `fadeUp 0.6s ease-out ${pIdx * 0.15}s both` }}>
                                        {/* Section Header */}
                                        <div className="mb-8 md:mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
                                            <div className="space-y-2">
                                                <span className="text-[#8B4513] font-black tracking-[0.4em] text-[10px] uppercase">
                                                    {playlist.engLabel}
                                                </span>
                                                <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
                                                    {playlist.label}
                                                </h2>
                                            </div>
                                            <a
                                                href={`https://www.youtube.com/playlist?list=${playlist.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-[#8B4513] font-bold text-sm hover:gap-3 transition-all group"
                                            >
                                                전체 보기
                                                <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                            </a>
                                        </div>

                                        {/* Video Grid */}
                                        {playlist.videos.length === 0 ? (
                                            <div className="bg-stone-50 rounded-[32px] py-16 text-center border border-stone-100">
                                                <p className="text-stone-400 font-bold text-sm">영상을 불러오는 중 오류가 발생했습니다.</p>
                                            </div>
                                        ) : (
                                            <div className={`grid gap-6 md:gap-8 ${playlist.engLabel === 'Sermon Shorts'
                                                    ? 'grid-cols-2 md:grid-cols-3'
                                                    : 'grid-cols-1 md:grid-cols-3'
                                                }`}>
                                                {playlist.videos.map((video, vIdx) => (
                                                    <VideoCard
                                                        key={video.id}
                                                        video={video}
                                                        isShort={playlist.engLabel === 'Sermon Shorts'}
                                                        index={vIdx}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

// ============================================
// Video Card Component
// ============================================
function VideoCard({ video, isShort, index }: { video: Video; isShort: boolean; index: number }) {
    const [showPlayer, setShowPlayer] = useState(false);
    const [imgError, setImgError] = useState(false);

    return (
        <div
            className={`bg-white rounded-[20px] md:rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-stone-100 ${isShort ? '' : ''
                }`}
            style={{ animation: `fadeUp 0.5s ease-out ${index * 0.1}s both` }}
        >
            {/* Thumbnail / Player */}
            <div className={`relative overflow-hidden bg-stone-900 ${isShort ? 'aspect-[9/16]' : 'aspect-video'}`}>
                {showPlayer ? (
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div
                        className="w-full h-full cursor-pointer relative"
                        onClick={() => setShowPlayer(true)}
                    >
                        {!imgError && video.thumbnail ? (
                            <img
                                src={video.thumbnail}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt={video.title}
                                loading="lazy"
                                decoding="async"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                                <Youtube size={40} className="text-white/20" />
                            </div>
                        )}
                        {/* Play overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-[#8B4513] shadow-xl opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                                <Play size={22} className="ml-0.5" fill="currentColor" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4 md:p-6 space-y-2">
                <div className="flex items-center gap-2 text-stone-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                    <Calendar size={11} />
                    {video.publishedAt
                        ? new Date(video.publishedAt).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })
                        : '최신'}
                </div>
                <h3 className={`font-serif font-bold text-stone-900 leading-snug group-hover:text-[#8B4513] transition-colors line-clamp-2 ${isShort ? 'text-sm md:text-base' : 'text-lg md:text-xl'
                    }`}>
                    {video.title}
                </h3>
                {!isShort && video.description && (
                    <p className="text-stone-500 text-sm line-clamp-2 font-light hidden md:block">
                        {video.description}
                    </p>
                )}
            </div>
        </div>
    );
}
