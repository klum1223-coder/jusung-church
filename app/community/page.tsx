'use client';

import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CHURCH_DATA, checkIfAdmin } from '../lib/constants';
import { Plus, Trash2, Image, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function CommunityPage() {
    const { user, login } = useAuth();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!db) return;
        const q = query(collection(db, 'community_posts'), orderBy('created_at', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(results);
            setLoading(false);
        }, (err) => {
            console.error("Fetch failed", err);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAddPost = async (newPost: any) => {
        if (!user) return;
        try {
            await addDoc(collection(db, 'community_posts'), {
                ...newPost,
                authorId: user?.uid || '',
                authorName: user?.displayName || '관리자',
                created_at: serverTimestamp(),
            });
        } catch (err) {
            console.error("Add failed", err);
        }
    };

    const handleDeletePost = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteDoc(doc(db, 'community_posts', id));
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <div className="bg-[#faf9f6] min-h-screen pt-24 font-sans selection:bg-[#8B4513] selection:text-white">
            <main>
                <section className="py-24 px-6 bg-white border-b border-stone-100">
                    <div className="container mx-auto max-w-5xl flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-6">
                            <span className="text-[#8B4513] font-black tracking-[0.4em] text-[12px] uppercase">Community Flow</span>
                            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-stone-900">나눔의 정원</h1>
                            <p className="text-stone-500 text-lg md:text-xl font-light max-w-xl">성도님들의 일상과 기도 제목, 받은 은혜를 자유롭게 나누는 따뜻한 공간입니다.</p>
                        </div>
                        <button
                            onClick={() => user ? setIsModalOpen(true) : login()}
                            className="flex items-center gap-3 px-10 py-5 bg-[#8B4513] text-white rounded-full font-bold shadow-2xl hover:-translate-y-1 transition-all active:scale-95 group shrink-0"
                        >
                            {user ? '나눔 글쓰기' : '로그인 후 작성하기'} <Plus size={20} />
                        </button>
                    </div>
                </section>

                <section className="py-24 px-6">
                    <div className="container mx-auto max-w-4xl">
                        {loading ? (
                            <div className="flex flex-col items-center py-32 space-y-4">
                                <div className="w-12 h-12 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">Connecting Body...</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-stone-200 rounded-[40px] py-32 text-center">
                                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-200">
                                    <MessageCircle size={40} />
                                </div>
                                <p className="text-stone-400 font-bold uppercase tracking-widest">사랑의 첫 마디를 남겨주세요.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-10">
                                {posts.map((post: any) => (
                                    <article key={post.id} className="bg-white p-10 md:p-12 rounded-[48px] shadow-sm border border-stone-100 hover:shadow-xl transition-all group relative">
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center text-[#8B4513] font-bold text-xl shadow-inner uppercase">
                                                    {post.authorName?.[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-stone-900 text-lg">{post.authorName}</h4>
                                                    <p className="text-[10px] text-stone-400 font-black tracking-widest uppercase mt-1">
                                                        {post.created_at ? new Date(post.created_at.seconds * 1000).toLocaleDateString() : '방금'}
                                                    </p>
                                                </div>
                                            </div>
                                            {(user && (user.uid === post.authorId || checkIfAdmin(user))) && (
                                                <button onClick={() => handleDeletePost(post.id)} className="text-stone-200 hover:text-red-500 transition-colors p-3 hover:bg-red-50 rounded-full">
                                                    <Trash2 size={24} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-6">
                                            <h3 className="font-serif text-3xl font-bold text-stone-900 leading-tight">{post.title}</h3>
                                            <p className="text-stone-600 text-xl leading-relaxed font-light whitespace-pre-line">{post.description}</p>
                                            {post.imageUrl && (
                                                <div className="pt-6">
                                                    <div className="rounded-[32px] overflow-hidden border border-stone-100 shadow-lg">
                                                        <img src={post.imageUrl} className="w-full max-h-[600px] object-cover" alt="Post content" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {isModalOpen && (
                <CommunityPostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddPost} />
            )}
        </div>
    );
}

const CommunityPostModal = ({ isOpen, onClose, onSubmit }: any) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsUploading(true);
        let imageUrl = '';

        if (imageFile) {
            try {
                const imageRef = ref(storage, `community/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(imageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            } catch (err) {
                console.error("Upload error", err);
            }
        }

        await onSubmit({ title, description, imageUrl });
        setIsUploading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="p-8 md:p-12 border-b border-stone-100 flex items-center justify-between">
                    <h3 className="font-serif text-3xl font-bold text-stone-900">새로운 나눔 쓰기</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-900"><X size={28} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">제목</label>
                        <input
                            value={title} onChange={e => setTitle(e.target.value)} required
                            placeholder="제목을 입력하세요"
                            className="w-full bg-stone-50 border-none rounded-2xl p-6 text-lg font-bold placeholder:text-stone-300 focus:ring-2 focus:ring-[#8B4513] transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">내용</label>
                        <textarea
                            value={description} onChange={e => setDescription(e.target.value)} required rows={6}
                            placeholder="은혜로운 이야기를 들려주세요"
                            className="w-full bg-stone-50 border-none rounded-2xl p-6 text-lg font-light placeholder:text-stone-300 focus:ring-2 focus:ring-[#8B4513] transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">사진 첨부</label>
                        <label className="flex items-center gap-4 p-6 bg-stone-50 rounded-2xl cursor-pointer hover:bg-stone-100 transition-colors border-2 border-dashed border-stone-200">
                            <Image className="text-[#8B4513]" size={24} />
                            <span className="text-stone-500 font-bold">{imageFile ? imageFile.name : '사진 선택 (클릭)'}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                        </label>
                    </div>
                    <button
                        disabled={isUploading}
                        className="w-full py-6 bg-[#8B4513] text-white rounded-[24px] font-bold text-xl shadow-xl hover:bg-stone-900 transition-all disabled:opacity-50"
                    >
                        {isUploading ? '작성 중...' : '나눔 올리기'}
                    </button>
                </form>
            </div>
        </div>
    );
};
