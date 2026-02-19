import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '주성교회 | Joosung Holiness Church';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #3d2b1f 50%, #1a1a2e 100%)',
                    color: 'white',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Decorative cross */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 120,
                        height: 180,
                        opacity: 0.08,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ width: 120, height: 40, background: 'white', borderRadius: 8 }} />
                    <div style={{ width: 40, height: 140, background: 'white', borderRadius: 8, marginTop: -8 }} />
                </div>

                {/* Logo */}
                <div
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 20,
                        background: 'linear-gradient(135deg, #d4af37, #8B4513)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 40,
                        fontWeight: 900,
                        marginBottom: 24,
                        boxShadow: '0 8px 32px rgba(139, 69, 19, 0.4)',
                    }}
                >
                    주
                </div>

                {/* Church name */}
                <div
                    style={{
                        fontSize: 72,
                        fontWeight: 900,
                        letterSpacing: 8,
                        marginBottom: 12,
                    }}
                >
                    주성교회
                </div>

                {/* English name */}
                <div
                    style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: '#d4af37',
                        letterSpacing: 6,
                        textTransform: 'uppercase',
                        marginBottom: 32,
                    }}
                >
                    Joosung Holiness Church
                </div>

                {/* Divider */}
                <div
                    style={{
                        width: 60,
                        height: 3,
                        background: '#d4af37',
                        borderRadius: 2,
                        marginBottom: 28,
                    }}
                />

                {/* Tagline */}
                <div
                    style={{
                        fontSize: 20,
                        fontWeight: 400,
                        color: 'rgba(255,255,255,0.6)',
                        letterSpacing: 4,
                    }}
                >
                    쉼과 회복이 있는 따뜻한 연결
                </div>
            </div>
        ),
        { ...size }
    );
}
