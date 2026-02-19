'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        // 이전에 닫았으면 24시간 동안 표시 안함
        const dismissed = localStorage.getItem('pwa-banner-dismissed');
        if (dismissed) {
            const dismissedAt = parseInt(dismissed, 10);
            if (Date.now() - dismissedAt < 24 * 60 * 60 * 1000) return;
        }

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShow(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
            setShow(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShow(false);
        localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
    };

    if (!show) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-0"
            style={{ animation: 'slideUp 0.4s ease-out' }}
        >
            <style jsx>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(100%); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <div className="max-w-lg mx-auto bg-stone-900 text-white rounded-2xl md:rounded-t-2xl md:rounded-b-none p-5 shadow-2xl flex items-center gap-4">
                {/* 아이콘 */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8B4513] flex items-center justify-center font-serif font-black text-xl shrink-0 shadow-lg">
                    주
                </div>
                {/* 텍스트 */}
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">주성교회 앱 설치</p>
                    <p className="text-white/50 text-xs mt-0.5">홈 화면에서 바로 접속할 수 있어요</p>
                </div>
                {/* 버튼 */}
                <button
                    onClick={handleInstall}
                    className="px-4 py-2.5 bg-[#8B4513] hover:bg-[#a0522d] text-white rounded-xl font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors shadow-lg"
                >
                    <Download size={14} />
                    설치
                </button>
                {/* 닫기 */}
                <button
                    onClick={handleDismiss}
                    className="text-white/30 hover:text-white/60 transition-colors shrink-0"
                    aria-label="닫기"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}
