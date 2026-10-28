import React from 'react';
import { Sparkles, ArrowRight, Shield, Globe, Coins, Wallet, CheckCircle2, Music2 } from 'lucide-react';
import { Track } from '../types';

interface HeroBannerProps {
  artistName: string;
  featuredTrack?: Track;
  onSelectTrack: (track: Track) => void;
  onOpenHowItWorks: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  genres: string[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  artistName,
  featuredTrack,
  onSelectTrack,
  onOpenHowItWorks,
  searchQuery,
  onSearchChange,
  selectedGenre,
  onSelectGenre,
  genres,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-slate-800/60 bg-gradient-to-b from-[#0e1320] via-[#090b10] to-[#090b10]">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Badges for Accepted Currencies */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mr-1">
            Accepted Payments:
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Local Bank & Mobile Money
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
            <Globe className="w-3.5 h-3.5 text-blue-400" /> International (PayPal / Wise)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Coins className="w-3.5 h-3.5 text-amber-400" /> Pi Network (Pi Browser)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <Wallet className="w-3.5 h-3.5 text-purple-400" /> Sidra Chain & Sidra Bank
          </span>
        </div>

        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 mb-4 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Automated Verification & Instant WhatsApp Code Delivery</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Direct Music Release Hub for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">{artistName}</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-6 leading-relaxed">
            Support the artist directly with zero streaming intermediary cuts. Pay via Local Bank, Mobile Money, PayPal, Pi Network, or Sidra Chain — get your automated download code via WhatsApp or instant verification to unlock high-fidelity studio WAV & MP3 master files.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenHowItWorks}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-medium text-sm border border-slate-700 transition-all hover:border-slate-500 shadow-md"
            >
              <span>See How It Works</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 px-3 py-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Studio 24-Bit Masters + DJ Stems + Artwork</span>
            </div>
          </div>
        </div>

        {/* Featured Spotlight (if available) */}
        {featuredTrack && (
          <div className="mb-10 max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900/80 to-indigo-950/30 border border-emerald-500/20 p-4 sm:p-6 backdrop-blur-sm shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-xl overflow-hidden shadow-lg border border-slate-700">
                <img
                  src={featuredTrack.coverUrl}
                  alt={featuredTrack.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950">
                  Featured
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Latest Exclusive Release
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400">{featuredTrack.genre}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400">{featuredTrack.duration}</span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2">
                  {featuredTrack.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-3">
                  {featuredTrack.description}
                </p>

                {/* Price indicators */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs font-mono mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-emerald-300 border border-emerald-500/30">
                    {featuredTrack.localCurrencySymbol}{featuredTrack.priceLocal.toLocaleString()}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-blue-300 border border-blue-500/30">
                    ${featuredTrack.priceUSD.toFixed(2)} USD
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-amber-300 border border-amber-500/30">
                    {featuredTrack.pricePi} Pi
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-purple-300 border border-purple-500/30">
                    {featuredTrack.priceSidra} Sidra
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    onClick={() => onSelectTrack(featuredTrack)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-emerald-500/20"
                  >
                    <span>Get Track & Download Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Genre Filters */}
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-72 shrink-0">
            <input
              type="text"
              placeholder="Search tracks, genre, lyrics..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <Music2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => onSelectGenre(genre)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedGenre === genre
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
