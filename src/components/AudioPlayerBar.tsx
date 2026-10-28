import React from 'react';
import { Play, Pause, Square, Volume2, KeyRound, ShoppingBag, Disc } from 'lucide-react';
import { Track } from '../types';

interface AudioPlayerBarProps {
  track: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
  onOpenPayment: (track: Track) => void;
  onOpenUnlock: (track: Track) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  track,
  isPlaying,
  onTogglePlay,
  onStop,
  onOpenPayment,
  onOpenUnlock,
}) => {
  if (!track) return null;

  return (
    <aside aria-label="Audio Preview Player" className="fixed bottom-0 left-0 right-0 z-30 bg-[#0c0f17]/95 border-t border-emerald-500/30 backdrop-blur-lg px-4 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Track Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-slate-900">
            <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
            {isPlaying && (
              <div className="absolute inset-0 bg-emerald-950/60 flex items-center justify-center">
                <Disc className="w-6 h-6 text-emerald-400 animate-spin" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-[280px]">
                {track.title}
              </h4>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PREVIEW
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate">
              {track.artist} • <span className="text-slate-300">{track.album}</span>
            </p>
          </div>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? "Pause Preview" : "Resume Preview"}
            className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-transform active:scale-95 shadow-md shadow-emerald-500/30"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>
          <button
            onClick={onStop}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Stop Preview"
            aria-label="Stop Preview"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>

          {/* Equalizer animation */}
          <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-mono text-emerald-400 mr-2">{track.duration}</span>
            <div className="flex items-end gap-0.5 h-4 w-16">
              {[...Array(8)].map((_, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isPlaying ? 'bg-emerald-400' : 'bg-slate-700'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.floor(20 + Math.random() * 80)}%` : '20%',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right side CTAs */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => onOpenPayment(track)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buy ({track.localCurrencySymbol}{track.priceLocal.toLocaleString()})</span>
          </button>

          <button
            onClick={() => onOpenUnlock(track)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>Unlock</span>
          </button>
        </div>

      </div>
    </aside>
  );
};
