import React, { useState } from 'react';
import { Eye, Lock, CheckCircle2, Sparkles, Loader2, Fingerprint, Shield, Tag } from 'lucide-react';

export const ClueCard = ({ clue, index, onDiscover, disabled = false }) => {
  const [isDiscovering, setIsDiscovering] = useState(false);

  const handleExamine = async () => {
    if (clue.discovered || isDiscovering || disabled) return;
    setIsDiscovering(true);
    try {
      await onDiscover(clue.id);
    } finally {
      setIsDiscovering(false);
    }
  };

  return (
    <div
      className={`relative rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        clue.discovered
          ? 'glass-panel border-noir-gold/35 shadow-dossier'
          : 'bg-mystery-950/80 border border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Evidence Tag Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                clue.discovered
                  ? 'bg-noir-gold/20 text-noir-gold border border-noir-gold/40 shadow-glow-gold'
                  : 'bg-mystery-850 text-slate-500 border border-slate-800'
              }`}
            >
              #{index + 1}
            </div>
            <h4
              className={`font-serif text-base font-bold transition-colors ${
                clue.discovered ? 'text-slate-100' : 'text-slate-400'
              }`}
            >
              {clue.title}
            </h4>
          </div>

          <div>
            {clue.discovered ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-glow-emerald">
                <CheckCircle2 className="w-3.5 h-3.5" /> +5 PTS
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium tracking-wider bg-mystery-850 text-slate-400 border border-slate-800">
                <Lock className="w-3 h-3 text-slate-500" /> Evidence Sealed
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="my-3">
          {clue.discovered ? (
            <div className="space-y-3 font-sans">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-mystery-950/80 p-3.5 rounded-xl border border-slate-800/80">
                {clue.description}
              </p>

              {clue.evidence && (
                <div className="relative rounded-xl p-3.5 bg-gradient-to-r from-amber-950/20 to-mystery-900 border border-noir-gold/30">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-noir-gold uppercase tracking-widest mb-1.5">
                    <Fingerprint className="w-3.5 h-3.5" />
                    Forensic Deduction
                  </div>
                  <p className="text-xs text-amber-100/90 leading-relaxed font-sans">
                    {clue.evidence}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-7 px-4 text-center border border-dashed border-slate-800 rounded-xl bg-mystery-950/40 relative group">
              <Eye className="w-6 h-6 text-slate-600 mx-auto mb-2 group-hover:text-noir-gold/50 transition-colors" />
              <p className="text-xs text-slate-400 font-mono">
                Classified forensic material. Unseal to inspect.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      {!clue.discovered && (
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <button
            onClick={handleExamine}
            disabled={isDiscovering || disabled}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold font-mono uppercase tracking-wider bg-gradient-to-r from-mystery-850 to-mystery-800 hover:from-noir-gold hover:to-amber-500 text-slate-200 hover:text-mystery-950 border border-slate-700 hover:border-noir-gold shadow-sm hover:shadow-glow-gold transition-all duration-300 disabled:opacity-50"
          >
            {isDiscovering ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-noir-gold" />
                <span>Forensic Lab Scanning...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-noir-gold group-hover:text-mystery-950" />
                <span>Examine Lead (+5 Pts)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
