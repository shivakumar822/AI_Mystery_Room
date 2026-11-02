import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, Shield, Sparkles, FolderLock } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-noir-gold/15 bg-mystery-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Bureau Identity */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-mystery-800 to-mystery-950 border border-noir-gold/40 flex items-center justify-center text-noir-gold shadow-glow-gold group-hover:border-noir-gold transition-all duration-300">
              <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-mystery-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-extrabold tracking-wider text-slate-100 group-hover:text-noir-goldLight transition-colors">
                AI MYSTERY ROOM
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest bg-noir-gold/15 text-noir-gold border border-noir-gold/30">
                v2.5
              </span>
            </div>
            <p className="text-[11px] font-mono tracking-widest uppercase text-slate-400 group-hover:text-noir-gold/70 transition-colors flex items-center gap-1.5 -mt-0.5">
              <span>Gemini AI Forensic Division</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400/90 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Bureau Online
              </span>
            </p>
          </div>
        </Link>

        {/* Navigation & CTAs */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              location.pathname === '/'
                ? 'text-noir-gold bg-noir-gold/10 border border-noir-gold/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-mystery-900 border border-transparent'
            }`}
          >
            Dossier Archive
          </Link>

          <Link
            to="/create"
            className="relative group overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-noir-gold via-amber-400 to-noir-goldDark text-mystery-950 shadow-glow-gold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
            <PlusCircle className="w-4 h-4" />
            <span>Commission Mystery</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
