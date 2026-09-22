import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const groom = searchParams.get('groom') || 'Julian';
  const bride = searchParams.get('bride') || 'Nadia';
  const guest = searchParams.get('guest');
  const date = searchParams.get('date') || '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8F7F3',
          padding: '60px 80px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Double Framing Outline */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: '1px solid #D8D2C4',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 30,
            left: 30,
            right: 30,
            bottom: 30,
            border: '1px solid #EBE5D8',
            display: 'flex',
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: 13,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#8A8275',
              fontFamily: 'sans-serif',
              fontWeight: 500,
            }}
          >
            UNDANGAN ONLINE · OFFICIAL INVITATION
          </span>
        </div>

        {/* Central Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 10,
            maxWidth: 1000,
          }}
        >
          {guest ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#7C7567',
                  fontFamily: 'sans-serif',
                  marginBottom: 12,
                }}
              >
                KEPADA YTH. BAPAK / IBU / SAUDARA / I:
              </span>
              <h1
                style={{
                  fontSize: 54,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: '#111111',
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {guest}
              </h1>

              {/* Decorative Divider */}
              <div
                style={{
                  width: 80,
                  height: 1,
                  backgroundColor: '#C5BCAC',
                  margin: '24px 0 16px 0',
                }}
              />

              <span
                style={{
                  fontSize: 13,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#8A8275',
                  fontFamily: 'sans-serif',
                }}
              >
                THE WEDDING OF
              </span>
              <h2
                style={{
                  fontSize: 38,
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#2A2723',
                  margin: '8px 0 0 0',
                }}
              >
                {groom} &amp; {bride}
              </h2>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#8A8275',
                  fontFamily: 'sans-serif',
                  marginBottom: 14,
                }}
              >
                THE WEDDING CELEBRATION
              </span>
              <h1
                style={{
                  fontSize: 68,
                  fontWeight: 400,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#111111',
                  margin: 0,
                  lineHeight: 1.05,
                }}
              >
                {groom} &amp; {bride}
              </h1>

              {date ? (
                <span
                  style={{
                    fontSize: 16,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: '#635D52',
                    fontFamily: 'sans-serif',
                    marginTop: 20,
                  }}
                >
                  {date}
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Bottom Footer Call to Action */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 50,
              height: 1,
              backgroundColor: '#D0C8B8',
              marginBottom: 16,
            }}
          />
          <span
            style={{
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#8A8275',
              fontFamily: 'sans-serif',
            }}
          >
            BUKA TAUTAN UNTUK INFO LENGKAP &amp; KONFIRMASI KEHADIRAN (RSVP)
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
