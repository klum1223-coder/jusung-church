'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Play, MapPin, Plus, Loader2, FileText,
  Image as ImageIcon, Calendar, Bell, Users, X
} from 'lucide-react';
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
  const isAdmin = checkIfAdmin(user);
  const [isMainModalOpen, setMainModalOpen] = useState(false);

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

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  // Fetch latest sermon from YouTube
  const [youtubeSermon, setYoutubeSermon] = useState<ContentCard | null>(null);
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
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-[#8B4513]/10 selection:text-[#8B4513]">
      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-[#8B4513]">
          <div className="absolute inset-0 z-0 opacity-20">
            <img src={CHURCH_DATA.images.hero} className="w-full h-full object-cover" alt="Church" />
          </div>
          <div className="relative z-10 text-center px-6 max-w-4xl space-y-8">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto border border-white/20 shadow-2xl">
                <span className="text-white text-3xl">✝</span>
              </div>
              <h1 className="font-serif text-6xl md:text-8xl text-white font-bold leading-none tracking-tight drop-shadow-2xl">
                {CHURCH_DATA.name}
              </h1>
              <p className="text-white/80 text-xl md:text-2xl font-light tracking-wide">
                {CHURCH_DATA.slogan}
              </p>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/worship')}
                className="px-10 py-4 bg-white text-[#8B4513] rounded-full font-bold hover:bg-white/90 transition-all shadow-2xl text-sm uppercase tracking-widest"
              >
                예배 안내
              </button>
              <button
                onClick={() => router.push('/sermon')}
                className="px-10 py-4 bg-white/10 backdrop-blur-md border-2 border-white/40 text-white rounded-full font-bold hover:bg-white/20 transition-all shadow-xl text-sm uppercase tracking-widest"
              >
                온라인 예배
              </button>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <section className="py-20 px-4 md:px-6 bg-[#fafafa]">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* LEFT: Large Card */}
              <div className="lg:col-span-7 space-y-6">
                <div
                  onClick={() => latestSermon?.linkUrl && window.open(latestSermon.linkUrl, '_blank')}
                  className="relative h-[500px] bg-gradient-to-br from-stone-800 to-stone-900 rounded-3xl overflow-hidden group cursor-pointer shadow-2xl"
                >
                  {latestSermon?.imageUrl && (
                    <img
                      src={latestSermon.imageUrl}
                      className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                      alt="Sermon"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  <div className="absolute top-8 left-8 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                      <Play size={20} className="text-white ml-0.5" fill="white" />
                    </div>
                    <span className="text-white/90 text-xs font-bold uppercase tracking-wide bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                      Latest Sermon
                    </span>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 space-y-4">
                    <h2 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight">
                      {latestSermon?.title || "이번 주 설교 말씀"}
                    </h2>
                    {latestSermon?.description && (
                      <p className="text-white/80 text-sm line-clamp-2 max-w-lg">
                        {latestSermon.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => router.push('/worship')}
                    className="bg-white p-8 rounded-2xl border border-stone-100 hover:shadow-xl transition-all group text-left space-y-4"
                  >
                    <div className="w-12 h-12 bg-[#8B4513]/10 rounded-xl flex items-center justify-center text-[#8B4513] group-hover:scale-110 transition-transform">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-stone-900 mb-1">예배 안내</h3>
                      <p className="text-stone-400 text-xs uppercase tracking-widest font-bold">Worship</p>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/worship')}
                    className="bg-[#8B4513] p-8 rounded-2xl hover:shadow-2xl transition-all group text-left space-y-4"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white mb-1">오시는 길</h3>
                      <p className="text-white/60 text-xs uppercase tracking-widest font-bold">Location</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* RIGHT: Small Cards */}
              <div className="lg:col-span-5 space-y-6">
                <button
                  onClick={() => router.push('/meditation')}
                  className="w-full bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-100 hover:shadow-xl transition-all group text-left space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <span className="text-[9px] text-amber-600 font-black uppercase tracking-wide bg-amber-100 px-3 py-1 rounded-full">
                      Daily
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 line-clamp-2">
                    {latestMeditation?.title || "오늘의 묵상"}
                  </h3>
                  {latestMeditation?.description && (
                    <p className="text-stone-600 text-sm line-clamp-3 leading-relaxed">
                      {latestMeditation.description}
                    </p>
                  )}
                </button>

                <button
                  onClick={() => router.push('/community')}
                  className="w-full bg-white p-8 rounded-2xl border border-stone-100 hover:shadow-xl transition-all group text-left space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <Bell size={24} />
                    </div>
                    <span className="text-[9px] text-blue-600 font-black uppercase tracking-wide bg-blue-50 px-3 py-1 rounded-full">
                      Notice
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-stone-900 mb-2">교회 소식</h3>
                  <p className="text-stone-500 text-sm line-clamp-2">
                    최신 공지사항을 확인하세요
                  </p>
                </button>

                <button
                  onClick={() => router.push('/community')}
                  className="w-full bg-gradient-to-br from-stone-50 to-stone-100 p-8 rounded-2xl border border-stone-200 hover:shadow-xl transition-all group text-left space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-stone-200 rounded-xl flex items-center justify-center text-stone-700 group-hover:scale-110 transition-transform">
                      <Users size={24} />
                    </div>
                    <span className="text-[9px] text-stone-600 font-black uppercase tracking-wide bg-stone-200 px-3 py-1 rounded-full">
                      Community
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-stone-900 mb-2">나눔의 정원</h3>
                  <p className="text-stone-500 text-sm">
                    {communityPosts.length > 0 ? `${communityPosts.length}개의 새로운 이야기` : "첫 이야기를 남겨주세요"}
                  </p>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {isAdmin && (
        <div className="fixed bottom-8 right-8 z-[90] flex flex-col gap-3">
          <button
            onClick={() => setMainModalOpen(true)}
            className="group flex items-center gap-3 px-6 py-4 bg-stone-900 text-white rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all"
          >
            <Plus size={20} />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">콘텐츠 등록</span>
          </button>
        </div>
      )}

      <MainContentModal
        isOpen={isMainModalOpen}
        onClose={() => setMainModalOpen(false)}
        onSubmit={handleAddMainContent}
      />
    </div>
  );
}

// =================================================================
// MAIN CONTENT MODAL (Admin)
// =================================================================
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-8 relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-6 right-6 text-stone-300 hover:text-stone-600">
          <X size={24} />
        </button>

        <div className="mb-8">
          <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">메인 콘텐츠 등록</h3>
          <p className="text-stone-400 text-sm">설교, 묵상, 공지사항 등을 등록합니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">분류</label>
              <select
                name="type"
                required
                className="w-full p-4 bg-stone-50 rounded-xl border border-stone-100 outline-none focus:ring-2 focus:ring-[#8B4513]"
              >
                <option value="sermon">설교 (Sermon)</option>
                <option value="meditation">묵상 (Meditation)</option>
                <option value="notice">공지 (Notice)</option>
                <option value="bulletin">주보 (Bulletin)</option>
                <option value="newcomer">새가족 (Newcomer)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">제목</label>
              <input
                name="title"
                required
                placeholder="제목"
                className="w-full p-4 bg-stone-50 rounded-xl border border-stone-100 outline-none focus:ring-2 focus:ring-[#8B4513]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">상세 설명 / 본문</label>
            <textarea
              name="description"
              placeholder="내용을 입력하세요"
              className="w-full p-4 bg-stone-50 rounded-xl border border-stone-100 outline-none focus:ring-2 focus:ring-[#8B4513] h-32 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">유튜브 / 외부 링크 (선택)</label>
            <input
              name="linkUrl"
              placeholder="https://youtube.com/..."
              className="w-full p-4 bg-stone-50 rounded-xl border border-stone-100 outline-none focus:ring-2 focus:ring-[#8B4513]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">이미지 URL (직접 입력 혹은 파일 업로드)</label>
            <input
              name="imageUrl"
              placeholder="https://..."
              className="w-full p-4 bg-stone-50 rounded-xl border border-stone-100 outline-none focus:ring-2 focus:ring-[#8B4513] mb-2"
            />
            <input type="file" accept="image/*" id="main-file" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
            <label
              htmlFor="main-file"
              className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-dashed cursor-pointer ${selectedFile ? 'bg-[#8B4513]/5 border-[#8B4513] text-[#8B4513]' : 'bg-stone-50 border-stone-200 text-stone-400'
                }`}
            >
              <ImageIcon size={20} />
              <span className="text-sm font-bold">{selectedFile ? selectedFile.name : '사진 파일 업로드'}</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-5 bg-stone-900 text-white rounded-xl font-bold hover:bg-black disabled:opacity-50 shadow-xl flex items-center justify-center gap-2"
          >
            {isUploading ? <><Loader2 className="animate-spin" size={20} /> 등록 중...</> : '홈페이지 콘텐츠 등록하기'}
          </button>
        </form>
      </div>
    </div>
  );
};
