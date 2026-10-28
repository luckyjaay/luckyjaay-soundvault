/**
 * SoundVault - Direct Music & Manual Payment Hub
 * Exclusive releases by Lucky Elisha with manual Local, International, Pi Network, and Sidra payments,
 * automated verification, WhatsApp delivery, and editable download codes in a secure admin panel.
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TrackCard } from './components/TrackCard';
import { PaymentModal } from './components/PaymentModal';
import { CodeUnlockModal } from './components/CodeUnlockModal';
import { AdminPanel } from './components/AdminPanel';
import { HowItWorksModal } from './components/HowItWorksModal';
import { AboutModal } from './components/AboutModal';
import { SupportCareerModal } from './components/SupportCareerModal';
import { PreviewAdModal } from './components/PreviewAdModal';
import { AdsterraRectangleBanner, AdsterraPreviewBanner } from './components/AdsterraAd';

import { Track, DownloadCode, PaymentConfig, PaymentSubmission } from './types';
import {
  getStoredTracks,
  saveTracks,
  getStoredCodes,
  saveCodes,
  getStoredPaymentConfig,
  savePaymentConfig,
  getStoredSubmissions,
  saveSubmissions,
  getAdminPin,
  saveAdminPin,
  resetAllDataToDefault,
  getStoredUniversalCode,
  saveUniversalCode,
} from './utils/storage';
import { playTrackPreview, stopCurrentAudio } from './utils/audioSynth';
import { Music, Disc, Building2, Globe, Coins, Wallet, Instagram, Heart, Sparkles, FileAudio } from 'lucide-react';

export default function App() {
  // App data state loaded from storage
  const [tracks, setTracks] = useState<Track[]>(getStoredTracks);
  const [downloadCodes, setDownloadCodes] = useState<DownloadCode[]>(getStoredCodes);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(getStoredPaymentConfig);
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>(getStoredSubmissions);
  const [adminPin, setAdminPin] = useState<string>(getAdminPin);
  const [universalCode, setUniversalCode] = useState<string>(getStoredUniversalCode);

  // Audio Playback state
  const [playingTrack, setPlayingTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [endedPreviewTrackIds, setEndedPreviewTrackIds] = useState<Set<string>>(new Set());

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentTrack, setSelectedPaymentTrack] = useState<Track | null>(null);

  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [selectedUnlockTrack, setSelectedUnlockTrack] = useState<Track | null>(null);
  const [prefillUnlockCode, setPrefillUnlockCode] = useState('');

  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSupportCareerModalOpen, setIsSupportCareerModalOpen] = useState(false);

  // Adsterra 5-Second Preview Ad state
  const [adPendingTrack, setAdPendingTrack] = useState<Track | null>(null);
  const [isPreviewAdModalOpen, setIsPreviewAdModalOpen] = useState(false);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Sync to localStorage
  const handleUpdateTracks = (newTracks: Track[]) => {
    setTracks(newTracks);
    saveTracks(newTracks);
  };

  const handleUpdateCodes = (newCodes: DownloadCode[]) => {
    setDownloadCodes(newCodes);
    saveCodes(newCodes);
  };

  const handleUpdatePaymentConfig = (newConfig: PaymentConfig) => {
    setPaymentConfig(newConfig);
    savePaymentConfig(newConfig);
  };

  const handleUpdateSubmissions = (newSubmissions: PaymentSubmission[]) => {
    setSubmissions(newSubmissions);
    saveSubmissions(newSubmissions);
  };

  const handleUpdateAdminPin = (newPin: string) => {
    setAdminPin(newPin);
    saveAdminPin(newPin);
  };

  const handleUpdateUniversalCode = (newCode: string) => {
    const clean = (newCode || 'LUCKY2026').trim().toUpperCase();
    setUniversalCode(clean);
    saveUniversalCode(clean);
  };

  const handleResetData = () => {
    resetAllDataToDefault();
    setTracks(getStoredTracks());
    setDownloadCodes(getStoredCodes());
    setPaymentConfig(getStoredPaymentConfig());
    setSubmissions(getStoredSubmissions());
    setAdminPin(getAdminPin());
    setUniversalCode(getStoredUniversalCode());
  };

  // Audio Playback with 5-second Adsterra ad preview requirement
  const startAudioPlayback = (track: Track) => {
    stopCurrentAudio();
    setPlayingTrack(track);
    setIsPlaying(true);
    setSecondsRemaining(30);

    // Increment play counter for this track and persist!
    const updatedTracks = tracks.map((t) =>
      t.id === track.id ? { ...t, playsCount: (t.playsCount || 0) + 1 } : t
    );
    handleUpdateTracks(updatedTracks);

    playTrackPreview(
      track.previewAudioUrl,
      (timeLeft) => {
        setSecondsRemaining(timeLeft);
      },
      () => {
        // When 30s preview ends: stop playback and mark track as previewEnded!
        setIsPlaying(false);
        setEndedPreviewTrackIds((prev) => new Set([...prev, track.id]));
      }
    );
  };

  // When fan clicks 30-sec play preview:
  // If already playing this track, pause it.
  // Otherwise, pop up the 5-second Adsterra ad before starting playback!
  const handleTogglePlay = (track: Track) => {
    if (playingTrack?.id === track.id && isPlaying) {
      stopCurrentAudio();
      setIsPlaying(false);
    } else {
      setAdPendingTrack(track);
      setIsPreviewAdModalOpen(true);
    }
  };

  // Once 5s ad finishes, start audio preview
  const handleAdComplete = (track: Track) => {
    setIsPreviewAdModalOpen(false);
    setAdPendingTrack(null);
    startAudioPlayback(track);
  };

  const handleStopAudio = () => {
    stopCurrentAudio();
    setIsPlaying(false);
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopCurrentAudio();
    };
  }, []);

  // Modal Triggers
  const handleOpenPayment = (track: Track) => {
    setSelectedPaymentTrack(track);
    setIsPaymentModalOpen(true);
  };

  const handleOpenUnlock = (track?: Track) => {
    setSelectedUnlockTrack(track || null);
    setPrefillUnlockCode('');
    setIsUnlockModalOpen(true);
  };

  const handleOpenUnlockWithCode = (track: Track, codeStr: string) => {
    setSelectedUnlockTrack(track);
    setPrefillUnlockCode(codeStr);
    setIsUnlockModalOpen(true);
  };

  // Automated Verification callback
  const handleAutoVerifySuccess = (newCode: DownloadCode, newSubmission: PaymentSubmission) => {
    handleUpdateCodes([newCode, ...downloadCodes]);
    handleUpdateSubmissions([newSubmission, ...submissions]);
  };

  // Code successfully redeemed to unlock track
  const handleCodeSuccessfullyUsed = (codeId: string, trackId: string) => {
    // 1. Increment code usage count
    const updatedCodes = downloadCodes.map((c) =>
      c.id === codeId ? { ...c, usedCount: c.usedCount + 1 } : c
    );
    handleUpdateCodes(updatedCodes);

    // 2. Increment track total download counter
    const updatedTracks = tracks.map((t) =>
      t.id === trackId ? { ...t, totalDownloads: t.totalDownloads + 1 } : t
    );
    handleUpdateTracks(updatedTracks);
  };

  // Genres list for filter tabs
  const allGenres = ['All', ...Array.from(new Set(tracks.map((t) => t.genre.split('/')[0].trim())))];

  // Filtered tracks
  const filteredTracks = tracks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.lyrics && t.lyrics.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      selectedGenre === 'All' || t.genre.toLowerCase().includes(selectedGenre.toLowerCase());

    return matchesSearch && matchesGenre;
  });

  const activeCodesCount = downloadCodes.filter((c) => c.isActive).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#090b10] text-slate-100 font-sans pb-12">
      
      {/* Navigation Header */}
      <Navbar
        paymentConfig={paymentConfig}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onOpenUnlockModal={() => handleOpenUnlock()}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        activeCodesCount={activeCodesCount}
      />

      {/* Page begins directly with LUCKY JAAY MUSIC CATALOG */}
      <section className="border-b border-slate-800/80 bg-gradient-to-b from-[#0e1320] via-[#090b10] to-[#090b10] pt-6 pb-6 sm:pt-8 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
                {paymentConfig.catalogTitle || 'LUCKY JAAY MUSIC CATALOG'}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {filteredTracks.length} Available Releases
                </span>
                <span className="text-xs text-slate-400">
                  • 30-Sec Previews • Direct Manual Download Codes
                </span>
              </div>
            </div>

            {/* Quick Search & Genre filter pills */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search tracks, lyrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2 pl-9 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <Music className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {allGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedGenre === genre
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Track Releases Catalog */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Buttons Strip before the first picture: About Lucky Jaay + Blinking Support Lucky Jaay Music Career */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          {/* Button 1: About LUCKY JAAY (Pops up About Lucky Jaay write-up) */}
          <button
            type="button"
            onClick={() => setIsAboutModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-slate-900 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>About LUCKY JAAY</span>
          </button>

          {/* Button 2: Blinking Support Lucky Jaay Music Career Button (Pops up 4 payment options with custom amount) */}
          <button
            type="button"
            onClick={() => setIsSupportCareerModalOpen(true)}
            className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-400 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/25 active:scale-95 cursor-pointer animate-pulse hover:animate-none border border-amber-300/80"
          >
            <Heart className="w-4 h-4 fill-current text-slate-950" />
            <span>Support Lucky Jaay Music Career</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>
        </div>

        {/* The One Master Picture for the entire website */}
        <div className="mb-10 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-950/20 flex flex-col lg:flex-row items-center gap-8">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[440px] lg:h-[440px] max-w-full rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/20 shrink-0 bg-slate-950 group ring-4 ring-emerald-500/10">
            <img
              src={paymentConfig.masterArtworkUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=90'}
              alt={paymentConfig.artistName || 'Lucky Jaay'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black bg-black/80 text-emerald-300 border border-emerald-500/50 backdrop-blur-md uppercase tracking-wider shadow-lg">
              Official Master Picture
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{paymentConfig.artistName || 'Lucky Jaay'} • Studio Music Catalog</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {paymentConfig.catalogTitle || 'LUCKY JAAY MUSIC CATALOG'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {paymentConfig.catalogSubtitle || 'Listen to 30-sec audio previews, support Lucky Jaay directly, and download studio master audio packages (WAV + 320kbps MP3).'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono text-emerald-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <Disc className="w-3.5 h-3.5 text-emerald-400" />
                <span>{tracks.length} Songs Released</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <FileAudio className="w-3.5 h-3.5 text-blue-400" />
                <span>Lossless 24-Bit WAV + MP3</span>
              </span>
              <button
                type="button"
                onClick={() => setIsAboutModalOpen(true)}
                className="text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Read Bio</span>
                <Sparkles className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Tracks Grid - Each song appears here without another picture box! */}
        {filteredTracks.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No songs found</h3>
            <p className="text-xs text-slate-400 mb-4">
              No releases match "{searchQuery}". Try a different keyword or reset filters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }}
              className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                isPlaying={playingTrack?.id === track.id && isPlaying}
                secondsRemaining={playingTrack?.id === track.id ? secondsRemaining : 30}
                hasPreviewEnded={endedPreviewTrackIds.has(track.id)}
                onTogglePlay={handleTogglePlay}
                onOpenPayment={handleOpenPayment}
                onOpenUnlock={handleOpenUnlock}
              />
            ))}
          </div>
        )}

        {/* Adsterra Sponsored Banner Placement (300x250) */}
        <div className="mt-12 mb-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-slate-800/80 shadow-2xl flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Music Sponsor & Partner Ad</span>
          </div>
          <AdsterraRectangleBanner label="Sponsored Partner (300x250)" />
          <p className="text-[11px] text-slate-500 mt-3 max-w-md">
            Ad interactions directly support Lucky Jaay studio recording, sound engineering, and free music previews.
          </p>
        </div>

      </main>

      {/* 5-Second Adsterra Preview Ad Modal before 30-sec song preview starts */}
      <PreviewAdModal
        isOpen={isPreviewAdModalOpen}
        track={adPendingTrack}
        onAdComplete={handleAdComplete}
        onClose={() => {
          setIsPreviewAdModalOpen(false);
          setAdPendingTrack(null);
        }}
      />

      {/* Payment & Download Code Modal (Local Opay, Intl, Pi, Sidra + WhatsApp + Active Download) */}
      {selectedPaymentTrack && (
        <PaymentModal
          track={selectedPaymentTrack}
          paymentConfig={paymentConfig}
          downloadCodes={downloadCodes}
          universalCode={universalCode}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onCodeSuccessfullyUsed={handleCodeSuccessfullyUsed}
        />
      )}

      {/* Code Unlock & Download Modal */}
      <CodeUnlockModal
        tracks={tracks}
        selectedTrack={selectedUnlockTrack}
        downloadCodes={downloadCodes}
        paymentConfig={paymentConfig}
        universalCode={universalCode}
        isOpen={isUnlockModalOpen}
        prefillCode={prefillUnlockCode}
        onClose={() => setIsUnlockModalOpen(false)}
        onCodeSuccessfullyUsed={handleCodeSuccessfullyUsed}
      />

      {/* Secure Admin Studio (Universal code, songs, counters, accounts, recent downloads, password) */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        tracks={tracks}
        onUpdateTracks={handleUpdateTracks}
        downloadCodes={downloadCodes}
        onUpdateCodes={handleUpdateCodes}
        paymentConfig={paymentConfig}
        onUpdatePaymentConfig={handleUpdatePaymentConfig}
        submissions={submissions}
        onUpdateSubmissions={handleUpdateSubmissions}
        adminPin={adminPin}
        onUpdateAdminPin={handleUpdateAdminPin}
        onResetData={handleResetData}
        universalCode={universalCode}
        onUpdateUniversalCode={handleUpdateUniversalCode}
      />

      {/* How It Works Explainer Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        paymentConfig={paymentConfig}
        onOpenUnlock={() => handleOpenUnlock()}
      />

      {/* About Lucky Jaay Popup Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        paymentConfig={paymentConfig}
        onOpenSupportModal={() => setIsSupportCareerModalOpen(true)}
      />

      {/* Support Lucky Jaay Music Career Modal (Open / Custom Amount) */}
      <SupportCareerModal
        isOpen={isSupportCareerModalOpen}
        onClose={() => setIsSupportCareerModalOpen(false)}
        paymentConfig={paymentConfig}
        universalCode={universalCode}
        onOpenUnlockModal={() => handleOpenUnlock()}
      />

      {/* Footer with Social Media & Creator Studio */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#08090e] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-white text-base">
                Sound<span className="text-emerald-400">Vault</span>
              </span>
              <span>• © {new Date().getFullYear()} {paymentConfig.artistName}. All rights reserved.</span>
            </div>

            {/* Social Media Section (Editable in Admin Panel) */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1">
                Follow Lucky Jaay:
              </span>
              {paymentConfig.socialLinks?.instagram && (
                <a
                  href={paymentConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-pink-500/50 transition-all text-xs font-medium"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram</span>
                </a>
              )}
              {paymentConfig.socialLinks?.twitter && (
                <a
                  href={paymentConfig.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-sky-500/50 transition-all text-xs font-medium"
                >
                  <svg className="w-3 h-3 fill-current text-sky-400" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>Twitter / X</span>
                </a>
              )}
              {paymentConfig.socialLinks?.tiktok && (
                <a
                  href={paymentConfig.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-teal-500/50 transition-all text-xs font-medium"
                >
                  <svg className="w-3 h-3 fill-current text-teal-400" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.26 6.26 0 0 0 1.84-4.47V8.75a8.16 8.16 0 0 0 4.93 1.63v-3.69z"/>
                  </svg>
                  <span>TikTok</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Payment Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Local MoMo/OPay
              </span>
              <span className="flex items-center gap-1 text-teal-400">
                <span className="w-3.5 h-3.5 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-[8px]">₮</span> Tether USDT (TRC20)
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[8px]">₿</span> Bitcoin (BTC)
              </span>
              <span className="flex items-center gap-1 text-yellow-400">
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-bold text-[7px]">BNB</span> BNB Smart Chain (BEP20)
              </span>
              <span className="flex items-center gap-1 text-purple-400">
                <Coins className="w-3.5 h-3.5 text-purple-400" /> Pi Network
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <Wallet className="w-3.5 h-3.5 text-blue-400" /> Sidra Chain
              </span>
            </div>

            <div>
              <button
                onClick={() => setIsAdminPanelOpen(true)}
                className="text-slate-400 hover:text-emerald-400 transition-colors font-medium flex items-center gap-1 text-xs"
              >
                <span>Creator Admin Studio</span>
              </button>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
