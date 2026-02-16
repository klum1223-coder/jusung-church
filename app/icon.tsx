import { ImageResponse } from 'next/og'

export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#1a1a2e',
                    borderRadius: '6px',
                    fontSize: 20,
                    fontWeight: 900,
                    fontFamily: 'serif',
                    color: '#d4af37',
                }}
            >
                J
            </div>
        ),
        { ...size }
    )
}
