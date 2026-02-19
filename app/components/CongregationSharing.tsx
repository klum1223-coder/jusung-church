'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { MessageSquare, Heart, Send, Trash2, X, Smile, Loader2, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../lib/AuthContext'; // Import AuthContext

export default function CongregationSharing() {
    const { user, userData, login } = useAuth(); // Get auth data
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isWriting, setIsWriting] = useState(false);

    // Form states
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!db) return;
        const q = query(collection(db, 'community_shares'), orderBy('created_at', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Security check
        if (!user || userData?.status !== 'approved') {
            alert("작성 권한이 없습니다.");
            return;
        }
        if (!content.trim()) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, 'community_shares'), {
                uid: user.uid, // Store UID for ownership check
                name: userData.displayName || user.displayName || '익명',
                photoURL: userData.photoURL || user.photoURL || '',
                content,
                created_at: serverTimestamp(),
                likes: 0
            });
            setContent('');
            setIsWriting(false);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("저장에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (postId: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteDoc(doc(db, 'community_shares', postId));
        } catch (error) {
            console.error("Error removing document: ", error);
            alert("삭제에 실패했습니다.");
        }
    };

    // Render Write Section Content based on Auth Status
    const renderWriteSection = () => {
        if (!user) {
            return (
                <button
                    onClick={login}
                    className="w-full py-6 bg-white rounded-[24px] border-2 border-dashed border-stone-200 text-stone-500 font-bold hover:border-[#8B4513] hover:text-[#8B4513] hover:bg-[#8B4513]/5 transition-all flex items-center justify-center gap-2 group"
                >
                    <LogIn className="group-hover:scale-110 transition-transform" />
                    로그인하고 나눔에 참여하기
                </button>
            );
        }

        if (userData?.status !== 'approved') {
            return (
                <div className="w-full py-6 bg-stone-50 rounded-[24px] border border-stone-200 text-stone-400 font-bold flex flex-col items-center justify-center gap-2 text-center">
                    <Lock size={24} className="mb-1" />
                    <p>작성 권한 승인 대기 중입니다.</p>
                    <p className="text-xs font-normal">관리자 승인 후 글을 작성할 수 있습니다.</p>
                </div>
            );
        }

        if (!isWriting) {
            return (
                <button
                    onClick={() => setIsWriting(true)}
                    className="w-full py-6 bg-white rounded-[24px] border-2 border-dashed border-stone-200 text-stone-400 font-bold hover:border-[#8B4513] hover:text-[#8B4513] hover:bg-[#8B4513]/5 transition-all flex items-center justify-center gap-2 group"
                >
                    <MessageSquare className="group-hover:scale-110 transition-transform" />
                    나의 묵상과 마음 나누기
                </button>
            );
        }

        return (
            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-[32px] shadow-xl animate-in fade-in slide-in-from-bottom-4 space-y-4 border border-[#8B4513]/10">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                        {userData?.photoURL ? (
                            <img src={userData.photoURL} alt="" className="w-8 h-8 rounded-full border border-stone-100" />
                        ) : (
                            <div className="w-8 h-8 bg-[#8B4513]/10 rounded-full flex items-center justify-center text-[#8B4513] font-bold text-xs">
                                {userData?.displayName?.charAt(0) || user.email?.charAt(0)}
                            </div>
                        )}
                        <h3 className="font-bold text-stone-900">{userData?.displayName}</h3>
                    </div>
                    <button type="button" onClick={() => setIsWriting(false)} className="text-stone-400 hover:text-stone-900"><X size={20} /></button>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="오늘 받은 은혜나 나누고 싶은 이야기를 적어주세요..."
                    className="w-full h-32 p-4 bg-stone-50 rounded-2xl border-none resize-none focus:ring-2 focus:ring-[#8B4513] transition-all text-stone-700 placeholder:text-stone-400"
                    required
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#8B4513] text-white rounded-2xl font-bold shadow-lg hover:bg-stone-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {submitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                    나눔 등록하기
                </button>
            </form>
        );
    };

    return (
        <section className="py-24 px-6 bg-[#f5f5f4]">
            <div className="container mx-auto max-w-3xl">
                <div className="text-center space-y-4 mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4 text-[#8B4513]">
                        <Smile size={32} strokeWidth={1.5} />
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-800">
                        오늘 기분이 어떠신가요?
                    </h2>
                    <p className="text-stone-500 font-light">
                        서로의 마음을 나누고 위로와 격려를 전해주세요.
                    </p>
                </div>

                {/* Write Section (Dynamic based on Auth) */}
                <div className="mb-12">
                    {renderWriteSection()}
                </div>

                {/* List */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <Loader2 className="animate-spin mx-auto text-[#8B4513]" size={32} />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12 text-stone-400 font-light italic">
                            아직 등록된 나눔이 없습니다. 첫 번째 이야기를 들려주세요.
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-stone-100 hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        {post.photoURL ? (
                                            <img src={post.photoURL} alt="" className="w-10 h-10 rounded-full border border-stone-100 object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 bg-[#8B4513]/10 rounded-full flex items-center justify-center text-[#8B4513] font-bold">
                                                {post.name.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-stone-900">{post.name}</p>
                                            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">
                                                {post.created_at?.seconds ? new Date(post.created_at.seconds * 1000).toLocaleDateString() : 'Just now'}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Delete Button (Only for author or admin) */}
                                    {(user?.uid === post.uid || userData?.role === 'admin') && (
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-stone-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-2"
                                            title="삭제"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>

                                <p className="text-stone-600 leading-relaxed whitespace-pre-wrap font-light text-lg">
                                    {post.content}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
