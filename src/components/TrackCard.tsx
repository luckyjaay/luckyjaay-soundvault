import React, { useState } from 'react';
import { Play, Pause, Download, ChevronDown, ChevronUp, FileAudio, Disc, Flame, Sparkles, Music } from 'lucide-react';
import { Track } from '../types';

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  secondsRemaining?: number;
  hasPreviewEnded?: boolean;
  onTogglePlay: (track: Track) => void;
  onOpenPayment: (track: Track) => void;
  onOpenUnlock: (track: Track) => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  isPlaying,
  secondsRemaining = 30,
  hasPreviewEnded = false,
  onTogglePlay,
  onOpenPayment,
  onOpenUnlock,
}) => {
  const [showLyrics, setShowLyrics] = useState(false);

  return (
    <div className="group relative rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-emerald-950/20">
      
      {/* Top Header Card Strip: Song Badge, Genre & Duration (NO Picture Box!) */}
      <div className="p-4 sm:p-5 pb-3 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Music className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-300 truncate">{track.artist}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {track.genre}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 bg-slate-900 border border-slate-700/60">
              {track.duration}
            </span>
          </div>
        </div>

        {/* Track Title */}
        <h3 className="font-heading text-lg sm:text-xl font-black text-white group-hover:text-emerald-300 transition-colors tracking-tight">
          {track.title}
        </h3>

        {track.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {track.description}
          </p>
        )}
      </div>

      {/* Playing Audio Countdown & Live Waveform Indicator */}
      {isPlaying && (
        <div className="mx-4 mt-3 flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-950/90 border border-emerald-500/50 backdrop-blur-md shadow-lg animate-pulse">
          <span className="text-xs font-semibold text-emerald-300 flex items-center gap-2 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>30s Preview: {secondsRemaining}s remaining</span>
          </span>
          <div className="flex items-end gap-1 h-4">
            <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-full" />
            <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-2/3 delay-75" />
            <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-4/5 delay-150" />
            <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-1/2 delay-100" />
          </div>
        </div>
      )}

      {/* Shaking Alert Banner when preview has ended */}
      {hasPreviewEnded && !isPlaying && (
        <div className="mx-4 mt-3 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-400 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg animate-pulse">
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Preview Ended • Download Full Song Below!</span>
        </div>
      )}

      {/* Middle Section: Audio Format & File Details */}
      <div className="p-4 sm:p-5 pt-3 flex-1 flex flex-col justify-between space-y-3">
        <div className="py-2 px-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <FileAudio className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-slate-200">{track.fileFormat}</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">{track.fileSize}</span>
        </div>

        {/* Action Buttons: 30s Play Preview + Shaking "Download Full Song Here" */}
        <div className="space-y-2.5">
          {/* Button 1: 30sec Play Preview Button */}
          <button
            type="button"
            onClick={() => onTogglePlay(track)}
            className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-emerald-500/50'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current text-slate-950" />
                <span>Pause Preview ({secondsRemaining}s)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-emerald-400" />
                <span>30-Sec Play Preview</span>
              </>
            )}
          </button>

          {/* Button 2: "Download Full Song Here" (starts shaking immediately preview ends!) */}
          <button
            type="button"
            onClick={() => onOpenPayment(track)}
            className={`w-full relative inline-flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer ${
              hasPreviewEnded
                ? 'bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-400 text-slate-950 shadow-emerald-500/40 ring-4 ring-amber-400/50 animate-shake-pulse'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Download Full Song Here</span>
            {hasPreviewEnded && (
              <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-400 text-slate-950 shadow-md">
                UNFREEZE FULL SONG
              </span>
            )}
          </button>

          {/* Enter Download Code link */}
          <button
            type="button"
            onClick={() => onOpenUnlock(track)}
            className="w-full text-center text-[11px] text-slate-400 hover:text-emerald-300 transition-colors pt-0.5 cursor-pointer"
          >
            Already have a download code? <span className="underline font-semibold text-emerald-400">Unlock & Download</span>
          </button>

          {/* Lyrics toggle */}
          {track.lyrics && (
            <button
              type="button"
              onClick={() => setShowLyrics(!showLyrics)}
              className="w-full pt-1 flex items-center justify-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <span>{showLyrics ? 'Hide Lyrics' : 'View Lyrics'}</span>
              {showLyrics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          {showLyrics && track.lyrics && (
            <div className="mt-2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-line max-h-44 overflow-y-auto">
              {track.lyrics}
            </div>
          )}
        </div>
      </div>

      {/* Counter badges at bottom: play counter and download counter */}
      <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Disc className="w-3.5 h-3.5 text-blue-400" />
          <span>{(track.playsCount || 0).toLocaleString()} plays</span>
        </span>
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <Flame className="w-3.5 h-3.5 text-emerald-400" />
          <span>{track.totalDownloads.toLocaleString()} downloads</span>
        </span>
      </div>

    </div>
  );
};
