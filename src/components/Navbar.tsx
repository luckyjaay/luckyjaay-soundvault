import React from 'react';
import { Disc3, ShieldCheck, KeyRound, MessageCircle, HelpCircle, Flame } from 'lucide-react';
import { PaymentConfig } from '../types';

import { normalizeWhatsAppNumber } from '../utils/storage';

interface NavbarProps {
  paymentConfig: PaymentConfig;
  onOpenAdmin: () => void;
  onOpenUnlockModal: () => void;
  onOpenHowItWorks: () => void;
  activeCodesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  paymentConfig,
  onOpenAdmin,
  onOpenUnlockModal,
  onOpenHowItWorks,
  activeCodesCount,
}) => {
  const cleanPhone = normalizeWhatsAppNumber(paymentConfig.whatsappNumber);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${paymentConfig.artistName} team, I am on your music catalog and have a payment/music inquiry.`
  )}`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090b10]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0d1017] rounded-[10px] flex items-center justify-center">
                <Disc3 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg sm:text-xl font-black tracking-tight text-white">
                LUCKY JAAY
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                OFFICIAL
              </span>
            </div>
          </div>

          {/* Navigation & Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* How It Works Button */}
            <button
              onClick={onOpenHowItWorks}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>How It Works</span>
            </button>

            {/* Official WhatsApp Support CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-700/40 hover:bg-emerald-900/50 hover:border-emerald-500 transition-all shadow-sm"
              title="Chat with Artist Support on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>

            {/* Enter Download Code / Unlock CTA */}
            <button
              onClick={onOpenUnlockModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Track</span>
            </button>

            {/* Admin Panel button */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-slate-500 transition-colors"
              title="Creator & Admin Studio (Manage Codes & Tracks)"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="hidden lg:inline">Admin Studio</span>
              {activeCodesCount > 0 && (
                <span className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  {activeCodesCount} codes
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
