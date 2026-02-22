'use client';

import React from 'react';
import { X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NoticeModalProps {
    isOpen: boolean;
    onClose: () => void;
    notices: any[];
}

export default function NoticeModal({ isOpen, onClose, notices }: NoticeModalProps) {
    if (!isOpen) return null;

    // 현재 날짜를 기준으로 유효한 공지사항 필터링
    const activeNotices = notices.filter(notice => {
        if (notice.type !== 'notice') return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (notice.startDate) {
            const startDate = new Date(notice.startDate);
            if (today < startDate) return false;
        }

        if (notice.endDate) {
            const endDate = new Date(notice.endDate);
            if (today > endDate) return false;
        }

        return true;
    });

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-stone-900/70 backdrop-blur-md"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-2xl bg-[#faf9f6] rounded-[32px] shadow-2xl overflow-hidden"
                >
                    {/* Header decoration */}
                    <div className="h-2 bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#d946ef]" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 z-10 w-10 h-10 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center text-stone-500 transition-all shadow-sm"
                    >
                        <X size={18} />
                    </button>

                    {/* Content */}
                    <div className="p-8 md:p-10 space-y-8 overflow-y-auto max-h-[80vh]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%)' }}>
                                <Bell size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-stone-900">교회 공지사항</h3>
                                <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">Notice & News</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {activeNotices.length > 0 ? (
                                activeNotices.map((notice, idx) => (
                                    <div key={notice.id || idx} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm relative overflow-hidden">
                                        {/* 장식용 사이드바 */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8b5cf6] to-[#a855f7]" />

                                        <div className="pl-4 space-y-3">
                                            <div className="flex justify-between items-start gap-4">
                                                <h4 className="font-bold text-lg text-stone-900">{notice.title}</h4>
                                                {notice.startDate && notice.endDate && (
                                                    <span className="shrink-0 bg-stone-50 text-stone-500 text-[10px] font-black tracking-wider px-3 py-1 rounded-full border border-stone-100">
                                                        {notice.startDate} ~ {notice.endDate}
                                                    </span>
                                                )}
                                            </div>

                                            {notice.description && (
                                                <p className="text-stone-600 text-sm md:text-base font-light leading-relaxed whitespace-pre-line">
                                                    {notice.description}
                                                </p>
                                            )}

                                            {notice.imageUrl && (
                                                <div className="mt-4 rounded-xl overflow-hidden aspect-video relative">
                                                    <img src={notice.imageUrl} alt={notice.title} className="absolute inset-0 w-full h-full object-cover" />
                                                </div>
                                            )}

                                            {notice.linkUrl && (
                                                <a
                                                    href={notice.linkUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block mt-2 text-[#8b5cf6] hover:text-[#7c3aed] text-sm font-bold underline underline-offset-4"
                                                >
                                                    자세히 보기
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-200">
                                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                                        <Bell size={28} />
                                    </div>
                                    <p className="text-stone-900 font-bold mb-1">새로운 공지사항이 없습니다.</p>
                                    <p className="text-stone-400 text-sm">진행 중인 특별한 알림이 없습니다.</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-center shadow-lg hover:bg-stone-800 transition-all"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
