import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caseApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Sparkles,
  AlertCircle,
  Shield,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  BookOpen,
  FolderPlus,
  Compass,
  Key,
} from 'lucide-react';

const PRESET_CATEGORIES = [
  {
    category: 'Manor Heist',
    title: 'The Clockwork Manor Heist',
    difficulty: 'medium',
    text: 'A priceless sapphire-encrusted mechanical pocket watch vanished from Lord Sterling’s private vault during a storm, with only four dinner guests present.',
  },
  {
    category: 'High-Tech Sabotage',
    title: 'Echoes in the Cryo-Lab',
    difficulty: 'hard',
    text: 'A prominent neuroscientist was found locked inside the deep-freeze chamber at BioCore Labs right before the patent transfer, with all digital security logs wiped.',
  },
  {
    category: 'Classic Poison',
    title: 'Midnight Express Poisoning',
    difficulty: 'easy',
    text: 'A famous wine critic collapsed after tasting the 1945 vintage aboard the high-speed alpine express train, leaving the sommelier and two companions stunned.',
  },
  {
    category: 'Museum Forgery',
    title: 'The Gallery of Vanished Shadows',
    difficulty: 'medium',
    text: 'A revolutionary renaissance masterpiece was replaced with a forged replica during a blackout at the National Heritage Gallery, right under the guards’ noses.',
  },
];

export const CreatePage = () => {
  const navigate = useNavigate();
  const [premise, setPremise] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const charCount = premise.trim().length;
  const isTooShort = charCount > 0 && charCount < 20;
  const isTooLong = charCount > 500;
  const isValid = charCount >= 20 && charCount <= 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      const response = await caseApi.createCase({
        premise: premise.trim(),
        difficulty,
      });

      if (response.success && response.case?.id) {
        navigate(`/room/${response.case.id}`);
      } else {
        throw new Error('Case generated but ID missing from response');
      }
    } catch (err) {
      console.error('Case generation error:', err);
      const serverMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to generate mystery with Gemini. Please try again.';
      setError(serverMsg);
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset) => {
    setPremise(preset.text);
    setDifficulty(preset.difficulty);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
        <div className="max-w-xl w-full glass-panel rounded-3xl p-8 sm:p-12 shadow-dossier border border-noir-gold/30">
          <LoadingSpinner
            message="Gemini AI Is Weaving Your Mystery"
            subtitle="Synthesizing alibis, forensic clues, and a logically verifiable culprit..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mystery-900 border border-noir-gold/30 text-noir-gold text-xs font-mono uppercase tracking-widest mb-3">
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Commission New Case Docket</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
            Draft Case Scenario
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl mx-auto font-sans font-light">
            Describe the crime scenario or choose from the bureau archives below. Gemini AI will architect a watertight case with authentic clues and hidden contradictions.
          </p>
        </div>

        {/* Preset Prompt Buttons */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-bold">
              <Lightbulb className="w-4 h-4 text-noir-gold" />
              <span>Bureau Case Archives (Click to Populate):</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {PRESET_CATEGORIES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-left p-4 rounded-2xl glass-panel-interactive border-slate-800 hover:border-noir-gold/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-noir-gold">
                      {preset.category}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-mystery-950 text-slate-400 border border-slate-800">
                      {preset.difficulty}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-slate-100 group-hover:text-noir-goldLight transition-colors mb-1">
                    {preset.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                    {preset.text}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Creation Form */}
        <form
          onSubmit={handleSubmit}
          className="glass-panel rounded-3xl p-6 sm:p-10 shadow-dossier border border-noir-gold/25 relative overflow-hidden"
        >
          {/* Premise Textarea */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2.5">
              <label
                htmlFor="premise"
                className="text-sm sm:text-base font-bold text-slate-100 font-serif flex items-center gap-2"
              >
                <span>Mystery Premise & Crime Scene Details:</span>
              </label>
              <span
                className={`text-xs font-mono font-bold ${
                  isTooShort || isTooLong ? 'text-noir-crimson' : 'text-slate-400'
                }`}
              >
                {charCount}/500 chars (min 20)
              </span>
            </div>

            <div className="relative">
              <textarea
                id="premise"
                rows={4}
                value={premise}
                onChange={(e) => setPremise(e.target.value)}
                placeholder="E.g., A priceless sapphire-encrusted mechanical pocket watch vanished from Lord Sterling's private vault during a thunderstorm, with only four dinner guests present..."
                className="w-full bg-mystery-950/90 border border-slate-700/80 rounded-2xl p-4 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-noir-gold focus:ring-1 focus:ring-noir-gold transition-all leading-relaxed font-sans"
              />
            </div>

            {isTooShort && (
              <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                Premise must be at least 20 characters long.
              </p>
            )}
            {isTooLong && (
              <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                Premise cannot exceed 500 characters.
              </p>
            )}
          </div>

          {/* Difficulty Tier Selector */}
          <div className="mb-10">
            <label className="block text-sm sm:text-base font-bold text-slate-100 font-serif mb-3">
              Investigation Difficulty:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 'easy',
                  label: 'Easy Tier',
                  spec: '3 Suspects • 5 Clues • 2 Hints',
                  reward: '100 Base Pts',
                  color: 'border-emerald-500 text-emerald-400 ring-emerald-500/30',
                },
                {
                  id: 'medium',
                  label: 'Medium Tier',
                  spec: '4 Suspects • 7 Clues • 3 Hints',
                  reward: '150 Base Pts',
                  color: 'border-noir-gold text-noir-gold ring-noir-gold/30',
                },
                {
                  id: 'hard',
                  label: 'Hard Tier',
                  spec: '5 Suspects • 9 Clues • 3 Hints',
                  reward: '200 Base Pts',
                  color: 'border-rose-500 text-rose-400 ring-rose-500/30',
                },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setDifficulty(tier.id)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    difficulty === tier.id
                      ? `bg-mystery-950/95 ${tier.color} shadow-lg ring-2`
                      : 'bg-mystery-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-serif font-bold text-slate-100 text-base">
                      {tier.label}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                      {tier.reward}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    {tier.spec}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-rose-950/70 to-mystery-950 border border-rose-500/50 flex items-start gap-3.5 text-xs text-rose-200">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-semibold text-rose-300 mb-0.5 font-sans">
                  Generation Request Failed
                </strong>
                <p className="font-sans leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-noir-gold via-amber-400 to-noir-goldDark text-mystery-950 shadow-glow-gold hover:shadow-2xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 font-sans"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Mystery with Gemini</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};
