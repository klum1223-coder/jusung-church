'use client';

export default function SplineHero() {
    return (
        <div className="absolute inset-0 w-full h-full z-0">
            <iframe
                src="https://my.spline.design/galaxycoffecup-2FRibpumUZ0DSxsUB5cFvwzS/"
                frameBorder="0"
                width="100%"
                height="100%"
                className="w-full h-full"
                title="3D Galaxy"
                loading="lazy"
            />
            {/* 3D 로딩 전/후 배경색 보정 (검은색) */}
            <div className="absolute inset-0 bg-black -z-10" />
        </div>
    );
}
