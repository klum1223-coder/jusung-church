'use client';

import React from 'react';
import { CHURCH_DATA } from '../lib/constants';
import { MapPin, Phone, Mail, Clock, Calendar, Globe, Youtube, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
    return (
        <div className="bg-[#faf9f6] min-h-screen pt-20 md:pt-24 font-sans selection:bg-[#8B4513] selection:text-white">
            <main>
                {/* Hero Section */}
                <section className="py-24 px-6 bg-stone-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                        <img
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                            className="w-full h-full object-cover"
                            alt="Contact Us"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />

                    <div className="container mx-auto max-w-5xl relative z-10 text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <span className="text-amber-400 font-black tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-[12px] uppercase">
                                Visit & Contact
                            </span>
                            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">오시는 길</h1>
                            <p className="text-white/80 text-lg md:text-xl font-light max-w-2xl mx-auto px-4 leading-relaxed">
                                주성교회는 언제나 여러분을 환영합니다.<br />
                                따뜻한 만남과 은혜가 있는 곳으로 여러분을 초대합니다.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Info & Map Section */}
                <section className="py-20 px-4 md:px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                            {/* Contact Info */}
                            <div className="space-y-12">
                                <div className="space-y-8">
                                    <h2 className="font-serif text-4xl font-bold text-stone-900">교회 안내</h2>
                                    <div className="w-20 h-1 bg-[#8B4513]" />

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-6 group">
                                            <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center text-[#8B4513] group-hover:bg-[#8B4513] group-hover:text-white transition-colors">
                                                <MapPin size={24} />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Address</span>
                                                <p className="text-xl text-stone-800 font-medium">{CHURCH_DATA.contact.address}</p>
                                                <p className="text-stone-500 text-sm">대중교통 이용 시 '봉명동' 정류장 하차</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-6 group">
                                            <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center text-[#8B4513] group-hover:bg-[#8B4513] group-hover:text-white transition-colors">
                                                <Phone size={24} />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Phone</span>
                                                <p className="text-xl text-stone-800 font-medium">{CHURCH_DATA.contact.phone}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-6 group">
                                            <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center text-[#8B4513] group-hover:bg-[#8B4513] group-hover:text-white transition-colors">
                                                <Mail size={24} />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Email</span>
                                                <p className="text-xl text-stone-800 font-medium">{CHURCH_DATA.contact.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="space-y-6">
                                    <h3 className="font-serif text-2xl font-bold text-stone-900">온라인 채널</h3>
                                    <div className="flex flex-wrap gap-4">
                                        <a
                                            href={CHURCH_DATA.contact.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-[#FF0000] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#cc0000] transition-colors shadow-lg shadow-red-500/20"
                                        >
                                            <Youtube size={20} /> 유튜브
                                        </a>
                                        <a
                                            href={CHURCH_DATA.contact.blog}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-[#03C75A] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#02b351] transition-colors shadow-lg shadow-green-500/20"
                                        >
                                            <MessageCircle size={20} /> 네이버 블로그
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="relative h-[400px] lg:h-[600px] bg-stone-100 rounded-[40px] overflow-hidden shadow-2xl border border-stone-200">
                                {/* Naver Map Static Image or Iframe Placeholder */}
                                {/* Ideally utilize a real map component, but for now linking to Naver Map */}
                                <div className="absolute inset-0 bg-stone-200 flex items-center justify-center group overflow-hidden">
                                    {/* This image mimics a map preview. In a real app, use the specific static map API or embed. */}
                                    <img
                                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80"
                                        className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                                        alt="Map Preview"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <a
                                            href={CHURCH_DATA.contact.naverMap}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-8 py-4 bg-[#8B4513] text-white rounded-full font-bold shadow-2xl hover:bg-stone-900 transition-all flex items-center gap-3 hover:-translate-y-1"
                                        >
                                            <MapPin size={20} /> 네이버 지도로 보기
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Worship Times Summary */}
                <section className="py-20 px-6 bg-stone-100">
                    <div className="container mx-auto max-w-4xl text-center space-y-12">
                        <div className="space-y-4">
                            <span className="text-[#8B4513] font-black tracking-[0.3em] uppercase text-xs">Worship Times</span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">예배 안내</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {CHURCH_DATA.worship.map((w, i) => (
                                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200/50 flex items-center justify-between group hover:-translate-y-1 transition-transform duration-300 hover:shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center text-[#8B4513] group-hover:bg-[#8B4513] group-hover:text-white transition-colors">
                                            {w.name.includes('주일') ? <Globe size={20} /> : <Calendar size={20} />}
                                        </div>
                                        <span className="font-bold text-stone-700 text-lg group-hover:text-stone-900 text-left">{w.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-stone-500 font-medium bg-stone-100 px-4 py-2 rounded-full text-sm">
                                        <Clock size={14} />
                                        {w.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
