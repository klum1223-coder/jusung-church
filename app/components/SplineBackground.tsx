'use client';

export default function SplineBackground() {
    return (
        <div className="fixed inset-0 w-full h-full -z-50 bg-[#eef2ff]">
            <iframe
                src="https://my.spline.design/welcome3dtextanimationlightdark-A4cq9ZV3ayEuzyaupJZkyhcb/"
                frameBorder="0"
                width="100%"
                height="100%"
                className="w-full h-full"
                title="Welcome 3D Animation"
            />
            {/* Overlay to ensure text readability if needed, or to tint */}
            <div className="absolute inset-0 bg-white/10 pointer-events-none" />
        </div>
    );
}
