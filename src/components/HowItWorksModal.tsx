import React from 'react';
import { X, Building2, Globe, Coins, Wallet, MessageCircle, KeyRound, Download, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { PaymentConfig } from '../types';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentConfig: PaymentConfig;
  onOpenUnlock: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  paymentConfig,
  onOpenUnlock,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-[#0c1018] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                How Manual Music Payments & WhatsApp Delivery Work
              </h3>
              <p className="text-xs text-slate-400">
                Direct fan-to-artist support with 100% fair pricing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close How It Works Modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Step 1 */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-500/30 font-mono text-sm">
              1
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-bold text-sm text-white">
                Choose Track & Select Payment Currency
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Click <strong>"Buy / Get Code"</strong> on any track you want. Choose your preferred currency:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-emerald-400 font-bold block flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> Local MoMo / OPay
                  </span>
                  <span className="text-slate-400">Direct Bank & MoMo</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-teal-400 font-bold block flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-[8px]">₮</span> Tether USDT
                  </span>
                  <span className="text-slate-400">TRON Network (TRC20)</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-amber-400 font-bold block flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[8px]">₿</span> Bitcoin (BTC)
                  </span>
                  <span className="text-slate-400">Native BTC Blockchain</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-yellow-400 font-bold block flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-bold text-[7px]">BNB</span> BNB Smart Chain
                  </span>
                  <span className="text-slate-400">Binance Smart Chain (BEP20)</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-purple-400 font-bold block flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> Pi Network
                  </span>
                  <span className="text-slate-400">Pi Browser / Wallet</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-blue-400 font-bold block flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" /> Sidra Chain
                  </span>
                  <span className="text-slate-400">Sidra Bank & Ledger</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 border border-blue-500/30 font-mono text-sm">
              2
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-bold text-sm text-white">
                Copy Details & Send Manual Payment
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Use the 1-click copy buttons to transfer the exact amount. For Pi and Sidra payments, ensure you include the specified <strong>Transaction Memo</strong> so the automated system immediately matches your payment.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 border border-amber-500/30 font-mono text-sm">
              3
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-bold text-sm text-white">
                Automated Verification OR WhatsApp Delivery
              </h4>
              <p className="text-slate-300 leading-relaxed">
                You have two instant options to receive your code:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                <li>
                  <strong className="text-emerald-300">Automated Instant Verification:</strong> Enter your Transaction Reference ID directly on the page to receive your code on screen in seconds.
                </li>
                <li>
                  <strong className="text-emerald-300">WhatsApp Dispatch:</strong> Click "Send on WhatsApp" to message {paymentConfig.artistName}'s support team with pre-filled payment details. Your download code will be sent to your WhatsApp chat.
                </li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center shrink-0 border border-purple-500/30 font-mono text-sm">
              4
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-bold text-sm text-white">
                Unlock & Download Master Audio Files
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Click <strong>"Unlock Track"</strong>, enter your code, and receive direct downloads of the uncompressed 24-bit WAV, 320kbps MP3, and official artwork archive!
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Direct Artist Portal
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenUnlock();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20"
            >
              <KeyRound className="w-4 h-4" />
              <span>I Have a Code: Unlock Now</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
