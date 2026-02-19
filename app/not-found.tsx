import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center px-6 text-center font-sans">
            <div className="space-y-6 max-w-md">
                <p className="text-[#8B4513] font-black tracking-[0.4em] text-[10px] uppercase">
                    Page Not Found
                </p>
                <h1 className="font-serif text-7xl md:text-9xl font-bold text-stone-900">
                    404
                </h1>
                <p className="text-stone-500 text-lg font-light leading-relaxed">
                    찾으시는 페이지가 존재하지 않습니다.<br />
                    주소를 다시 확인해주세요.
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-4 bg-[#8B4513] text-white rounded-full font-bold text-sm shadow-xl hover:bg-stone-900 transition-all hover:scale-105"
                >
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
}
