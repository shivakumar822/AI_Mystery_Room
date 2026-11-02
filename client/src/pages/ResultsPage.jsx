import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { caseApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  UserCheck,
  UserX,
  FileText,
  Fingerprint,
  Lightbulb,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await caseApi.getCaseResult(id);
        if (res.success && res.result) {
          setResult(res.result);
        } else {
          throw new Error('Case result not found');
        }
      } catch (err) {
        console.error('Fetch result error:', err);
        if (err.response?.status === 400 && err.response?.data?.message?.includes('active')) {
          navigate(`/room/${id}`, { replace: true });
          return;
        }
        setError(err.response?.data?.message || err.message || 'Failed to retrieve case results');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
        <LoadingSpinner
          message="Auditing Forensic Verdict"
          subtitle="Verifying accusation against sealed physical evidence..."
        />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel border border-rose-500/40 rounded-3xl p-8 text-center shadow-dossier">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="font-serif text-2xl font-bold text-slate-100 mb-2">
            Verdict Inaccessible
          </h2>
          <p className="text-xs text-rose-300 font-mono mb-6">{error}</p>
          <button
            onClick={() => navigate('/create')}
            className="w-full py-3 rounded-xl bg-mystery-850 text-xs font-mono font-bold uppercase tracking-wider text-slate-200 border border-slate-700 transition-colors"
          >
            Start New Mystery
          </button>
        </div>
      </div>
    );
  }

  const isSolved = result.correct;

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Grand Verdict Stamp Banner */}
        <div
          className={`rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl backdrop-blur-xl border-2 ${
            isSolved
              ? 'bg-gradient-to-b from-emerald-950/50 via-mystery-900/90 to-mystery-950 border-emerald-500/50 shadow-glow-emerald'
              : 'bg-gradient-to-b from-rose-950/50 via-mystery-900/90 to-mystery-950 border-rose-500/50 shadow-glow-crimson'
          }`}
        >
          {/* Animated Stamp Effect */}
          <div className="mb-4">
            <span
              className={`stamp text-sm sm:text-base py-1 px-4 ${
                isSolved ? 'stamp-solved' : 'stamp-classified'
              }`}
            >
              {isSolved ? 'CASE OFFICIALLY SOLVED' : 'COLD CASE • WRONGFUL ACCUSATION'}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-black text-slate-100 tracking-tight mb-3">
            {isSolved ? 'GUILTY AS CHARGED!' : 'THE CULPRIT ESCAPED!'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-sans font-light">
            {isSolved
              ? 'Your forensic deduction matched the evidence flawlessly. The perpetrator has been officially indicted by the Bureau.'
              : 'An innocent suspect was indicted. The true mastermind successfully exploited their alibi and vanished into the shadows.'}
          </p>

          {/* Final Score Ledger Card */}
          <div className="mt-8 pt-8 border-t border-slate-800/80 inline-block">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-2">
              Final Bureau Score Assessment
            </span>
            <div className="flex items-center justify-center gap-3">
              <Award className={`w-9 h-9 ${isSolved ? 'text-noir-gold animate-bounce' : 'text-slate-500'}`} />
              <span className="font-serif text-5xl sm:text-6xl font-black text-slate-100">
                {result.score}
              </span>
              <span className="text-sm font-mono text-slate-400 self-end mb-2">PTS</span>
            </div>
          </div>
        </div>

        {/* Accusation vs Actual Culprit Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Accused Suspect */}
          <div className="glass-panel rounded-2xl p-6 sm:p-7 border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
              <UserCheck className="w-4 h-4 text-slate-400" />
              <span>Your Official Accusation</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-100 mb-2">
              {result.playerAccusation}
            </h3>
            {result.playerAccusedDetails && (
              <p className="text-xs text-slate-300 bg-mystery-950/80 p-3.5 rounded-xl border border-slate-800 font-sans leading-relaxed">
                {result.playerAccusedDetails.description}
              </p>
            )}
          </div>

          {/* Actual Culprit */}
          <div
            className={`rounded-2xl p-6 sm:p-7 border-2 ${
              isSolved
                ? 'bg-emerald-950/20 border-emerald-500/40 shadow-glow-emerald'
                : 'bg-rose-950/20 border-rose-500/40 shadow-glow-crimson'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-noir-gold font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>The True Mastermind</span>
              </span>
              <span className="stamp text-[10px] py-0.5 px-2">
                {isSolved ? 'CORRECT MATCH' : 'TRUE CULPRIT'}
              </span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-100 mb-2">
              {result.culprit}
            </h3>
            {result.culpritDetails && (
              <p className="text-xs text-slate-300 bg-mystery-950/80 p-3.5 rounded-xl border border-slate-800 font-sans leading-relaxed">
                {result.culpritDetails.description}
              </p>
            )}
          </div>
        </div>

        {/* Forensic Score Breakdown Table */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-noir-gold/25 shadow-dossier">
          <div className="flex items-center gap-2.5 mb-5 border-b border-slate-800 pb-4">
            <Award className="w-5 h-5 text-noir-gold" />
            <h3 className="font-serif text-xl font-bold text-slate-100">
              Official Bureau Score Ledger
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs sm:text-sm">
            <div className="flex justify-between py-2.5 border-b border-slate-800/80 text-slate-300">
              <span>Difficulty Base Points ({result.difficulty?.toUpperCase()} Tier):</span>
              <strong className={isSolved ? 'text-slate-100' : 'text-slate-500'}>
                {isSolved
                  ? result.difficulty === 'hard'
                    ? 200
                    : result.difficulty === 'medium'
                    ? 150
                    : 100
                  : 0}{' '}
                pts
              </strong>
            </div>
            <div className="flex justify-between py-2.5 border-b border-slate-800/80 text-slate-300">
              <span>
                Evidence Discovered ({result.discoveredCluesCount} of {result.totalCluesCount} × 5 pts):
              </span>
              <strong className="text-emerald-400">+{result.discoveredCluesCount * 5} pts</strong>
            </div>
            <div className="flex justify-between py-2.5 border-b border-slate-800/80 text-slate-300">
              <span>Hints Deductions ({result.hintsUsed} requested × -10 pts):</span>
              <strong className="text-rose-400">-{result.hintsUsed * 10} pts</strong>
            </div>
            <div className="flex justify-between pt-3 text-base text-slate-100 font-bold border-t border-slate-700">
              <span>Net Bureau Score:</span>
              <span className="text-noir-gold text-xl font-serif">{result.score} PTS</span>
            </div>
          </div>
        </div>

        {/* Detailed Forensic Explanation & Reasoning */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-noir-gold/25 shadow-dossier space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-noir-gold font-bold mb-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Case Resolution Dossier</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-100">
              How The Mystery Was Solved
            </h2>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-mystery-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line shadow-inner">
            {result.explanation}
          </div>

          {result.reasoning?.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
                Forensic Deductions That Cracked The Alibi:
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-sans">
                {result.reasoning.map((reason, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-mystery-950/60 border border-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-noir-gold shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Play Again CTA */}
        <div className="text-center pt-6">
          <Link
            to="/create"
            className="inline-flex items-center justify-center gap-3 px-9 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-noir-gold via-amber-400 to-noir-goldDark text-mystery-950 shadow-glow-gold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Investigate Another Mystery</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
