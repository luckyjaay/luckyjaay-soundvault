import React, { useState, useEffect } from 'react';
import {
  X,
  KeyRound,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileAudio,
  ShieldCheck,
  Disc,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Track, DownloadCode, PaymentConfig } from '../types';
import { generateTrackDownloadBlob } from '../utils/audioSynth';
import { normalizeWhatsAppNumber, addDownloadLog } from '../utils/storage';

interface CodeUnlockModalProps {
  tracks: Track[];
  selectedTrack: Track | null;
  downloadCodes: DownloadCode[];
  paymentConfig: PaymentConfig;
  isOpen: boolean;
  universalCode?: string;
  prefillCode?: string;
  onClose: () => void;
  onCodeSuccessfullyUsed: (codeId: string, trackId: string) => void;
}

export const CodeUnlockModal: React.FC<CodeUnlockModalProps> = ({
  tracks,
  selectedTrack,
  downloadCodes,
  paymentConfig,
  isOpen,
  universalCode,
  prefillCode = '',
  onClose,
  onCodeSuccessfullyUsed,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [activeTrackId, setActiveTrackId] = useState<string>(selectedTrack ? selectedTrack.id : (tracks[0]?.id || ''));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [validatedCodeObj, setValidatedCodeObj] = useState<DownloadCode | null>(null);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputCode('');
      setErrorMsg(null);
      setIsUnlocked(false);
      setValidatedCodeObj(null);
      setDownloadStarted(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedTrack) {
      setActiveTrackId(selectedTrack.id);
    } else if (tracks.length > 0 && !activeTrackId) {
      setActiveTrackId(tracks[0].id);
    }
  }, [selectedTrack, tracks]);

  if (!isOpen) return null;

  const currentTrack = tracks.find(t => t.id === activeTrackId) || tracks[0];

  const handleValidateAndUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanInput = inputCode.trim();
    if (!cleanInput) {
      setErrorMsg('Please enter your download code.');
      return;
    }

    // 1. Check Universal Code (unlocks all tracks)
    if (universalCode && cleanInput.toUpperCase() === universalCode.trim().toUpperCase()) {
      const universalObj: DownloadCode = {
        id: 'universal-active-pass',
        code: universalCode,
        trackId: 'ALL',
        maxUses: 999999,
        usedCount: 0,
        isActive: true,
        createdAt: '2026-01-01',
        expiresAt: null,
        paymentMethod: 'admin_promo',
        customerName: 'Universal Music Fan',
      };
      setValidatedCodeObj(universalObj);
      setIsUnlocked(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'],
        });
      } catch {
        // ignore
      }
      onCodeSuccessfullyUsed('universal-active-pass', activeTrackId);
      return;
    }

    // 2. Match code case-insensitively from list
    const match = downloadCodes.find(
      (c) => c.code.trim().toUpperCase() === cleanInput.toUpperCase()
    );

    if (!match) {
      setErrorMsg(
        'Invalid download code. Please check for typos or message artist support on WhatsApp if you made a payment.'
      );
      return;
    }

    if (!match.isActive) {
      setErrorMsg('This download code has been deactivated by the administrator.');
      return;
    }

    // Check expiration if set
    if (match.expiresAt) {
      const expDate = new Date(match.expiresAt);
      if (new Date() > expDate) {
        setErrorMsg(`This download code expired on ${match.expiresAt}.`);
        return;
      }
    }

    // Check track restriction
    if (match.trackId !== 'ALL' && match.trackId !== activeTrackId) {
      const allowedTrack = tracks.find(t => t.id === match.trackId);
      setErrorMsg(
        `This code is assigned specifically to "${allowedTrack?.title || 'another track'}". Please select that track to unlock it.`
      );
      return;
    }

    // Check usage limits
    if (match.usedCount >= match.maxUses) {
      setErrorMsg(
        `This code has reached its maximum download limit (${match.maxUses} of ${match.maxUses} uses). Contact WhatsApp support for a refreshed code.`
      );
      return;
    }

    // Success!
    setValidatedCodeObj(match);
    setIsUnlocked(true);

    // Confetti explosion
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'],
      });
    } catch {
      // ignore
    }

    onCodeSuccessfullyUsed(match.id, activeTrackId);
  };

  const handleTriggerDownload = () => {
    if (!currentTrack) return;
    setDownloadStarted(true);

    // Record in Recent Downloads log
    addDownloadLog({
      trackId: currentTrack.id,
      trackTitle: currentTrack.title,
      artist: currentTrack.artist,
      codeUsed: validatedCodeObj?.code || universalCode || 'LUCKY2026',
    });

    // Create browser file download
    const blob = generateTrackDownloadBlob(currentTrack.title, currentTrack.artist, currentTrack.fileFormat);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTrack.artist} - ${currentTrack.title} [Studio Master Archive].txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const cleanPhone = normalizeWhatsAppNumber(paymentConfig.whatsappNumber);
  const supportWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${paymentConfig.artistName} support, I need assistance with my download code for "${currentTrack?.title}".`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-[#0c1018] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Unlock Track Download
              </h3>
              <p className="text-xs text-slate-400">
                Enter your WhatsApp or Automated Verification code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Unlock Modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Target Track Selector if user didn't pre-select or wants to change */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Track to Unlock
            </label>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <img
                src={paymentConfig.masterArtworkUrl || currentTrack?.coverUrl}
                alt={currentTrack?.title}
                className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-700"
              />
              <div className="flex-1 min-w-0">
                <select
                  value={activeTrackId}
                  onChange={(e) => {
                    setActiveTrackId(e.target.value);
                    setIsUnlocked(false);
                  }}
                  className="w-full bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
                >
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                      {t.title} ({t.duration}) - {t.artist}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 truncate">
                  Master Format: {currentTrack?.fileFormat} ({currentTrack?.fileSize})
                </p>
              </div>
            </div>
          </div>

          {/* If already Unlocked successfully */}
          {isUnlocked ? (
            <div className="p-5 rounded-xl bg-emerald-950/40 border-2 border-emerald-500/60 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Access Granted • Verification Complete
                </span>
                <h4 className="text-xl font-heading font-extrabold text-white mt-1">
                  "{currentTrack?.title}" is Unlocked!
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Code <span className="font-mono font-bold text-emerald-300">{validatedCodeObj?.code}</span> verified. Full master stems and 320kbps MP3 are ready for immediate download.
                </p>
              </div>

              {/* Download CTA Button */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleTriggerDownload}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/30 active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Master Package ({currentTrack?.fileSize})</span>
                </button>

                {downloadStarted && (
                  <p className="text-xs text-emerald-300 flex items-center justify-center gap-1.5 pt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Archive download triggered! Check your downloads folder.
                  </p>
                )}
              </div>

              {/* Package contents breakdown */}
              <div className="p-3 rounded-lg bg-black/50 border border-slate-800 text-left text-xs space-y-1.5 font-mono text-slate-300">
                <span className="text-[10px] uppercase font-sans font-semibold text-slate-400 block mb-1">
                  Package contents:
                </span>
                <div className="flex items-center gap-2">
                  <FileAudio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1. {currentTrack?.title} - Studio Master (320kbps MP3)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileAudio className="w-3.5 h-3.5 text-blue-400" />
                  <span>2. {currentTrack?.title} - Lossless 24-bit Studio WAV</span>
                </div>
                <div className="flex items-center gap-2">
                  <Disc className="w-3.5 h-3.5 text-purple-400" />
                  <span>3. High-Res Artwork Pack (4000x4000px)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>4. Official Verified Fan Commercial License</span>
                </div>
              </div>
            </div>
          ) : (
            /* Input Code Form */
            <form onSubmit={handleValidateAndUnlock} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Your Download Code
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Case-insensitive
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter download code"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 font-mono text-base tracking-wider focus:outline-none focus:border-emerald-500 uppercase"
                  />
                  {inputCode && (
                    <button
                      type="button"
                      onClick={() => setInputCode('')}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Unlock Failed</span>
                    <span>{errorMsg}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <KeyRound className="w-4 h-4" />
                <span>Verify Code & Unlock Download</span>
              </button>
            </form>
          )}

          {/* WhatsApp Support fallback */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Haven't received your code on WhatsApp?</span>
            <a
              href={supportWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contact Support</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
