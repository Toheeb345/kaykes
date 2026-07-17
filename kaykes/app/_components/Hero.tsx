"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface WordConfig {
  text: string;
  scatterX: number;
  scatterY: number;
  fontSizeDesktop: number;
  fontSizeMobile: number;
  order: number;
}

const WORDS: WordConfig[] = [
  { text: "Design",    scatterX: 15, scatterY: 8,  fontSizeDesktop: 5.5, fontSizeMobile: 10,  order: 0 },
  { text: "Innovate",  scatterX: 60, scatterY: 22, fontSizeDesktop: 4.2, fontSizeMobile: 8,   order: 1 },
  { text: "Create",    scatterX: 35, scatterY: 45, fontSizeDesktop: 6.5, fontSizeMobile: 11,  order: 2 },
  { text: "Visualize", scatterX: 72, scatterY: 65, fontSizeDesktop: 4.8, fontSizeMobile: 9,   order: 3 },
  { text: "Customize", scatterX: 20, scatterY: 80, fontSizeDesktop: 5.0, fontSizeMobile: 8.5, order: 4 },
  { text: "Order",     scatterX: 50, scatterY: 90, fontSizeDesktop: 3.8, fontSizeMobile: 7,   order: 5 },
];

const COUNT = WORDS.length;
const STAGGER = 0.09;

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

const Hero: React.FC = () => {
  const zoneRef  = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRef   = useRef<HTMLDivElement>(null);
  const copyRef  = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const lastPRef = useRef<number>(-1);

  const getAlignedTop = (order: number, isMobile: boolean): number => {
    if (isMobile) {
      // Bottom half: 52% → 95%
      const gap = 50 / (COUNT + 1);
      return 48 + gap * (order + 1);
    } else {
      // Full height: 8% → 92%
      const gap = 84 / (COUNT + 1);
      return 8 + gap * (order + 1);
    }
  };

  // Desktop: words align to right side. We use % of the FULL sticky panel.
  // "55%" left + the word renders left-anchored, so longest word "Customize" (~9ch)
  // at 5.2vw ≈ ~47vw wide — so we anchor at 55% and words flow rightward but fit.
  // We nudge left anchor to 52% so there's breathing room from the right edge.
  const ALIGNED_LEFT_DESKTOP = 55;  // % of full screen — right half, words go rightward from here
  const ALIGNED_LEFT_MOBILE  = 5;   // % — left edge, bottom half
  const ALIGNED_FONT_DESKTOP = 5.2; // vw — same as original
  const ALIGNED_FONT_MOBILE  = 8.5; // vw

  const render = useCallback((globalProgress: number) => {
    if (Math.abs(globalProgress - lastPRef.current) < 0.0005) return;
    lastPRef.current = globalProgress;

    const isMobile = window.innerWidth < 768;
    const gp = clamp(globalProgress, 0, 1);

    // ── Fade out left copy (desktop) / top copy (mobile) ──────────────────
    if (copyRef.current) {
      const fadeProgress = clamp((gp - 0.05) / 0.45, 0, 1);
      copyRef.current.style.opacity = String(lerp(1, 0, easeInOutQuart(fadeProgress)));
      copyRef.current.style.pointerEvents = fadeProgress >= 1 ? "none" : "auto";
    }

    // ── Accent bar ─────────────────────────────────────────────────────────
    if (barRef.current) {
      barRef.current.style.opacity   = String(lerp(0, 1, gp));
      barRef.current.style.transform = `scaleY(${lerp(0.05, 1, easeInOutQuart(gp))})`;
    }

    // ── Words ──────────────────────────────────────────────────────────────
    WORDS.forEach((word, i) => {
      const el = wordRefs.current[i];
      if (!el) return;

      const stagger  = STAGGER * i;
      const localRaw = clamp((gp - stagger) / (1 - stagger), 0, 1);
      const lp       = easeInOutQuart(localRaw);

      const alignedLeft = isMobile ? ALIGNED_LEFT_MOBILE : ALIGNED_LEFT_DESKTOP;
      const alignedFont = isMobile ? ALIGNED_FONT_MOBILE  : ALIGNED_FONT_DESKTOP;
      const alignedTop  = getAlignedTop(word.order, isMobile);
      const scatterFont = isMobile ? word.fontSizeMobile : word.fontSizeDesktop;

      const left    = lerp(word.scatterX, alignedLeft, lp);
      const top     = lerp(word.scatterY, alignedTop,  lp);
      const fs      = lerp(scatterFont,   alignedFont,  lp);
      const opacity = lerp(0.06, 1, lp);
      const weight  = lp > 0.5 ? "800" : "400";

      const accentWord  = word.order % 2 === 0;
      const targetColor = accentWord ? "#7C3AED" : "#0D0D0D";

      el.style.left       = `${left}%`;
      el.style.top        = `${top}%`;
      el.style.fontSize   = `${fs}vw`;
      el.style.opacity    = String(opacity);
      el.style.fontWeight = weight;
      el.style.color      = lp > 0.4 ? targetColor : "#c4b5fd";
    });
  }, []);

  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect       = zone.getBoundingClientRect();
        const scrolled   = -rect.top;
        const activeDist = zone.offsetHeight * 0.52;
        const raw        = clamp(scrolled / activeDist, 0, 1);
        render(raw);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    render(0);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [render]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&display=swap');

        .hero-zone {
          position: relative;
          height: 300vh;
        }

        .hero-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          background: #ffffff;
        }

        .hero-sticky::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 60% 50%, #f5f3ff 0%, #ffffff 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* Layout: copy sits in left half, canvas overlays FULL sticky panel */
        .hero-inner {
          position: relative;
          z-index: 1;
          height: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 48px;
        }

        @media (max-width: 767px) {
          .hero-inner {
            grid-template-columns: 1fr;
            padding: 0 20px;
            align-items: flex-start;
            padding-top: 80px;
          }
        }

        .hero-copy {
          z-index: 2;
          will-change: opacity;
          transition: opacity 0.05s linear;
        }

        .hero-copy h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          color: #111827;
          line-height: 1.08;
          letter-spacing: -0.035em;
          margin-bottom: 16px;
        }

        .hero-copy h1 strong {
          color: #7C3AED;
          font-weight: 800;
        }

        .hero-copy p {
          font-size: clamp(0.9rem, 1.5vw, 1.05rem);
          color: #6b7280;
          line-height: 1.7;
          margin-bottom: 28px;
          max-width: 40ch;
        }

        .hero-btn-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-block;
          padding: 12px 26px;
          background: #7C3AED;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          cursor: pointer;
        }
        .btn-primary:hover { background: #6d28d9; transform: translateY(-1px); }

        .btn-outline {
          display: inline-block;
          padding: 12px 26px;
          background: transparent;
          color: #374151;
          border: 1.5px solid #e5e7eb;
          border-radius: 6px;
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
          cursor: pointer;
        }
        .btn-outline:hover { border-color: #7C3AED; color: #7C3AED; transform: translateY(-1px); }

        /*
          KEY CHANGE: canvas is now position:absolute over the FULL sticky panel,
          not just the right grid column. Words scatter and align across the whole screen.
        */
        .hero-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 3;
        }

        /* Accent bar — sits at the right-side aligned column edge */
        .hero-accent-bar {
          position: absolute;
          /* right-side bar: ~54% from left */
          left: 54%;
          top: 8%;
          bottom: 8%;
          width: 3px;
          border-radius: 2px;
          background: linear-gradient(to bottom, #7C3AED 0%, #c4b5fd 100%);
          transform-origin: top center;
          opacity: 0;
          transform: scaleY(0.05);
          z-index: 3;
          pointer-events: none;
        }

        .hero-word {
          position: absolute;
          font-family: 'Syne', sans-serif;
          font-weight: 400;
          white-space: nowrap;
          line-height: 1;
          letter-spacing: -0.04em;
          transform: translateY(-50%);
          will-change: left, top, font-size, opacity, color;
          user-select: none;
          cursor: default;
          transition: color 0.35s ease, font-weight 0.25s ease;
          text-shadow: 0 1px 0 rgba(255,255,255,0.8), 0 -1px 0 rgba(196,181,253,0.3);
          z-index: 2;
        }

        .hero-scroll-hint {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          z-index: 5;
          font-family: 'Syne', sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c4b5fd;
          pointer-events: none;
        }

        .hero-scroll-hint-line {
          width: 1px;
          height: 28px;
          background: linear-gradient(to bottom, #c4b5fd, transparent);
          animation: hint-pulse 1.8s ease-in-out infinite;
        }

        @keyframes hint-pulse {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50%       { opacity: 0.3; transform: scaleY(0.4); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-word { transition: none !important; will-change: auto; }
          .hero-scroll-hint-line { animation: none; }
        }
          @media (max-width: 767px){
            .hero-accent-bar {
    left: 18px;
  }
          }
      `}</style>

      <div className="hero-zone" ref={zoneRef}>
        <div className="hero-sticky">
          <div className="hero-inner">

            {/* ── Left: copy (fades out as scroll progresses) ── */}
            <div className="hero-copy" ref={copyRef}>
              <h1>
                Create,&nbsp;
                <strong>Customize</strong>
                &nbsp;&amp; Order
              </h1>
              <p>
                Why waste materials on testing? Design, visualize, and
                perfect your product before a single item is printed.
              </p>
              <div className="hero-btn-group">
                <a className="btn-primary" href="#">Start Designing</a>
                <a className="btn-outline" href="#">Explore</a>
              </div>
            </div>

          </div>

          {/*
            Canvas is OUTSIDE hero-inner so it overlays the FULL sticky panel.
            Words scatter across 100vw and align to the right half.
          */}
          <div className="hero-canvas">
            <div className="hero-accent-bar" ref={barRef} />

            {WORDS.map((word, i) => (
              <span
                key={word.text}
                className="hero-word"
                ref={el => { wordRefs.current[i] = el; }}
                style={{
                  left:       `${word.scatterX}%`,
                  top:        `${word.scatterY}%`,
                  fontSize:   `${word.fontSizeDesktop}vw`,
                  opacity:    0.06,
                  color:      "#c4b5fd",
                  fontWeight: 400,
                }}
              >
                {word.text}
              </span>
            ))}
          </div>

          <div className="hero-scroll-hint">
            <span>Scroll</span>
            <div className="hero-scroll-hint-line" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;