import React, { useState } from 'react';
import { ShieldAlert, AlertCircle, X, Check, Loader2, Fingerprint, Lock } from 'lucide-react';
import { SuspectCard } from './SuspectCard';

export const AccusationModal = ({
  isOpen,
  onClose,
  suspects = [],
  onSubmitAccusation,
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedId) {
      setError('You must single out one prime suspect to charge.');
      return;
    }
    if (!confirmed) {
      setError('You must sign the legal affidavit confirmation before closing the case.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await onSubmitAccusation(selectedId);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit accusation');
      setLoading(false);
    }
  };

  const selectedSuspect = suspects.find((s) => s.id === selectedId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-mystery-900 border-2 border-noir-crimson/50 rounded-3xl shadow-glow-crimson p-6 sm:p-8 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-noir-crimson/30">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-noir-crimson/20 border border-noir-crimson/40 flex items-center justify-center text-noir-crimson shadow-glow-crimson">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-black text-slate-100">
                  Official Accusation & Indictment
                </h3>
                <span className="stamp stamp-classified text-[10px] py-0.5 px-2">
                  FINAL WARRANT
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Bureau Case Resolution Protocol #88
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 to-mystery-950 border border-rose-800/40 flex items-start gap-3.5 text-xs text-rose-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="font-sans">
            <strong className="block text-sm font-semibold text-rose-300 mb-0.5">
              Permanent Case Finalization
            </strong>
            Once your accusation is submitted, the docket is sealed forever. The true culprit, solution breakdown, and your score rating will be irreversibly rendered.
          </div>
        </div>

        {/* Suspect Selection Lineup */}
        <div className="my-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-noir-crimson" />
              <span>Select Culprit from Police Lineup:</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {selectedSuspect ? `Target: ${selectedSuspect.name}` : 'No suspect chosen'}
            </span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {suspects.map((suspect, idx) => (
              <SuspectCard
                key={suspect.id}
                suspect={suspect}
                index={idx}
                isSelectable={true}
                isSelected={selectedId === suspect.id}
                onSelect={(id) => {
                  setSelectedId(id);
                  setError(null);
                }}
              />
            ))}
          </div>
        </div>

        {/* Legal Confirmation Checkbox */}
        <div className="my-5 p-4 rounded-xl bg-mystery-950/90 border border-slate-800 hover:border-slate-700 transition-colors">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => {
                setConfirmed(e.target.checked);
                setError(null);
              }}
              className="mt-0.5 w-4 h-4 rounded border-slate-700 text-noir-crimson focus:ring-noir-crimson bg-mystery-900 cursor-pointer"
            />
            <span className="text-xs text-slate-300 leading-relaxed font-sans">
              I formally declare under detective oath that{' '}
              {selectedSuspect ? (
                <strong className="text-noir-gold">{selectedSuspect.name}</strong>
              ) : (
                'the chosen suspect'
              )}{' '}
              committed the crime based on the physical clues and alibi contradictions discovered.
            </span>
          </label>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-xs text-rose-200 font-sans">
            {error}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Review Evidence Again
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || !selectedId || !confirmed}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-noir-crimson via-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-glow-crimson transition-all disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Issuing Indictment...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Execute Final Accusation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
