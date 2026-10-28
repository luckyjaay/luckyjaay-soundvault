import React, { useState } from 'react';
import {
  X,
  Heart,
  Sparkles,
  Building2,
  Globe,
  Coins,
  Wallet,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentConfig, PaymentMethodType } from '../types';
import { normalizeWhatsAppNumber } from '../utils/storage';

interface SupportCareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentConfig: PaymentConfig;
  universalCode?: string;
  onOpenUnlockModal?: () => void;
}

export const SupportCareerModal: React.FC<SupportCareerModalProps> = ({
  isOpen,
  onClose,
  paymentConfig,
  universalCode = 'LUCKY2026',
  onOpenUnlockModal,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('local');
  const [customAmount, setCustomAmount] = useState<string>('5000');
  const [fanName, setFanName] = useState<string>('');
  const [fanMessage, setFanMessage] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [hasClaimedGift, setHasClaimedGift] = useState<boolean>(false);

  if (!isOpen) return null;

  const currencySymbol = paymentConfig.globalPricing?.localCurrencySymbol || '₦';

  // Preset amount suggestions based on active method
  const getPresets = () => {
    switch (selectedMethod) {
      case 'local':
        return [
          { label: '₦1,000', value: '1000' },
          { label: '₦2,500', value: '2500' },
          { label: '₦5,000', value: '5000' },
          { label: '₦10,000', value: '10000' },
          { label: '₦25,000', value: '25000' },
          { label: '₦50,000', value: '50000' },
          { label: '₦100,000', value: '100000' },
        ];
      case 'usdt':
      case 'international':
        return [
          { label: '$5 USDT', value: '5' },
          { label: '$10 USDT', value: '10' },
          { label: '$25 USDT', value: '25' },
          { label: '$50 USDT', value: '50' },
          { label: '$100 USDT', value: '100' },
          { label: '$250 USDT', value: '250' },
        ];
      case 'btc':
        return [
          { label: '$10 BTC', value: '10' },
          { label: '$25 BTC', value: '25' },
          { label: '$50 BTC', value: '50' },
          { label: '$100 BTC', value: '100' },
          { label: '$250 BTC', value: '250' },
          { label: '$500 BTC', value: '500' },
        ];
      case 'bnb':
        return [
          { label: '$5 BNB', value: '5' },
          { label: '$10 BNB', value: '10' },
          { label: '$25 BNB', value: '25' },
          { label: '$50 BNB', value: '50' },
          { label: '$100 BNB', value: '100' },
          { label: '$250 BNB', value: '250' },
        ];
      case 'pi':
        return [
          { label: '1 π', value: '1' },
          { label: '5 π', value: '5' },
          { label: '10 π', value: '10' },
          { label: '25 π', value: '25' },
          { label: '50 π', value: '50' },
          { label: '100 π', value: '100' },
        ];
      case 'sidra':
        return [
          { label: '2 SDA', value: '2' },
          { label: '5 SDA', value: '5' },
          { label: '10 SDA', value: '10' },
          { label: '25 SDA', value: '25' },
          { label: '50 SDA', value: '50' },
          { label: '100 SDA', value: '100' },
        ];
    }
  };

  const getMethodDisplayAmount = () => {
    const val = customAmount.trim() || '0';
    switch (selectedMethod) {
      case 'local':
        return `${currencySymbol}${Number(val).toLocaleString() || val}`;
      case 'usdt':
      case 'international':
        return `${val} USDT (TRC20)`;
      case 'btc':
        return `$${val} USD in BTC`;
      case 'bnb':
        return `$${val} USD in BNB (BEP20)`;
      case 'pi':
        return `${val} Pi (π)`;
      case 'sidra':
        return `${val} SDA (Sidra)`;
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleOpenWhatsAppSupport = () => {
    const cleanPhone = normalizeWhatsAppNumber(paymentConfig.whatsappNumber);
    const methodNames: Record<PaymentMethodType, string> = {
      local: `Local Bank / OPay (${paymentConfig.localPayment.accountNumber})`,
      usdt: 'Tether USDT (TRON TRC20)',
      btc: 'Bitcoin (BTC)',
      bnb: 'BNB Smart Chain (BEP20)',
      pi: 'Pi Network Wallet',
      sidra: 'Sidra Chain / Sidra Bank',
      international: 'Tether USDT (TRON TRC20)',
    };

    const sender = fanName.trim() ? fanName.trim() : 'A Proud Fan';
    const noteText = fanMessage.trim() ? `\n💬 Note: "${fanMessage.trim()}"` : '';

    const message = `Hello ${paymentConfig.artistName || 'Lucky Jaay'}! 🎵❤️\n\nI want to support your music career with ${getMethodDisplayAmount()} via ${methodNames[selectedMethod]}!\n\nFrom: ${sender}${noteText}\n\nPlease find my support proof. Keep making great music!`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleClaimVIPGift = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
      });
    } catch {
      // ignore
    }
    setHasClaimedGift(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#0c1018] border-2 border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Glowing Top Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-emerald-400 to-teal-400"></div>

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-slate-950 shadow-md">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                <span>Support Lucky Jaay's Music Career</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  OPEN AMOUNT
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                You decide how much you want to support with • 4 Payment Options
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Support Modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          
          {/* Welcome Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/30 text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Direct Independent Music Sponsorship</span>
            </div>
            <p>
              Thank you for believing in <strong className="text-white">{paymentConfig.artistName || 'Lucky Jaay'}</strong>. There is no fixed price here—every support from your heart funds studio recording sessions, mixing, video shoots, and brand promotion.
            </p>
          </div>

          {/* Step 1: Fan Decides The Amount */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
                <span>Choose or Type Your Support Amount:</span>
              </label>
              <span className="font-mono font-black text-sm text-amber-400">
                {getMethodDisplayAmount()}
              </span>
            </div>

            {/* Custom Amount Input Box */}
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 font-bold font-mono text-base">
                {selectedMethod === 'local' ? currencySymbol : (selectedMethod === 'usdt' || selectedMethod === 'international') ? '₮' : selectedMethod === 'btc' ? '₿' : selectedMethod === 'bnb' ? 'BNB' : selectedMethod === 'pi' ? 'π' : 'SDA'}
              </span>
              <input
                type="number"
                min="1"
                step="any"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Type any amount you want..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900 border-2 border-amber-500/40 focus:border-amber-400 text-white font-mono text-lg font-bold tracking-wide focus:outline-none"
              />
            </div>

            {/* Preset Amount Chips */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Quick Amount Choices:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {getPresets().map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setCustomAmount(p.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      customAmount === p.value
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Payment Options Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Your Preferred Payment Option:
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* Option 1: Local */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('local');
                  if (!['1000', '2500', '5000', '10000', '25000', '50000', '100000'].includes(customAmount)) {
                    setCustomAmount('5000');
                  }
                }}
                className={`p-3 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer ${
                  selectedMethod === 'local'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit mb-2">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">Local Bank / OPay</span>
                  <span className="text-[10px] text-emerald-400">Naira • MoMo</span>
                </div>
              </button>

              {/* Option 2: Tether USDT (TRC20) */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('usdt');
                  if (!['5', '10', '25', '50', '100', '250'].includes(customAmount)) {
                    setCustomAmount('25');
                  }
                }}
                className={`p-3 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer ${
                  selectedMethod === 'usdt' || selectedMethod === 'international'
                    ? 'bg-teal-950/60 border-teal-500 text-teal-200 shadow-md ring-2 ring-teal-500/30'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs mb-2 border border-teal-500/30">
                  ₮
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">Tether USDT</span>
                  <span className="text-[10px] text-teal-400">TRON (TRC-20)</span>
                </div>
              </button>

              {/* Option 3: Bitcoin (BTC) */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('btc');
                  if (!['10', '25', '50', '100', '250', '500'].includes(customAmount)) {
                    setCustomAmount('50');
                  }
                }}
                className={`p-3 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer ${
                  selectedMethod === 'btc'
                    ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-md ring-2 ring-amber-500/30'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-2 border border-amber-500/30">
                  ₿
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">Bitcoin</span>
                  <span className="text-[10px] text-amber-400">BTC Mainnet</span>
                </div>
              </button>

              {/* Option 4: BNB Smart Chain (BEP20) */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('bnb');
                  if (!['5', '10', '25', '50', '100', '250'].includes(customAmount)) {
                    setCustomAmount('25');
                  }
                }}
                className={`p-3 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer ${
                  selectedMethod === 'bnb'
                    ? 'bg-yellow-950/60 border-yellow-500 text-yellow-200 shadow-md ring-2 ring-yellow-500/30'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold text-[9px] mb-2 border border-yellow-500/30">
                  BNB
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">BNB Smart Chain</span>
                  <span className="text-[10px] text-yellow-400">BSC (BEP-20)</span>
                </div>
              </button>

              {/* Option 5: Pi Network */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('pi');
                  if (!['1', '5', '10', '25', '50', '100'].includes(customAmount)) {
                    setCustomAmount('10');
                  }
                }}
                className={`p-3 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer ${
                  selectedMethod === 'pi'
                    ? 'bg-purple-950/60 border-purple-500 text-purple-200 shadow-md ring-2 ring-purple-500/30'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 w-fit mb-2">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">Pi Network</span>
                  <span className="text-[10px] text-purple-400">Pi Browser</span>
                </div>
              </button>

              {/* Option 6: Sidra Chain */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('sidra');
                  if (!['2', '5', '10', '25', '50', '100'].includes(customAmount)) {
                    setCustomAmount('10');
                  }
                }}
                className={`p-3 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer ${
                  selectedMethod === 'sidra'
                    ? 'bg-blue-950/60 border-blue-500 text-blue-200 shadow-md ring-2 ring-blue-500/30'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 w-fit mb-2">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">Sidra Chain</span>
                  <span className="text-[10px] text-blue-400">Sidra Bank</span>
                </div>
              </button>
            </div>
          </div>

          {/* Step 3: Payment Details Card for Selected Option */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            
            {/* OPTION 1: LOCAL BANK / OPAY */}
            {selectedMethod === 'local' && (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>Local Bank & OPay Account</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Instant Transfer</span>
                </div>

                <div className="space-y-2">
                  {/* Account Number */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Account / Phone Number (OPay)</span>
                      <span className="font-mono text-lg font-black text-emerald-400 tracking-wider">
                        {paymentConfig.localPayment.accountNumber || paymentConfig.whatsappNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(paymentConfig.localPayment.accountNumber || paymentConfig.whatsappNumber, 'account')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold cursor-pointer"
                    >
                      {copiedField === 'account' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'account' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Bank & Name */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Bank Name</span>
                      <span className="font-bold text-white">{paymentConfig.localPayment.bankName || 'OPay'}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Account Name</span>
                      <span className="font-bold text-white truncate">{paymentConfig.localPayment.accountName || paymentConfig.artistName}</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {paymentConfig.localPayment.instructions || 'Send your chosen support amount via OPay, PalmPay, or Bank Transfer, then click the WhatsApp button below.'}
                </p>
              </div>
            )}

            {/* OPTION 2: TETHER USDT (TRON TRC20) */}
            {(selectedMethod === 'usdt' || selectedMethod === 'international') && (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">₮</span>
                    <span>Tether USDT (TRON TRC-20)</span>
                  </span>
                  <span className="text-[10px] font-mono text-teal-300">Fast 1-2 Mins • Low Fee</span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-medium">TRC20 USDT Wallet Address</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(paymentConfig.usdtPayment?.walletAddress || 'TYDZSXDzpjyWPvg1Z7sA2996hR3P45t6TR', 'usdt')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold cursor-pointer"
                      >
                        {copiedField === 'usdt' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'usdt' ? 'Copied' : 'Copy Address'}</span>
                      </button>
                    </div>
                    <span className="font-mono text-xs text-teal-300 break-all block font-semibold">
                      {paymentConfig.usdtPayment?.walletAddress || 'TYDZSXDzpjyWPvg1Z7sA2996hR3P45t6TR'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-teal-950/30 border border-teal-800/40 text-[11px] text-teal-200">
                    Network: <strong>TRON (TRC-20)</strong>. Send only USDT via the TRON network from any exchange or wallet.
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {paymentConfig.usdtPayment?.instructions || 'Send your chosen USDT support amount via TRON TRC20, then tap the WhatsApp button below with transaction screenshot.'}
                </p>
              </div>
            )}

            {/* OPTION 3: BITCOIN (BTC) */}
            {selectedMethod === 'btc' && (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">₿</span>
                    <span>Bitcoin (BTC Mainnet)</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-300">1 Confirmation</span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Bitcoin (BTC) Wallet Address</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(paymentConfig.btcPayment?.walletAddress || 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', 'btc')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer"
                      >
                        {copiedField === 'btc' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'btc' ? 'Copied' : 'Copy Address'}</span>
                      </button>
                    </div>
                    <span className="font-mono text-xs text-amber-300 break-all block font-semibold">
                      {paymentConfig.btcPayment?.walletAddress || 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200">
                    Network: <strong>Bitcoin (BTC Mainnet)</strong>. Send only native Bitcoin (BTC) to this address.
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {paymentConfig.btcPayment?.instructions || 'Send Bitcoin to the address above. Copy your TXID and tap WhatsApp below to send verification to artist.'}
                </p>
              </div>
            )}

            {/* OPTION 4: BNB SMART CHAIN (BEP20) */}
            {selectedMethod === 'bnb' && (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-bold text-[9px]">BNB</span>
                    <span>BNB Smart Chain (BEP-20)</span>
                  </span>
                  <span className="text-[10px] font-mono text-yellow-300">Fast 3s • Near-Zero Gas</span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-medium">BNB (BEP20) Wallet Address</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(paymentConfig.bnbPayment?.walletAddress || '0x71C83457D2840004cE7A03EaC267c827B735160E', 'bnb')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-xs font-semibold cursor-pointer"
                      >
                        {copiedField === 'bnb' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'bnb' ? 'Copied' : 'Copy Address'}</span>
                      </button>
                    </div>
                    <span className="font-mono text-xs text-yellow-300 break-all block font-semibold">
                      {paymentConfig.bnbPayment?.walletAddress || '0x71C83457D2840004cE7A03EaC267c827B735160E'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-yellow-950/30 border border-yellow-800/40 text-[11px] text-yellow-200">
                    Network: <strong>BNB Smart Chain (BSC / BEP20)</strong>. Send BNB or BEP20 tokens via BSC network only.
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {paymentConfig.bnbPayment?.instructions || 'Send BNB via BNB Smart Chain BEP20. Tap WhatsApp below with your transaction hash.'}
                </p>
              </div>
            )}

            {/* OPTION 3: PI NETWORK */}
            {selectedMethod === 'pi' && (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Coins className="w-4 h-4" />
                    <span>Pi Network Public Wallet</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Pi Browser Mainnet</span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Pi Public Wallet Address</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(paymentConfig.piPayment.walletAddress, 'pi-addr')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer"
                      >
                        {copiedField === 'pi-addr' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'pi-addr' ? 'Copied' : 'Copy Address'}</span>
                      </button>
                    </div>
                    <span className="font-mono text-xs text-amber-300 break-all block font-semibold">
                      {paymentConfig.piPayment.walletAddress}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Required Transfer Memo</span>
                      <span className="font-mono font-bold text-white">{paymentConfig.piPayment.memo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(paymentConfig.piPayment.memo, 'pi-memo')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                    >
                      {copiedField === 'pi-memo' ? 'Copied' : 'Copy Memo'}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {paymentConfig.piPayment.instructions || 'Open Pi Browser, navigate to wallet.pi, send your chosen Pi support amount with the required memo.'}
                </p>
              </div>
            )}

            {/* OPTION 4: SIDRA CHAIN */}
            {selectedMethod === 'sidra' && (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    <span>Sidra Chain Wallet Address</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Sidra Mainnet</span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Sidra Chain Address</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(paymentConfig.sidraPayment.walletAddress, 'sidra-addr')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold cursor-pointer"
                      >
                        {copiedField === 'sidra-addr' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'sidra-addr' ? 'Copied' : 'Copy Address'}</span>
                      </button>
                    </div>
                    <span className="font-mono text-xs text-purple-300 break-all block font-semibold">
                      {paymentConfig.sidraPayment.walletAddress}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Required Sidra Memo</span>
                      <span className="font-mono font-bold text-white">{paymentConfig.sidraPayment.memo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(paymentConfig.sidraPayment.memo, 'sidra-memo')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                    >
                      {copiedField === 'sidra-memo' ? 'Copied' : 'Copy Memo'}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {paymentConfig.sidraPayment.instructions || 'Send SDA on Sidra Chain mainnet including the memo, then message artist on WhatsApp.'}
                </p>
              </div>
            )}

          </div>

          {/* Step 4: Supporter Personalization Form (Optional) */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
              Personalize Your Support (Optional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Your Name / Fan Tag</label>
                <input
                  type="text"
                  value={fanName}
                  onChange={(e) => setFanName(e.target.value)}
                  placeholder="e.g. Chinedu from Imo State"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Message for Lucky Jaay</label>
                <input
                  type="text"
                  value={fanMessage}
                  onChange={(e) => setFanMessage(e.target.value)}
                  placeholder="e.g. Keep inspiring us with your music!"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Step 5: Direct Action Buttons */}
          <div className="space-y-3 pt-1">
            {/* WhatsApp Support Button */}
            <button
              type="button"
              onClick={handleOpenWhatsAppSupport}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/25 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Send Support Proof via WhatsApp ({getMethodDisplayAmount()})</span>
            </button>

            {/* Claim VIP Supporter Pass Button */}
            {!hasClaimedGift ? (
              <button
                type="button"
                onClick={handleClaimVIPGift}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-amber-400" />
                <span>I Have Made Payment • Claim My VIP Supporter Download Pass</span>
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/70 border-2 border-emerald-500/60 text-center space-y-2 animate-fade-in">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  🎉 Thank You For Supporting Lucky Jaay!
                </span>
                <p className="text-xs text-slate-200">
                  Here is your official VIP Supporter Download Code to unlock songs:
                </p>
                <div className="inline-flex items-center gap-2 p-2 px-4 rounded-xl bg-slate-950 border border-emerald-500/50">
                  <span className="font-mono text-xl font-black text-emerald-300 tracking-wider">
                    {universalCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(universalCode, 'vip-code')}
                    className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {copiedField === 'vip-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {onOpenUnlockModal && (
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenUnlockModal();
                      }}
                      className="text-xs text-emerald-400 hover:underline font-bold inline-flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <span>Unlock Songs Now with this Code</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
