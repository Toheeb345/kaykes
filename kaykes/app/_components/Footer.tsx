"use client";

import React from "react";
import Link from "next/link";

// ─── Social Icons ─────────────────────────────────────────────────────────────

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Start Designing",  href: "#" },
      { label: "Explore Templates", href: "#" },
      { label: "How It Works",     href: "#" },
      { label: "Pricing",          href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us",   href: "#" },
      { label: "Blog",       href: "#" },
      { label: "Careers",    href: "#" },
      { label: "Contact",    href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",    href: "#" },
      { label: "Terms of Service",  href: "#" },
      { label: "Cookie Policy",     href: "#" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "X / Twitter", href: "#", Icon: XIcon },
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
  { label: "TikTok", href: "#", Icon: TikTokIcon },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&display=swap');

        .footer {
          background: #ffffff;
          border-top: 1px solid #ede9fe;
          font-family: 'Syne', sans-serif;
        }

        /* ── Top accent line ── */
        .footer-accent {
          height: 3px;
          background: linear-gradient(to right, #7C3AED, #c4b5fd, #ffffff);
        }

        /* ── Main grid ── */
        .footer-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 40px 48px;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 48px;
        }

        @media (max-width: 1024px) {
          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 600px) {
          .footer-main {
            grid-template-columns: 1fr;
            padding: 48px 24px 36px;
            gap: 36px;
          }
          .footer-brand {
            grid-column: auto;
          }
        }

        /* ── Brand block ── */
        .footer-brand {}

        .footer-wordmark {
          font-size: 1.9rem;
          font-weight: 800;
          letter-spacing: -0.05em;
          color: #111827;
          line-height: 1;
          margin: 0 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 2px;
        }

        .footer-wordmark span {
          color: #7C3AED;
        }

        .footer-tagline {
          font-size: 0.82rem;
          color: #6b7280;
          line-height: 1.65;
          max-width: 26ch;
          margin: 0 0 24px;
          font-weight: 400;
        }

        /* ── Socials ── */
        .footer-socials {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .footer-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1.5px solid #ede9fe;
          color: #7C3AED;
          background: transparent;
          text-decoration: none;
          transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.15s;
        }

        .footer-social-btn:hover {
          background: #7C3AED;
          border-color: #7C3AED;
          color: #ffffff;
          transform: translateY(-2px);
        }

        /* ── Nav columns ── */
        .footer-nav-col {}

        .footer-nav-heading {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #7C3AED;
          margin: 0 0 16px;
        }

        .footer-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-nav-list a {
          font-size: 0.88rem;
          font-weight: 400;
          color: #374151;
          text-decoration: none;
          transition: color 0.15s;
          display: inline-block;
        }

        .footer-nav-list a:hover {
          color: #7C3AED;
        }

        /* ── Bottom bar ── */
        .footer-bottom {
          border-top: 1px solid #f3f0ff;
          max-width: 1280px;
          margin: 0 auto;
          padding: 20px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        @media (max-width: 600px) {
          .footer-bottom {
            padding: 20px 24px;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }

        .footer-copy {
          font-size: 0.75rem;
          color: #9ca3af;
          margin: 0;
        }

        .footer-copy strong {
          color: #7C3AED;
          font-weight: 700;
        }

        .footer-legal-links {
          display: flex;
          gap: 20px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .footer-legal-links a {
          font-size: 0.73rem;
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.15s;
        }

        .footer-legal-links a:hover {
          color: #7C3AED;
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .footer-social-btn,
          .footer-nav-list a {
            transition: none;
          }
        }
      `}</style>

      <footer className="footer">
        {/* Top purple gradient line */}
        <div className="footer-accent" />

        <div className="footer-main">

          {/* ── Brand + socials ── */}
          <div className="footer-brand">
            <p className="footer-wordmark">
              kay<span>kes</span>
            </p>
            <p className="footer-tagline">
              Design, visualize, and perfect your product
              before a single item is printed.
            </p>
            <div className="footer-socials">
              {SOCIALS.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="footer-social-btn"
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>

          {/* ── Nav columns ── */}
          {NAV_LINKS.map((col) => (
            <div key={col.heading} className="footer-nav-col">
              <p className="footer-nav-heading">{col.heading}</p>
              <ul className="footer-nav-list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} <strong>kaykes</strong>. All rights reserved.
          </p>
          <ul className="footer-legal-links">
            <li><Link href="#">Privacy</Link></li>
            <li><Link href="#">Terms</Link></li>
            <li><Link href="#">Cookies</Link></li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;
