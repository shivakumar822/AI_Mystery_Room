import React from 'react';
import { User, Clock, AlertCircle, ShieldAlert, CheckCircle2, FileSearch } from 'lucide-react';

export const SuspectCard = ({
  suspect,
  index,
  isSelectable = false,
  isSelected = false,
  onSelect,
}) => {
  return (
    <div
      onClick={() => isSelectable && onSelect && onSelect(suspect.id)}
      className={`group relative rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between ${
        isSelectable ? 'cursor-pointer' : ''
      } ${
        isSelected
          ? 'bg-mystery-900/95 border-2 border-noir-crimson shadow-glow-crimson ring-2 ring-noir-crimson/50 transform -translate-y-1'
          : 'glass-panel-interactive hover:border-noir-gold/40'
      }`}
    >
      {/* Top Banner Tag */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-serif font-black text-lg transition-colors shadow-inner ${
              isSelected
                ? 'bg-noir-crimson text-white'
                : 'bg-mystery-850 border border-noir-gold/30 text-noir-gold group-hover:border-noir-gold'
            }`}
          >
            0{index + 1}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-serif text-lg font-bold text-slate-100 group-hover:text-noir-gold transition-colors">
                {suspect.name}
              </h4>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
              Dossier Ref: {suspect.id}
            </span>
          </div>
        </div>

        {/* Selection Indicator */}
        {isSelectable ? (
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-noir-crimson border-noir-crimson text-white shadow-glow-crimson'
                : 'border-slate-600 group-hover:border-noir-gold bg-mystery-950'
            }`}
          >
            {isSelected && <CheckCircle2 className="w-4 h-4" />}
          </div>
        ) : (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-mystery-950 text-slate-400 border border-slate-800">
            Interviewed
          </span>
        )}
      </div>

      {/* Selected Stamp */}
      {isSelected && (
        <div className="absolute top-3 right-10">
          <span className="stamp stamp-classified text-[10px] py-0.5 px-2">
            TARGETED ACCUSATION
          </span>
        </div>
      )}

      {/* Background / Role Description */}
      <div className="mb-4">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-mystery-950/70 p-3.5 rounded-xl border border-slate-800/80 font-sans">
          {suspect.description}
        </p>
      </div>

      {/* Alibi & Motive Dossier Grid */}
      <div className="space-y-2.5 pt-3 border-t border-slate-800/80 text-xs font-sans">
        {/* Claimed Alibi */}
        <div className="flex items-start gap-2.5 bg-mystery-950/40 p-2.5 rounded-lg border border-slate-800/60">
          <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <span className="font-mono text-[10px] font-bold text-amber-300 uppercase tracking-widest block mb-0.5">
              Claimed Whereabouts / Alibi
            </span>
            <span className="text-slate-300 text-xs">{suspect.alibi}</span>
          </div>
        </div>

        {/* Suspicious Motive */}
        {suspect.motive && (
          <div className="flex items-start gap-2.5 bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/40">
            <AlertCircle className="w-4 h-4 text-noir-crimson shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="font-mono text-[10px] font-bold text-rose-400 uppercase tracking-widest block mb-0.5">
                Suspected Motive
              </span>
              <span className="text-slate-300 text-xs">{suspect.motive}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
