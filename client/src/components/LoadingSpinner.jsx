import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Fingerprint, Cpu, ShieldCheck } from 'lucide-react';

const TELEMETRY_STEPS = [
  'Establishing crime scene perimeter and initial timeline...',
  'Synthesizing suspect dossiers, opportunities, and hidden motives...',
  'Simulating forensic inconsistencies and physical trace evidence...',
  'Interlocking progressive detective hints with Gemini AI...',
  'Sealing culprit identity into encrypted bureau vault...',
];

export const LoadingSpinner = ({ message = 'Generating Mystery Case...', subtitle }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % TELEMETRY_STEPS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center overflow-hidden">
      {/* Ambient Radial Spotlight */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

      {/* Futuristic Forensic Reticle Spinner */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Outer Pulsing Aura */}
        <div className="absolute -inset-4 rounded-full bg-noir-gold/15 blur-xl animate-pulse" />
        
        {/* Outer Rotating Segmented Ring */}
        <div className="w-24 h-24 rounded-full border border-noir-gold/20 border-dashed animate-spin [animation-duration:18s]" />

        {/* Inner High-Speed Ring */}
        <div className="absolute w-16 h-16 rounded-full border-2 border-transparent border-t-noir-gold border-r-noir-goldLight animate-spin [animation-duration:1.2s]" />

        {/* Center Forensic Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-noir-gold">
          <Fingerprint className="w-8 h-8 animate-pulse text-noir-gold" />
        </div>
      </div>

      {/* Main Title */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-noir-gold/10 border border-noir-gold/30 text-noir-gold text-xs font-mono uppercase tracking-widest mb-3">
        <Cpu className="w-3.5 h-3.5" />
        <span>Gemini Engine Active</span>
      </div>

      <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mb-2">
        {message}
      </h3>

      {/* Telemetry Progress Bar */}
      <div className="w-full max-w-sm bg-mystery-950 h-1.5 rounded-full overflow-hidden border border-slate-800 my-4 relative">
        <div className="h-full bg-gradient-to-r from-noir-goldDark via-noir-gold to-noir-goldLight rounded-full w-full animate-shimmer bg-[length:200%_100%]" />
      </div>

      {/* Rotating Forensic Telemetry Logs */}
      <p className="text-xs sm:text-sm text-slate-300 font-mono italic max-w-md min-h-[2.5rem] flex items-center justify-center transition-all duration-300">
        "{subtitle || TELEMETRY_STEPS[stepIndex]}"
      </p>
    </div>
  );
};
