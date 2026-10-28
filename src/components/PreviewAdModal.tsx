import React, { useState, useEffect } from 'react';
import { X, Play, Music, Sparkles, Volume2, ShieldCheck, Clock } from 'lucide-react';
import { Track } from '../types';
import { AdsterraPreviewBanner, AdsterraRectangleBanner } from './AdsterraAd';

interface PreviewAdModalProps {
  isOpen: boolean;
  track: Track | null;
  onAdComplete: (track: Track) => void;
  onClose: () => void;
}

export const PreviewAdModal: React.FC<PreviewAdModalProps> = ({
  isOpen,
  track,
  onAdComplete,
  onClose,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  // Reset timer whenever modal opens for a track
  useEffect(() => {
    if (isOpen && track) {
      setSecondsRemaining(5);
      setCanSkip(false);

      const interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanSkip(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, track]);

  // When timer reaches 0, auto-transition to song playback after brief delay or user click
  useEffect(() => {
    if (isOpen && track && secondsRemaining === 0) {
      const autoPlayTimeout = setTimeout(() => {
        onAdComplete(track);
      }, 800);
      return () => clearTimeout(autoPlayTimeout);
    }
  }, [secondsRemaining, isOpen, track, onAdComplete]);

  if (!isOpen || !track) return null;

  const handleStartListening = () => {
    onAdComplete(track);
  };

  const progressPercent = ((5 - secondsRemaining) / 5) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-900 via-[#0d121f] to-slate-950 border border-emerald-500/40 shadow-2xl shadow-emerald-950/50 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="relative px-5 py-4 border-b border-slate-800/80 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Volume2 className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-black text-white tracking-wide uppercase flex items-center gap-1.5">
                <span>Audio Preview Starting</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </h3>
              <p className="text-[11px] text-slate-400">
                Sponsored sponsor ad • Song unlocks in {secondsRemaining}s
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5-Second Countdown Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Track Info Badge */}
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                <Music className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  Preparing 30s Master Preview
                </p>
                <h4 className="text-sm font-bold text-white truncate">{track.title}</h4>
                <p className="text-xs text-slate-400 truncate">{track.artist} • {track.genre}</p>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className="shrink-0 flex flex-col items-center justify-center px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/40">
              <div className="flex items-center gap-1 text-emerald-400 font-mono font-black text-base">
                <Clock className="w-3.5 h-3.5" />
                <span>{secondsRemaining}s</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                {secondsRemaining > 0 ? 'Wait' : 'Ready'}
              </span>
            </div>
          </div>

          {/* PRIMARY REQUIRED AD: Adsterra Preview Banner (320x50) */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-inner flex flex-col items-center">
            <AdsterraPreviewBanner
              label="Sponsored Preview Ad (320x50)"
              className="w-full"
            />
          </div>

          {/* SECONDARY REQUIRED AD: Adsterra Rectangle (300x250) for maximum sponsor visibility */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-inner flex flex-col items-center">
            <AdsterraRectangleBanner
              label="Featured Sponsor Ad (300x250)"
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1 text-emerald-400/90">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Music Sponsorship</span>
            </span>
            <span>Supports Lucky Jaay Music</span>
          </div>
        </div>

        {/* Footer with Action Button */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>

          {canSkip || secondsRemaining === 0 ? (
            <button
              type="button"
              onClick={handleStartListening}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer animate-pulse"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Listening (30s) Now</span>
            </button>
          ) : (
            <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800/80 text-slate-400 font-bold text-xs uppercase tracking-wider border border-slate-700/60 cursor-not-allowed">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Song preview in {secondsRemaining}s...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
