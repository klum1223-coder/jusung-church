'use client';

import React from 'react';
import { Mail, Phone, MapPin, Youtube, Instagram, Facebook, ChevronRight } from 'lucide-react';
import { CHURCH_DATA } from '../lib/constants';

const Footer = () => {
    return (
        <footer className="bg-stone-50 border-t border-stone-100 pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#8B4513] text-white rounded-full flex items-center justify-center font-bold text-xl">✝</div>
                            <h2 className="text-xl font-bold tracking-tighter text-stone-900">주성교회</h2>
                        </div>
                        <p className="text-stone-500 text-sm leading-relaxed max-w-xs">{CHURCH_DATA.slogan}</p>
                        <div className="flex gap-4">
                            <a href={CHURCH_DATA.contact.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-stone-400 hover:text-[#FF0000] transition-colors"><Youtube size={20} /></a>
                            <a href="#" className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-stone-400 hover:text-[#E1306C] transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-stone-400 hover:text-[#1877F2] transition-colors"><Facebook size={20} /></a>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="font-bold text-stone-900 text-sm uppercase tracking-widest">Service Times</h4>
                        <div className="space-y-4">
                            {CHURCH_DATA.worship.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm border-b border-stone-100 pb-2">
                                    <span className="text-stone-500">{item.name}</span>
                                    <span className="font-bold text-stone-900">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="font-bold text-stone-900 text-sm uppercase tracking-widest">Contact Us</h4>
                        <div className="space-y-4 text-sm text-stone-600">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-[#8B4513] shrink-0 mt-1" />
                                <p className="leading-relaxed">{CHURCH_DATA.contact.address}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-[#8B4513] shrink-0" />
                                <p>{CHURCH_DATA.contact.phone}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-[#8B4513] shrink-0" />
                                <p>{CHURCH_DATA.contact.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="font-bold text-stone-900 text-sm uppercase tracking-widest">Location</h4>
                        <div className="rounded-2xl overflow-hidden shadow-sm h-48 bg-stone-200 border border-stone-100">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3213.3984534720937!2d127.457883!3d36.645041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3565287f3bfff651%3A0x6d9f0a2e5d7a7b8!2s24%20Bongmyeong-ro%20219beon-gil%2C%20Heungdeok-gu%2C%20Cheongju-si%2C%20Chungcheongbuk-do!5e0!3m2!1sen!2skr!4v1715878423456!5m2!1sen!2skr"
                                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-stone-400 text-xs">© 2024 Joosung Holiness Church. All rights reserved.</p>
                    <div className="flex gap-8 text-stone-400 text-xs">
                        <a href="#" className="hover:text-stone-900 transition-colors">이용약관</a>
                        <a href="#" className="hover:text-stone-900 transition-colors">개인정보처리방침</a>
                        <a href="#" className="hover:text-stone-900 transition-colors">관리자 로그인</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
