'use client';

import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebaseConfig';
import {
    collection, query, orderBy, onSnapshot, addDoc,
    updateDoc, deleteDoc, doc, serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../lib/AuthContext';
import { CHURCH_DATA, checkIfAdmin } from '../lib/constants';
import {
    Plus, Trash2, Edit2, Image as ImageIcon,
    X, LayoutDashboard, Users, MessageSquare,
    Home, Loader2, Save, ArrowLeft, BarChart3
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const isAdmin = checkIfAdmin(user);

    const [activeTab, setActiveTab] = useState<'main' | 'ministry' | 'activity' | 'community' | 'settings' | 'stats'>('main');
    const [contents, setContents] = useState<any[]>([]);
    const [ministries, setMinistries] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const { login } = useAuth(); // ensure login is destructured

    // Redirect only if user is logged in but not admin
    useEffect(() => {
        if (!authLoading && user && !isAdmin) {
            // Optional: Redirect to home or show access denied. 
        }
    }, [user, isAdmin, authLoading]);
    // Data fetching for Admin
    useEffect(() => {
        if (!isAdmin || !db) return;

        const unsubMain = onSnapshot(query(collection(db, 'main_contents'), orderBy('created_at', 'desc')), (s) => {
            setContents(s.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const unsubMin = onSnapshot(query(collection(db, 'ministries'), orderBy('created_at', 'desc')), (s) => {
            setMinistries(s.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const unsubAct = onSnapshot(query(collection(db, 'ministry_activities'), orderBy('created_at', 'desc')), (s) => {
            setActivities(s.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const unsubComm = onSnapshot(query(collection(db, 'community_posts'), orderBy('created_at', 'desc')), (s) => {
            setPosts(s.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const unsubSett = onSnapshot(doc(db, 'settings', 'site'), (s) => {
            if (s.exists()) setSettings(s.data());
        });

        const unsubStats = onSnapshot(query(collection(db, 'daily_stats'), orderBy('date', 'desc')), (s) => {
            const data = s.docs.map(d => d.data());
            setStats(data.slice(0, 30).reverse());
        });

        setLoading(false);
        return () => {
            unsubMain();
            unsubMin();
            unsubAct();
            unsubComm();
            unsubSett();
            unsubStats();
        };
    }, [isAdmin]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <Loader2 className="animate-spin text-[#8B4513]" size={48} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4">
                <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center space-y-8">
                    <div className="w-16 h-16 bg-[#8B4513] rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg">
                        <LayoutDashboard size={32} />
                    </div>
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-stone-900">Admin Login</h1>
                        <p className="text-stone-500 mt-2">관리자 페이지에 접근하려면 로그인이 필요합니다.</p>
                    </div>
                    <button
                        onClick={login}
                        className="w-full py-4 bg-[#8B4513] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-stone-900 transition-all flex items-center justify-center gap-3"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6 bg-white rounded-full p-0.5" alt="G" />
                        Google 계정으로 로그인
                    </button>
                    <button onClick={() => router.push('/')} className="text-stone-400 text-sm hover:text-stone-600 underline">
                        홈페이지로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4">
                <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto">
                        <X size={32} />
                    </div>
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-stone-900">접근 권한이 없습니다</h1>
                        <p className="text-stone-500 mt-2">현재 로그인된 계정({user.email})은<br />관리자 권한이 없습니다.</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={login}
                            className="w-full py-3 bg-stone-100 text-stone-600 rounded-xl font-bold hover:bg-stone-200 transition-all"
                        >
                            다른 계정으로 로그인 (Logout & Re-login)
                        </button>
                        <button onClick={() => router.push('/')} className="text-stone-400 text-sm hover:text-stone-600 underline">
                            홈페이지로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleDelete = async (collectionName: string, id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteDoc(doc(db, collectionName, id));
        } catch (e) {
            alert("삭제 실패");
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex">
            <aside className="w-72 bg-white border-r border-stone-200 flex flex-col fixed h-full">
                <div className="p-8 border-b border-stone-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#8B4513] rounded-xl flex items-center justify-center text-white shadow-lg">
                        <LayoutDashboard size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-stone-900 group">Admin Panel</h1>
                        <p className="text-[10px] text-stone-400 font-black tracking-widest uppercase">Jusung Church</p>
                    </div>
                </div>

                <nav className="p-6 flex-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('main')}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'main' ? 'bg-[#8B4513] text-white shadow-xl' : 'text-stone-500 hover:bg-stone-100'}`}
                    >
                        <Home size={20} /> 메인 콘텐츠
                    </button>
                    <button
                        onClick={() => setActiveTab('ministry')}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'ministry' ? 'bg-[#8B4513] text-white shadow-xl' : 'text-stone-500 hover:bg-stone-100'}`}
                    >
                        <Users size={20} /> 사역 소개
                    </button>
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'activity' ? 'bg-[#8B4513] text-white shadow-xl' : 'text-stone-500 hover:bg-stone-100'}`}
                    >
                        <ImageIcon size={20} /> 사역 현장
                    </button>
                    <button
                        onClick={() => setActiveTab('community')}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'community' ? 'bg-[#8B4513] text-white shadow-xl' : 'text-stone-500 hover:bg-stone-100'}`}
                    >
                        <MessageSquare size={20} /> 나눔/커뮤니티
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-[#8B4513] text-white shadow-xl' : 'text-stone-500 hover:bg-stone-100'}`}
                    >
                        <Save size={20} /> 사이트 설정
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'stats' ? 'bg-[#8B4513] text-white shadow-xl' : 'text-stone-500 hover:bg-stone-100'}`}
                    >
                        <BarChart3 size={20} /> 방문자 통계
                    </button>
                </nav>

                <div className="p-6 border-t border-stone-100">
                    <button
                        onClick={() => router.push('/')}
                        className="w-full flex items-center justify-center gap-2 text-stone-400 hover:text-stone-900 font-bold text-sm transition-colors py-4"
                    >
                        <ArrowLeft size={16} /> 홈페이지로 이동
                    </button>
                </div>
            </aside>

            <main className="flex-1 ml-72 p-12">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-4xl font-serif font-bold text-stone-900">
                            {activeTab === 'main' && '메인 콘텐츠'}
                            {activeTab === 'ministry' && '사역 소개'}
                            {activeTab === 'activity' && '사역 현장 (갤러리)'}
                            {activeTab === 'community' && '나눔의 정원'}
                            {activeTab === 'settings' && '사이트 환경 설정'}
                            {activeTab === 'stats' && '방문자 통계'}
                        </h2>
                        <p className="text-stone-400 mt-2">홈페이지 내용을 관리자 권한으로 직접 수정합니다.</p>
                    </div>
                    {(activeTab === 'main' || activeTab === 'ministry' || activeTab === 'activity') && (
                        <button
                            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                            className="bg-[#8B4513] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl hover:bg-stone-900 transition-all active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={20} /> 새로운 {activeTab === 'main' ? '콘텐츠' : activeTab === 'ministry' ? '사역' : '활동/사진'} 등록하기
                        </button>
                    )}
                </header>

                <div className="grid grid-cols-1 gap-6">
                    {activeTab === 'main' && (
                        contents.length === 0 ? (
                            <EmptyState type="콘텐츠" onAdd={() => { setEditingItem(null); setIsModalOpen(true); }} />
                        ) : (
                            contents.map(item => (
                                <AdminCard
                                    key={item.id}
                                    item={item}
                                    onEdit={() => { setEditingItem(item); setIsModalOpen(true); }}
                                    onDelete={() => handleDelete('main_contents', item.id)}
                                />
                            ))
                        )
                    )}
                    {activeTab === 'ministry' && (
                        ministries.length === 0 ? (
                            <EmptyState type="사역 소개" onAdd={() => { setEditingItem(null); setIsModalOpen(true); }} />
                        ) : (
                            ministries.map(item => (
                                <AdminCard
                                    key={item.id}
                                    item={item}
                                    onEdit={() => { setEditingItem(item); setIsModalOpen(true); }}
                                    onDelete={() => handleDelete('ministries', item.id)}
                                />
                            ))
                        )
                    )}
                    {activeTab === 'activity' && (
                        activities.length === 0 ? (
                            <EmptyState type="활동 사진" onAdd={() => { setEditingItem(null); setIsModalOpen(true); }} />
                        ) : (
                            activities.map(item => (
                                <AdminCard
                                    key={item.id}
                                    item={item}
                                    onEdit={() => { setEditingItem(item); setIsModalOpen(true); }}
                                    onDelete={() => handleDelete('ministry_activities', item.id)}
                                />
                            ))
                        )
                    )}
                    {activeTab === 'community' && (
                        posts.length === 0 ? (
                            <EmptyState type="게시물" />
                        ) : (
                            posts.map(item => (
                                <AdminCard
                                    key={item.id}
                                    item={item}
                                    onDelete={() => handleDelete('community_posts', item.id)}
                                />
                            ))
                        )
                    )}
                    {activeTab === 'settings' && (
                        <div className="bg-white p-12 rounded-[40px] shadow-sm border border-stone-100 space-y-12">
                            <div className="space-y-8">
                                <h3 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-100 pb-4">사역 안내 페이지 설정</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <SettingsForm
                                        label="사역 안내 제목"
                                        name="ministry_title"
                                        defaultValue={settings.ministry_title || '사역 안내'}
                                    />
                                    <SettingsForm
                                        label="사역 안내 설명"
                                        name="ministry_desc"
                                        defaultValue={settings.ministry_desc || '주성교회는 모든 세대와 이웃을 향해 하나님의 사랑을 전하는 다양한 사역을 펼치고 있습니다.'}
                                        textarea
                                    />
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-100 pb-4">사역 현장(갤러리) 설정</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <SettingsForm
                                        label="갤러리 섹션 제목"
                                        name="gallery_title"
                                        defaultValue={settings.gallery_title || '사역 현장'}
                                    />
                                    <SettingsForm
                                        label="갤러리 섹션 설명"
                                        name="gallery_desc"
                                        defaultValue={settings.gallery_desc || '은혜와 감동이 있는 주성교회의 사역 현장을 전해드립니다.'}
                                        textarea
                                    />
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-100 pb-4">교회 소개(About) 설정</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <SettingsForm
                                        label="담임목사 성함"
                                        name="pastor_name"
                                        defaultValue={settings.pastor_name || CHURCH_DATA.pastor.name}
                                    />
                                    <SettingsForm
                                        label="인사말 제목"
                                        name="about_welcome_title"
                                        defaultValue={settings.about_welcome_title || '말씀과 기도로 세상을 변화시킵니다.'}
                                    />
                                    <SettingsForm
                                        label="인사말 본문"
                                        name="about_welcome_text"
                                        defaultValue={settings.about_welcome_text || '하나님이 기뻐하시는 교회, 성도가 행복한 교회...'}
                                        textarea
                                    />
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">목사님 프로필 사진</label>
                                        <div className="flex items-center gap-4">
                                            {settings.pastor_img && (
                                                <img src={settings.pastor_img} className="w-16 h-16 rounded-full object-cover border border-stone-200" />
                                            )}
                                            <label className="cursor-pointer bg-stone-100 px-4 py-2 rounded-xl text-xs font-bold hover:bg-stone-200 transition-all">
                                                사진 업로드
                                                <input type="file" className="hidden" onChange={async (e) => {
                                                    const f = e.target.files?.[0];
                                                    if (!f) return;
                                                    const storageRef = ref(storage, `settings/pastor_${Date.now()}`);
                                                    const snap = await uploadBytes(storageRef, f);
                                                    const url = await getDownloadURL(snap.ref);
                                                    await updateDoc(doc(db, 'settings', 'site'), { pastor_img: url });
                                                    alert("사진이 업데이트되었습니다.");
                                                    window.location.reload();
                                                }} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'stats' && (
                        <div className="space-y-6">
                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-100">
                                <h3 className="font-serif text-xl font-bold text-stone-900 mb-6">최근 30일 방문자 추이</h3>
                                <div className="h-[400px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#a8a29e', fontSize: 12 }}
                                                tickFormatter={(value) => value.slice(5)}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#a8a29e', fontSize: 12 }}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                            <Bar name="총 조회수" dataKey="total_views" fill="#f5f5f4" radius={[4, 4, 0, 0]} />
                                            <Bar name="순수 방문자" dataKey="unique_visitors" fill="#8B4513" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="bg-white p-8 rounded-3xl border border-stone-100">
                                    <p className="text-stone-400 text-xs font-black uppercase tracking-widest mb-2">오늘의 방문자</p>
                                    <h4 className="text-3xl font-bold text-stone-900">
                                        {stats.length > 0 && stats[stats.length - 1].date === new Date().toISOString().split('T')[0]
                                            ? stats[stats.length - 1].unique_visitors
                                            : 0}
                                        <span className="text-sm text-stone-400 font-normal ml-1">명</span>
                                    </h4>
                                </div>
                                <div className="bg-white p-8 rounded-3xl border border-stone-100">
                                    <p className="text-stone-400 text-xs font-black uppercase tracking-widest mb-2">오늘의 조회수</p>
                                    <h4 className="text-3xl font-bold text-stone-900">
                                        {stats.length > 0 && stats[stats.length - 1].date === new Date().toISOString().split('T')[0]
                                            ? stats[stats.length - 1].total_views
                                            : 0}
                                        <span className="text-sm text-stone-400 font-normal ml-1">회</span>
                                    </h4>
                                </div>
                                <div className="bg-white p-8 rounded-3xl border border-stone-100">
                                    <p className="text-stone-400 text-xs font-black uppercase tracking-widest mb-2">최근 30일 누적 방문</p>
                                    <h4 className="text-3xl font-bold text-stone-900">
                                        {stats.reduce((acc, curr) => acc + (curr.unique_visitors || 0), 0).toLocaleString()}
                                        <span className="text-sm text-stone-400 font-normal ml-1">명</span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {isModalOpen && (
                <AdminModal
                    type={activeTab}
                    item={editingItem}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}

const AdminCard = ({ item, onEdit, onDelete }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-stone-200 flex items-center gap-6 group hover:shadow-xl transition-all">
        {item.imageUrl || item.img ? (
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                <img src={item.imageUrl || item.img} className="w-full h-full object-cover" alt="" />
            </div>
        ) : (
            <div className="w-24 h-24 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-200 shrink-0">
                <ImageIcon size={32} />
            </div>
        )}
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
                {item.type && <span className="bg-stone-100 text-stone-500 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">{item.type}</span>}
                <h3 className="font-bold text-stone-900 truncate text-lg">{item.title || item.name}</h3>
            </div>
            <p className="text-stone-400 text-sm line-clamp-1">{item.description || item.desc}</p>
        </div>
        <div className="flex items-center gap-2">
            {onEdit && (
                <button onClick={onEdit} className="p-3 text-stone-400 hover:text-[#8B4513] hover:bg-[#8B4513]/5 rounded-xl transition-all">
                    <Edit2 size={20} />
                </button>
            )}
            <button onClick={onDelete} className="p-3 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 size={20} />
            </button>
        </div>
    </div>
);

const AdminModal = ({ type, item, onClose }: any) => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.target);
            const data: any = Object.fromEntries(formData.entries());

            let imageUrl = item?.imageUrl || item?.img || '';
            let linkUrl = data.linkUrl || item?.linkUrl || '';

            if (file) {
                const folder = type === 'main' ? 'contents' : type === 'activity' ? 'ministry_activities' : 'ministries';
                const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const downloadUrl = await getDownloadURL(snapshot.ref);

                if (type === 'main' && data.type === 'bulletin') {
                    linkUrl = downloadUrl;
                } else {
                    imageUrl = downloadUrl;
                }
            }

            const colName = type === 'main' ? 'main_contents' : type === 'activity' ? 'ministry_activities' : 'ministries';
            const payload = {
                ...data,
                linkUrl: linkUrl,
                [type === 'main' || type === 'activity' ? 'imageUrl' : 'img']: imageUrl,
                updated_at: serverTimestamp(),
                ...(item ? {} : { created_at: serverTimestamp() })
            };

            if (item) {
                await updateDoc(doc(db, colName, item.id), payload);
            } else {
                await addDoc(collection(db, colName), payload);
            }
            onClose();
        } catch (error: any) {
            console.error("Upload failed", error);
            alert(`저장 실패: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-stone-900">{item ? '정보 수정' : '새로운 항목 추가'}</h3>
                        <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest font-black">{type} Manager</p>
                    </div>
                    <button onClick={onClose} className="text-stone-300 hover:text-stone-900 transition-colors"><X size={28} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {type === 'main' ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="분류" name="type" defaultValue={item?.type} required select options={['sermon', 'meditation', 'notice', 'bullet', 'newcomer']} />
                                <FormInput label="제목" name="title" defaultValue={item?.title} required />
                            </div>
                            <FormInput label="설명" name="description" defaultValue={item?.description} textarea />
                            <FormInput label="링크 URL" name="linkUrl" defaultValue={item?.linkUrl} />
                        </>
                    ) : type === 'activity' ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="활동 제목" name="title" defaultValue={item?.title} required />
                                <FormInput label="날짜 (예: 2024.01.01)" name="date" defaultValue={item?.date} required />
                            </div>
                            <FormInput label="활동 설명" name="description" defaultValue={item?.description} textarea required />
                            <FormInput label="사역 분류 (예: 다음세대)" name="category" defaultValue={item?.category} required />
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="사역 이름" name="name" defaultValue={item?.name} required />
                                <FormInput label="영문 이름" name="engName" defaultValue={item?.engName} required />
                            </div>
                            <FormInput label="간략 설명" name="desc" defaultValue={item?.desc} required />
                            <FormInput label="상세 설명" name="detail" defaultValue={item?.detail} textarea required />
                        </>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">사진 등록</label>
                        <label className="flex items-center gap-4 p-6 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 cursor-pointer hover:bg-stone-100 transition-all">
                            <ImageIcon className="text-[#8B4513]" size={24} />
                            <span className="text-stone-500 font-bold">{file ? file.name : (item?.imageUrl || item?.img ? '사진 변경하기' : '사진 선택')}</span>
                            <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                        </label>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-5 bg-[#8B4513] text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-stone-900 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {item ? '수정사항 저장하기' : '항목 추가하기'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const FormInput = ({ label, name, defaultValue, required, textarea, select, options }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">{label}</label>
        {select ? (
            <select name={name} defaultValue={defaultValue} required={required} className="w-full bg-stone-50 border-none rounded-2xl p-4 font-bold text-stone-900 focus:ring-2 focus:ring-[#8B4513] transition-all">
                {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
            </select>
        ) : textarea ? (
            <textarea name={name} defaultValue={defaultValue} required={required} rows={4} className="w-full bg-stone-50 border-none rounded-2xl p-4 text-stone-900 focus:ring-2 focus:ring-[#8B4513] transition-all" />
        ) : (
            <input name={name} defaultValue={defaultValue} required={required} className="w-full bg-stone-50 border-none rounded-2xl p-4 font-bold text-stone-900 focus:ring-2 focus:ring-[#8B4513] transition-all" />
        )}
    </div>
);
const EmptyState = ({ type, onAdd }: any) => (
    <div className="bg-white border-2 border-dashed border-stone-100 rounded-[40px] py-32 text-center space-y-6">
        <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-200">
            <Plus size={40} />
        </div>
        <div>
            <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">등록된 {type}가 없습니다.</p>
            <p className="text-stone-300 text-sm mt-1">새로운 {type}를 등록하여 홈페이지를 꾸며보세요.</p>
        </div>
        {onAdd && (
            <button
                onClick={onAdd}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#8B4513] text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all"
            >
                첫 {type} 추가하기 <Plus size={16} />
            </button>
        )}
    </div>
);

const SettingsForm = ({ label, name, defaultValue, textarea }: any) => {
    const [val, setVal] = useState(defaultValue);
    const [saving, setSaving] = useState(false);

    useEffect(() => { setVal(defaultValue); }, [defaultValue]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateDoc(doc(db, 'settings', 'site'), { [name]: val });
        } catch (e) {
            try {
                const { setDoc } = await import('firebase/firestore');
                await setDoc(doc(db, 'settings', 'site'), { [name]: val }, { merge: true });
            } catch (err) {
                alert("저장 실패");
            }
        }
        setSaving(false);
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">{label}</label>
            <div className="flex gap-4">
                {textarea ? (
                    <textarea
                        value={val}
                        onChange={e => setVal(e.target.value)}
                        className="flex-1 bg-stone-50 border-none rounded-2xl p-4 text-stone-900 focus:ring-2 focus:ring-[#8B4513] transition-all min-h-[100px]"
                    />
                ) : (
                    <input
                        value={val}
                        onChange={e => setVal(e.target.value)}
                        className="flex-1 bg-stone-50 border-none rounded-2xl p-4 font-bold text-stone-900 focus:ring-2 focus:ring-[#8B4513] transition-all"
                    />
                )}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 bg-stone-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 min-w-[100px]"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 저장
                </button>
            </div>
        </div>
    );
};
