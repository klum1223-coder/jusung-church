'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, Pause, Volume2, VolumeX, ChevronDown, Calendar, Clock, MapPin, Search, Menu as MenuIcon, X, Instagram, Youtube, ArrowUpRight, Heart, FileText, Bell, Users, Loader2, Link as LinkIcon, ExternalLink, BookOpen, Sparkles, Plus, Image as ImageIcon, Gift, Mic } from 'lucide-react';

import GraceCardModal from './components/GraceCardModal';
import TiltCard from './components/TiltCard';
import MeditationPopup from './components/MeditationPopup';
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

const SplineBackground = dynamic(() => import('./components/SplineBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#eef2ff] -z-50" />
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

    // Fetch Naver Blog Posts
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
  const latestMeditation = cards.find(c => c.type === 'meditation');

  return (
    <div className="min-h-screen bg-transparent text-zinc-800 selection:bg-indigo-500/30">
      <main>
        {/* Daily Meditation Popup */}
        <MeditationPopup data={latestMeditation} />

        <SplineBackground />

        {/* Hero Section */}
        <section className="relative h-[100vh] md:h-[95vh] flex items-center justify-center overflow-hidden">
          {/* 3D Background moved to global fixed layer */}

          {/* Beautiful Gradient Background (Overlay) */}




          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20 md:pt-0"
          >
            {/* Glass Card Wrapper */}
            <div className="bg-white/50 backdrop-blur-2xl rounded-[40px] p-8 md:p-16 border border-white/60 shadow-2xl relative overflow-hidden ring-1 ring-white/50">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/10 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-8">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-stone-200 shadow-sm"
                  >
                    <Sparkles size={14} className="text-amber-500" />
                    <span className="text-stone-800 text-[10px] font-bold uppercase tracking-[0.15em]">{CHURCH_DATA.engName}</span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="font-serif text-5xl md:text-8xl text-stone-900 font-black leading-none tracking-tight relative drop-shadow-sm"
                  >
                    <span className="relative inline-block">
                      {CHURCH_DATA.name}
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-stone-600 text-base md:text-xl font-medium tracking-wide max-w-2xl mx-auto leading-relaxed"
                  >
                    {CHURCH_DATA.slogan}
                  </motion.p>
                </div>

                {/* Animated Heart for Mobile */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="md:hidden relative mx-auto w-16 h-16"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-4xl"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(255,100,100,0.3))' }}
                  >
                    ❤️
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
                >
                  <motion.button
                    onClick={() => router.push('/worship')}
                    className="group relative px-10 py-4 bg-stone-900 text-white rounded-full font-bold transition-all shadow-xl hover:scale-105 overflow-hidden ring-4 ring-stone-900/10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-400" />
                      예배 안내
                    </span>
                  </motion.button>
                  <motion.button
                    onClick={() => router.push('/sermon')}
                    className="px-10 py-4 bg-white border border-stone-200 text-stone-900 rounded-full font-bold hover:bg-stone-50 transition-all shadow-lg relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">온라인 예배</span>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2 px-4 py-3 bg-white/60 backdrop-blur-xl rounded-full border border-zinc-200 shadow-sm"
            >
              <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Scroll</span>
              <motion.div
                animate={{ y: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronDown size={20} className="text-zinc-400" />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Content Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="py-32 px-4 md:px-6 relative"
        >
          {/* Subtle background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#d4af37]/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#8b4513]/5 rounded-full blur-[150px]" />
          </div>
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">

              {/* Left Column: Featured Sermon (Span 7) */}
              <motion.div
                className="col-span-1 lg:col-span-7 h-[400px] lg:h-full"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <TiltCard className="h-full">
                  <div
                    onClick={() => (latestSermon?.linkUrl) && window.open(latestSermon.linkUrl, '_blank')}
                    className="w-full h-full premium-card relative overflow-hidden group cursor-pointer bg-gradient-to-br from-[#1a1033] via-[#2d1b4e] to-[#0f0c29] border-none shadow-2xl"
                  >
                    {/* Pastor/Sermon Background Image */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      {/* Background Image */}
                      <img
                        src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&q=80"
                        alt="주일예배설교"
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60"
                      />

                      {/* Dark overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

                      {/* Decorative golden accent */}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] via-[#cd7f32] to-transparent" />
                    </div>

                    <div className="relative z-10 p-8 md:p-12 flex flex-col justify-between h-full">
                      <div className="flex justify-between items-start">
                        {/* Glass Badge */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
                          <motion.span
                            className="w-2 h-2 rounded-full bg-[#d4af37]"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="text-[10px] font-black uppercase text-white tracking-[0.2em]">Featured Sermon</span>
                        </div>

                        {/* Sermon Icon - 오른쪽 카드들과 통일감 */}
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center shadow-2xl"
                          style={{ background: 'linear-gradient(135deg, #d4af37 0%, #cd7f32 50%, #8b4513 100%)' }}
                        >
                          <Mic size={28} className="text-white" />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <motion.p
                            className="text-[#d4af37] text-xs font-bold tracking-widest uppercase mb-2"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                          >
                            New Update
                          </motion.p>
                          <h2 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight group-hover:translate-x-1 transition-transform duration-500 drop-shadow-2xl">
                            {latestSermon?.title || "이번 주 설교 말씀"}
                          </h2>
                        </div>

                        {latestSermon?.description && (
                          <p className="text-white/70 text-base md:text-lg line-clamp-2 font-light leading-relaxed max-w-lg drop-shadow-md border-l-2 border-[#d4af37]/30 pl-4">
                            {latestSermon.description}
                          </p>
                        )}

                        <motion.div
                          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#cd7f32] text-white rounded-full font-bold text-xs hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all mt-4"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-1">
                            <Play size={14} fill="currentColor" />
                          </div>
                          WATCH SERMON
                        </motion.div>
                      </div>
                    </div>

                    {/* Decorative glass border on hover */}
                    <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-500 pointer-events-none rounded-[32px]" />
                  </div>
                </TiltCard>
              </motion.div>

              {/* Right Column: Quick Actions (Span 5) */}
              <motion.div
                className="col-span-1 lg:col-span-5 flex flex-col gap-6 h-full"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <TiltCard>
                      <button
                        onClick={() => setIsGraceModalOpen(true)}
                        className="w-full h-full rounded-[32px] p-6 flex flex-col justify-between group border-none hover:shadow-2xl transition-all relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #dc2626 100%)' }}
                      >
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)' }}
                        />
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
                        <div className="relative z-10 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <Gift size={24} fill="currentColor" />
                        </div>
                        <div className="text-left relative z-10">
                          <h3 className="font-bold text-white text-lg mb-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>말씀 뽑기</h3>
                          <p className="text-[11px] text-white/90 uppercase tracking-wider font-bold">Grace Draw</p>
                        </div>
                      </button>
                    </TiltCard>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 }}
                  >
                    <TiltCard>
                      <button
                        onClick={() => router.push('/worship')}
                        className="w-full h-full rounded-[32px] p-6 flex flex-col justify-between group border-none hover:shadow-2xl transition-all relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)' }}
                      >
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)' }}
                        />
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
                        <div className="relative z-10 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                          <BookOpen size={24} />
                        </div>
                        <div className="text-left relative z-10">
                          <h3 className="font-bold text-white text-lg mb-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>예배 안내</h3>
                          <p className="text-[11px] text-white/90 uppercase tracking-wider font-bold">Worship Info</p>
                        </div>
                      </button>
                    </TiltCard>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <TiltCard>
                      <button
                        onClick={() => router.push('/bulletin')}
                        className="w-full h-full rounded-[32px] p-6 flex flex-col justify-between group border-none hover:shadow-2xl transition-all text-left relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)' }}
                      >
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)' }}
                        />
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
                        <div className="relative z-10 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <FileText size={24} />
                        </div>
                        <div className="text-left relative z-10">
                          <h3 className="font-bold text-white text-lg mb-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>주보 보기</h3>
                          <p className="text-[11px] text-white/90 uppercase tracking-wider font-bold">Weekly Bulletin</p>
                        </div>
                      </button>
                    </TiltCard>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.45 }}
                  >
                    <TiltCard>
                      <button
                        onClick={() => router.push('/community')}
                        className="w-full h-full rounded-[32px] p-6 flex flex-col justify-between group border-none hover:shadow-2xl transition-all relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%)' }}
                      >
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)' }}
                        />
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
                        <div className="relative z-10 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                          <Bell size={24} />
                        </div>
                        <div className="text-left relative z-10">
                          <h3 className="font-bold text-white text-lg mb-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>공지사항</h3>
                          <p className="text-[11px] text-white/90 uppercase tracking-wider font-bold">Notice & News</p>
                        </div>
                      </button>
                    </TiltCard>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <TiltCard>
                    <button
                      onClick={() => router.push('/community')}
                      className="w-full h-full rounded-[32px] shadow-premium hover:shadow-premium-hover p-8 flex items-center justify-between group bg-gradient-to-br from-[#d4af37] via-[#c5a065] to-[#8b4513] border-none relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                      />
                      <div className="text-left relative z-10">
                        <h3 className="font-serif text-2xl font-bold text-white mb-2 drop-shadow-lg">나눔의 정원</h3>
                        <p className="text-white/90 text-xs font-medium tracking-wide drop-shadow">Community Lounge & Sharing</p>
                      </div>
                      <motion.div
                        className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#8b4513] transition-all shadow-lg relative z-10"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Users size={28} />
                      </motion.div>
                    </button>
                  </TiltCard>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </motion.section>

        {/* Blog Post Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="py-32 px-6 bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0a0a0a] text-white overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#d4af37]/10 blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#8b4513]/10 blur-[120px] pointer-events-none" />

          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-[#d4af37] text-[10px] font-black tracking-[0.4em] uppercase inline-block animate-pulse">Garden of Grace</span>
                <h2 className="font-serif text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">은혜의 정원</h2>
                <p className="text-white/50 text-lg font-light max-w-xl leading-relaxed pt-2">네이버 블로그와 커뮤니티를 통해 전하는 주성교회의 따뜻한 일상을 전해드립니다.</p>
              </motion.div>
              <motion.a
                href={CHURCH_DATA.contact.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 text-white font-bold text-sm px-8 py-4 bg-white/5 hover:bg-gradient-to-r hover:from-[#d4af37] hover:to-[#cd7f32] hover:text-white rounded-full transition-all border border-white/10 hover:border-transparent backdrop-blur-md"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                블로그 전체보기 <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </motion.a>
            </div>

            {blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.slice(0, 3).map((post, idx) => {
                  const placeholderImages = [
                    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80"
                  ];

                  // '기도' 관련 포스트 커스텀 처리 (제목이 정확히 '기도'인 경우만)
                  const isTargetPrayerPost = post.title.trim() === '기도';

                  // 기도 포스트일 경우 커스텀 이미지(성경책/묵상) 사용
                  const displayImage = isTargetPrayerPost
                    ? "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80"
                    : (idx < 3 ? placeholderImages[idx] : placeholderImages[0]);

                  const linkUrl = isTargetPrayerPost
                    ? "https://blog.naver.com/joosung0416/223997530763"
                    : post.link;

                  return (
                    <motion.a
                      key={idx}
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className="group flex flex-col h-full bg-[#2a2a2a] rounded-[32px] overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={displayImage}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          alt={post.title}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        <div className="absolute top-6 left-6 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] text-white font-bold uppercase tracking-wider">
                          {new Date(post.pubDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="p-8 flex flex-col flex-1 relative">
                        <div className="space-y-4 mb-8">
                          <h3 className="text-xl font-bold text-white group-hover:text-[#c5a065] line-clamp-2 leading-snug transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-white/40 text-sm line-clamp-3 font-light leading-relaxed">
                            {post.description}
                          </p>
                        </div>
                        <div className="mt-auto flex items-center gap-2 text-[#c5a065] text-[10px] font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                          VIEW POST <ArrowRight size={12} />
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            ) : (
              <div className="py-24 text-center bg-white/5 rounded-[48px] border border-dashed border-white/10">
                <Loader2 className="animate-spin text-white/20 mx-auto mb-6" size={48} />
                <p className="text-white/40 font-bold tracking-widest text-xs uppercase">Connecting to Naver Blog Feed...</p>
              </div>
            )}
          </div>
        </motion.section>
      </main>

      {isAdmin && (
        <div className="fixed bottom-10 right-10 z-[90] flex flex-col gap-4">
          <button
            onClick={() => setMainModalOpen(true)}
            className="group flex items-center gap-4 px-8 py-5 bg-stone-900 text-white rounded-[24px] font-bold shadow-2xl hover:bg-[#8B4513] hover:scale-105 transition-all"
          >
            <Plus size={24} />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">콘텐츠 등록</span>
          </button>
        </div>
      )}

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
      </AnimatePresence>
    </div>
  );
}

// MainContentModal is now dynamically imported above
