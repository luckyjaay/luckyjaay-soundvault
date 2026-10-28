import React from 'react';
import { X, Sparkles, MapPin, Music, Heart, Instagram, Twitter, ExternalLink, Globe } from 'lucide-react';
import { PaymentConfig } from '../types';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentConfig: PaymentConfig;
  onOpenSupportModal?: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  paymentConfig,
  onOpenSupportModal,
}) => {
  if (!isOpen) return null;

  const socialLinks = paymentConfig.socialLinks || { instagram: '', twitter: '', tiktok: '' };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0c1018] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide uppercase">
                {paymentConfig.aboutTitle || 'ABOUT LUCKY JAAY'}
              </h3>
              <p className="text-xs text-slate-400">
                Official Artist Profile & Biography
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close About Modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Master Artist Image & Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/20">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-xl shrink-0 bg-slate-950">
              <img
                src={paymentConfig.masterArtworkUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
                alt={paymentConfig.artistName || 'Lucky Jaay'}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center sm:text-left space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider inline-block">
                Afro Pop Music Singer
              </span>
              <h4 className="text-xl font-black text-white font-heading">
                {paymentConfig.artistName || 'Lucky Jaay'}
              </h4>
              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>From Imo State, Nigeria</span>
              </p>
            </div>
          </div>

          {/* Main Bio Text */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              <span>Artist Story & Music Style</span>
            </span>
            <p className="text-sm text-slate-200 leading-relaxed font-sans font-medium whitespace-pre-line">
              {paymentConfig.aboutBio ||
                'Lucky Jaay is an Afro pop music singer from imo state Singing about street life, reality, and love songs.'}
            </p>
          </div>

          {/* Themes Tags */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">Focus</span>
              <span className="text-xs font-semibold text-white">Street Life</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-0.5">Themes</span>
              <span className="text-xs font-semibold text-white">Reality</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-0.5">Vibes</span>
              <span className="text-xs font-semibold text-white">Love Songs</span>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Follow Lucky Jaay on Social Media
            </span>
            <div className="grid grid-cols-3 gap-2">
              <a
                href={socialLinks.instagram ? (socialLinks.instagram.startsWith('http') ? socialLinks.instagram : `https://instagram.com/${socialLinks.instagram.replace('@', '')}`) : 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/40 text-slate-300 hover:text-pink-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <span className="truncate">Instagram</span>
              </a>

              <a
                href={socialLinks.twitter ? (socialLinks.twitter.startsWith('http') ? socialLinks.twitter : `https://x.com/${socialLinks.twitter.replace('@', '')}`) : 'https://x.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-blue-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Twitter className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="truncate">Twitter / X</span>
              </a>

              <a
                href={socialLinks.tiktok ? (socialLinks.tiktok.startsWith('http') ? socialLinks.tiktok : `https://tiktok.com/@${socialLinks.tiktok.replace('@', '')}`) : 'https://tiktok.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">TikTok</span>
              </a>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 flex items-center gap-3">
            {onOpenSupportModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSupportModal();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-400 hover:from-amber-400 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-current text-slate-950" />
                <span>Support Lucky Jaay's Career</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
