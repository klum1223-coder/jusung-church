'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, Pause, Volume2, VolumeX, ChevronDown, Calendar, Clock, MapPin, Search, Menu as MenuIcon, X, Instagram, Youtube, ArrowUpRight, Heart, FileText, Bell, Users, Loader2, Link as LinkIcon, ExternalLink, BookOpen, Sparkles, Plus, Image as ImageIcon, Gift, Mic, Phone, PenLine } from 'lucide-react';

import GraceCardModal from './components/GraceCardModal';
import TiltCard from './components/TiltCard';

import NoticeModal from './components/NoticeModal';
import { db } from './firebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { CHURCH_DATA, checkIfAdmin } from './lib/constants';
import { useAuth } from './lib/AuthContext';

// Dynamic Imports
const GlowingCross = dynamic(() => import('./components/GlowingCross'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />
});

// Dynamic import for MainContentModal (client-only to avoid SSR storage issues)
const MainContentModal = dynamic(() => import('./components/MainContentModal'), {
  ssr: false,
  loading: () => null
});

// =================================================================
// Types
// =================================================================
interface ContentCard {
  id: string;
  type: 'newcomer' | 'sermon' | 'notice' | 'bulletin' | 'meditation';
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  isPinned?: boolean;
  created_at?: any;
  authorName?: string;
  authorId?: string;
}

// =================================================================
// MAIN APP
// =================================================================
export default function JusungChurchPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cards, setCards] = useState<ContentCard[]>([]);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const isAdmin = checkIfAdmin(user);
  const [isMainModalOpen, setMainModalOpen] = useState(false);
  const [isGraceModalOpen, setIsGraceModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isMedExpanded, setIsMedExpanded] = useState(false);

  interface QTData {
    date: string;
    title: string;
    scripture: string;
    content: string;
    question: string;
  }
  const [todayQT, setTodayQT] = useState<QTData | null>(null);
  const [qtLoading, setQtLoading] = useState(true);



  useEffect(() => {
    if (!db) return;

    const unsubscribe1 = onSnapshot(
      query(collection(db, "main_contents"), orderBy("created_at", "desc")),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)) as ContentCard[];
        setCards(data);
      }
    );

    const unsubscribe2 = onSnapshot(
      query(collection(db, "community_posts"), orderBy("created_at", "desc")),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCommunityPosts(data);
      }
    );

    const fetchBlogPosts = async () => {
      try {
        const res = await fetch('/api/naver-rss');
        if (res.ok) {
          const data = await res.json();
          setBlogPosts(data);
        }
      } catch (e) {
        console.error("Failed to fetch blog posts", e);
      }
    };
    fetchBlogPosts();

    const fetchQTFromSheet = async () => {
      const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLTyXyrQvXbNxzR7ouopJThkMlgOYFRJNVjrliXMupw1q76sjckBr1e6Wda6p_GoIeX1pYIzcjYHBP/pub?output=csv';
      try {
        const res = await fetch(CSV_URL);
        const text = await res.text();
        const parseCSV = (str: string) => {
          const rows = []; let currentRow = []; let currentVal = ''; let insideQuote = false;
          for (let i = 0; i < str.length; i++) {
            const char = str[i], nextChar = str[i + 1];
            if (char === '"') {
              if (insideQuote && nextChar === '"') { currentVal += '"'; i++; } else insideQuote = !insideQuote;
            } else if (char === ',' && !insideQuote) {
              currentRow.push(currentVal); currentVal = '';
            } else if ((char === '\r' || char === '\n') && !insideQuote) {
              if (char === '\r' && nextChar === '\n') i++;
              currentRow.push(currentVal); rows.push(currentRow); currentRow = []; currentVal = '';
            } else currentVal += char;
          }
          if (currentVal || currentRow.length > 0) { currentRow.push(currentVal); rows.push(currentRow); }
          return rows;
        };
        const rows = parseCSV(text);
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
        const todayRow = rows.find(row => row[0]?.trim() === today);
        if (todayRow) {
          setTodayQT({
            date: todayRow[0] || today, title: todayRow[1] || '오늘의 묵상',
            scripture: todayRow[2] || '', content: todayRow[3] || '', question: todayRow[4] || ''
          });
        }
      } catch (err) { console.error('Failed to fetch QT from Sheet', err); }
      finally { setQtLoading(false); }
    };
    fetchQTFromSheet();

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);



  // Fetch latest sermon from YouTube
  const [youtubeSermon, setYoutubeSermon] = useState<any | null>(null);
  useEffect(() => {
    const fetchYoutubeSermon = async () => {
      try {
        const res = await fetch('/api/youtube?playlistId=PLiCiBKlwP2LHA5nPQt7aNn8i4xdZRlHHf');
        if (res.ok) {
          const videos = await res.json();
          if (videos.length > 0) {
            setYoutubeSermon(videos[0]);
          }
        }
      } catch (e) {
        console.error("Failed to fetch YouTube sermon", e);
      }
    };
    fetchYoutubeSermon();
  }, []);

  const handleAddMainContent = async (data: any) => {
    if (!db || !isAdmin) return;
    try {
      await addDoc(collection(db, "main_contents"), {
        ...data,
        authorName: user?.displayName || '관리자',
        authorId: user?.uid || '',
        created_at: serverTimestamp()
      });
      alert("콘텐츠가 성공적으로 등록되었습니다.");
    } catch (e) {
      alert("콘텐츠 등록에 실패했습니다.");
    }
  };

  const latestSermon = youtubeSermon || cards.find(c => c.type === 'sermon');

  return (
    <div className="min-h-screen bg-[#121215] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white">
      <main>
        {/* Hero Section: Today's Word (Meditation) */}
        <header className="relative min-h-[70vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-[#121215]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed]/10 to-transparent opacity-50 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7c3aed]/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7c3aed]/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
            {todayQT ? (
              <div className="w-full max-w-7xl flex flex-col items-center text-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#7c3aed]/20 rounded-2xl flex items-center justify-center text-[#7c3aed] border border-[#7c3aed]/30 shadow-[0_0_30px_rgba(124,58,237,0.2)]">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-sm font-bold tracking-widest text-[#7c3aed] uppercase">Today's Word</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                  <span className="text-sm text-gray-400 tracking-wider drop-shadow-md">
                    {todayQT.date}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg px-4 whitespace-nowrap overflow-x-auto no-scrollbar max-w-full">
                  {todayQT.scripture || todayQT.title}
                </h1>

                {(todayQT.scripture && todayQT.title) && (
                  <h2 className="text-xl md:text-2xl text-[#d1d5db] font-medium mb-8 pb-8 border-b border-white/10 w-full max-w-5xl px-4 whitespace-nowrap overflow-x-auto no-scrollbar">
                    {todayQT.title}
                  </h2>
                )}

                <div className="relative w-full max-w-5xl px-4">
                  <div className={`text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed font-light mb-8 whitespace-pre-wrap transition-all duration-700 overflow-hidden text-left ${isMedExpanded ? 'max-h-[2000px]' : 'max-h-36'}`}>
                    <div className="mb-8">{todayQT.content}</div>
                    {todayQT.question && (
                      <div className="mt-10 pt-10 border-t border-white/10 bg-[#1A1A24]/40 p-8 rounded-3xl border border-white/5 w-full">
                        <h4 className="flex items-center justify-center md:justify-start gap-3 text-[#7c3aed] font-bold text-base mb-4 uppercase tracking-widest">
                          <PenLine size={18} /> 묵상 질문
                        </h4>
                        <p className="text-gray-300 italic text-lg lg:text-xl leading-relaxed whitespace-pre-line text-center md:text-left">
                          {todayQT.question.replace(/(\d+\.)/g, '\n$1').trim()}
                        </p>
                      </div>
                    )}
                  </div>
                  {!isMedExpanded && (
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#121215] to-transparent pointer-events-none"></div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-6 items-center">
                  <button
                    onClick={() => setIsMedExpanded(!isMedExpanded)}
                    className="inline-flex items-center text-sm font-bold tracking-wider text-white hover:text-[#7c3aed] transition-colors bg-white/5 px-8 py-3.5 rounded-full hover:bg-white/10 border border-white/10 shadow-lg"
                  >
                    {isMedExpanded ? "말씀 접기" : "말씀 전체 읽기"}
                    <ChevronDown size={18} className={`ml-2 transition-transform ${isMedExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    onClick={() => router.push('/sharing')}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#7c3aed] text-white hover:bg-[#6d28d9] rounded-full font-bold transition-all shadow-lg shadow-[#7c3aed]/20 hover:shadow-[#7c3aed]/40 hover:-translate-y-1 border border-white/10"
                  >
                    <PenLine size={18} />
                    이 말씀으로 나눔 작성하기
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl w-full flex flex-col items-center text-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#7c3aed]/20 rounded-2xl flex items-center justify-center text-[#7c3aed] border border-[#7c3aed]/30">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-sm font-bold tracking-widest text-[#7c3aed] uppercase">Today's Word</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-700 mb-4">
                  오늘의 말씀이<br />준비 중입니다.
                </h1>
              </div>
            )}
          </div>
        </header>

        {/* Welcome Section: JOOSUNG CHURCH & Sermon */}
        <section className="py-24 bg-[#52575D] relative overflow-hidden shadow-2xl border-t border-white/5">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[30rem] h-[30rem] bg-black/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-px bg-yellow-400"></span>
                  <span className="text-yellow-400 font-bold tracking-widest text-sm uppercase">Welcome to</span>
                </div>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-display uppercase leading-[0.9] tracking-tight mb-8">
                  <span className="block text-white">JOOSUNG</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500">Church</span>
                </h2>
                <div className="w-12 h-1 bg-[#7c3aed] rounded-full mb-8"></div>
                <p className="text-lg md:text-xl text-gray-200 max-w-md mb-10 leading-relaxed font-light">
                  하나님이 이루어 가시는 공동체.<br />
                  우리는 예수님만 닮아갑니다.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => router.push('/worship')} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#52575D] font-bold rounded-full hover:bg-gray-100 transition-colors shadow-xl shadow-black/10 hover:-translate-y-1">
                    <Play size={20} fill="currentColor" /> 예배 안내
                  </button>
                </div>
              </div>

              <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
                <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem]">
                  <div className="absolute inset-0 border border-white/20 rounded-full scale-110"></div>
                  <div className="absolute inset-0 border border-white/10 rounded-full scale-[1.2]"></div>
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#52575D] shadow-2xl relative z-10 group cursor-pointer" onClick={() => (latestSermon?.linkUrl) && window.open(latestSermon.linkUrl, '_blank')}>
                    <img alt="Worship atmosphere" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                      <div className="w-20 h-20 bg-[#7c3aed] backdrop-blur rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play fill="white" className="text-white w-10 h-10 ml-1.5" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 sm:-right-4 transform translate-y-4 bg-[#121215]/90 backdrop-blur-md border border-white/10 p-5 rounded-3xl shadow-2xl z-20 max-w-[240px]">
                    <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Latest Sermon
                    </p>
                    <p className="font-bold text-white leading-snug line-clamp-2 text-sm">{latestSermon?.title || "주님이 원하시는 참된 예배자"}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="py-20 bg-[#333446] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "말씀 뽑기", desc: "매일 나에게 주시는 은혜의 말씀", icon: Gift, color: "text-rose-400 bg-rose-500/10 group-hover:bg-rose-500/20", onClick: () => setIsGraceModalOpen(true) },
                { title: "설교 듣기", desc: "지난 주일 설교와 집회 메시지", icon: Mic, color: "text-blue-400 bg-blue-500/10 group-hover:bg-blue-500/20", onClick: () => router.push('/sermon') },
                { title: "예배 안내", desc: "주일, 수요 및 예배 시간 안내", icon: BookOpen, color: "text-emerald-400 bg-emerald-500/10 group-hover:bg-emerald-500/20", onClick: () => router.push('/worship') },
                { title: "주보 보기", desc: "매주 발행되는 주보를 편하게 확인", icon: FileText, color: "text-amber-400 bg-amber-500/10 group-hover:bg-amber-500/20", onClick: () => router.push('/bulletin') }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.onClick}
                  className="group p-8 bg-[#121215] border border-white/5 hover:border-white/20 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#121215]/50 text-left w-full h-full flex flex-col"
                >
                  <div className={`p-4 rounded-2xl w-fit mb-6 transition-colors ${item.color}`}>
                    <item.icon size={32} className="transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-24 bg-[#121215]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-4">
              <h2 className="text-4xl font-display uppercase text-white">은혜의 정원</h2>
              <a href={CHURCH_DATA.contact.blog} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#7c3aed] hover:text-[#6d28d9] flex items-center gap-1 transition-colors">
                전체보기 <ArrowRight size={16} />
              </a>
            </div>

            {blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogPosts.slice(0, 3).map((post, idx) => {
                  const placeholderImages = [
                    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?auto=format&fit=crop&q=80"
                  ];
                  const isTargetPrayerPost = post.title.trim() === '기도';
                  const displayImage = isTargetPrayerPost
                    ? "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80"
                    : (idx < 3 ? placeholderImages[idx] : placeholderImages[0]);
                  const linkUrl = isTargetPrayerPost
                    ? "https://blog.naver.com/joosung0416/223997530763"
                    : post.link;

                  return (
                    <a
                      key={idx}
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col h-full bg-[#121215] rounded-xl overflow-hidden border border-white/5 hover:shadow-lg hover:border-white/10 transition-all group"
                    >
                      <div className="h-48 overflow-hidden relative border-b border-white/5">
                        <span className="absolute top-4 left-4 bg-black/70 backdrop-blur px-3 py-1 text-xs font-bold rounded-full z-10 text-white font-mono uppercase">
                          {new Date(post.pubDate).toLocaleDateString()}
                        </span>
                        <img
                          src={displayImage}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                          alt={post.title}
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-[#7c3aed] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                          {post.description}
                        </p>
                        <span className="inline-flex items-center text-xs font-bold tracking-wider uppercase text-[#7c3aed] pb-1 w-fit group-hover:underline underline-offset-4">
                          Read Article <ArrowRight size={12} className="ml-1" />
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="py-24 text-center bg-[#121215] rounded-xl border border-dashed border-white/10">
                <Loader2 className="animate-spin text-[#7c3aed] mx-auto mb-6" size={48} />
                <p className="text-gray-400 font-medium text-sm">블로그 소식을 불러오는 중입니다...</p>
              </div>
            )}
          </div>
        </section>


      </main>

      {
        isAdmin && (
          <div className="fixed bottom-10 right-10 z-[90] flex flex-col gap-4">
            <button
              onClick={() => setMainModalOpen(true)}
              className="group flex items-center justify-center p-4 bg-[#8B4513] text-white rounded-full font-bold shadow-xl shadow-[#8B4513]/30 border border-[#8B4513]/20 hover:bg-stone-900 hover:scale-105 hover:shadow-2xl transition-all"
            >
              <Plus size={24} />
            </button>
          </div>
        )
      }

      <MainContentModal
        isOpen={isMainModalOpen}
        onClose={() => setMainModalOpen(false)}
        onSubmit={handleAddMainContent}
      />

      <AnimatePresence>
        {isGraceModalOpen && (
          <GraceCardModal
            isOpen={isGraceModalOpen}
            onClose={() => setIsGraceModalOpen(false)}
          />
        )}
        {isNoticeModalOpen && (
          <NoticeModal
            isOpen={isNoticeModalOpen}
            onClose={() => setIsNoticeModalOpen(false)}
            notices={cards}
          />
        )}
      </AnimatePresence>
    </div >
  );
}

// MainContentModal is now dynamically imported above
