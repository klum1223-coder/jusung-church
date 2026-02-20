'use client';

import React, { useState } from 'react';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Loader2, X, Image as ImageIcon } from 'lucide-react';

const storageAny = storage as any;

const MainContentModal = ({ isOpen, onClose, onSubmit }: any) => {
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [contentType, setContentType] = useState('sermon');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        let imageUrl = formData.get('imageUrl') as string;

        if (selectedFile) {
            if (!storageAny) {
                alert("스토리지 초기화 오류. 잠시 후 다시 시도해주세요.");
                setIsUploading(false);
                return;
            }
            try {
                const storageRef = ref(storageAny, `contents/${Date.now()}_${selectedFile.name}`);
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
            scripture: formData.get('scripture') || '',
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
                                value={contentType}
                                onChange={(e) => setContentType(e.target.value)}
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

                    {/* 묵상 선택 시 성경 구절 입력 필드 */}
                    {contentType === 'meditation' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">성경 구절 참조 (Scripture Reference)</label>
                            <input
                                name="scripture"
                                placeholder="예: 마태복음 16:13-20"
                                className="w-full p-6 bg-amber-50 rounded-2xl border-2 border-amber-200 outline-none focus:ring-2 focus:ring-[#8B4513] font-medium"
                            />
                            <p className="text-[11px] text-stone-400 pl-2">성경 구절이 메인 제목으로 표시되고, 위의 '제목'은 주제 설명으로 표시됩니다.</p>
                        </div>
                    )}

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

export default MainContentModal;
