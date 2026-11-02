import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { caseApi } from '../services/api';
import { SuspectCard } from '../components/SuspectCard';
import { ClueCard } from '../components/ClueCard';
import { HintModal } from '../components/HintModal';
import { AccusationModal } from '../components/AccusationModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  FileText,
  User,
  Fingerprint,
  Lightbulb,
  ShieldAlert,
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  Lock,
  Search,
  FolderOpen,
} from 'lucide-react';

export const RoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isAccuseModalOpen, setIsAccuseModalOpen] = useState(false);

  const loadCase = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await caseApi.getCase(id);

      if (res.success && res.case) {
        if (res.case.status === 'completed') {
          navigate(`/room/${id}/results`, { replace: true });
          return;
        }
        setCaseData(res.case);
      } else {
        throw new Error('Case not found');
      }
    } catch (err) {
      console.error('Failed to load case:', err);
      setError(err.response?.data?.message || err.message || 'Error loading case docket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCase();
  }, [id]);

  const handleDiscoverClue = async (clueId) => {
    try {
      const res = await caseApi.discoverClue(id, clueId);
      if (res.success && res.clue) {
        setCaseData((prev) => {
          if (!prev) return prev;
          const updatedClues = prev.clues.map((c) =>
            c.id === clueId ? { ...res.clue } : c
          );
          return {
            ...prev,
            clues: updatedClues,
            discoveredClueIds: res.discoveredClueIds || [...prev.discoveredClueIds, clueId],
          };
        });
      }
    } catch (err) {
      console.error('Discover clue error:', err);
      alert(err.response?.data?.message || 'Failed to examine clue');
    }
  };

  const handleRequestHint = async () => {
    try {
      const res = await caseApi.requestHint(id);
      if (res.success && res.hint) {
        setCaseData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            hintsUsed: res.hintsUsed,
            hintsRemaining: res.hintsRemaining,
            revealedHints: [...(prev.revealedHints || []), res.hint],
          };
        });
      }
    } catch (err) {
      console.error('Request hint error:', err);
      alert(err.response?.data?.message || 'Failed to request hint');
    }
  };

  const handleSubmitAccusation = async (suspectId) => {
    const res = await caseApi.submitAccusation(id, suspectId);
    if (res.success) {
      navigate(`/room/${id}/results`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
        <LoadingSpinner
          message="Retrieving Bureau Case File"
          subtitle="Decrypting evidence manifests and suspect testimonies..."
        />
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel border border-rose-500/40 rounded-3xl p-8 text-center shadow-dossier">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="font-serif text-2xl font-bold text-slate-100 mb-2">
            Docket Access Restricted
          </h2>
          <p className="text-xs text-rose-300 font-mono mb-6">{error || 'Unable to open case file'}</p>
          <button
            onClick={() => navigate('/create')}
            className="w-full py-3 rounded-xl bg-mystery-850 hover:bg-mystery-800 text-xs font-mono font-bold uppercase tracking-wider text-slate-200 border border-slate-700 transition-colors"
          >
            Commission New Case
          </button>
        </div>
      </div>
    );
  }

  const discoveredCount = (caseData.discoveredClueIds || []).length;
  const totalClues = (caseData.clues || []).length;
  const progressPercent = totalClues > 0 ? Math.round((discoveredCount / totalClues) * 100) : 0;

  return (
    <div className="min-h-[calc(100vh-5rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Case File Header Dossier */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-dossier border border-noir-gold/30 relative overflow-hidden">
          {/* Top Dossier Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-noir-gold/15 pb-7 mb-7">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="px-3 py-1 rounded-md bg-mystery-950 border border-noir-gold/40 text-[11px] font-mono font-bold text-noir-gold uppercase tracking-wider shadow-inner">
                  Docket #{caseData.id?.slice(-8).toUpperCase() || 'ACTIVE'}
                </span>
                <span className="px-3 py-1 rounded-md bg-amber-950/70 border border-amber-600/40 text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                  Tier: {caseData.difficulty}
                </span>
                <span className="stamp stamp-classified text-[10px] py-0.5 px-2">
                  ACTIVE INVESTIGATION
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
                {caseData.title}
              </h1>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsHintModalOpen(true)}
                className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-mystery-850 hover:bg-mystery-800 text-noir-gold border border-noir-gold/30 hover:border-noir-gold transition-all shadow-md"
              >
                <Lightbulb className="w-4 h-4 text-noir-gold" />
                <span>Hints ({caseData.hintsRemaining} remaining)</span>
              </button>

              <button
                onClick={() => setIsAccuseModalOpen(true)}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-noir-crimson to-rose-600 hover:from-rose-500 hover:to-rose-600 text-white shadow-glow-crimson transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Make Accusation</span>
              </button>
            </div>
          </div>

          {/* Incident Story & Victim Dossier */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-noir-gold font-bold">
                <FileText className="w-4 h-4" />
                <span>Incident Briefing</span>
              </div>
              <div className="text-sm text-slate-200 leading-relaxed bg-mystery-950/70 p-5 rounded-2xl border border-slate-800 font-sans whitespace-pre-line shadow-inner">
                {caseData.story}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-400 font-bold">
                <User className="w-4 h-4" />
                <span>Victim Dossier</span>
              </div>
              <div className="bg-mystery-950/70 p-5 rounded-2xl border border-slate-800 space-y-2 shadow-inner">
                <h4 className="font-serif text-xl font-bold text-slate-100">
                  {caseData.victim?.name}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans font-light">
                  {caseData.victim?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Realtime Forensic Progress Bar */}
          <div className="mt-8 pt-7 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4 text-noir-gold" />
                Evidence Examined: <strong className="text-slate-100">{discoveredCount} of {totalClues}</strong> ({progressPercent}%)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Hints Used: <strong className="text-slate-100">{caseData.hintsUsed || 0}</strong> (-{(caseData.hintsUsed || 0) * 10} pts)
              </span>
            </div>

            <div className="w-full sm:w-72 bg-mystery-950 rounded-full h-3 border border-slate-800 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-noir-goldDark to-noir-gold h-full rounded-full transition-all duration-700 shadow-glow-gold"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Suspects Section */}
        <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-mystery-850 border border-noir-gold/30 flex items-center justify-center text-noir-gold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-100">
                  Persons of Interest & Suspect Lineup
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Cross-examine alibis and uncover hidden motives
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-mystery-900 border border-slate-800 text-slate-300">
              {caseData.suspects?.length} Suspects Identified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {caseData.suspects?.map((suspect, idx) => (
              <SuspectCard key={suspect.id} suspect={suspect} index={idx} />
            ))}
          </div>
        </section>

        {/* Clues Evidence Board Section */}
        <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-mystery-850 border border-noir-gold/30 flex items-center justify-center text-noir-gold">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-100">
                  Crime Scene Physical Leads & Traces
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Each unsealed clue reveals forensic deduction (+5 pts)
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-mystery-900 border border-slate-800 text-emerald-400">
              {discoveredCount}/{totalClues} Discovered
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {caseData.clues?.map((clue, idx) => (
              <ClueCard
                key={clue.id}
                clue={clue}
                index={idx}
                onDiscover={handleDiscoverClue}
              />
            ))}
          </div>
        </section>

        {/* Floating Mobile Accusation CTA */}
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-40">
          <button
            onClick={() => setIsAccuseModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-noir-crimson to-rose-600 text-white font-mono font-bold text-sm shadow-glow-crimson"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>Make Final Accusation</span>
          </button>
        </div>

        {/* Modals */}
        <HintModal
          isOpen={isHintModalOpen}
          onClose={() => setIsHintModalOpen(false)}
          revealedHints={caseData.revealedHints || []}
          hintsRemaining={caseData.hintsRemaining || 0}
          onRequestHint={handleRequestHint}
        />

        <AccusationModal
          isOpen={isAccuseModalOpen}
          onClose={() => setIsAccuseModalOpen(false)}
          suspects={caseData.suspects || []}
          onSubmitAccusation={handleSubmitAccusation}
        />
      </div>
    </div>
  );
};
