import React, { useState } from 'react';
import { Lightbulb, AlertTriangle, X, Loader2, CheckCircle2, BookOpen, ShieldAlert } from 'lucide-react';

export const HintModal = ({
  isOpen,
  onClose,
  revealedHints = [],
  hintsRemaining = 0,
  onRequestHint,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRequest = async () => {
    if (hintsRemaining <= 0 || loading || disabled) return;
    setLoading(true);
    try {
      await onRequestHint();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl shadow-dossier overflow-hidden p-6 sm:p-7 border border-noir-gold/30">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-noir-gold/20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-noir-gold/10 border border-noir-gold/30 flex items-center justify-center text-noir-gold shadow-glow-gold">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-100">
                Detective's Dossier & Hints
              </h3>
              <p className="text-xs font-mono text-slate-400">
                {hintsRemaining} classified hint{hintsRemaining === 1 ? '' : 's'} remaining
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Penalty Warning */}
        <div className="my-4 p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/30 flex items-center gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Bureau Rule: Each hint request incurs a penalty of <strong>-10 points</strong> from your final verdict.
          </span>
        </div>

        {/* Revealed Hints List */}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1 my-4">
          {revealedHints.length === 0 ? (
            <div className="text-center py-8 text-xs sm:text-sm text-slate-500 font-mono border border-dashed border-slate-800 rounded-xl">
              No hints decrypted yet. Examine crime clues first or unlock guidance below.
            </div>
          ) : (
            revealedHints.map((hint, idx) => (
              <div
                key={idx}
                className="bg-mystery-950/90 p-4 rounded-xl border border-noir-gold/25 text-xs sm:text-sm text-slate-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono text-noir-gold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-noir-gold" />
                    Decrypted Clue #{idx + 1}
                  </span>
                  <span className="text-rose-400 font-mono">-10 PTS</span>
                </div>
                <p className="leading-relaxed font-sans">{hint}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Close Notebook
          </button>

          <button
            onClick={handleRequest}
            disabled={hintsRemaining <= 0 || loading || disabled}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-noir-gold to-amber-500 hover:from-noir-goldLight hover:to-noir-gold text-mystery-950 transition-all shadow-glow-gold disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Decrypting Hint...</span>
              </>
            ) : hintsRemaining > 0 ? (
              <>
                <Lightbulb className="w-4 h-4" />
                <span>Unlock Next Hint (-10 pts)</span>
              </>
            ) : (
              <span>All Hints Exhausted</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
