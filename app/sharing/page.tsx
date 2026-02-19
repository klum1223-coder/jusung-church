'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import {
    collection, addDoc, query, orderBy, onSnapshot,
    deleteDoc, doc, serverTimestamp, updateDoc, increment,
    limit, getDocs
} from 'firebase/firestore';
import {
    BookOpen, Send, Trash2, X, Loader2, Lock,
    LogIn, Heart, PenLine, ChevronDown, ChevronUp,
    FileText, Quote
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function SharingPage() {
    const { user, userData, login } = useAuth();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isWriting, setIsWriting] = useState(false);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [scripture, setScripture] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // 오늘의 큐티 (Google Sheet)
    interface QTData {
        date: string;
        title: string;
        scripture: string;
        content: string;
        question: string;
    }
    const [todayQT, setTodayQT] = useState<QTData | null>(null);
    const [qtLoading, setQtLoading] = useState(true);
    const [qtExpanded, setQtExpanded] = useState(false);

    // DB 묵상 (Firestore fallback/Legacy)
    const [todayMeditation, setTodayMeditation] = useState<any>(null);

    const isApproved = userData?.status === 'approved';
    const isAdmin = userData?.role === 'admin';

    const [todayDateStr, setTodayDateStr] = useState('');

    useEffect(() => {
        setTodayDateStr(new Date().toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
        }));
    }, []);

    // ── 구글 스프레드시트에서 오늘 큐티 가져오기 ──
    useEffect(() => {
        const fetchQTFromSheet = async () => {
            const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLTyXyrQvXbNxzR7ouopJThkMlgOYFRJNVjrliXMupw1q76sjckBr1e6Wda6p_GoIeX1pYIzcjYHBP/pub?output=csv';

            try {
                const res = await fetch(CSV_URL);
                const text = await res.text();

                // Simple CSV Parser
                const parseCSV = (str: string) => {
                    const rows = [];
                    let currentRow = [];
                    let currentVal = '';
                    let insideQuote = false;

                    for (let i = 0; i < str.length; i++) {
                        const char = str[i];
                        const nextChar = str[i + 1];

                        if (char === '"') {
                            if (insideQuote && nextChar === '"') {
                                currentVal += '"';
                                i++;
                            } else {
                                insideQuote = !insideQuote;
                            }
                        } else if (char === ',' && !insideQuote) {
                            currentRow.push(currentVal);
                            currentVal = '';
                        } else if ((char === '\r' || char === '\n') && !insideQuote) {
                            if (char === '\r' && nextChar === '\n') i++;
                            currentRow.push(currentVal);
                            rows.push(currentRow);
                            currentRow = [];
                            currentVal = '';
                        } else {
                            currentVal += char;
                        }
                    }
                    if (currentVal || currentRow.length > 0) {
                        currentRow.push(currentVal);
                        rows.push(currentRow);
                    }
                    return rows;
                };

                const rows = parseCSV(text);

                // 한국 시간 기준 오늘 날짜 (YYYY-MM-DD)
                const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });

                const todayRow = rows.find(row => {
                    const dateCell = row[0]?.trim();
                    return dateCell === today;
                });

                if (todayRow) {
                    setTodayQT({
                        date: todayRow[0] || today,
                        title: todayRow[1] || '오늘의 묵상',
                        scripture: todayRow[2] || '',
                        content: todayRow[3] || '',
                        question: todayRow[4] || ''
                    });
                } else {
                    console.log('Today QT not found for date:', today);
                }
            } catch (err) {
                console.error('Failed to fetch QT from Sheet:', err);
            } finally {
                setQtLoading(false);
            }
        };

        fetchQTFromSheet();
    }, []);

    // ── 나눔 게시글 실시간 구독 ──
    useEffect(() => {
        if (!db) return;
        const q = query(collection(db, 'community_shares'), orderBy('created_at', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !isApproved) return;
        if (!content.trim() || !title.trim()) return;
        setSubmitting(true);
        try {
            await addDoc(collection(db, 'community_shares'), {
                uid: user.uid,
                name: userData?.displayName || user.displayName || '익명',
                photoURL: userData?.photoURL || user.photoURL || '',
                title, scripture, content,
                created_at: serverTimestamp(),
                likes: 0
            });
            setContent(''); setTitle(''); setScripture('');
            setIsWriting(false);
        } catch { alert('저장에 실패했습니다.'); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (postId: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        try { await deleteDoc(doc(db, 'community_shares', postId)); }
        catch { alert('삭제에 실패했습니다.'); }
    };

    const handleLike = async (postId: string) => {
        try { await updateDoc(doc(db, 'community_shares', postId), { likes: increment(1) }); }
        catch { }
    };

    const formatDate = (ts: any) => {
        if (!ts?.seconds) return '방금 전';
        return new Date(ts.seconds * 1000).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    // Helper to format scripture (extract ref if possible)
    // Assuming user enters "Luke 6:46 Text..." or just text
    // We'll just display it nicely.

    return (
        <div className="min-h-screen pt-24 font-sans" style={{ background: '#f0ebe3' }}>

            {/* ── 헤더 ── */}
            <section className="py-12 px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-3">
                    <p className="text-[#8B4513] font-black tracking-[0.5em] text-[10px] uppercase">
                        Daily Word · Community
                    </p>
                    <h1 className="font-serif text-5xl md:text-6xl font-black text-stone-900">
                        말씀 나눔
                    </h1>
                    <p className="text-stone-600 text-base font-medium">
                        {todayDateStr}
                    </p>
                    <div className="w-12 h-0.5 bg-[#8B4513] mx-auto mt-4" />
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-6 pb-24 space-y-10">

                {/* ── 오늘의 큐티 카드 (Redesigned) ── */}
                <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-stone-100 relative">
                    <div className="absolute top-0 w-full h-2 bg-[#8B4513]" /> {/* Top Accent Bar */}

                    <div className="p-8 md:p-10">
                        {qtLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="animate-spin text-[#8B4513]" size={32} />
                                <span className="text-stone-400 font-medium text-sm">말씀을 불러오는 중입니다...</span>
                            </div>
                        ) : todayQT ? (
                            <div className="space-y-8">
                                {/* Header: Badge + Date */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#f0ebe3] px-3 py-1.5 rounded-full">
                                            <span className="text-[#8B4513] text-[11px] font-black tracking-widest uppercase">오늘의 말씀</span>
                                        </div>
                                        <span className="text-stone-400 text-xs font-bold tracking-wider uppercase">
                                            {todayQT.date}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 text-stone-300">
                                        <BookOpen size={18} />
                                    </div>
                                </div>

                                {/* Scripture Ref as Main Title */}
                                <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-stone-900 leading-tight">
                                    {todayQT.scripture}
                                </h1>

                                {/* Topic Title inside Box (Quote Style) */}
                                {todayQT.title && (
                                    <div className="relative bg-[#f9f5f0] p-8 rounded-3xl border-l-4 border-[#8B4513]">
                                        {/* Quote Icon Removed */}
                                        <div className="relative z-10">
                                            <p className="font-serif text-lg md:text-xl font-bold text-stone-800 leading-relaxed whitespace-pre-wrap">
                                                {todayQT.title}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Content Body */}
                                <div className={`prose prose-stone max-w-none transition-all duration-700 overflow-hidden ${qtExpanded ? 'opacity-100 max-h-[2000px]' : 'opacity-80 max-h-32 mask-image-b'}`}>
                                    <div className="whitespace-pre-wrap text-stone-600 leading-8 font-medium text-[15px]">
                                        {todayQT.content}
                                    </div>

                                    {/* Question Section */}
                                    {todayQT.question && (
                                        <div className="mt-8 pt-8 border-t border-stone-100">
                                            <h3 className="flex items-center gap-2 text-[#8B4513] font-bold text-sm uppercase tracking-wider mb-4">
                                                <PenLine size={16} /> 묵상 질문
                                            </h3>
                                            <p className="text-stone-700 italic font-serif text-lg leading-relaxed bg-stone-50 p-6 rounded-2xl border border-stone-100 whitespace-pre-wrap">
                                                {todayQT.question.replace(/(\d+\.)/g, '\n$1').trim()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Expand Button */}
                                <div className="flex justify-center pt-4">
                                    <button
                                        onClick={() => setQtExpanded(!qtExpanded)}
                                        className="group flex items-center gap-2 px-8 py-3 rounded-full border border-stone-200 bg-white hover:border-[#8B4513] hover:text-[#8B4513] transition-all shadow-sm hover:shadow-md"
                                    >
                                        <span className="text-xs font-bold tracking-wider text-stone-500 group-hover:text-[#8B4513] transition-colors">
                                            {qtExpanded ? '묵상 내용 접기' : '묵상 전체 읽기'}
                                        </span>
                                        {qtExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>
                                </div>

                                {/* Write Action */}
                                {isApproved && (
                                    <div className="flex justify-center pt-4">
                                        <button
                                            onClick={() => {
                                                setScripture(todayQT.title); // Or quote part
                                                setIsWriting(true);
                                                setTimeout(() => window.scrollTo({ top: 800, behavior: 'smooth' }), 100);
                                            }}
                                            className="w-full md:w-auto px-8 py-4 bg-[#8B4513] text-white rounded-2xl font-bold shadow-lg hover:bg-[#723b10] transition-all flex items-center justify-center gap-2"
                                        >
                                            <PenLine size={18} />
                                            이 말씀으로 나눔 작성하기
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-stone-400 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-bold text-lg text-stone-500">오늘의 큐티가 없습니다</p>
                                <p className="text-sm mt-2">관리자가 자료를 업로드하면 표시됩니다.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── 글쓰기 섹션 (Same as before, simplified slightly) ── */}
                <div id="write-section">
                    {!user ? (
                        <button
                            onClick={login}
                            className="w-full py-6 rounded-3xl border-2 border-dashed border-stone-300 text-stone-500 font-bold hover:border-[#8B4513] hover:text-[#8B4513] hover:bg-white transition-all flex items-center justify-center gap-3 group bg-[#f7f3ef]"
                        >
                            <LogIn className="group-hover:scale-110 transition-transform" size={20} />
                            로그인하고 은혜 나누기
                        </button>
                    ) : !isApproved ? (
                        <div className="w-full py-6 rounded-3xl border border-amber-200 bg-amber-50 flex flex-col items-center justify-center gap-2 text-center">
                            <Lock size={22} className="text-amber-600 mb-1" />
                            <p className="font-bold text-amber-800">작성 권한 승인 대기 중</p>
                        </div>
                    ) : !isWriting ? (
                        <button
                            onClick={() => setIsWriting(true)}
                            className="w-full py-6 rounded-3xl border-2 border-dashed border-stone-300 text-stone-500 font-bold hover:border-[#8B4513] hover:text-[#8B4513] hover:bg-white transition-all flex items-center justify-center gap-3 group bg-[#f7f3ef]"
                        >
                            <PenLine className="group-hover:scale-110 transition-transform" size={20} />
                            오늘 받은 은혜 나누기
                        </button>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            onSubmit={handleSubmit}
                            className="bg-white rounded-[32px] shadow-xl border border-stone-100 overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center bg-[#fbf9f6]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#8B4513] text-white flex items-center justify-center font-black shadow-md">
                                        {userData?.displayName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-stone-900">{userData?.displayName}</p>
                                        <p className="text-xs text-stone-500 font-medium">작성 중...</p>
                                    </div>
                                </div>
                                <button type="button" onClick={() => setIsWriting(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                                    <X size={20} className="text-stone-400" />
                                </button>
                            </div>
                            <div className="p-8 space-y-5">
                                <input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="제목 (예: 시편 23편 묵상)"
                                    className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none font-bold text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-[#8B4513]/20 transition-all"
                                    required
                                />
                                <input
                                    value={scripture}
                                    onChange={e => setScripture(e.target.value)}
                                    placeholder="관련 말씀 (선택사항)"
                                    className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none font-medium text-stone-700 placeholder:text-stone-400 focus:ring-2 focus:ring-[#8B4513]/20 transition-all text-sm"
                                />
                                <textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="나의 묵상과 은혜를 자유롭게 기록해보세요..."
                                    className="w-full h-48 px-6 py-4 rounded-2xl bg-stone-50 border-none font-medium text-stone-700 placeholder:text-stone-400 focus:ring-2 focus:ring-[#8B4513]/20 transition-all resize-none leading-relaxed"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 rounded-2xl bg-[#8B4513] text-white font-bold shadow-lg hover:bg-[#723b10] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                    나눔 게시하기
                                </button>
                            </div>
                        </motion.form>
                    )}
                </div>

                {/* ── 게시글 목록 ── */}
                {!loading && posts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 border-t border-stone-200">
                        {posts.map((post, idx) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-[24px] p-6 shadow-sm border border-stone-100 hover:shadow-xl transition-all group flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[#f0ebe3] text-[#8B4513] flex items-center justify-center font-black text-sm">
                                            {post.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-stone-900 text-sm">{post.name}</p>
                                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{formatDate(post.created_at)}</p>
                                        </div>
                                    </div>
                                    {(user?.uid === post.uid || isAdmin) && (
                                        <button onClick={() => handleDelete(post.id)} className="text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                {post.scripture && (
                                    <span className="inline-block px-3 py-1 bg-[#8B4513]/5 text-[#8B4513] text-[10px] font-black rounded-lg mb-3 self-start">
                                        {post.scripture}
                                    </span>
                                )}

                                <h3 className="font-serif text-lg font-bold text-stone-900 mb-2 line-clamp-1">{post.title}</h3>
                                <p className={`text-stone-600 text-sm leading-relaxed whitespace-pre-wrap flex-1 ${expandedId !== post.id ? 'line-clamp-4' : ''}`}>
                                    {post.content}
                                </p>

                                {post.content?.length > 150 && (
                                    <button onClick={() => setExpandedId(expandedId === post.id ? null : post.id)} className="mt-2 text-[#8B4513] text-xs font-bold hover:underline self-start">
                                        {expandedId === post.id ? '접기' : '더 보기'}
                                    </button>
                                )}

                                <div className="mt-4 pt-4 border-t border-stone-50 flex items-center gap-2">
                                    <button onClick={() => handleLike(post.id)} className="flex items-center gap-1.5 text-stone-400 hover:text-rose-500 transition-colors text-xs font-bold">
                                        <Heart size={16} /> {post.likes || 0}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
