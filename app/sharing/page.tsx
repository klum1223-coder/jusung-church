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
    FileText
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
    const [todayQT, setTodayQT] = useState<{ text: string; filename: string } | null>(null);
    const [qtLoading, setQtLoading] = useState(true);
    const [qtExpanded, setQtExpanded] = useState(false);

    // DB 묵상 (Firestore fallback) - 사용하지 않을 수도 있지만 호환성을 위해 유지
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
                    const title = todayRow[1] || '';
                    const scriptureRef = todayRow[2] || '';
                    const content = todayRow[3] || '';
                    const question = todayRow[4] || '';

                    const formattedText = `[제목] ${title}\n\n[성경 말씀]\n${scriptureRef}\n\n[본문]\n${content}\n\n[묵상 질문]\n${question}`;

                    setTodayQT({
                        text: formattedText,
                        filename: title || '오늘의 큐티'
                    });
                } else {
                    console.log('Today QT not found in sheet for date:', today);
                    // Fallback logic could go here
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

            <div className="max-w-6xl mx-auto px-6 pb-24 space-y-10">

                {/* ── 오늘의 큐티 카드 ── */}
                <div className="rounded-3xl overflow-hidden shadow-lg border border-stone-300" style={{ background: '#fff8f0' }}>
                    {/* 카드 헤더 */}
                    <div className="flex items-center justify-between px-8 py-5 border-b border-stone-200" style={{ background: '#8B4513' }}>
                        <div className="flex items-center gap-3">
                            <BookOpen size={20} className="text-white" />
                            <span className="text-white font-black tracking-widest text-sm uppercase">
                                오늘의 큐티 말씀
                            </span>
                        </div>
                        <span className="text-white/70 text-xs font-bold">
                            {todayQT?.filename || '매일 묵상'}
                        </span>
                    </div>

                    {/* 카드 본문 */}
                    <div className="p-8">
                        {qtLoading ? (
                            <div className="flex items-center gap-3 py-8 justify-center">
                                <Loader2 className="animate-spin text-[#8B4513]" size={24} />
                                <span className="text-stone-500 font-medium">말씀을 불러오는 중...</span>
                            </div>
                        ) : todayQT ? (
                            <div>
                                <div className={`overflow-hidden transition-all duration-500 ${qtExpanded ? '' : 'max-h-64'}`}>
                                    <pre className="whitespace-pre-wrap font-sans text-stone-800 leading-8 text-[15px] font-medium">
                                        {todayQT.text}
                                    </pre>
                                </div>
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-200">
                                    <button
                                        onClick={() => setQtExpanded(!qtExpanded)}
                                        className="flex items-center gap-2 text-[#8B4513] font-bold text-sm hover:underline"
                                    >
                                        {qtExpanded ? <><ChevronUp size={16} />접기</> : <><ChevronDown size={16} />전체 보기</>}
                                    </button>
                                    {isApproved && (
                                        <button
                                            onClick={() => {
                                                setScripture(todayQT.filename.replace(/\.[^/.]+$/, ''));
                                                setIsWriting(true);
                                                setTimeout(() => window.scrollTo({ top: 700, behavior: 'smooth' }), 100);
                                            }}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                                            style={{ background: '#8B4513' }}
                                        >
                                            <PenLine size={15} />
                                            이 말씀으로 나눔 쓰기
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : todayMeditation ? (
                            <div className="space-y-3">
                                <h3 className="font-serif text-2xl font-bold text-stone-900">
                                    "{todayMeditation.title}"
                                </h3>
                                <p className="text-stone-700 leading-8 font-medium text-[15px]">
                                    {todayMeditation.description}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-stone-400">
                                <FileText size={40} className="mx-auto mb-3 opacity-30" />
                                <p className="font-medium">오늘의 큐티 자료를 준비 중입니다.</p>
                                <p className="text-sm mt-1">관리자가 자료를 업로드하면 여기에 표시됩니다.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── 글쓰기 영역 ── */}
                <div>
                    {!user ? (
                        <button
                            onClick={login}
                            className="w-full py-5 rounded-2xl border-2 border-dashed border-stone-400 text-stone-600 font-bold hover:border-[#8B4513] hover:text-[#8B4513] transition-all flex items-center justify-center gap-3 group"
                            style={{ background: '#fff8f0' }}
                        >
                            <LogIn className="group-hover:scale-110 transition-transform" size={18} />
                            로그인하고 말씀 나눔에 참여하기
                        </button>
                    ) : !isApproved ? (
                        <div className="w-full py-6 rounded-2xl border border-amber-300 flex flex-col items-center justify-center gap-2 text-center"
                            style={{ background: '#fffbeb' }}>
                            <Lock size={22} className="text-amber-600 mb-1" />
                            <p className="font-bold text-amber-800">작성 권한 승인 대기 중입니다.</p>
                            <p className="text-sm text-amber-600">관리자 승인 후 글을 작성할 수 있습니다.</p>
                        </div>
                    ) : !isWriting ? (
                        <button
                            onClick={() => setIsWriting(true)}
                            className="w-full py-5 rounded-2xl border-2 border-dashed border-stone-400 text-stone-600 font-bold hover:border-[#8B4513] hover:text-[#8B4513] transition-all flex items-center justify-center gap-3 group"
                            style={{ background: '#fff8f0' }}
                        >
                            <PenLine className="group-hover:scale-110 transition-transform" size={18} />
                            오늘 받은 은혜를 나눠주세요
                        </button>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="rounded-3xl shadow-lg border border-stone-300 overflow-hidden"
                            style={{ background: '#fff8f0' }}
                        >
                            {/* 폼 헤더 */}
                            <div className="flex justify-between items-center px-8 py-5 border-b border-stone-200">
                                <div className="flex items-center gap-3">
                                    {userData?.photoURL ? (
                                        <img src={userData.photoURL} alt="" className="w-10 h-10 rounded-full border-2 border-stone-200 object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-base"
                                            style={{ background: '#8B4513' }}>
                                            {userData?.displayName?.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-black text-stone-900">{userData?.displayName}</p>
                                        <p className="text-xs text-stone-500 font-medium">{todayDateStr}</p>
                                    </div>
                                </div>
                                <button type="button" onClick={() => setIsWriting(false)}
                                    className="text-stone-400 hover:text-stone-700 transition-colors p-1.5 rounded-lg hover:bg-stone-100">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* 입력 필드 */}
                            <div className="p-8 space-y-4">
                                <input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="제목을 입력하세요 (예: 시편 23편 묵상)"
                                    className="w-full px-5 py-4 rounded-xl text-stone-900 font-bold placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/40 transition-all border border-stone-300 text-sm"
                                    style={{ background: '#fdf6ee' }}
                                    required
                                />
                                <input
                                    value={scripture}
                                    onChange={e => setScripture(e.target.value)}
                                    placeholder="말씀 구절 (예: 시편 23:1-3, 선택사항)"
                                    className="w-full px-5 py-4 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/40 transition-all border border-stone-300 text-sm font-medium"
                                    style={{ background: '#fdf6ee' }}
                                />
                                <textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="오늘 받은 은혜나 묵상한 내용을 자유롭게 나눠주세요..."
                                    className="w-full h-40 px-5 py-4 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/40 transition-all resize-none leading-relaxed border border-stone-300 text-sm font-medium"
                                    style={{ background: '#fdf6ee' }}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 rounded-xl font-black text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm hover:opacity-90"
                                    style={{ background: '#8B4513' }}
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                                    나눔 등록하기
                                </button>
                            </div>
                        </motion.form>
                    )}
                </div>

                {/* ── 구분선 + 나눔 수 ── */}
                {!loading && posts.length > 0 && (
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-stone-300" />
                        <span className="text-stone-500 font-bold text-sm whitespace-nowrap">
                            {posts.length}개의 나눔
                        </span>
                        <div className="flex-1 h-px bg-stone-300" />
                    </div>
                )}

                {/* ── 나눔 게시글 3열 그리드 ── */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-[#8B4513]" size={36} />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-stone-500 font-medium text-base">
                        아직 등록된 나눔이 없습니다.<br />
                        <span className="text-stone-400 text-sm">첫 번째 말씀 나눔을 시작해 보세요.</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <AnimatePresence>
                            {posts.map((post, idx) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    className="rounded-2xl border border-stone-300 shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col"
                                    style={{ background: '#fff8f0' }}
                                >
                                    <div className="p-6 flex flex-col flex-1">
                                        {/* 작성자 */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2.5">
                                                {post.photoURL ? (
                                                    <img src={post.photoURL} alt="" className="w-10 h-10 rounded-full border-2 border-stone-200 object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm"
                                                        style={{ background: '#8B4513' }}>
                                                        {post.name?.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-black text-stone-900 text-sm">{post.name}</p>
                                                    <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                                                        {formatDate(post.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            {(user?.uid === post.uid || isAdmin) && (
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>

                                        {/* 말씀 구절 뱃지 */}
                                        {post.scripture && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg mb-3 w-fit border border-[#8B4513]/30"
                                                style={{ background: '#8B4513' + '18' }}>
                                                <BookOpen size={11} className="text-[#8B4513]" />
                                                <span className="text-[#8B4513] text-[11px] font-black">{post.scripture}</span>
                                            </div>
                                        )}

                                        {/* 제목 */}
                                        <h2 className="font-serif text-base font-black text-stone-900 mb-2.5 leading-snug">
                                            {post.title}
                                        </h2>

                                        {/* 내용 */}
                                        <div className={`text-stone-700 leading-relaxed text-sm font-medium whitespace-pre-wrap flex-1 ${expandedId !== post.id ? 'line-clamp-4' : ''}`}>
                                            {post.content}
                                        </div>

                                        {post.content?.length > 150 && (
                                            <button
                                                onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                                                className="mt-2 text-[#8B4513] text-xs font-black flex items-center gap-0.5 hover:underline"
                                            >
                                                {expandedId === post.id
                                                    ? <><ChevronUp size={12} />접기</>
                                                    : <><ChevronDown size={12} />더 보기</>
                                                }
                                            </button>
                                        )}

                                        {/* 좋아요 */}
                                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-stone-200">
                                            <button
                                                onClick={() => handleLike(post.id)}
                                                className="flex items-center gap-1.5 text-stone-500 hover:text-rose-600 transition-colors text-xs font-black"
                                            >
                                                <Heart size={14} />
                                                <span>{post.likes || 0}</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
