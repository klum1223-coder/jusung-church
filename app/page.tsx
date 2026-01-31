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
        <section className="relative h-[90vh] md:h-[95vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1507692049790-de58293a4697?auto=format&fit=crop&q=80"
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="https://cdn.pixabay.com/video/2020/05/22/40297-424319516_large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f2922] via-transparent to-black/30 z-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 text-center px-6 max-w-5xl space-y-10"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">{CHURCH_DATA.engName}</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-serif text-6xl md:text-9xl text-white font-bold leading-none tracking-tight drop-shadow-2xl"
              >
                {CHURCH_DATA.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-white/80 text-lg md:text-2xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed"
              >
                {CHURCH_DATA.slogan}
              </motion.p>
            </div>

            {/* 3D Interactive Cross */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-4"
            >
              <Interactive3D type="heart" scale={1.2} className="w-full h-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <button
                onClick={() => router.push('/worship')}
                className="group relative px-12 py-5 bg-white text-stone-900 rounded-full font-bold transition-all shadow-2xl hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">예배 안내</span>
                <div className="absolute inset-0 bg-stone-100 translate-y-full group-hover:translate-y-0 transition-transform" />
              </button>
              <button
                onClick={() => router.push('/sermon')}
                className="px-12 py-5 bg-transparent border-2 border-white/30 text-white rounded-full font-bold hover:bg-white hover:text-stone-900 transition-all shadow-xl backdrop-blur-sm"
              >
                온라인 예배
              </button>
            </motion.div>
          </motion.div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
          </div>
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
