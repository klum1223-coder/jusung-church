'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, Pause, Volume2, VolumeX, ChevronDown, Calendar, Clock, MapPin, Search, Menu as MenuIcon, X, Instagram, Youtube, ArrowUpRight, Heart, FileText, Bell, Users, Loader2, Link as LinkIcon, ExternalLink, BookOpen, Sparkles, Plus, Image as ImageIcon, Gift } from 'lucide-react';
import GraceCardModal from './components/GraceCardModal';
import TiltCard from './components/TiltCard';
import dynamic from 'next/dynamic';

// Dynamic import for 3D component (client-only)
const Interactive3D = dynamic(() => import('./components/Interactive3D'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />
});
import { db, storage } from './firebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { CHURCH_DATA, checkIfAdmin } from './lib/constants';
import { useAuth } from './lib/AuthContext';

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
    <div className="min-h-screen bg-[#fafafa]">
      <main>
        {/* Floating Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#8B4513]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-amber-100/30 rounded-full blur-[100px]" />
        </div>

        {/* Hero Section */}
        <section className="relative h-[100vh] md:h-[95vh] flex items-center justify-center overflow-hidden">
          {/* Beautiful Gradient Background */}
          <div className="absolute inset-0 z-0">
            {/* Animated gradient background - richer colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />

            {/* Aurora-like effect */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(ellipse at 20% 30%, rgba(120,119,198,0.3) 0%, transparent 50%)',
                  'radial-gradient(ellipse at 80% 70%, rgba(120,119,198,0.3) 0%, transparent 50%)',
                  'radial-gradient(ellipse at 40% 60%, rgba(120,119,198,0.3) 0%, transparent 50%)',
                ]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />

            {/* Decorative glowing orbs - more vibrant */}
            <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-r from-amber-500/30 to-orange-500/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-48 md:w-80 h-48 md:h-80 bg-gradient-to-r from-blue-500/25 to-cyan-500/20 rounded-full blur-[60px] md:blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-gradient-to-r from-purple-500/15 to-pink-500/10 rounded-full blur-[100px] md:blur-[150px]" />
            <div className="absolute top-[10%] right-[10%] w-32 md:w-48 h-32 md:h-48 bg-rose-500/20 rounded-full blur-[50px] animate-pulse" style={{ animationDelay: '2s' }} />

            {/* Floating particles - more varied sizes */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${2 + Math.random() * 4}px`,
                    height: `${2 + Math.random() * 4}px`,
                    background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#60a5fa' : '#ffffff',
                  }}
                  initial={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    opacity: 0
                  }}
                  animate={{
                    y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                    opacity: [0, 0.8, 0],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 5,
                    repeat: Infinity,
                    delay: Math.random() * 4
                  }}
                />
              ))}
            </div>

            {/* Twinkling stars */}
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3
                  }}
                >
                  <Sparkles size={8 + Math.random() * 8} className="text-amber-300/60" />
                </motion.div>
              ))}
            </div>

            {/* Cross light rays - enhanced */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-amber-400/40 via-amber-400/10 to-transparent" />
            <div className="absolute top-1/3 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />

            {/* Diagonal light streaks */}
            <motion.div
              className="absolute top-0 -left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{ transform: 'rotate(45deg)', transformOrigin: 'center' }}
              animate={{ x: ['0%', '200%'], opacity: [0, 1, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />

            {/* Subtle pattern overlay - denser */}
            <div className="absolute inset-0 opacity-25" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }} />

            {/* Video for desktop only */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-20 hidden md:block"
            >
              <source src="https://cdn.pixabay.com/video/2020/05/22/40297-424319516_large.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-black/10 z-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 text-center px-6 max-w-5xl space-y-6 pt-20 md:pt-0"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-white text-[10px] font-bold uppercase tracking-[0.15em]">{CHURCH_DATA.engName}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-serif text-5xl md:text-9xl text-white font-bold leading-none tracking-tight"
                style={{ textShadow: '0 0 60px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.5)' }}
              >
                {CHURCH_DATA.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-white/90 text-base md:text-2xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed"
              >
                {CHURCH_DATA.slogan}
              </motion.p>
            </div>

            {/* Animated Heart for Mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="md:hidden relative mx-auto w-20 h-20"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-5xl"
                style={{ filter: 'drop-shadow(0 0 20px rgba(255,100,100,0.5))' }}
              >
                ❤️
              </motion.div>
            </motion.div>

            {/* 3D Interactive Heart - Desktop only */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="hidden md:block w-32 h-32 md:w-40 md:h-40 mx-auto"
            >
              <Interactive3D type="heart" scale={1.2} className="w-full h-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
            >
              <button
                onClick={() => router.push('/worship')}
                className="group relative px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold transition-all shadow-2xl hover:scale-105 overflow-hidden"
                style={{ boxShadow: '0 10px 40px rgba(245,158,11,0.4)' }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles size={16} />
                  예배 안내
                </span>
              </button>
              <button
                onClick={() => router.push('/sermon')}
                className="px-10 py-4 bg-white/10 border-2 border-white/30 text-white rounded-full font-bold hover:bg-white hover:text-stone-900 transition-all shadow-xl backdrop-blur-md"
              >
                온라인 예배
              </button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-white/50 text-xs uppercase tracking-widest">Scroll</span>
              <ChevronDown size={20} className="text-white/50" />
            </motion.div>
          </motion.div>
        </section>

        {/* Content Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="py-32 px-4 md:px-6"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">

              {/* Left Column: Featured Sermon (Span 7) */}
              <div className="col-span-1 lg:col-span-7 h-[400px] lg:h-full">
                <TiltCard className="h-full">
                  <div
                    onClick={() => (latestSermon?.linkUrl) && window.open(latestSermon.linkUrl, '_blank')}
                    className="w-full h-full premium-card relative overflow-hidden group cursor-pointer bg-[#1a3c34] border-none shadow-2xl h-full"
                  >
                    <div className="absolute inset-0 z-0">
                      <img
                        src={latestSermon?.imageUrl || latestSermon?.thumbnail || CHURCH_DATA.images.hero}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000"
                        alt="Sermon"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f2922] via-[#1a3c34]/40 to-transparent" />
                    </div>

                    <div className="relative z-10 p-8 md:p-12 flex flex-col justify-between h-full">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                          <span className="text-[10px] font-black uppercase text-white tracking-widest">Featured Sermon</span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h2 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight group-hover:translate-x-2 transition-transform duration-500 drop-shadow-lg">
                          {latestSermon?.title || "이번 주 설교 말씀"}
                        </h2>
                        {latestSermon?.description && (
                          <p className="text-white/80 text-base md:text-lg line-clamp-2 font-light leading-relaxed max-w-lg drop-shadow-md">
                            {latestSermon.description}
                          </p>
                        )}
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#c5a065] text-[#0f2922] rounded-full font-bold text-xs hover:bg-white transition-colors mt-4 shadow-lg shadow-black/20">
                          <Play size={14} fill="currentColor" /> WATCH NOW
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>

              {/* Right Column: Quick Actions (Span 5) */}
              <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 h-full">
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <TiltCard>
                    <button
                      onClick={() => setIsGraceModalOpen(true)}
                      className="w-full h-full premium-card p-6 flex flex-col justify-between group bg-amber-50 border-amber-100 hover:bg-amber-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <Gift size={20} fill="currentColor" className="text-amber-500 animate-bounce" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-stone-900 mb-1">말씀 뽑기</h3>
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Grace Draw</p>
                      </div>
                    </button>
                  </TiltCard>

                  <TiltCard>
                    <button
                      onClick={() => router.push('/worship')}
                      className="w-full h-full premium-card p-6 flex flex-col justify-between group bg-blue-50 border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                        <BookOpen size={20} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-stone-900 mb-1">예배 안내</h3>
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Worship Info</p>
                      </div>
                    </button>
                  </TiltCard>

                  <TiltCard>
                    <button
                      onClick={() => {
                        const b = cards.find(c => c.type === 'bulletin');
                        if (b?.linkUrl) window.open(b.linkUrl, '_blank');
                      }}
                      className="w-full h-full premium-card p-6 flex flex-col justify-between group bg-emerald-50 border-emerald-100 hover:bg-emerald-100 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                        <FileText size={20} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-stone-900 mb-1">주보 보기</h3>
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Weekly Bulletin</p>
                      </div>
                    </button>
                  </TiltCard>

                  <TiltCard>
                    <button
                      onClick={() => router.push('/community')}
                      className="w-full h-full premium-card p-6 flex flex-col justify-between group bg-violet-50 border-violet-100 hover:bg-violet-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-violet-600 mb-4 shadow-sm">
                        <Bell size={20} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-stone-900 mb-1">공지사항</h3>
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Notice & News</p>
                      </div>
                    </button>
                  </TiltCard>
                </div>

                <TiltCard>
                  <button
                    onClick={() => router.push('/community')}
                    className="w-full h-full rounded-[32px] shadow-premium hover:shadow-premium-hover p-8 flex items-center justify-between group bg-[#c5a065] border-none"
                  >
                    <div className="text-left">
                      <h3 className="font-serif text-2xl font-bold text-white mb-2">나눔의 정원</h3>
                      <p className="text-white/80 text-xs font-medium tracking-wide">Community Lounge & Sharing</p>
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#c5a065] transition-all">
                      <Users size={28} />
                    </div>
                  </button>
                </TiltCard>
              </div>

            </div>
          </div>
        </motion.section>

        {/* Blog Post Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="py-32 px-6 bg-[#1a1a1a] text-white overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#8B4513]/5 blur-[150px] pointer-events-none" />

          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
              <div className="space-y-4">
                <span className="text-[#c5a065] text-[10px] font-black tracking-[0.4em] uppercase">Our Journal</span>
                <h2 className="font-serif text-5xl md:text-7xl font-bold leading-tight">주성 소식</h2>
                <p className="text-white/40 text-lg font-light max-w-xl leading-relaxed pt-2">네이버 블로그와 커뮤니티를 통해 전하는 주성교회의 따뜻한 일상을 전해드립니다.</p>
              </div>
              <a
                href={CHURCH_DATA.contact.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 text-white font-bold text-sm px-8 py-4 bg-white/5 hover:bg-white hover:text-stone-900 rounded-full transition-all border border-white/10"
              >
                블로그 전체보기 <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </a>
            </div>

            {blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.slice(0, 3).map((post, idx) => {
                  const placeholderImages = [
                    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1507692049790-de58293a4697?auto=format&fit=crop&q=80"
                  ];
                  const displayImage = idx < 3 ? placeholderImages[idx] : placeholderImages[0];

                  return (
                    <motion.a
                      key={idx}
                      href={post.link}
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

const MainContentModal = ({ isOpen, onClose, onSubmit }: any) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    let imageUrl = formData.get('imageUrl') as string;

    if (selectedFile) {
      try {
        const storageRef = ref(storage, `contents/${Date.now()}_${selectedFile.name}`);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        alert("사진 업로드 실패");
        setIsUploading(false);
        return;
      }
    }

    onSubmit({
      type: formData.get('type'),
      title: formData.get('title'),
      description: formData.get('description'),
      linkUrl: formData.get('linkUrl'),
      imageUrl
    });

    setIsUploading(false);
    onClose();
    setSelectedFile(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-12 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-500">
        <button onClick={onClose} className="absolute top-10 right-10 text-stone-300 hover:text-stone-900 transition-colors">
          <X size={32} />
        </button>

        <div className="mb-10">
          <h3 className="font-serif text-3xl font-bold text-stone-900 mb-2">메인 콘텐츠 등록</h3>
          <p className="text-stone-400 text-sm font-light">홈페이지 곳곳에 배치될 공지, 설교, 묵상 등을 관리합니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">분류</label>
              <select
                name="type"
                required
                className="w-full p-6 bg-stone-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#8B4513] font-bold transition-all appearance-none"
              >
                <option value="sermon">설교 (Sermon)</option>
                <option value="meditation">묵상 (Meditation)</option>
                <option value="notice">공지 (Notice)</option>
                <option value="bulletin">주보 (Bulletin)</option>
                <option value="newcomer">새가족 (Newcomer)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">제목</label>
              <input
                name="title"
                required
                placeholder="제목을 입력하세요"
                className="w-full p-6 bg-stone-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#8B4513] font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">상세 설명 / 본문</label>
            <textarea
              name="description"
              placeholder="내용을 정성스레 입력하세요"
              className="w-full p-6 bg-stone-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#8B4513] h-40 resize-none font-light leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">외부 링크 (YouTube / Document URL)</label>
            <input
              name="linkUrl"
              placeholder="https://..."
              className="w-full p-6 bg-stone-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#8B4513] font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">시각 자료 (이미지 선택)</label>
            <div className="grid grid-cols-1 gap-4">
              <input
                name="imageUrl"
                placeholder="직접 이미지 URL 주소 입력 시 여기에 작성"
                className="w-full p-6 bg-stone-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
              />
              <input
                type="file"
                accept="image/*"
                id="main-file-input"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="main-file-input"
                className={`flex items-center gap-4 p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${selectedFile ? 'bg-[#8B4513]/5 border-[#8B4513] text-[#8B4513]' : 'bg-stone-50 border-stone-200 text-stone-400 hover:border-stone-400'
                  }`}
              >
                <ImageIcon size={24} />
                <span className="text-sm font-bold uppercase">{selectedFile ? selectedFile.name : '기기에서 사진 업로드'}</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-6 bg-stone-900 text-white rounded-[24px] font-bold text-lg hover:bg-[#8B4513] disabled:opacity-50 shadow-2xl transition-all flex items-center justify-center gap-3"
          >
            {isUploading ? <><Loader2 className="animate-spin" size={24} /> 저장 중...</> : '홈페이지 콘텐츠 발행하기'}
          </button>
        </form>
      </div>
    </div>
  );
};
