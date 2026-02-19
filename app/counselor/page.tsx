'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Sparkles, Heart, BookOpen, Loader2,
    RefreshCw, MessageCircle, Sun, Moon, CloudRain,
    Smile, Frown, Meh, Zap, Coffee
} from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    scriptures?: Scripture[];
    sermons?: Sermon[];
}

interface Scripture {
    text: string;
    source: string;
}

interface Sermon {
    title: string;
    description: string;
    videoId?: string;
    thumbnail?: string;
}

// Pre-defined emotional states for quick selection
const EMOTION_PRESETS = [
    { id: 'tired', label: '지치고 힘들어요', icon: Coffee, color: 'from-blue-500 to-indigo-500' },
    { id: 'anxious', label: '불안하고 걱정돼요', icon: CloudRain, color: 'from-purple-500 to-pink-500' },
    { id: 'grateful', label: '감사한 마음이에요', icon: Heart, color: 'from-amber-500 to-orange-500' },
    { id: 'lost', label: '방향을 잃은 것 같아요', icon: Meh, color: 'from-slate-500 to-gray-500' },
    { id: 'joyful', label: '기쁘고 행복해요', icon: Smile, color: 'from-green-500 to-emerald-500' },
    { id: 'angry', label: '화가 나요', icon: Zap, color: 'from-red-500 to-rose-500' },
];

// Pre-defined scripture responses based on emotions (fallback when API is not available)
const SCRIPTURE_RESPONSES: Record<string, { scriptures: Scripture[], message: string }> = {
    tired: {
        message: "지치고 힘드실 때, 하나님께서는 우리에게 쉼을 주시겠다고 약속하셨습니다.",
        scriptures: [
            { text: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라", source: "마태복음 11:28" },
            { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물가로 인도하시는도다", source: "시편 23:1-2" },
            { text: "오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요", source: "이사야 40:31" }
        ]
    },
    anxious: {
        message: "불안할 때 하나님께서 우리와 함께 하십니다. 두려워하지 마세요.",
        scriptures: [
            { text: "아무 것도 염려하지 말고 오직 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라", source: "빌립보서 4:6" },
            { text: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라", source: "이사야 41:10" },
            { text: "너희 염려를 다 주께 맡기라 이는 그가 너희를 돌보심이라", source: "베드로전서 5:7" }
        ]
    },
    grateful: {
        message: "감사함으로 하나님께 영광을 돌릴 때, 우리의 기쁨은 더욱 충만해집니다.",
        scriptures: [
            { text: "범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라", source: "데살로니가전서 5:18" },
            { text: "여호와께 감사하라 그는 선하시며 그 인자하심이 영원함이로다", source: "시편 136:1" },
            { text: "감사함으로 그의 문에 들어가며 찬송함으로 그의 궁정에 들어가서", source: "시편 100:4" }
        ]
    },
    lost: {
        message: "방향을 잃은 것 같을 때, 하나님께서 우리의 길을 인도해 주십니다.",
        scriptures: [
            { text: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라 너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라", source: "잠언 3:5-6" },
            { text: "내가 산을 향하여 눈을 들리라 나의 도움이 어디서 올까 나의 도움은 천지를 지으신 여호와에게서로다", source: "시편 121:1-2" },
            { text: "주의 말씀은 내 발에 등이요 내 길에 빛이니이다", source: "시편 119:105" }
        ]
    },
    joyful: {
        message: "기쁨은 주님께서 주시는 선물입니다. 함께 찬양하며 감사드립시다!",
        scriptures: [
            { text: "주 안에서 항상 기뻐하라 내가 다시 말하노니 기뻐하라", source: "빌립보서 4:4" },
            { text: "이 날은 여호와께서 정하신 것이라 이 날에 우리가 즐거워하고 기뻐하리로다", source: "시편 118:24" },
            { text: "여호와로 인하여 기뻐하는 것이 너희의 힘이니라", source: "느헤미야 8:10" }
        ]
    },
    angry: {
        message: "화가 날 때도 하나님께 솔직하게 나아갈 수 있습니다. 주님께서 우리 마음을 다스려 주십니다.",
        scriptures: [
            { text: "분을 내어도 죄를 짓지 말며 해가 지도록 분을 품지 말고", source: "에베소서 4:26" },
            { text: "노하기를 더디하는 자는 용사보다 낫고 자기의 마음을 다스리는 자는 성을 빼앗는 자보다 나으니라", source: "잠언 16:32" },
            { text: "사랑하는 자들아 너희가 친히 원수를 갚지 말고 하나님의 진노하심에 맡기라", source: "로마서 12:19" }
        ]
    }
};

export default function CounselorPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPresets, setShowPresets] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll removed based on user request ("don't scroll down when buttons clicked")
    /*
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);
    */

    const handlePresetClick = (presetId: string) => {
        const preset = EMOTION_PRESETS.find(p => p.id === presetId);
        if (preset) {
            handleSendMessage(preset.label);
        }
    };

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        setShowPresets(false);
        setInputValue('');
        setIsLoading(true);

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text
        };
        setMessages(prev => [...prev, userMessage]);

        // Simulate AI response (using local fallback for now)
        setTimeout(() => {
            const response = getLocalResponse(text);
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.message,
                scriptures: response.scriptures
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);
        }, 1500);
    };

    const getLocalResponse = (input: string): { message: string, scriptures: Scripture[] } => {
        const lowerInput = input.toLowerCase();

        // Match keywords to emotions
        if (lowerInput.includes('지치') || lowerInput.includes('힘들') || lowerInput.includes('피곤') || lowerInput.includes('쉬고')) {
            return SCRIPTURE_RESPONSES.tired;
        }
        if (lowerInput.includes('불안') || lowerInput.includes('걱정') || lowerInput.includes('두려') || lowerInput.includes('무서')) {
            return SCRIPTURE_RESPONSES.anxious;
        }
        if (lowerInput.includes('감사') || lowerInput.includes('고마') || lowerInput.includes('축복')) {
            return SCRIPTURE_RESPONSES.grateful;
        }
        if (lowerInput.includes('방향') || lowerInput.includes('잃') || lowerInput.includes('모르') || lowerInput.includes('어떻게')) {
            return SCRIPTURE_RESPONSES.lost;
        }
        if (lowerInput.includes('기쁘') || lowerInput.includes('행복') || lowerInput.includes('좋') || lowerInput.includes('즐거')) {
            return SCRIPTURE_RESPONSES.joyful;
        }
        if (lowerInput.includes('화') || lowerInput.includes('분노') || lowerInput.includes('짜증') || lowerInput.includes('억울')) {
            return SCRIPTURE_RESPONSES.angry;
        }

        // Default response
        return {
            message: "당신의 마음을 나눠주셔서 감사합니다. 하나님께서 언제나 우리와 함께 하십니다.",
            scriptures: [
                { text: "내가 세상 끝날까지 너희와 항상 함께 있으리라", source: "마태복음 28:20" },
                { text: "여호와는 네 모든 영접에서 너를 지키시며 또한 네 영혼을 지키시리로다", source: "시편 121:7" },
                { text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라", source: "요한복음 3:16" }
            ]
        };
    };

    const handleReset = () => {
        setMessages([]);
        setShowPresets(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50 pt-20 md:pt-24">
            {/* Header */}
            <section className="py-10 md:py-16 px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 md:space-y-6 max-w-3xl mx-auto"
                >
                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-[#8B4513] to-amber-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/20">
                        <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <span className="text-[#8B4513] font-black tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-[11px] uppercase">
                        AI Faith Counselor
                    </span>
                    <h1 className="font-serif text-3xl md:text-4xl lg:text-6xl text-stone-900 font-bold leading-tight">
                        오늘 기분이 <span className="text-[#8B4513]">어떠신가요?</span>
                    </h1>
                    <p className="text-stone-500 text-base md:text-lg font-light max-w-xl mx-auto px-2">
                        마음을 나눠주시면, 지금 당신에게 필요한<br className="hidden md:block" />
                        하나님의 말씀과 위로를 전해드립니다.
                    </p>
                </motion.div>
            </section>

            {/* Chat Area */}
            <section className="px-4 md:px-6 pb-32">
                <div className="max-w-2xl mx-auto">
                    {/* Emotion Presets */}
                    <AnimatePresence>
                        {showPresets && messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8"
                            >
                                {EMOTION_PRESETS.map((preset, idx) => (
                                    <motion.button
                                        key={preset.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => handlePresetClick(preset.id)}
                                        className={`p-4 md:p-6 rounded-2xl md:rounded-3xl bg-gradient-to-br ${preset.color} text-white text-left group hover:scale-105 transition-all shadow-lg hover:shadow-xl`}
                                    >
                                        <preset.icon className="w-6 h-6 md:w-8 md:h-8 mb-3 md:mb-4 opacity-80" />
                                        <p className="font-bold text-xs md:text-sm leading-relaxed">{preset.label}</p>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Messages */}
                    <div className="space-y-6 mb-8">
                        <AnimatePresence>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 bg-[#8B4513] rounded-xl flex items-center justify-center">
                                                    <Heart className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-xs font-bold text-stone-400">신앙 상담사</span>
                                            </div>
                                        )}
                                        <div className={`p-6 rounded-3xl ${msg.role === 'user'
                                            ? 'bg-[#8B4513] text-white rounded-tr-lg'
                                            : 'bg-white border border-stone-100 shadow-lg rounded-tl-lg'
                                            }`}>
                                            <p className={`leading-relaxed ${msg.role === 'user' ? 'font-medium' : 'text-stone-700'}`}>
                                                {msg.content}
                                            </p>

                                            {/* Scripture Cards */}
                                            {msg.scriptures && msg.scriptures.length > 0 && (
                                                <div className="mt-6 space-y-4">
                                                    {msg.scriptures.map((scripture, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.2 }}
                                                            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5"
                                                        >
                                                            <BookOpen className="w-5 h-5 text-amber-600 mb-3" />
                                                            <p className="text-stone-800 font-serif text-lg leading-relaxed mb-3 break-keep">
                                                                "{scripture.text}"
                                                            </p>
                                                            <p className="text-amber-700 font-bold text-sm">
                                                                — {scripture.source}
                                                            </p>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Loading */}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-4"
                            >
                                <div className="w-8 h-8 bg-[#8B4513] rounded-xl flex items-center justify-center">
                                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                                </div>
                                <div className="bg-white border border-stone-100 rounded-2xl px-6 py-4 shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-stone-400 text-sm">말씀을 찾고 있습니다</span>
                                        <motion.div
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="flex gap-1"
                                        >
                                            <span className="w-1.5 h-1.5 bg-[#8B4513] rounded-full" />
                                            <span className="w-1.5 h-1.5 bg-[#8B4513] rounded-full" />
                                            <span className="w-1.5 h-1.5 bg-[#8B4513] rounded-full" />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Reset Button */}
                    {messages.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center mb-6"
                        >
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 px-6 py-3 text-stone-400 hover:text-stone-600 text-sm font-bold transition-colors"
                            >
                                <RefreshCw size={16} />
                                새로운 대화 시작하기
                            </button>
                        </motion.div>
                    )}

                    {/* Input Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-white via-white to-transparent"
                    >
                        <div className="max-w-2xl mx-auto">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage(inputValue);
                                }}
                                className="relative"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="오늘의 마음을 나눠주세요..."
                                    disabled={isLoading}
                                    className="w-full px-5 md:px-8 py-4 md:py-6 pr-14 md:pr-16 bg-white border-2 border-[#8B4513]/40 rounded-2xl md:rounded-3xl text-base md:text-lg placeholder:text-stone-400 focus:outline-none focus:border-[#8B4513] focus:ring-4 focus:ring-[#8B4513]/20 transition-all shadow-2xl font-medium text-stone-800"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-[#8B4513] text-white rounded-xl md:rounded-2xl flex items-center justify-center disabled:opacity-30 hover:bg-stone-900 transition-all shadow-lg"
                                >
                                    <Send size={18} className="md:w-5 md:h-5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
