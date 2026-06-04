import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: '#1b2e1c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: '#c4893a',
            fontSize: 72,
            fontWeight: 700,
            fontFamily: 'Georgia, serif',
            letterSpacing: '-2px',
            lineHeight: 1,
          }}
        >
          WB
        </span>
      </div>
    ),
    { ...size }
  )
}
