import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ShieldAlert,
  FileQuestion,
  Fingerprint,
  Award,
  ChevronRight,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Flame,
} from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center space-y-6 pt-6 sm:pt-14 relative z-10">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-mystery-900/90 border border-noir-gold/30 text-noir-gold text-xs font-mono tracking-widest uppercase shadow-glow-gold backdrop-blur-md">
          <Brain className="w-4 h-4 text-noir-gold animate-pulse" />
          <span>Powered by Gemini AI • Structured Forensics Engine</span>
        </div>

        {/* Dramatic Headline */}
        <h1 className="font-serif text-4xl sm:text-7xl font-black text-slate-100 tracking-tight leading-[1.1]">
          STEP INTO THE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-noir-goldLight via-noir-gold to-amber-500 drop-shadow-sm">
            AI MYSTERY ROOM
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans font-light">
          Commission any locked-room crime or heist scenario you imagine. Gemini AI dynamically constructs a logically consistent mystery with deceptive alibis, physical clues, and a hidden culprit.
        </p>

        {/* Hero Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/create"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-noir-gold via-amber-400 to-noir-goldDark text-mystery-950 shadow-glow-gold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
          >
            <Search className="w-5 h-5" />
            <span>Launch Detective Investigation</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>

          <a
            href="#protocol"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold text-slate-300 hover:text-white glass-panel-interactive"
          >
            <span>Review Bureau Protocol</span>
          </a>
        </div>

        {/* Interactive Case Docket Teaser Card */}
        <div className="pt-8 max-w-3xl mx-auto">
          <div className="glass-panel rounded-2xl p-4 sm:p-5 text-left border border-noir-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-mystery-850 border border-noir-gold/30 flex items-center justify-center text-noir-gold shadow-inner">
                <Fingerprint className="w-6 h-6 text-noir-gold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-slate-100 text-sm sm:text-base">
                    Active Cold Case Example: "The Clockwork Manor Heist"
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  4 Suspects • 7 Forensic Clues • 3 Hidden Deductions
                </p>
              </div>
            </div>
            <Link
              to="/create"
              className="shrink-0 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-mystery-800 hover:bg-noir-gold hover:text-mystery-950 text-slate-200 transition-colors border border-slate-700"
            >
              Simulate Case
            </Link>
          </div>
        </div>
      </div>

      {/* Investigation Protocol */}
      <div id="protocol" className="max-w-6xl mx-auto w-full my-20">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-noir-gold block mb-1">
            Standard Operating Procedures
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100">
            How The Bureau Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Commission The Scenario',
              desc: 'Enter any locked-room enigma, corporate sabotage, or poison mystery with your desired difficulty tier.',
              icon: FileQuestion,
              highlight: 'border-slate-800',
            },
            {
              step: '02',
              title: 'Gemini AI Synthesis',
              desc: 'The neural engine constructs authentic motives, physical anomalies, and a logically verifiable culprit.',
              icon: Sparkles,
              highlight: 'border-noir-gold/30',
            },
            {
              step: '03',
              title: 'Forensic Investigation',
              desc: 'Interrogate suspect profiles, unseal physical clues (+5 pts each), and request notebook hints (-10 pts penalty).',
              icon: Fingerprint,
              highlight: 'border-emerald-500/30',
            },
            {
              step: '04',
              title: 'Formal Indictment',
              desc: 'Identify the culprit in a police lineup. Unmask the true mastermind, read the evidence reasoning, and claim your score.',
              icon: ShieldAlert,
              highlight: 'border-rose-500/30',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel-interactive rounded-2xl p-6 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl font-serif font-black text-noir-gold/30 group-hover:text-noir-gold/60 transition-colors">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-mystery-850 border border-noir-gold/30 flex items-center justify-center text-noir-gold shadow-glow-gold group-hover:border-noir-gold transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans font-light">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Difficulty Tier Classification */}
      <div className="max-w-6xl mx-auto w-full mb-16">
        <div className="text-center mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-noir-gold block mb-1">
            Challenge Ratings
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100">
            Case Difficulty Classification
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Easy Tier */}
          <div className="glass-panel rounded-2xl p-7 border-emerald-500/30 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 mb-4 shadow-glow-emerald">
                APPRENTICE INVESTIGATION
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-100 mb-2">
                Level I: Standard Case
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-sans">
                Clear motive lines and straightforward evidence corroboration.
              </p>
              <ul className="space-y-3 text-xs text-slate-300 font-mono">
                <li className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span>Persons of Interest:</span> <strong className="text-slate-100">3 Suspects</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span>Crime Scene Leads:</span> <strong className="text-slate-100">5 Clues</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span>Notebook Guidance:</span> <strong className="text-slate-100">2 Hints</strong>
                </li>
                <li className="flex justify-between pt-1 text-emerald-400 font-bold">
                  <span>Base Score Reward:</span> <span>100 PTS</span>
                </li>
              </ul>
            </div>
            <Link
              to="/create"
              className="mt-6 w-full py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-center bg-mystery-850 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 transition-colors"
            >
              Select Easy Case
            </Link>
          </div>

          {/* Medium Tier - Recommended */}
          <div className="glass-panel rounded-2xl p-7 border-2 border-noir-gold shadow-glow-gold relative flex flex-col justify-between transform md:-translate-y-2">
            <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-noir-gold text-mystery-950 text-[10px] font-mono font-black tracking-widest shadow-md">
              BUREAU FAVORITE
            </div>
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/80 text-amber-300 border border-noir-gold/40 mb-4">
                SENIOR INVESTIGATOR
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-100 mb-2">
                Level II: Complex Enigma
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-sans">
                Multiple deceptive alibis, circumstantial motives, and forensic contradictions.
              </p>
              <ul className="space-y-3 text-xs text-slate-300 font-mono">
                <li className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span>Persons of Interest:</span> <strong className="text-slate-100">4 Suspects</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span>Crime Scene Leads:</span> <strong className="text-slate-100">7 Clues</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span>Notebook Guidance:</span> <strong className="text-slate-100">3 Hints</strong>
                </li>
                <li className="flex justify-between pt-1 text-noir-gold font-bold">
                  <span>Base Score Reward:</span> <span>150 PTS</span>
                </li>
              </ul>
            </div>
            <Link
              to="/create"
              className="mt-6 w-full py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-center bg-noir-gold hover:bg-noir-goldLight text-mystery-950 shadow-md transition-colors"
            >
              Select Medium Case
            </Link>
          </div>

          {/* Hard Tier */}
          <div className="glass-panel rounded-2xl p-7 border-rose-500/30 hover:border-rose-500/60 transition-all flex flex-col justify-between">
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950/80 text-rose-400 border border-rose-500/40 mb-4 shadow-glow-crimson">
                CHIEF INSPECTOR
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-100 mb-2">
                Level III: Grand Mystery
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-sans">
                Maximum complexity, deceptive red herrings, and subtle physical traces.
              </p>
              <ul className="space-y-3 text-xs text-slate-300 font-mono">
                <li className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span>Persons of Interest:</span> <strong className="text-slate-100">5 Suspects</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span>Crime Scene Leads:</span> <strong className="text-slate-100">9 Clues</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span>Notebook Guidance:</span> <strong className="text-slate-100">3 Hints</strong>
                </li>
                <li className="flex justify-between pt-1 text-rose-400 font-bold">
                  <span>Base Score Reward:</span> <span>200 PTS</span>
                </li>
              </ul>
            </div>
            <Link
              to="/create"
              className="mt-6 w-full py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-center bg-mystery-850 hover:bg-rose-900/40 text-rose-300 border border-rose-500/30 transition-colors"
            >
              Select Hard Case
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="text-center text-xs text-slate-500 font-mono py-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto w-full gap-4">
        <div>AI Mystery Room • Powered by Google Gemini AI & MongoDB Atlas</div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Security Sealed</span>
          <span>•</span>
          <span>Zero Frontend Leakage</span>
          <span>•</span>
          <span>Verified Logic</span>
        </div>
      </footer>
    </div>
  );
};
