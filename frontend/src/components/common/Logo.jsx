// src/components/common/Logo.jsx
// Reusable EthioClear vector logo component matching the brand specifications.

import { Link } from 'react-router-dom';

export default function Logo({ size = 38, showSubtitle = true, variant = 'light', className = '' }) {
  const isDark = variant === 'dark';

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-lg py-1 ${className}`} aria-label="EthioClear Home">
      {/* Document + Shield Icon Tile */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E6FE8] to-[#0F2A6B] shadow-md ring-1 ring-white/20">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="m9 15 2 2 4-4" />
        </svg>
      </div>

      <div className="leading-tight text-left">
        <div className={`font-sans font-extrabold text-xl tracking-tight ${isDark ? 'text-white' : 'text-[#0F2A6B]'}`}>
          Ethio<span className="text-[#D4A53A]">Clear</span>
        </div>
        {showSubtitle && (
          <div className="text-[9px] font-semibold tracking-widest uppercase text-slate-500">
            CERTIFICATE SYSTEM
          </div>
        )}
      </div>
    </Link>
  );
}

