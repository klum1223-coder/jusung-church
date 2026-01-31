'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ currentPage, totalPages, onPageChange }: any) {
    return (
        <div className="flex items-center justify-center gap-2 py-10">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-2 rounded-xl border border-stone-200 disabled:opacity-30 hover:bg-stone-50"
            >
                <ChevronLeft size={20} />
            </button>
            <span className="font-bold text-stone-600 px-4">
                {currentPage} / {totalPages || 1}
            </span>
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-2 rounded-xl border border-stone-200 disabled:opacity-30 hover:bg-stone-50"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
