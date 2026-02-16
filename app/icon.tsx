import { ImageResponse } from 'next/og'

export const size = {
    width: 192,
    height: 192,
}
export const contentType = 'image/png'

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 100,
                    background: '#1a1a2e',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '40px',
                }}
            >
                <div
                    style={{
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #d4af37, #8b4513)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'serif',
                        fontWeight: 900,
                        color: 'white',
                        fontSize: 80,
                    }}
                >
                    J
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
