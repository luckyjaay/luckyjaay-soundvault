import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Copy,
  MessageCircle,
  ShieldCheck,
  Coins,
  Globe,
  Wallet,
  Building2,
  Download,
  Lock,
  Unlock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileAudio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Track, PaymentConfig, PaymentMethodType, DownloadCode } from '../types';
import { generateTrackDownloadBlob } from '../utils/audioSynth';
import { normalizeWhatsAppNumber, addDownloadLog } from '../utils/storage';

interface PaymentModalProps {
  track: Track;
  paymentConfig: PaymentConfig;
  downloadCodes: DownloadCode[];
  isOpen: boolean;
  universalCode?: string;
  onClose: () => void;
  onCodeSuccessfullyUsed: (codeId: string, trackId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  track,
  paymentConfig,
  downloadCodes,
  isOpen,
  universalCode,
  onClose,
  onCodeSuccessfullyUsed,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // The Download Code Box state
  const [enteredCode, setEnteredCode] = useState('');
  const [validCodeObj, setValidCodeObj] = useState<DownloadCode | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  // Reset inputs when modal opens or track changes - do not auto select any payment option
  useEffect(() => {
    if (isOpen) {
      setSelectedMethod(null);
      setEnteredCode('');
      setValidCodeObj(null);
      setCodeError(null);
      setDownloadTriggered(false);
      setCopiedField(null);
    }
  }, [isOpen, track.id]);

  // Real-time Code Validation
  useEffect(() => {
    const clean = enteredCode.trim().toUpperCase();
    if (!clean) {
      setValidCodeObj(null);
      setCodeError(null);
      return;
    }

    // 1. Check Universal Download Code (unlocks all tracks & payment options)
    if (universalCode && clean === universalCode.trim().toUpperCase()) {
      setValidCodeObj({
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
      });
      setCodeError(null);
      return;
    }

    // 2. Check downloadCodes list
    const match = downloadCodes.find((c) => c.code.trim().toUpperCase() === clean);

    if (!match) {
      setValidCodeObj(null);
      setCodeError('Invalid code. Tap the WhatsApp button above to request code from artist.');
      return;
    }

    if (!match.isActive) {
      setValidCodeObj(null);
      setCodeError('This code is currently disabled by administrator.');
      return;
    }

    if (match.trackId !== 'ALL' && match.trackId !== track.id) {
      setValidCodeObj(null);
      setCodeError('This code is valid for another song in the catalog.');
      return;
    }

    if (match.usedCount >= match.maxUses) {
      setValidCodeObj(null);
      setCodeError(`Code limit reached (${match.maxUses}/${match.maxUses} uses).`);
      return;
    }

    // Code is valid!
    setValidCodeObj(match);
    setCodeError(null);
  }, [enteredCode, downloadCodes, universalCode, track.id]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getAmountString = (method: PaymentMethodType | null) => {
    if (!method) return '';
    switch (method) {
      case 'local':
        return `${track.localCurrencySymbol}${track.priceLocal.toLocaleString()}`;
      case 'usdt':
      case 'international':
        return `${track.priceUSD.toFixed(2)} USDT (TRC20)`;
      case 'btc':
        return `$${track.priceUSD.toFixed(2)} USD in BTC`;
      case 'bnb':
        return `$${track.priceUSD.toFixed(2)} USD in BNB (BEP20)`;
      case 'pi':
        return `${track.pricePi} Pi`;
      case 'sidra':
        return `${track.priceSidra} Sidra`;
    }
  };

  // WhatsApp Pre-filled message generator
  const getWhatsAppMessage = () => {
    if (selectedMethod) {
      const amount = getAmountString(selectedMethod);
      const methodNames: Record<PaymentMethodType, string> = {
        local: `Local Bank / OPay (${paymentConfig.localPayment.accountNumber})`,
        usdt: 'Tether USDT (TRON TRC20)',
        btc: 'Bitcoin (BTC)',
        bnb: 'BNB Smart Chain (BEP20)',
        pi: 'Pi Network Wallet',
        sidra: 'Sidra Chain / Sidra Bank',
        international: 'Tether USDT (TRON TRC20)',
      };

      return `Hello ${paymentConfig.artistName},\n\nI am making payment for your song:\n🎵 Song: "${track.title}"\n💰 Amount: ${amount}\n💳 Method: ${methodNames[selectedMethod]}\n\nPlease verify my payment and send my Download Code to unlock the full song on your website. Thank you!`;
    }

    return `Hello ${paymentConfig.artistName},\n\nI want to pay for your song and receive my Download Code:\n🎵 Song: "${track.title}"\n\nPlease let me know your payment details and send my Download Code to unlock the song. Thank you!`;
  };

  // WhatsApp Button handler
  const handleOpenWhatsApp = () => {
    const cleanPhone = normalizeWhatsAppNumber(paymentConfig.whatsappNumber);
    const message = getWhatsAppMessage();
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // When fan clicks the active download button
  const handleStartDownload = () => {
    if (!validCodeObj) return;

    // Trigger confetti explosion
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
      });
    } catch {
      // ignore
    }

    setDownloadTriggered(true);

    // Record code usage & track downloads in storage
    onCodeSuccessfullyUsed(validCodeObj.id, track.id);

    // Record in Recent Downloads log view
    addDownloadLog({
      trackId: track.id,
      trackTitle: track.title,
      artist: track.artist,
      codeUsed: validCodeObj.code,
    });

    // If track has a real download URL, navigate or create blob
    if (track.downloadFileUrl && track.downloadFileUrl.startsWith('http')) {
      const a = document.createElement('a');
      a.href = track.downloadFileUrl;
      a.target = '_blank';
      a.download = `${track.artist} - ${track.title}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Generate immediate master studio archive package
      const blob = generateTrackDownloadBlob(track.title, track.artist, track.fileFormat);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${track.artist} - ${track.title} [Studio Master Package].txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-[#0c1018] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-4">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-700 shrink-0">
              <img
                src={paymentConfig.masterArtworkUrl || track.coverUrl}
                alt={track.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Unlock Full Song Download</span>
              </h3>
              <p className="text-xs text-slate-400">
                "{track.title}" by <span className="text-slate-200 font-semibold">{track.artist}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Payment Dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* 1. The 4 Payment Method Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Choose Your Preferred Payment Method:
              </label>
              {!selectedMethod && (
                <span className="text-[11px] font-semibold text-amber-400 animate-pulse">
                  Choose an option below 👇
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              
              {/* Local Payment (Opay) */}
              <button
                type="button"
                onClick={() => setSelectedMethod('local')}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                  selectedMethod === 'local'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Building2 className={`w-5 h-5 mb-1 ${selectedMethod === 'local' ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">Local Payment</span>
                <span className="text-[10px] text-emerald-400 font-medium">Opay / MoMo</span>
                <span className="text-xs font-mono font-bold text-emerald-300 mt-1">
                  {track.localCurrencySymbol}{track.priceLocal.toLocaleString()}
                </span>
              </button>

              {/* 1. Tether USDT (TRON TRC20) */}
              <button
                type="button"
                onClick={() => setSelectedMethod('usdt')}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                  selectedMethod === 'usdt' || selectedMethod === 'international'
                    ? 'bg-teal-950/60 border-teal-500 text-white shadow-lg ring-1 ring-teal-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className={`w-5 h-5 mb-1 rounded-full flex items-center justify-center font-bold text-xs ${
                  selectedMethod === 'usdt' || selectedMethod === 'international' ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-teal-400'
                }`}>
                  ₮
                </div>
                <span className="text-xs font-bold">Tether USDT</span>
                <span className="text-[10px] text-teal-400 font-semibold">TRON (TRC20)</span>
                <span className="text-xs font-mono font-bold text-teal-300 mt-1">
                  ${track.priceUSD.toFixed(2)} USDT
                </span>
              </button>

              {/* 2. Bitcoin (BTC) */}
              <button
                type="button"
                onClick={() => setSelectedMethod('btc')}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                  selectedMethod === 'btc'
                    ? 'bg-amber-950/60 border-amber-500 text-white shadow-lg ring-1 ring-amber-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className={`w-5 h-5 mb-1 rounded-full flex items-center justify-center font-bold text-xs ${
                  selectedMethod === 'btc' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'
                }`}>
                  ₿
                </div>
                <span className="text-xs font-bold">Bitcoin</span>
                <span className="text-[10px] text-amber-400 font-semibold">BTC Mainnet</span>
                <span className="text-xs font-mono font-bold text-amber-300 mt-1">
                  ${track.priceUSD.toFixed(2)} USD
                </span>
              </button>

              {/* 3. BNB Smart Chain (BEP20) */}
              <button
                type="button"
                onClick={() => setSelectedMethod('bnb')}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                  selectedMethod === 'bnb'
                    ? 'bg-yellow-950/60 border-yellow-500 text-white shadow-lg ring-1 ring-yellow-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className={`w-5 h-5 mb-1 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  selectedMethod === 'bnb' ? 'bg-yellow-400 text-slate-950' : 'bg-slate-800 text-yellow-400'
                }`}>
                  BNB
                </div>
                <span className="text-xs font-bold">BNB Smart Chain</span>
                <span className="text-[10px] text-yellow-400 font-semibold">BSC (BEP20)</span>
                <span className="text-xs font-mono font-bold text-yellow-300 mt-1">
                  ${track.priceUSD.toFixed(2)} USD
                </span>
              </button>

              {/* Pi Network */}
              <button
                type="button"
                onClick={() => setSelectedMethod('pi')}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                  selectedMethod === 'pi'
                    ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg ring-1 ring-purple-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Coins className={`w-5 h-5 mb-1 ${selectedMethod === 'pi' ? 'text-purple-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">Pi Network</span>
                <span className="text-[10px] text-purple-400">Pi Browser</span>
                <span className="text-xs font-mono font-bold text-purple-300 mt-1">
                  {track.pricePi} Pi
                </span>
              </button>

              {/* Sidra Chain */}
              <button
                type="button"
                onClick={() => setSelectedMethod('sidra')}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                  selectedMethod === 'sidra'
                    ? 'bg-blue-950/60 border-blue-500 text-white shadow-lg ring-1 ring-blue-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Wallet className={`w-5 h-5 mb-1 ${selectedMethod === 'sidra' ? 'text-blue-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">Sidra Chain</span>
                <span className="text-[10px] text-blue-400">Sidra Bank</span>
                <span className="text-xs font-mono font-bold text-blue-300 mt-1">
                  {track.priceSidra} Sidra
                </span>
              </button>

            </div>
          </div>

          {/* 2. Account Details Card (Exact user specifications for Local / Opay) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            
            {/* If no method selected yet: prompt fan to choose their preferred method */}
            {!selectedMethod && (
              <div className="p-5 rounded-xl bg-slate-900/60 border border-dashed border-slate-700/80 text-center py-6 space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs font-bold text-slate-200">
                  Please Choose Your Preferred Payment Option Above
                </p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Click on Local Payment (Opay), International, Pi Payment, or Sidra Payment to view payment details and account number.
                </p>
              </div>
            )}

            {/* If Local Payment is clicked: Opay 8063270422 Ezirim lucky Elisha */}
            {selectedMethod === 'local' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    Local Account Details
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Amount: {track.localCurrencySymbol}{track.priceLocal.toLocaleString()}
                  </span>
                </div>

                {/* Bank / Provider Name */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Bank / Provider:</span>
                    <span className="font-bold text-white text-sm">{paymentConfig.localPayment.bankName || 'Opay'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Account Name:</span>
                    <span className="font-bold text-white text-sm truncate block">{paymentConfig.localPayment.accountName || 'Ezirim lucky Elisha'}</span>
                  </div>
                </div>

                {/* Account Number with 1-Click Copy */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/40 border border-emerald-700/50">
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-400 block">Account Number:</span>
                    <span className="font-mono font-extrabold text-white text-lg tracking-wider">
                      {paymentConfig.localPayment.accountNumber || '8063270422'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(paymentConfig.localPayment.accountNumber || '8063270422', 'opay-num')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold text-xs shadow-sm transition-all active:scale-95"
                  >
                    {copiedField === 'opay-num' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedField === 'opay-num' ? 'Copied!' : 'Copy Number'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  💡 {paymentConfig.localPayment.instructions}
                </p>
              </div>
            )}

            {/* 1. If Tether USDT (TRON TRC20) is clicked */}
            {(selectedMethod === 'usdt' || selectedMethod === 'international') && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">₮</span>
                    Tether USDT (TRON TRC-20)
                  </span>
                  <span className="text-xs font-mono font-bold text-teal-300">
                    Amount: ${track.priceUSD.toFixed(2)} USDT
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-teal-950/40 border border-teal-700/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider block">Network:</span>
                      <span className="font-bold text-white text-xs">TRON (TRC20)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                      Low Gas Fee • 1-2 Mins
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-teal-400 font-semibold block mb-0.5">TRC20 USDT Wallet Address:</span>
                    <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-lg border border-teal-500/30">
                      <span className="font-mono font-bold text-white text-xs break-all select-all">
                        {paymentConfig.usdtPayment?.walletAddress || 'TYDZSXDzpjyWPvg1Z7sA2996hR3P45t6TR'}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(paymentConfig.usdtPayment?.walletAddress || 'TYDZSXDzpjyWPvg1Z7sA2996hR3P45t6TR', 'usdt-addr')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 hover:bg-teal-400 text-xs font-bold shrink-0 transition-all active:scale-95 cursor-pointer"
                      >
                        {copiedField === 'usdt-addr' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'usdt-addr' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300/90 leading-relaxed">
                  ⚠️ <strong>Important:</strong> Send <strong>only USDT via the TRON (TRC20) network</strong>. Do NOT use ERC20 or BEP20 to this address.
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  💡 {paymentConfig.usdtPayment?.instructions || 'Send USDT via TRON (TRC20). Copy your transaction hash and send via WhatsApp to unlock your download code immediately!'}
                </p>
              </div>
            )}

            {/* 2. If Bitcoin (BTC) is clicked */}
            {selectedMethod === 'btc' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">₿</span>
                    Bitcoin (BTC Mainnet)
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    Amount: ${track.priceUSD.toFixed(2)} USD in BTC
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-700/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">Network:</span>
                      <span className="font-bold text-white text-xs">Bitcoin Network (BTC)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      1 Confirmation Required
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-amber-400 font-semibold block mb-0.5">Bitcoin (BTC) Wallet Address:</span>
                    <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-lg border border-amber-500/30">
                      <span className="font-mono font-bold text-white text-xs break-all select-all">
                        {paymentConfig.btcPayment?.walletAddress || 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(paymentConfig.btcPayment?.walletAddress || 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', 'btc-addr')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-bold shrink-0 transition-all active:scale-95 cursor-pointer"
                      >
                        {copiedField === 'btc-addr' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'btc-addr' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300/90 leading-relaxed">
                  ⚠️ <strong>Notice:</strong> Send <strong>only Bitcoin (BTC)</strong> via the native Bitcoin network. Do not send Bitcoin Cash (BCH) or wrapped tokens.
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  💡 {paymentConfig.btcPayment?.instructions || 'Send Bitcoin (BTC) to the address above. Copy the TXID and tap WhatsApp to receive your download code.'}
                </p>
              </div>
            )}

            {/* 3. If BNB Smart Chain (BEP20) is clicked */}
            {selectedMethod === 'bnb' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-bold text-[9px]">BNB</span>
                    BNB Smart Chain (BEP-20)
                  </span>
                  <span className="text-xs font-mono font-bold text-yellow-300">
                    Amount: ${track.priceUSD.toFixed(2)} USD in BNB
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-yellow-950/40 border border-yellow-700/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-yellow-400 uppercase tracking-wider block">Network:</span>
                      <span className="font-bold text-white text-xs">BNB Smart Chain (BSC / BEP20)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                      Fast 3s • Near-Zero Gas
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-yellow-400 font-semibold block mb-0.5">BNB (BEP20) Wallet Address:</span>
                    <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-lg border border-yellow-500/30">
                      <span className="font-mono font-bold text-white text-xs break-all select-all">
                        {paymentConfig.bnbPayment?.walletAddress || '0x71C83457D2840004cE7A03EaC267c827B735160E'}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(paymentConfig.bnbPayment?.walletAddress || '0x71C83457D2840004cE7A03EaC267c827B735160E', 'bnb-addr')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-400 text-slate-950 hover:bg-yellow-300 text-xs font-bold shrink-0 transition-all active:scale-95 cursor-pointer"
                      >
                        {copiedField === 'bnb-addr' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'bnb-addr' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300/90 leading-relaxed">
                  ⚠️ <strong>Notice:</strong> Send <strong>BNB or BEP-20 tokens via BSC (BEP20) network only</strong>. Do not use Binance Beacon Chain (BEP2) or Ethereum (ERC20).
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  💡 {paymentConfig.bnbPayment?.instructions || 'Send BNB or BEP20 tokens via BNB Smart Chain. Send transaction hash via WhatsApp to receive your code.'}
                </p>
              </div>
            )}

            {/* If Pi Payment is clicked */}
            {selectedMethod === 'pi' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Coins className="w-4 h-4" />
                    Pi Network Public Wallet
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Amount: {track.pricePi} Pi
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Pi Public Wallet Address:</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(paymentConfig.piPayment.walletAddress, 'pi-addr')}
                      className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-semibold"
                    >
                      {copiedField === 'pi-addr' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'pi-addr' ? 'Copied' : 'Copy Address'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-slate-200 text-[11px] break-all bg-slate-950 p-2 rounded border border-slate-800">
                    {paymentConfig.piPayment.walletAddress}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div>
                    <span className="text-[10px] text-amber-400 font-semibold block">Required Memo:</span>
                    <span className="font-mono font-bold text-white text-sm">{paymentConfig.piPayment.memo}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(paymentConfig.piPayment.memo, 'pi-memo')}
                    className="text-xs text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800"
                  >
                    Copy Memo
                  </button>
                </div>
              </div>
            )}

            {/* If Sidra Payment is clicked */}
            {selectedMethod === 'sidra' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    Sidra Chain Wallet
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-400">
                    Amount: {track.priceSidra} Sidra
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-800/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-purple-400 font-bold uppercase">Sidra Chain Address:</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(paymentConfig.sidraPayment.walletAddress, 'sidra-addr')}
                      className="text-xs text-purple-300 hover:underline flex items-center gap-1 font-semibold"
                    >
                      {copiedField === 'sidra-addr' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'sidra-addr' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-slate-200 text-[11px] break-all bg-slate-950 p-2 rounded border border-slate-800">
                    {paymentConfig.sidraPayment.walletAddress}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div>
                    <span className="text-[10px] text-purple-400 font-semibold block">Required Sidra Memo:</span>
                    <span className="font-mono font-bold text-white text-sm">{paymentConfig.sidraPayment.memo}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(paymentConfig.sidraPayment.memo, 'sidra-memo')}
                    className="text-xs text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800"
                  >
                    Copy Memo
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* 3. The WhatsApp Button */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current text-white" />
              <span>
                {selectedMethod === 'international'
                  ? 'Get Your Payment Address & Payment Code'
                  : 'Get Your Download Code'}
              </span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              {selectedMethod === 'international'
                ? `Opens WhatsApp directly to ${paymentConfig.artistName} (${paymentConfig.whatsappNumber}) to get your payment address & payment code.`
                : `Opens WhatsApp directly to ${paymentConfig.artistName} (${paymentConfig.whatsappNumber}) with your payment proof to get your download code.`}
            </p>
          </div>

          {/* 4. The Code Box: "input the code in the box" */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Enter Received Download Code:
              </label>
              {validCodeObj && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Code Verified!
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Enter download code"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-white font-mono text-base tracking-wider uppercase focus:outline-none transition-colors ${
                  validCodeObj
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-300'
                    : codeError
                    ? 'border-red-500/80 text-red-200'
                    : 'border-slate-700 text-white focus:border-emerald-500'
                }`}
              />
              {enteredCode && (
                <button
                  type="button"
                  onClick={() => setEnteredCode('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {codeError && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{codeError}</span>
              </p>
            )}
          </div>

          {/* 5. Inactive / Active Download Button (Core requirement!) */}
          <div className="space-y-2 pt-1">
            {validCodeObj ? (
              /* ACTIVE DOWNLOAD BUTTON (When code is correct) */
              <button
                type="button"
                onClick={handleStartDownload}
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/40 active:scale-95 animate-pulse"
              >
                <Download className="w-5 h-5" />
                <span>Download Full Song Now (Active)</span>
              </button>
            ) : (
              /* INACTIVE DOWNLOAD BUTTON (Greyed out / Disabled until code is verified) */
              <button
                type="button"
                disabled
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl bg-slate-800/80 text-slate-500 font-bold text-xs uppercase tracking-wider border border-slate-700/60 cursor-not-allowed opacity-75"
              >
                <Lock className="w-4 h-4 text-slate-500" />
                <span>Download Locked (Enter Code Above)</span>
              </button>
            )}

            {downloadTriggered && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs text-center flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Full Master Song Archive download started! Check your device downloads.</span>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Artist: {paymentConfig.artistName}
          </span>
          <span className="font-mono text-emerald-400">Master 320kbps MP3 + WAV</span>
        </div>

      </div>
    </div>
  );
};
