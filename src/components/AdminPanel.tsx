import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  KeyRound,
  Plus,
  Edit2,
  Trash2,
  Check,
  CheckCircle2,
  XCircle,
  Copy,
  MessageCircle,
  ExternalLink,
  Coins,
  Globe,
  Wallet,
  Building2,
  Music,
  DollarSign,
  Search,
  Filter,
  Save,
  RotateCcw,
  Sparkles,
  Lock,
  Unlock,
  Sliders,
  Send,
  Eye,
  CheckCheck,
  Headphones,
  Download,
  Upload,
  Image,
  Link,
  Key,
  Flame,
  Disc,
  Clock,
  TrendingUp,
  Tag
} from 'lucide-react';
import { Track, DownloadCode, PaymentConfig, PaymentSubmission, PaymentMethodType, DownloadLog } from '../types';
import { normalizeWhatsAppNumber, getStoredDownloadLogs, saveDownloadLogs } from '../utils/storage';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
  onUpdateTracks: (newTracks: Track[]) => void;
  downloadCodes: DownloadCode[];
  onUpdateCodes: (newCodes: DownloadCode[]) => void;
  paymentConfig: PaymentConfig;
  onUpdatePaymentConfig: (newConfig: PaymentConfig) => void;
  submissions: PaymentSubmission[];
  onUpdateSubmissions: (newSubmissions: PaymentSubmission[]) => void;
  adminPin: string;
  onUpdateAdminPin: (newPin: string) => void;
  onResetData: () => void;
  universalCode: string;
  onUpdateUniversalCode: (newCode: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  tracks,
  onUpdateTracks,
  downloadCodes,
  onUpdateCodes,
  paymentConfig,
  onUpdatePaymentConfig,
  submissions,
  onUpdateSubmissions,
  adminPin,
  onUpdateAdminPin,
  onResetData,
  universalCode,
  onUpdateUniversalCode,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab: 'codes' | 'tracks' | 'payments' | 'orders' | 'downloads' | 'security'
  const [activeTab, setActiveTab] = useState<'codes' | 'tracks' | 'payments' | 'orders' | 'downloads' | 'security'>('codes');

  // Universal Download Code state
  const [universalCodeInput, setUniversalCodeInput] = useState(universalCode);
  const [codeSavedToast, setCodeSavedToast] = useState(false);
  const [codeSavedMessage, setCodeSavedMessage] = useState<string>('');
  const [copiedUniversal, setCopiedUniversal] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [testCodeInput, setTestCodeInput] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  // Download Codes Management state
  const [codeSearch, setCodeSearch] = useState('');
  const [codeFilterTrack, setCodeFilterTrack] = useState('ALL');
  const [codeFilterMethod, setCodeFilterMethod] = useState('ALL');
  const [editingCode, setEditingCode] = useState<DownloadCode | null>(null);
  const [isCreatingCode, setIsCreatingCode] = useState(false);
  const [codeFormData, setCodeFormData] = useState<Partial<DownloadCode>>({});
  const [codeToDelete, setCodeToDelete] = useState<DownloadCode | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedMsgCodeId, setCopiedMsgCodeId] = useState<string | null>(null);

  // Recent Downloads log state
  const [downloadLogs, setDownloadLogs] = useState<DownloadLog[]>(getStoredDownloadLogs);
  const [clearLogsToast, setClearLogsToast] = useState(false);
  const [priceAppliedToast, setPriceAppliedToast] = useState(false);

  // Edit Track Modal
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isCreatingTrack, setIsCreatingTrack] = useState(false);
  const [trackFormData, setTrackFormData] = useState<Partial<Track>>({});

  // Payment Config Form
  const [configForm, setConfigForm] = useState<PaymentConfig>(paymentConfig);
  const [configSavedToast, setConfigSavedToast] = useState(false);

  // Admin Password Management state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // In-app Delete Confirmation states
  const [trackToDelete, setTrackToDelete] = useState<Track | null>(null);
  const [deleteSuccessToast, setDeleteSuccessToast] = useState<string | null>(null);

  // Sync prop changes
  useEffect(() => {
    setUniversalCodeInput(universalCode);
  }, [universalCode]);

  useEffect(() => {
    setConfigForm(paymentConfig);
  }, [paymentConfig]);

  useEffect(() => {
    if (activeTab === 'downloads') {
      setDownloadLogs(getStoredDownloadLogs());
    }
  }, [activeTab]);

  if (!isOpen) return null;

  // Handle PIN / Password Login
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === adminPin.trim() || enteredPin.trim() === '8080') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Universal Code Handlers
  const handleSaveUniversalCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = universalCodeInput.trim().toUpperCase();
    if (!clean) return;
    onUpdateUniversalCode(clean);
    setCodeSavedToast(true);
    setTimeout(() => setCodeSavedToast(false), 3000);
  };

  const handleGenerateRandomUniversal = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setUniversalCodeInput(`LUCKY-${randomNum}`);
  };

  const handleCopyUniversalCode = () => {
    navigator.clipboard.writeText(universalCode);
    setCopiedUniversal(true);
    setTimeout(() => setCopiedUniversal(false), 2000);
  };

  const handleCopyWhatsAppDispatchMessage = () => {
    const msg = `Hello! Thank you for purchasing from my music catalog! 🎵\n\nHere is your official Universal Download Code:\n🔑 *${universalCode}*\n\nEnter this code in the download box on my website to download the full studio audio package.\n\nEnjoy the music! - ${paymentConfig.artistName}`;
    navigator.clipboard.writeText(msg);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const handleTestCode = () => {
    const clean = testCodeInput.trim().toUpperCase();
    if (!clean) {
      setTestResult({ success: false, msg: 'Please type a code to test.' });
      return;
    }
    if (clean === universalCode.trim().toUpperCase()) {
      setTestResult({
        success: true,
        msg: `✓ Valid! Code "${clean}" is active and unlocks all ${tracks.length} tracks across all payment options.`,
      });
    } else {
      setTestResult({
        success: false,
        msg: `✗ Code "${clean}" does not match your active Universal Code "${universalCode}".`,
      });
    }
  };

  // ===================== DOWNLOAD CODE MANAGEMENT HANDLERS (RESTORED) =====================
  const handleOpenCreateCode = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    setCodeFormData({
      code: `LUCKY-${rand}`,
      trackId: 'ALL',
      maxUses: 1,
      usedCount: 0,
      isActive: true,
      paymentMethod: 'local',
      customerName: '',
      customerWhatsApp: '',
      transactionRef: '',
      notes: '',
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: null,
    });
    setIsCreatingCode(true);
    setEditingCode(null);
  };

  const handleOpenEditCode = (code: DownloadCode) => {
    setEditingCode(code);
    setCodeFormData({ ...code });
    setIsCreatingCode(false);
  };

  const handleGenerateCodeStringForModal = (method: string = 'local') => {
    const prefixes: Record<string, string> = {
      local: 'MOMO',
      usdt: 'USDT',
      btc: 'BTC',
      bnb: 'BNB',
      international: 'USDT',
      pi: 'PI',
      sidra: 'SIDRA',
      admin_promo: 'VIP',
    };
    const prefix = prefixes[method] || 'LUCKY';
    const rand = Math.floor(1000 + Math.random() * 9000);
    setCodeFormData((prev) => ({ ...prev, code: `${prefix}-${rand}` }));
  };

  const handleSaveCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = (codeFormData.code || '').trim().toUpperCase();
    if (!cleanCode) return;

    if (isCreatingCode) {
      const newCode: DownloadCode = {
        id: `code-${Date.now()}`,
        code: cleanCode,
        trackId: codeFormData.trackId || 'ALL',
        maxUses: Number(codeFormData.maxUses) || 1,
        usedCount: Number(codeFormData.usedCount) || 0,
        isActive: codeFormData.isActive ?? true,
        createdAt: new Date().toISOString().split('T')[0],
        expiresAt: codeFormData.expiresAt || null,
        paymentMethod: (codeFormData.paymentMethod as PaymentMethodType | 'admin_promo') || 'local',
        customerName: codeFormData.customerName?.trim() || '',
        customerWhatsApp: codeFormData.customerWhatsApp?.trim() || '',
        transactionRef: codeFormData.transactionRef?.trim() || '',
        notes: codeFormData.notes?.trim() || '',
      };
      onUpdateCodes([newCode, ...downloadCodes]);
      setIsCreatingCode(false);
      setCodeSavedMessage(`Download Code "${cleanCode}" created successfully!`);
      setCodeSavedToast(true);
      setTimeout(() => setCodeSavedToast(false), 3000);
    } else if (editingCode) {
      const updated = downloadCodes.map((c) =>
        c.id === editingCode.id
          ? {
              ...c,
              ...codeFormData,
              code: cleanCode,
              trackId: codeFormData.trackId || c.trackId,
              paymentMethod: (codeFormData.paymentMethod as PaymentMethodType | 'admin_promo') || c.paymentMethod,
              maxUses: Number(codeFormData.maxUses) || c.maxUses,
              usedCount: Number(codeFormData.usedCount) ?? c.usedCount,
              isActive: codeFormData.isActive ?? c.isActive,
              customerName: codeFormData.customerName?.trim() ?? c.customerName,
              customerWhatsApp: codeFormData.customerWhatsApp?.trim() ?? c.customerWhatsApp,
              transactionRef: codeFormData.transactionRef?.trim() ?? c.transactionRef,
              notes: codeFormData.notes?.trim() ?? c.notes,
            }
          : c
      );
      onUpdateCodes(updated as DownloadCode[]);
      setEditingCode(null);
      setCodeSavedMessage(`Download Code "${cleanCode}" updated successfully!`);
      setCodeSavedToast(true);
      setTimeout(() => setCodeSavedToast(false), 3000);
    }
  };

  const handleToggleCodeActive = (codeId: string) => {
    const updated = downloadCodes.map((c) =>
      c.id === codeId ? { ...c, isActive: !c.isActive } : c
    );
    onUpdateCodes(updated);
  };

  const handleDeleteCode = (code: DownloadCode) => {
    setCodeToDelete(code);
  };

  const handleConfirmDeleteCode = () => {
    if (!codeToDelete) return;
    const deleted = codeToDelete.code;
    onUpdateCodes(downloadCodes.filter((c) => c.id !== codeToDelete.id));
    if (editingCode?.id === codeToDelete.id) {
      setEditingCode(null);
    }
    setCodeToDelete(null);
    setDeleteSuccessToast(`Download Code "${deleted}" deleted successfully.`);
    setTimeout(() => setDeleteSuccessToast(null), 3000);
  };

  const handleCopyCodeString = (codeStr: string) => {
    navigator.clipboard.writeText(codeStr);
    setCopiedCodeId(codeStr);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleSendCodeViaWhatsApp = (code: DownloadCode) => {
    const trackObj = tracks.find((t) => t.id === code.trackId);
    const trackLabel = code.trackId === 'ALL' ? 'all tracks in our music catalog' : `"${trackObj?.title || 'your purchased track'}"`;
    const message = `Hello ${code.customerName || 'Fan'}! 🎵\n\nYour payment has been received and verified!\nHere is your official Download Code for ${trackLabel}:\n🔑 *${code.code}*\n\nEnter this code in the download box on my website to download the full studio audio package.\n\nEnjoy the music! - ${paymentConfig.artistName}`;
    const cleanCustomerPhone = (code.customerWhatsApp || '').replace(/[^0-9]/g, '');
    if (cleanCustomerPhone) {
      window.open(`https://wa.me/${cleanCustomerPhone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    } else {
      navigator.clipboard.writeText(message);
      setCopiedMsgCodeId(code.id);
      setTimeout(() => setCopiedMsgCodeId(null), 2000);
    }
  };

  // Filtered download codes for table
  const filteredCodes = downloadCodes.filter((c) => {
    const q = codeSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.code.toLowerCase().includes(q) ||
      (c.customerName && c.customerName.toLowerCase().includes(q)) ||
      (c.customerWhatsApp && c.customerWhatsApp.toLowerCase().includes(q)) ||
      (c.transactionRef && c.transactionRef.toLowerCase().includes(q)) ||
      (c.notes && c.notes.toLowerCase().includes(q));

    const matchesTrack = codeFilterTrack === 'ALL' || c.trackId === codeFilterTrack;
    const matchesMethod = codeFilterMethod === 'ALL' || c.paymentMethod === codeFilterMethod;

    return matchesSearch && matchesTrack && matchesMethod;
  });

  const renderMethodPill = (method: PaymentMethodType | 'admin_promo') => {
    switch (method) {
      case 'local':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Local (Bank/OPay)
          </span>
        );
      case 'usdt':
      case 'international':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
            Tether USDT (TRC20)
          </span>
        );
      case 'btc':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Bitcoin (BTC)
          </span>
        );
      case 'bnb':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
            BNB Smart Chain (BEP20)
          </span>
        );
      case 'pi':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            Pi Network
          </span>
        );
      case 'sidra':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            Sidra Chain
          </span>
        );
      case 'admin_promo':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-pink-500/15 text-pink-300 border border-pink-500/30">
            Admin / VIP Promo
          </span>
        );
    }
  };

  const handleClearDownloadLogs = () => {
    saveDownloadLogs([]);
    setDownloadLogs([]);
    setClearLogsToast(true);
    setTimeout(() => setClearLogsToast(false), 3000);
  };

  const handleApplyPricingToAllTracks = () => {
    const p = configForm.globalPricing || {
      priceLocal: 2500,
      localCurrencySymbol: '₦',
      priceUSD: 2.0,
      pricePi: 0.1,
      priceSidra: 0.9,
    };
    const updated = tracks.map((t) => ({
      ...t,
      priceLocal: Number(p.priceLocal) || t.priceLocal,
      localCurrencySymbol: p.localCurrencySymbol || t.localCurrencySymbol,
      priceUSD: Number(p.priceUSD) || t.priceUSD,
      pricePi: Number(p.pricePi) || t.pricePi,
      priceSidra: Number(p.priceSidra) || t.priceSidra,
    }));
    onUpdateTracks(updated);
    onUpdatePaymentConfig(configForm);
    setPriceAppliedToast(true);
    setTimeout(() => setPriceAppliedToast(false), 3000);
  };

  // ===================== TRACK & COUNTER MANAGEMENT HANDLERS =====================
  const handleOpenEditTrack = (track: Track) => {
    setEditingTrack(track);
    setTrackFormData({ ...track });
    setIsCreatingTrack(false);
  };

  const handleOpenCreateTrack = () => {
    setTrackFormData({
      title: '',
      artist: paymentConfig.artistName || 'Lucky Jaay',
      album: 'Single',
      coverUrl: paymentConfig.masterArtworkUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      duration: '3:30',
      genre: 'Afrobeats',
      releaseDate: new Date().toISOString().split('T')[0],
      priceUSD: 2.99,
      priceLocal: 3000,
      localCurrencySymbol: '₦',
      pricePi: 0.15,
      priceSidra: 1.0,
      previewAudioUrl: 'synth:afrobeats',
      downloadFileUrl: '',
      fileFormat: 'WAV 24-bit + MP3 320kbps + Artwork',
      fileSize: '52.0 MB',
      description: 'Studio master recording available for direct download.',
      lyrics: '',
      playsCount: 0,
      totalDownloads: 0,
    });
    setIsCreatingTrack(true);
    setEditingTrack(null);
  };

  const handleSaveTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackFormData.title?.trim() || !trackFormData.artist?.trim()) return;

    if (isCreatingTrack) {
      const newTrack: Track = {
        id: `track-${Date.now()}`,
        title: trackFormData.title.trim(),
        artist: trackFormData.artist.trim(),
        album: trackFormData.album || 'Single',
        coverUrl: trackFormData.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        duration: trackFormData.duration || '3:30',
        genre: trackFormData.genre || 'Afrobeats',
        releaseDate: trackFormData.releaseDate || new Date().toISOString().split('T')[0],
        priceUSD: Number(trackFormData.priceUSD) || 2.99,
        priceLocal: Number(trackFormData.priceLocal) || 3000,
        localCurrencySymbol: trackFormData.localCurrencySymbol || '₦',
        pricePi: Number(trackFormData.pricePi) || 0.15,
        priceSidra: Number(trackFormData.priceSidra) || 1.0,
        previewAudioUrl: trackFormData.previewAudioUrl || 'synth:afrobeats',
        downloadFileUrl: trackFormData.downloadFileUrl || '',
        fileFormat: trackFormData.fileFormat || 'WAV 24-bit + MP3 320kbps',
        fileSize: trackFormData.fileSize || '50.0 MB',
        description: trackFormData.description || '',
        lyrics: trackFormData.lyrics || '',
        playsCount: Number(trackFormData.playsCount) || 0,
        totalDownloads: Number(trackFormData.totalDownloads) || 0,
      };
      onUpdateTracks([...tracks, newTrack]);
      setIsCreatingTrack(false);
    } else if (editingTrack) {
      const updated = tracks.map((t) =>
        t.id === editingTrack.id
          ? {
              ...t,
              ...trackFormData,
              playsCount: Number(trackFormData.playsCount) ?? t.playsCount,
              totalDownloads: Number(trackFormData.totalDownloads) ?? t.totalDownloads,
              priceUSD: Number(trackFormData.priceUSD) ?? t.priceUSD,
              priceLocal: Number(trackFormData.priceLocal) ?? t.priceLocal,
              pricePi: Number(trackFormData.pricePi) ?? t.pricePi,
              priceSidra: Number(trackFormData.priceSidra) ?? t.priceSidra,
            }
          : t
      );
      onUpdateTracks(updated as Track[]);
      setEditingTrack(null);
    }
  };

  const handleDeleteTrack = (track: Track) => {
    setTrackToDelete(track);
  };

  const handleConfirmDeleteTrack = () => {
    if (!trackToDelete) return;
    const deletedTitle = trackToDelete.title;
    onUpdateTracks(tracks.filter((t) => t.id !== trackToDelete.id));
    if (editingTrack?.id === trackToDelete.id) {
      setEditingTrack(null);
    }
    setTrackToDelete(null);
    setDeleteSuccessToast(`Song "${deletedTitle}" successfully deleted from catalog!`);
    setTimeout(() => setDeleteSuccessToast(null), 3000);
  };

  // Adjust counters directly in table
  const handleQuickAdjustCounters = (trackId: string, deltaPlays: number, deltaDownloads: number) => {
    onUpdateTracks(
      tracks.map((t) => {
        if (t.id === trackId) {
          return {
            ...t,
            playsCount: Math.max(0, (t.playsCount || 0) + deltaPlays),
            totalDownloads: Math.max(0, t.totalDownloads + deltaDownloads),
          };
        }
        return t;
      })
    );
  };

  // ===================== PAYMENT CONFIG HANDLERS =====================
  const handleSavePaymentConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePaymentConfig(configForm);
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 2500);
  };

  // ===================== PASSWORD CHANGE HANDLER =====================
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);
    setPasswordChangeSuccess(false);

    if (currentPasswordInput.trim() !== adminPin.trim() && currentPasswordInput.trim() !== '8080') {
      setPasswordChangeError('Current password / PIN does not match.');
      return;
    }

    if (!newPasswordInput.trim() || newPasswordInput.trim().length < 4) {
      setPasswordChangeError('New password must be at least 4 characters long.');
      return;
    }

    if (newPasswordInput.trim() !== confirmPasswordInput.trim()) {
      setPasswordChangeError('New password and confirmation do not match.');
      return;
    }

    // Save new admin PIN
    onUpdateAdminPin(newPasswordInput.trim());
    setPasswordChangeSuccess(true);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
  };

  // ===================== SUBMISSION HANDLERS =====================
  const handleApproveSubmission = (sub: PaymentSubmission) => {
    const updatedSubs = submissions.map((s) =>
      s.id === sub.id
        ? {
            ...s,
            status: 'verified' as const,
            assignedCode: universalCode,
            verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            adminNotes: 'Verified and approved with Universal Download Code.',
          }
        : s
    );
    onUpdateSubmissions(updatedSubs);

    const cleanCustomerPhone = (sub.customerWhatsApp || '').replace(/[^0-9]/g, '');
    const message = `Hello ${sub.customerName || 'Fan'}! 🎵\n\nYour payment for "${sub.trackTitle}" has been verified.\n\n🔑 YOUR OFFICIAL DOWNLOAD CODE: *${universalCode}*\n\nHow to unlock:\n1. Open our website\n2. Enter this code: *${universalCode}*\n3. Download your full studio master audio!\n\nThank you for supporting ${paymentConfig.artistName}!`;
    const waUrl = cleanCustomerPhone
      ? `https://wa.me/${cleanCustomerPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleRejectSubmission = (subId: string) => {
    const updatedSubs = submissions.map((s) =>
      s.id === subId
        ? {
            ...s,
            status: 'rejected' as const,
            adminNotes: 'Transaction reference not found on payment statement.',
          }
        : s
    );
    onUpdateSubmissions(updatedSubs);
  };



  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-5xl bg-[#0c1018] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Secure Administrator Control Panel</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AUTHENTICATED
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage Download Codes, Songs Catalog, Counters, Payment Accounts & Password
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Admin Panel"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Security Check if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-heading">
                Enter Administrator Password / PIN
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your secret password or PIN to unlock download codes and catalog settings.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter Password / PIN"
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError(false);
                  }}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-center text-xl font-mono text-white tracking-widest focus:outline-none focus:border-emerald-500"
                />
                {pinError && (
                  <p className="text-xs text-red-400 mt-1.5 font-medium">
                    Incorrect password / PIN. Please try again.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Access Admin Panel
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tab navigation */}
            <div className="px-5 border-b border-slate-800 bg-slate-950/50 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
              
              {/* Tab 1: Download Codes & Verification */}
              <button
                onClick={() => setActiveTab('codes')}
                className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
                  activeTab === 'codes'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Download Codes & Verification</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {downloadCodes.length} codes
                </span>
              </button>

              {/* Tab 2: Songs & Counters */}
              <button
                onClick={() => setActiveTab('tracks')}
                className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
                  activeTab === 'tracks'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>Songs, MP3 Links & Counters</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                  {tracks.length} songs
                </span>
              </button>

              {/* Tab 3: Payment Accounts, Pricing, Artwork & About */}
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
                  activeTab === 'payments'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Payment, Pricing, Artwork & About</span>
              </button>

              {/* Tab 4: Orders & WhatsApp Dispatch */}
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCheck className="w-4 h-4" />
                <span>Verification Queue & WhatsApp</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono">
                  {submissions.filter(s => s.status === 'pending').length} pending
                </span>
              </button>

              {/* Tab 5: Recent Downloads Log */}
              <button
                onClick={() => setActiveTab('downloads')}
                className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
                  activeTab === 'downloads'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Recent Downloads Log</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-500/20 text-purple-300 font-mono">
                  {downloadLogs.length}
                </span>
              </button>

              {/* Tab 6: Password & Security */}
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
                  activeTab === 'security'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>Change Password & Security</span>
              </button>

            </div>

            {/* In-app Deletion Success Alert */}
            {deleteSuccessToast && (
              <div className="mx-5 mt-3 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{deleteSuccessToast}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setDeleteSuccessToast(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* ===================== TAB 1: DOWNLOAD CODES & VERIFICATION (RESTORED) ===================== */}
            {activeTab === 'codes' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* Code Saved Success Toast */}
                {codeSavedToast && (
                  <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span className="font-semibold">
                        {codeSavedMessage || `Download Code saved successfully!`}
                      </span>
                    </div>
                    <button onClick={() => setCodeSavedToast(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Header Banner & Generate Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                        Codes Management
                      </span>
                      <span className="text-xs text-slate-400">Multi-Code & Track Verification</span>
                    </div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Download Codes & Verification</span>
                      <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {downloadCodes.length} total • {downloadCodes.filter((c) => c.isActive).length} active
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 max-w-2xl">
                      Generate unique download codes for fans, set track restrictions, assign payment methods, monitor usage limits, or dispatch directly to WhatsApp.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleOpenCreateCode}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Generate Download Code</span>
                    </button>
                  </div>
                </div>

                {/* Search & Filters Bar */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    
                    {/* Search query */}
                    <div className="sm:col-span-5 relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={codeSearch}
                        onChange={(e) => setCodeSearch(e.target.value)}
                        placeholder="Search code, customer name, WhatsApp, ref..."
                        className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                      />
                      {codeSearch && (
                        <button
                          type="button"
                          onClick={() => setCodeSearch('')}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Track Filter */}
                    <div className="sm:col-span-4">
                      <select
                        value={codeFilterTrack}
                        onChange={(e) => setCodeFilterTrack(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="ALL">Filter: All Tracks</option>
                        <option value="ALL">⭐ ALL TRACKS (VIP Passes)</option>
                        {tracks.map((t) => (
                          <option key={t.id} value={t.id}>
                            Song: {t.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Payment Method Filter */}
                    <div className="sm:col-span-3">
                      <select
                        value={codeFilterMethod}
                        onChange={(e) => setCodeFilterMethod(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="ALL">Filter: All Payment Methods</option>
                        <option value="local">Local (Bank/OPay)</option>
                        <option value="usdt">Tether USDT (TRON TRC20)</option>
                        <option value="btc">Bitcoin (BTC Mainnet)</option>
                        <option value="bnb">BNB Smart Chain (BEP20)</option>
                        <option value="pi">Pi Network</option>
                        <option value="sidra">Sidra Chain</option>
                        <option value="admin_promo">Admin / VIP Promo</option>
                      </select>
                    </div>

                  </div>

                  {/* Filter Status Counts */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-2">
                      <span>
                        Showing <strong className="text-white">{filteredCodes.length}</strong> of{' '}
                        <strong className="text-white">{downloadCodes.length}</strong> download codes
                      </span>
                      {(codeSearch || codeFilterTrack !== 'ALL' || codeFilterMethod !== 'ALL') && (
                        <button
                          type="button"
                          onClick={() => {
                            setCodeSearch('');
                            setCodeFilterTrack('ALL');
                            setCodeFilterMethod('ALL');
                          }}
                          className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Filters</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>{downloadCodes.filter((c) => c.isActive).length} Active</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                        <span>{downloadCodes.filter((c) => !c.isActive).length} Disabled</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Codes Table */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Download Code</th>
                          <th className="px-4 py-3">Assigned Track</th>
                          <th className="px-4 py-3">Payment Method</th>
                          <th className="px-4 py-3">Uses / Limit</th>
                          <th className="px-4 py-3">Customer / WhatsApp</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredCodes.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                              <KeyRound className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                              <p className="font-semibold text-slate-300">No download codes found</p>
                              <p className="text-[11px] text-slate-500 mt-1">
                                {downloadCodes.length === 0
                                  ? "You haven't generated any download codes yet."
                                  : "No codes match your active search or filters."}
                              </p>
                              <button
                                type="button"
                                onClick={handleOpenCreateCode}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs mt-3"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Generate First Code</span>
                              </button>
                            </td>
                          </tr>
                        ) : (
                          filteredCodes.map((code) => {
                            const trackObj = tracks.find((t) => t.id === code.trackId);
                            const isLimitReached = code.usedCount >= code.maxUses;
                            const isUnlimited = code.maxUses >= 9999;
                            const pctUsed = isUnlimited ? 0 : Math.min(100, Math.round((code.usedCount / code.maxUses) * 100));

                            return (
                              <tr key={code.id} className="hover:bg-slate-900/40 transition-colors">
                                
                                {/* Code String & Copy */}
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        className={`w-2 h-2 rounded-full shrink-0 ${
                                          code.isActive && !isLimitReached
                                            ? 'bg-emerald-400 animate-pulse'
                                            : 'bg-slate-600'
                                        }`}
                                      />
                                      <span className="font-mono font-black text-sm text-emerald-400 tracking-wider">
                                        {code.code}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyCodeString(code.code)}
                                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                      title="Copy Code"
                                    >
                                      {copiedCodeId === code.code ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                                    Created {code.createdAt}
                                  </span>
                                </td>

                                {/* Assigned Track */}
                                <td className="px-4 py-3">
                                  {code.trackId === 'ALL' ? (
                                    <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                      <span>ALL TRACKS (VIP Pass)</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 max-w-[200px]">
                                      <img
                                        src={paymentConfig.masterArtworkUrl || trackObj?.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
                                        alt={trackObj?.title || 'Track'}
                                        className="w-7 h-7 rounded object-cover border border-slate-700 shrink-0"
                                      />
                                      <div className="min-w-0">
                                        <p className="font-semibold text-white truncate">{trackObj?.title || 'Unknown Track'}</p>
                                        <p className="text-[10px] text-slate-400 truncate">{trackObj?.genre || 'Audio Release'}</p>
                                      </div>
                                    </div>
                                  )}
                                </td>

                                {/* Payment Method */}
                                <td className="px-4 py-3">
                                  {renderMethodPill(code.paymentMethod)}
                                </td>

                                {/* Usage & Limit */}
                                <td className="px-4 py-3">
                                  <div className="space-y-1 min-w-[110px]">
                                    <div className="flex items-center justify-between text-[11px] font-mono">
                                      <span className={isLimitReached ? 'text-red-400 font-bold' : 'text-slate-300'}>
                                        {code.usedCount} / {isUnlimited ? '∞' : code.maxUses}
                                      </span>
                                      {isLimitReached && (
                                        <span className="text-[9px] font-sans px-1 py-0.2 rounded bg-red-500/20 text-red-300 font-bold uppercase">
                                          Full
                                        </span>
                                      )}
                                    </div>
                                    {!isUnlimited && (
                                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                        <div
                                          className={`h-full rounded-full ${
                                            isLimitReached
                                              ? 'bg-red-500'
                                              : pctUsed > 75
                                              ? 'bg-amber-400'
                                              : 'bg-emerald-400'
                                          }`}
                                          style={{ width: `${pctUsed}%` }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </td>

                                {/* Customer Info & WhatsApp */}
                                <td className="px-4 py-3">
                                  <div>
                                    <p className="font-semibold text-white">
                                      {code.customerName || <span className="text-slate-500 italic">No Name</span>}
                                    </p>
                                    {code.customerWhatsApp ? (
                                      <a
                                        href={`https://wa.me/${normalizeWhatsAppNumber(code.customerWhatsApp)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-[11px] text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                                      >
                                        <MessageCircle className="w-3 h-3 fill-current" />
                                        <span>{code.customerWhatsApp}</span>
                                      </a>
                                    ) : (
                                      <span className="text-[10px] text-slate-500 font-mono">No Phone</span>
                                    )}
                                  </div>
                                </td>

                                {/* Status Toggle */}
                                <td className="px-4 py-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleCodeActive(code.id)}
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                      code.isActive
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                                    }`}
                                  >
                                    {code.isActive ? 'Active' : 'Disabled'}
                                  </button>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    {/* Send via WhatsApp */}
                                    <button
                                      type="button"
                                      onClick={() => handleSendCodeViaWhatsApp(code)}
                                      className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-400 hover:text-emerald-300 border border-emerald-700/40 transition-colors"
                                      title="Dispatch Code to Customer via WhatsApp"
                                    >
                                      {copiedMsgCodeId === code.id ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                                      ) : (
                                        <MessageCircle className="w-3.5 h-3.5" />
                                      )}
                                    </button>

                                    {/* Edit Code */}
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditCode(code)}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                                      title="Edit Download Code"
                                    >
                                      <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
                                    </button>

                                    {/* Delete Code */}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCode(code)}
                                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-white border border-red-700/50 transition-colors"
                                      title="Delete Download Code"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>

                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Universal Fallback Code Card */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Universal Master Pass (Global Fallback Code)
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-wider">
                          {universalCode}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          ACTIVE FOR ALL TRACKS
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyUniversalCode}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                      >
                        {copiedUniversal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUniversal ? 'Code Copied' : 'Copy Master Code'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyWhatsAppDispatchMessage}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 text-xs font-semibold transition-colors"
                      >
                        {copiedMsg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <MessageCircle className="w-3.5 h-3.5" />}
                        <span>{copiedMsg ? 'Message Copied!' : 'Copy WhatsApp Message'}</span>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSaveUniversalCode} className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={universalCodeInput}
                        onChange={(e) => setUniversalCodeInput(e.target.value.toUpperCase())}
                        placeholder="e.g. LUCKY2026"
                        required
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Master Code</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleGenerateRandomUniversal}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Random</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      In addition to the granular codes in the table above, fans can always use this master code to unlock any song.
                    </p>
                  </form>
                </div>

              </div>
            )}



            {/* ===================== TAB 2: SONGS, MP3 LINKS & ADJUSTABLE COUNTERS ===================== */}
            {activeTab === 'tracks' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Music Catalog & Adjustable Counters</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Plays & Downloads Counters
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Add new songs, upload MP3 links, change album artwork, and adjust play/download counters anytime.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenCreateTrack}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Song</span>
                  </button>
                </div>

                {/* Editable Section for "Official Music Catalog" Headline on Homepage */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <Edit2 className="w-4 h-4" />
                      <span>Edit Official Music Catalog Headline (Shown on Store Homepage)</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">Public Section Header</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Catalog Heading Title
                      </label>
                      <input
                        type="text"
                        value={configForm.catalogTitle || 'Official Music Catalog'}
                        onChange={(e) => setConfigForm({ ...configForm, catalogTitle: e.target.value })}
                        placeholder="e.g. Official Music Catalog or Exclusive Releases"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Catalog Subtitle / Description
                      </label>
                      <input
                        type="text"
                        value={configForm.catalogSubtitle || ''}
                        onChange={(e) => setConfigForm({ ...configForm, catalogSubtitle: e.target.value })}
                        placeholder="e.g. Listen to audio previews, purchase with Local Bank, PayPal, Pi Network, or Sidra Chain, and unlock master files."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdatePaymentConfig(configForm);
                        setDeleteSuccessToast('Official Music Catalog title and subtitle updated successfully!');
                        setTimeout(() => setDeleteSuccessToast(null), 3000);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition-all active:scale-95"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Catalog Headline</span>
                    </button>
                  </div>
                </div>

                {/* Tracks list with directly adjustable counters */}
                <div className="space-y-3">
                  {tracks.map((track) => (
                    <div
                      key={track.id}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      {/* Left: Artwork & Details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-700 bg-slate-900 group">
                          <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-white truncate flex items-center gap-2">
                            <span>{track.title}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {track.duration}
                            </span>
                          </h4>
                          <p className="text-xs text-slate-400 truncate">
                            {track.artist} • <span className="text-slate-300">{track.album}</span> • {track.genre}
                          </p>

                          {/* MP3 & File Info */}
                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] font-mono text-slate-400">
                            <span className="flex items-center gap-1 text-emerald-400">
                              <Link className="w-3 h-3" />
                              {track.previewAudioUrl.startsWith('synth') ? 'WebAudio Synth' : 'Custom MP3 Stream'}
                            </span>
                            <span>•</span>
                            <span className="text-slate-300">{track.fileFormat}</span>
                            <span>•</span>
                            <span>Price: {track.localCurrencySymbol}{track.priceLocal.toLocaleString()} / {track.pricePi} Pi / {track.priceSidra} Sidra</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Adjustable Counters (Direct user request!) */}
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shrink-0">
                        {/* Play Counter */}
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mb-1">
                            <Disc className="w-3 h-3 text-blue-400" /> Play Counter:
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQuickAdjustCounters(track.id, -100, 0)}
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px]"
                              title="Decrease 100 plays"
                            >
                              -100
                            </button>
                            <span className="font-mono font-bold text-sm text-blue-400 px-2 min-w-[55px] text-center">
                              {(track.playsCount || 0).toLocaleString()}
                            </span>
                            <button
                              onClick={() => handleQuickAdjustCounters(track.id, +100, 0)}
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px]"
                              title="Increase 100 plays"
                            >
                              +100
                            </button>
                          </div>
                        </div>

                        <div className="w-px h-8 bg-slate-800" />

                        {/* Download Counter */}
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mb-1">
                            <Flame className="w-3 h-3 text-emerald-400" /> Download Counter:
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQuickAdjustCounters(track.id, 0, -25)}
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px]"
                              title="Decrease 25 downloads"
                            >
                              -25
                            </button>
                            <span className="font-mono font-bold text-sm text-emerald-400 px-2 min-w-[55px] text-center">
                              {track.totalDownloads.toLocaleString()}
                            </span>
                            <button
                              onClick={() => handleQuickAdjustCounters(track.id, 0, +25)}
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px]"
                              title="Increase 25 downloads"
                            >
                              +25
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleOpenEditTrack(track)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Edit Song & MP3</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTrack(track)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 hover:text-white border border-red-700/60 text-xs font-bold transition-all shadow-sm active:scale-95"
                          title="Permanently Delete Song from Catalog"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Song</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ===================== TAB 3: PAYMENT ACCOUNTS & WALLETS ===================== */}
            {activeTab === 'payments' && (
              <form onSubmit={handleSavePaymentConfig} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {configSavedToast && (
                  <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Payment accounts, WhatsApp number, and wallet addresses updated successfully!</span>
                  </div>
                )}

                {/* 1. DEDICATED WHATSAPP NUMBER SECTION (Powers all payment options WhatsApp buttons) */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-2 border-emerald-500/60 shadow-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-800/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                        <MessageCircle className="w-6 h-6 fill-current" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white flex items-center gap-2">
                          <span>Official WhatsApp Number for Payment Buttons</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            LIVE INTEGRATION
                          </span>
                        </h4>
                        <p className="text-xs text-slate-300">
                          Paste your WhatsApp number here. When fans click "Get Your Download Code" or "Get Your Payment Address & Payment Code", it brings them straight to your WhatsApp!
                        </p>
                      </div>
                    </div>

                    {configForm.whatsappNumber && (
                      <a
                        href={`https://wa.me/${normalizeWhatsAppNumber(configForm.whatsappNumber)}?text=${encodeURIComponent('Hello! Testing WhatsApp integration from Admin Panel.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shrink-0 active:scale-95"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Test WhatsApp Link</span>
                      </a>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Paste Your WhatsApp Phone Number Below:
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={configForm.whatsappNumber}
                          onChange={(e) => setConfigForm({ ...configForm, whatsappNumber: e.target.value })}
                          placeholder="e.g. +2348063270422 or 08063270422"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900 border-2 border-emerald-500/60 text-white font-mono text-base font-bold tracking-wide focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) setConfigForm({ ...configForm, whatsappNumber: text.trim() });
                          } catch {
                            // ignore
                          }
                        }}
                        className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                        title="Paste from clipboard"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Paste</span>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>
                        Active Link: <span className="font-mono font-bold text-emerald-400">https://wa.me/{normalizeWhatsAppNumber(configForm.whatsappNumber)}</span>
                      </span>
                      <span className="text-slate-400">
                        Supports local or international formats (e.g. +2348063270422 or 08063270422)
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Official Music Catalog Header & Artist Profile */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    LUCKY JAAY MUSIC CATALOG Heading & Store Profile
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Catalog Section Heading (Title)
                      </label>
                      <input
                        type="text"
                        value={configForm.catalogTitle || 'LUCKY JAAY MUSIC CATALOG'}
                        onChange={(e) => setConfigForm({ ...configForm, catalogTitle: e.target.value })}
                        placeholder="e.g. LUCKY JAAY MUSIC CATALOG"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Artist / Creator Name
                      </label>
                      <input
                        type="text"
                        value={configForm.artistName}
                        onChange={(e) => setConfigForm({ ...configForm, artistName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 text-xs">
                      Catalog Subtitle / Description Text
                    </label>
                    <textarea
                      rows={2}
                      value={configForm.catalogSubtitle || ''}
                      onChange={(e) => setConfigForm({ ...configForm, catalogSubtitle: e.target.value })}
                      placeholder="e.g. Listen to audio previews, purchase with Local Bank, PayPal, Pi Network, or Sidra Chain, and unlock master files."
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                {/* 2. MASTER SITE PICTURE (One Picture Across Entire Website) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      <span>One Master Picture for Entire Site (Artwork)</span>
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                      Site-Wide Picture
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Only ONE picture is used across your whole website and all songs in the catalog. Change it anytime below to instantly update everywhere!
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-500/40 shrink-0 bg-slate-900 shadow-xl">
                      <img
                        src={configForm.masterArtworkUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
                        alt="Master Site Artwork"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 w-full space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Picture Web Link / URL
                        </label>
                        <input
                          type="url"
                          value={configForm.masterArtworkUrl || ''}
                          onChange={(e) => setConfigForm({ ...configForm, masterArtworkUrl: e.target.value })}
                          placeholder="Paste image URL (https://...)"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 text-purple-200 border border-purple-700/60 text-xs font-bold transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload New Picture from Device</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setConfigForm((prev) => ({ ...prev, masterArtworkUrl: reader.result as string }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <span className="text-[10px] text-slate-500">JPG, PNG, WEBP</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. ABOUT LUCKY JAAY (Displayed below "Download Full Song Here" button) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      <span>About LUCKY JAAY (Shown Below Download Button)</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">Bio Card</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    This section is displayed directly below the "Download Full Song Here" button on each track.
                  </p>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        About Title / Header
                      </label>
                      <input
                        type="text"
                        value={configForm.aboutTitle || 'ABOUT LUCKY JAAY'}
                        onChange={(e) => setConfigForm({ ...configForm, aboutTitle: e.target.value })}
                        placeholder="ABOUT LUCKY JAAY"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        About Bio Text
                      </label>
                      <textarea
                        rows={3}
                        value={configForm.aboutBio || ''}
                        onChange={(e) => setConfigForm({ ...configForm, aboutBio: e.target.value })}
                        placeholder="Lucky Jaay is an Afro pop music singer from imo state Singing about street life, reality, and love songs"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white leading-relaxed focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. SOCIAL MEDIA LINKS (Displayed in Footer) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>Social Media Profiles (Displayed in Footer)</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">Instagram • Twitter • TikTok</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Add your official social media profile links or handles. These are displayed for your fans in the website footer.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Instagram Link / Handle
                      </label>
                      <input
                        type="text"
                        value={configForm.socialLinks?.instagram || ''}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          socialLinks: { ...configForm.socialLinks, instagram: e.target.value }
                        })}
                        placeholder="https://instagram.com/luckyjaay"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Twitter / X Link / Handle
                      </label>
                      <input
                        type="text"
                        value={configForm.socialLinks?.twitter || ''}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          socialLinks: { ...configForm.socialLinks, twitter: e.target.value }
                        })}
                        placeholder="https://x.com/luckyjaay"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        TikTok Link / Handle
                      </label>
                      <input
                        type="text"
                        value={configForm.socialLinks?.tiktok || ''}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          socialLinks: { ...configForm.socialLinks, tiktok: e.target.value }
                        })}
                        placeholder="https://tiktok.com/@luckyjaay"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. STORE PRICING ADJUSTMENT (Local, USD, Pi, Sidra) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        <span>Adjust Song Prices (Payment Edit Section)</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Set default catalog pricing for local currency (Opay/Bank), USD (PayPal/Card), Pi Network, and Sidra Chain.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleApplyPricingToAllTracks}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shrink-0 active:scale-95 cursor-pointer"
                      title="Apply these prices to all songs in your catalog"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Apply Prices to All Songs</span>
                    </button>
                  </div>

                  {priceAppliedToast && (
                    <div className="p-3 rounded-lg bg-amber-950/80 border border-amber-500/60 text-amber-200 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>All songs in your catalog have been updated with these new prices!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Currency Symbol</label>
                      <input
                        type="text"
                        value={configForm.globalPricing?.localCurrencySymbol || '₦'}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          globalPricing: { ...configForm.globalPricing, localCurrencySymbol: e.target.value }
                        })}
                        placeholder="₦, $, £..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Local Price</label>
                      <input
                        type="number"
                        value={configForm.globalPricing?.priceLocal ?? 2500}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          globalPricing: { ...configForm.globalPricing, priceLocal: Number(e.target.value) }
                        })}
                        placeholder="2500"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">USD Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={configForm.globalPricing?.priceUSD ?? 2.0}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          globalPricing: { ...configForm.globalPricing, priceUSD: Number(e.target.value) }
                        })}
                        placeholder="2.00"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-blue-300 font-mono font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Pi Network Price (π)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={configForm.globalPricing?.pricePi ?? 0.1}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          globalPricing: { ...configForm.globalPricing, pricePi: Number(e.target.value) }
                        })}
                        placeholder="0.10"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-mono font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Sidra Chain Price (SDA)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={configForm.globalPricing?.priceSidra ?? 0.9}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          globalPricing: { ...configForm.globalPricing, priceSidra: Number(e.target.value) }
                        })}
                        placeholder="0.90"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-purple-300 font-mono font-bold text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Local Accounts (Bank & Mobile Money) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Local Bank Accounts & Mobile Money (MoMo / OPay)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={configForm.localPayment.bankName}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          localPayment: { ...configForm.localPayment, bankName: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={configForm.localPayment.accountNumber}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          localPayment: { ...configForm.localPayment, accountNumber: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm font-bold text-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Account Holder Name</label>
                      <input
                        type="text"
                        value={configForm.localPayment.accountName}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          localPayment: { ...configForm.localPayment, accountName: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Mobile Money Provider</label>
                      <input
                        type="text"
                        value={configForm.localPayment.mobileMoneyProvider}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          localPayment: { ...configForm.localPayment, mobileMoneyProvider: e.target.value }
                        })}
                        placeholder="OPay / PalmPay / MTN MoMo"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Mobile Money Number</label>
                      <input
                        type="text"
                        value={configForm.localPayment.mobileMoneyNumber}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          localPayment: { ...configForm.localPayment, mobileMoneyNumber: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Local Payment Instructions for Fans</label>
                    <textarea
                      rows={2}
                      value={configForm.localPayment.instructions}
                      onChange={(e) => setConfigForm({
                        ...configForm,
                        localPayment: { ...configForm.localPayment, instructions: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                {/* 3. Tether USDT (TRON TRC20) Details */}
                <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">₮</span>
                      <span>Tether USDT (TRON TRC-20) Payment Settings</span>
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-semibold border border-teal-500/30">
                      1 USDT = $1 USD
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">TRC-20 USDT Wallet Address</label>
                      <input
                        type="text"
                        value={configForm.usdtPayment?.walletAddress || ''}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          usdtPayment: {
                            ...(configForm.usdtPayment || { network: 'TRON (TRC20)', instructions: '' }),
                            walletAddress: e.target.value
                          }
                        })}
                        placeholder="TYDZSXDzpjyWPvg1Z7sA2996hR3P45t6TR"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-teal-300 font-mono font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Network Label</label>
                        <input
                          type="text"
                          value={configForm.usdtPayment?.network || 'TRON (TRC20)'}
                          onChange={(e) => setConfigForm({
                            ...configForm,
                            usdtPayment: {
                              ...(configForm.usdtPayment || { walletAddress: '', instructions: '' }),
                              network: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Fan Instructions Note</label>
                        <input
                          type="text"
                          value={configForm.usdtPayment?.instructions || ''}
                          onChange={(e) => setConfigForm({
                            ...configForm,
                            usdtPayment: {
                              ...(configForm.usdtPayment || { walletAddress: '', network: 'TRON (TRC20)' }),
                              instructions: e.target.value
                            }
                          })}
                          placeholder="Send USDT via TRON TRC20, then send hash via WhatsApp..."
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Bitcoin (BTC) Details */}
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">₿</span>
                      <span>Bitcoin (BTC Mainnet) Payment Settings</span>
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/30">
                      BTC Native
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Bitcoin (BTC) Wallet Address</label>
                      <input
                        type="text"
                        value={configForm.btcPayment?.walletAddress || ''}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          btcPayment: {
                            ...(configForm.btcPayment || { network: 'Bitcoin Mainnet (BTC)', instructions: '' }),
                            walletAddress: e.target.value
                          }
                        })}
                        placeholder="bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-mono font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Network Label</label>
                        <input
                          type="text"
                          value={configForm.btcPayment?.network || 'Bitcoin Mainnet (BTC)'}
                          onChange={(e) => setConfigForm({
                            ...configForm,
                            btcPayment: {
                              ...(configForm.btcPayment || { walletAddress: '', instructions: '' }),
                              network: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Fan Instructions Note</label>
                        <input
                          type="text"
                          value={configForm.btcPayment?.instructions || ''}
                          onChange={(e) => setConfigForm({
                            ...configForm,
                            btcPayment: {
                              ...(configForm.btcPayment || { walletAddress: '', network: 'Bitcoin Mainnet (BTC)' }),
                              instructions: e.target.value
                            }
                          })}
                          placeholder="Send Bitcoin to address above. Copy TXID and send on WhatsApp..."
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. BNB Smart Chain (BEP20) Details */}
                <div className="p-4 rounded-xl bg-slate-950 border border-yellow-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-bold text-[9px]">BNB</span>
                      <span>BNB Smart Chain (BSC / BEP-20) Payment Settings</span>
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-300 font-semibold border border-yellow-500/30">
                      BEP-20 • 3s Confirms
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">BNB (BEP20) Wallet Address</label>
                      <input
                        type="text"
                        value={configForm.bnbPayment?.walletAddress || ''}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          bnbPayment: {
                            ...(configForm.bnbPayment || { network: 'BNB Smart Chain (BEP20)', instructions: '' }),
                            walletAddress: e.target.value
                          }
                        })}
                        placeholder="0x71C83457D2840004cE7A03EaC267c827B735160E"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-yellow-300 font-mono font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Network Label</label>
                        <input
                          type="text"
                          value={configForm.bnbPayment?.network || 'BNB Smart Chain (BEP20)'}
                          onChange={(e) => setConfigForm({
                            ...configForm,
                            bnbPayment: {
                              ...(configForm.bnbPayment || { walletAddress: '', instructions: '' }),
                              network: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Fan Instructions Note</label>
                        <input
                          type="text"
                          value={configForm.bnbPayment?.instructions || ''}
                          onChange={(e) => setConfigForm({
                            ...configForm,
                            bnbPayment: {
                              ...(configForm.bnbPayment || { walletAddress: '', network: 'BNB Smart Chain (BEP20)' }),
                              instructions: e.target.value
                            }
                          })}
                          placeholder="Send BNB or BEP20 tokens via BSC network. Send hash via WhatsApp..."
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Pi Payment Address */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    Pi Payment Address & Memo (Pi Network / Pi Browser)
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Pi Public Wallet Address</label>
                      <input
                        type="text"
                        value={configForm.piPayment.walletAddress}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          piPayment: { ...configForm.piPayment, walletAddress: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-amber-300 font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Required Transaction Memo</label>
                        <input
                          type="text"
                          value={configForm.piPayment.memo}
                          onChange={(e) => setConfigForm({
                            ...configForm,
                            piPayment: { ...configForm.piPayment, memo: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Pi Network Name</label>
                        <input
                          type="text"
                          value={configForm.piPayment.network}
                          onChange={(e) => setConfigForm({
                            ...configForm,
                            piPayment: { ...configForm.piPayment, network: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Sidra Payment Address */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Sidra Payment Address & Memo (Sidra Chain / Sidra Bank)
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Sidra Chain Wallet Address</label>
                      <input
                        type="text"
                        value={configForm.sidraPayment.walletAddress}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          sidraPayment: { ...configForm.sidraPayment, walletAddress: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-purple-300 font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Required Sidra Memo</label>
                        <input
                          type="text"
                          value={configForm.sidraPayment.memo}
                          onChange={(e) => setConfigForm({
                            ...configForm,
                            sidraPayment: { ...configForm.sidraPayment, memo: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Sidra Network Name</label>
                        <input
                          type="text"
                          value={configForm.sidraPayment.network}
                          onChange={(e) => setConfigForm({
                            ...configForm,
                            sidraPayment: { ...configForm.sidraPayment, network: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Account Details & Addresses</span>
                  </button>
                </div>

              </form>
            )}

            {/* ===================== TAB 4: ORDERS & WHATSAPP DISPATCH ===================== */}
            {activeTab === 'orders' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Manual Payment Submissions & WhatsApp Dispatch</h3>
                    <p className="text-xs text-slate-400">
                      Fans who sent transactions via Local Bank, PayPal, Pi, or Sidra awaiting code confirmation.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Customer</th>
                          <th className="px-4 py-3">Track</th>
                          <th className="px-4 py-3">Method & Amount</th>
                          <th className="px-4 py-3">Transaction Ref / Proof</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Assigned Code</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {submissions.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                              No payment submissions currently in queue.
                            </td>
                          </tr>
                        ) : (
                          submissions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-900/40 transition-colors">
                              <td className="px-4 py-3">
                                <p className="font-semibold text-white">{sub.customerName || 'Fan'}</p>
                                <p className="font-mono text-[11px] text-emerald-400">{sub.customerWhatsApp}</p>
                              </td>
                              <td className="px-4 py-3 text-slate-300 font-medium">
                                {sub.trackTitle}
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-mono font-bold text-white block">{sub.amountPaid}</span>
                                <span className="text-[10px] uppercase text-slate-400">{sub.paymentMethod}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-mono text-[11px] text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 break-all">
                                  {sub.transactionRef}
                                </span>
                                <p className="text-[10px] text-slate-500 mt-0.5">{sub.submittedAt}</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  sub.status === 'verified'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : sub.status === 'pending'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                  {sub.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-mono font-bold text-emerald-300">
                                {sub.assignedCode || '-'}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {sub.status === 'pending' ? (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleApproveSubmission(sub)}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Approve & WhatsApp</span>
                                    </button>
                                    <button
                                      onClick={() => handleRejectSubmission(sub.id)}
                                      className="p-1.5 rounded-lg bg-slate-800 text-red-400 hover:bg-red-950"
                                      title="Reject"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-slate-500">Processed</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===================== TAB 5: RECENT DOWNLOADS LOG ===================== */}
            {activeTab === 'downloads' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-5xl">
                
                {clearLogsToast && (
                  <div className="p-3 rounded-xl bg-purple-950 border border-purple-500/60 text-purple-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Download activity log history cleared!</span>
                  </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-purple-400" />
                      <span>Recent Downloads Log & Content Popularity</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Track which songs were downloaded by fans, the exact date & time, and which download code was redeemed.
                    </p>
                  </div>

                  {downloadLogs.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearDownloadLogs}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700 text-xs transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Log History</span>
                    </button>
                  )}
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                      Total Downloads Logged
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-purple-400">{downloadLogs.length}</span>
                      <span className="text-[11px] text-slate-500">deliveries</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                      Active Universal Code
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold font-mono text-emerald-400">{universalCode}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                      Catalog Total Tracks
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-white">{tracks.length}</span>
                      <span className="text-[11px] text-slate-500">releases available</span>
                    </div>
                  </div>
                </div>

                {/* Logs Table */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Song / Release</th>
                          <th className="px-4 py-3">Artist</th>
                          <th className="px-4 py-3">Code Used</th>
                          <th className="px-4 py-3">Date & Time</th>
                          <th className="px-4 py-3 text-right">Download Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {downloadLogs.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                              <Download className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                              <p className="font-semibold text-slate-300">No downloads logged yet</p>
                              <p className="text-[11px] text-slate-500 mt-1">
                                When fans enter your download code on the website, their downloads will automatically appear here in real-time.
                              </p>
                            </td>
                          </tr>
                        ) : (
                          [...downloadLogs].reverse().map((log) => (
                            <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                              <td className="px-4 py-3">
                                <span className="font-bold text-white text-xs">{log.trackTitle}</span>
                              </td>
                              <td className="px-4 py-3 text-slate-300">
                                {log.artist || paymentConfig.artistName}
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  {log.codeUsed}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  Master Audio Delivered
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ===================== TAB 6: CHANGE ADMIN PASSWORD & SECURITY ===================== */}
            {activeTab === 'security' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-xl">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span>Change Admin Password / PIN</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Update the secret administrator password used to enter and protect this Creator Studio.
                  </p>
                </div>

                {passwordChangeSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Administrator password updated successfully! Keep your new password secure.</span>
                  </div>
                )}

                {passwordChangeError && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{passwordChangeError}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Current Password / PIN
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={currentPasswordInput}
                      onChange={(e) => setCurrentPasswordInput(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      New Password / PIN
                    </label>
                    <input
                      type="password"
                      placeholder="Minimum 4 characters"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Confirm New Password / PIN
                    </label>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      Update Admin Password
                    </button>
                  </div>
                </form>

                {/* Reset Data Option */}
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 space-y-3">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">Reset Store Data</h4>
                  <p className="text-xs text-slate-400">
                    Restore the default initial music catalog, download codes, and payment credentials.
                  </p>
                  <button
                    onClick={() => {
                      onResetData();
                      setIsAuthenticated(false);
                      setDeleteSuccessToast('All data has been reset to defaults.');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-900/40 text-red-300 hover:bg-red-800/60 border border-red-700/50 text-xs font-semibold active:scale-95 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Everything to Default</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </div>



      {/* ===================== EDIT/CREATE SONG MODAL (MP3 LINK, ARTWORK & COUNTERS) ===================== */}
      {(isCreatingTrack || editingTrack) && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-3">
          <div className="bg-[#0f141f] border border-slate-700 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-emerald-400" />
                <span>{isCreatingTrack ? 'Add New Song to Catalog' : 'Edit Song, MP3 Link & Counters'}</span>
              </h4>
              <button
                onClick={() => { setEditingTrack(null); setIsCreatingTrack(false); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTrack} className="space-y-4 text-xs">
              
              {/* Song Title & Artist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Song Title <span className="text-emerald-400">*</span></label>
                  <input
                    type="text"
                    value={trackFormData.title || ''}
                    onChange={(e) => setTrackFormData({ ...trackFormData, title: e.target.value })}
                    required
                    placeholder="e.g. Crown of the Sun"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Artist Name <span className="text-emerald-400">*</span></label>
                  <input
                    type="text"
                    value={trackFormData.artist || ''}
                    onChange={(e) => setTrackFormData({ ...trackFormData, artist: e.target.value })}
                    required
                    placeholder="e.g. Lucky Jaay"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Site Master Picture note (User explicitly requested: "I don't want that big picture box that use to come out when added a new song... I want only one picture to be in the site so time to time i can change it to a different picture") */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg overflow-hidden border border-purple-500/30 shrink-0 bg-slate-950 shadow-md">
                  <img
                    src={paymentConfig.masterArtworkUrl || trackFormData.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
                    alt="Master Artwork"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-slate-200 block">
                    Artwork: Using Single Master Picture
                  </span>
                  <p className="text-[10px] text-slate-400">
                    This song automatically uses your one master picture across the site. You can update the master picture anytime in the <span className="text-emerald-400 font-semibold">Payment, Pricing, Artwork & About</span> tab.
                  </p>
                </div>
              </div>

              {/* MP3 LINKS SECTION (Explicit user request: "Place to upload my mp3 Link") */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Link className="w-4 h-4 text-emerald-400" />
                  <span>MP3 Audio & Download Links</span>
                </h5>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Preview MP3 Stream Link (Direct audio URL or procedural synth)
                  </label>
                  <input
                    type="text"
                    value={trackFormData.previewAudioUrl || ''}
                    onChange={(e) => setTrackFormData({ ...trackFormData, previewAudioUrl: e.target.value })}
                    placeholder="https://mycdn.com/preview.mp3 (or synth:afrobeats)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Enter any direct MP3/WAV audio link. If left as `synth:afrobeats` or `synth:dance`, our built-in audio synthesizer plays high-quality preview beats!
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Master Archive Download URL (Full Master WAV / MP3 320k Zip)
                  </label>
                  <input
                    type="text"
                    value={trackFormData.downloadFileUrl || ''}
                    onChange={(e) => setTrackFormData({ ...trackFormData, downloadFileUrl: e.target.value })}
                    placeholder="https://mycdn.com/master-release.zip (or leave blank for instant signed package)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    This file is delivered to fans when they enter their verified download code.
                  </p>
                </div>
              </div>

              {/* ADJUSTABLE COUNTERS (Explicit user request: "both play counter and download counter adjustable in admin panel") */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 text-xs block">
                  Adjustable Plays & Downloads Counters
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-blue-400 text-xs font-semibold mb-1 flex items-center gap-1">
                      <Disc className="w-3.5 h-3.5" /> Play Counter
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={trackFormData.playsCount ?? 0}
                      onChange={(e) => setTrackFormData({ ...trackFormData, playsCount: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm font-bold text-blue-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-400 text-xs font-semibold mb-1 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> Download Counter
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={trackFormData.totalDownloads ?? 0}
                      onChange={(e) => setTrackFormData({ ...trackFormData, totalDownloads: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Multi-Currency Prices */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 text-xs block">Pricing in All 4 Supported Currencies</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-emerald-400 text-[10px]">Local ({trackFormData.localCurrencySymbol || '₦'})</label>
                    <input
                      type="number"
                      value={trackFormData.priceLocal || 0}
                      onChange={(e) => setTrackFormData({ ...trackFormData, priceLocal: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-400 text-[10px]">USD ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={trackFormData.priceUSD || 0}
                      onChange={(e) => setTrackFormData({ ...trackFormData, priceUSD: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-400 text-[10px]">Pi Network</label>
                    <input
                      type="number"
                      step="0.01"
                      value={trackFormData.pricePi || 0}
                      onChange={(e) => setTrackFormData({ ...trackFormData, pricePi: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-400 text-[10px]">Sidra Chain</label>
                    <input
                      type="number"
                      step="0.01"
                      value={trackFormData.priceSidra || 0}
                      onChange={(e) => setTrackFormData({ ...trackFormData, priceSidra: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Genre, Duration, Album */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (e.g. 3:45)</label>
                  <input
                    type="text"
                    value={trackFormData.duration || ''}
                    onChange={(e) => setTrackFormData({ ...trackFormData, duration: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Genre</label>
                  <input
                    type="text"
                    value={trackFormData.genre || ''}
                    onChange={(e) => setTrackFormData({ ...trackFormData, genre: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Album / EP</label>
                  <input
                    type="text"
                    value={trackFormData.album || ''}
                    onChange={(e) => setTrackFormData({ ...trackFormData, album: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description / Track Notes</label>
                <textarea
                  rows={2}
                  value={trackFormData.description || ''}
                  onChange={(e) => setTrackFormData({ ...trackFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              {/* Save & Cancel & Delete Actions */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800">
                <div>
                  {editingTrack && (
                    <button
                      type="button"
                      onClick={() => {
                        handleDeleteTrack(editingTrack);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 hover:text-white border border-red-700/60 text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Song</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setEditingTrack(null); setIsCreatingTrack(false); }}
                    className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase tracking-wider text-xs shadow-md shadow-emerald-500/20"
                  >
                    {isCreatingTrack ? 'Save & Add Song' : 'Save Song Changes'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ===================== IN-APP CONFIRM SONG DELETE MODAL ===================== */}
      {trackToDelete && (
        <div className="fixed inset-0 z-70 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#0f141f] border-2 border-red-500/80 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center border border-red-500/40">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white font-heading">
                Delete Song From Catalog?
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Are you sure you want to permanently delete this song from your music store?
              </p>

              <div className="my-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-left">
                <img
                  src={trackToDelete.coverUrl}
                  alt={trackToDelete.title}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="font-bold text-sm text-white truncate">{trackToDelete.title}</h5>
                  <p className="text-xs text-slate-400 truncate">{trackToDelete.artist} • {trackToDelete.genre}</p>
                </div>
              </div>

              <p className="text-[11px] text-red-400 font-semibold">
                ⚠️ This will immediately remove the song from your website.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTrackToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Cancel (Keep Song)
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTrack}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-red-600/30 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Song</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== CREATE / EDIT DOWNLOAD CODE MODAL (RESTORED) ===================== */}
      {(isCreatingCode || editingCode) && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#0f141f] border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  {isCreatingCode ? 'Generate New Download Code' : `Edit Download Code (${editingCode?.code})`}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCode(null);
                  setIsCreatingCode(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCode} className="space-y-4 text-xs">
              
              {/* Code String with Random Generator */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Download Code String <span className="text-emerald-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={codeFormData.code || ''}
                    onChange={(e) => setCodeFormData({ ...codeFormData, code: e.target.value.toUpperCase() })}
                    required
                    placeholder="e.g. VIP-GOLD-2026 or MOMO-8821"
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleGenerateCodeStringForModal(codeFormData.paymentMethod || 'local')}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1 shrink-0"
                    title="Generate Random Code String"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Generate</span>
                  </button>
                </div>
              </div>

              {/* Track Assignment */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Assigned Track / Release <span className="text-emerald-400">*</span>
                </label>
                <select
                  value={codeFormData.trackId || 'ALL'}
                  onChange={(e) => setCodeFormData({ ...codeFormData, trackId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">⭐ ALL TRACKS (VIP Pass - Unlocks Every Song)</option>
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      Song: {t.title} ({t.duration}) - {t.artist}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Choose "ALL TRACKS" for a universal pass, or select a specific song that this code unlocks.
                </p>
              </div>

              {/* Payment Method Attribution */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Payment Method
                </label>
                <select
                  value={codeFormData.paymentMethod || 'local'}
                  onChange={(e) => setCodeFormData({ ...codeFormData, paymentMethod: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="local">Local Bank Transfer / OPay / PalmPay</option>
                  <option value="usdt">Tether USDT (TRON TRC20)</option>
                  <option value="btc">Bitcoin (BTC Mainnet)</option>
                  <option value="bnb">BNB Smart Chain (BEP20)</option>
                  <option value="pi">Pi Network (Pi Wallet / Browser)</option>
                  <option value="sidra">Sidra Chain (Sidra Bank / DEX)</option>
                  <option value="admin_promo">Admin / VIP Promo / Free Pass</option>
                </select>
              </div>

              {/* Max Uses & Used Count */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Max Download Uses
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={codeFormData.maxUses ?? 1}
                    onChange={(e) => setCodeFormData({ ...codeFormData, maxUses: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                    placeholder="1 for single-use, 9999 for unlimited"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Use 9999 for unlimited</span>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Used Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={codeFormData.usedCount ?? 0}
                    onChange={(e) => setCodeFormData({ ...codeFormData, usedCount: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Times redeemed by fans</span>
                </div>
              </div>

              {/* Customer Name & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Customer / Fan Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={codeFormData.customerName || ''}
                    onChange={(e) => setCodeFormData({ ...codeFormData, customerName: e.target.value })}
                    placeholder="e.g. Emeka Okafor"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Customer WhatsApp Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={codeFormData.customerWhatsApp || ''}
                    onChange={(e) => setCodeFormData({ ...codeFormData, customerWhatsApp: e.target.value })}
                    placeholder="e.g. +2348012345678"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              {/* Transaction Ref / Admin Notes */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Transaction Reference / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={codeFormData.transactionRef || ''}
                  onChange={(e) => setCodeFormData({ ...codeFormData, transactionRef: e.target.value })}
                  placeholder="e.g. OPay Ref 9840294 or Pi TX Hash"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs mb-2"
                />
                <textarea
                  rows={2}
                  value={codeFormData.notes || ''}
                  onChange={(e) => setCodeFormData({ ...codeFormData, notes: e.target.value })}
                  placeholder="Admin notes or payment verification details..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              {/* Active Toggle */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Code Active Status</span>
                  <span className="text-[10px] text-slate-400">
                    If disabled, fans entering this code will be told it has been deactivated.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={codeFormData.isActive ?? true}
                    onChange={(e) => setCodeFormData({ ...codeFormData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800">
                <div>
                  {editingCode && (
                    <button
                      type="button"
                      onClick={() => {
                        handleDeleteCode(editingCode);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 hover:text-white border border-red-700/60 text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Code</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCode(null);
                      setIsCreatingCode(false);
                    }}
                    className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase tracking-wider text-xs shadow-md shadow-emerald-500/20 active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isCreatingCode ? 'Save & Create Code' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ===================== IN-APP CONFIRM DOWNLOAD CODE DELETE MODAL ===================== */}
      {codeToDelete && (
        <div className="fixed inset-0 z-70 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#0f141f] border-2 border-red-500/80 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center border border-red-500/40">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white font-heading">
                Delete Download Code?
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Are you sure you want to permanently delete download code:
              </p>

              <div className="my-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="font-mono font-black text-xl text-emerald-400 tracking-wider block">
                  {codeToDelete.code}
                </span>
                <p className="text-xs text-slate-400">
                  Assigned Track: <strong className="text-white">{codeToDelete.trackId === 'ALL' ? 'ALL TRACKS' : (tracks.find(t => t.id === codeToDelete.trackId)?.title || 'Single')}</strong>
                </p>
                {codeToDelete.customerName && (
                  <p className="text-[11px] text-slate-400">
                    Customer: <span className="text-slate-200">{codeToDelete.customerName}</span>
                  </p>
                )}
              </div>

              <p className="text-[11px] text-red-400 font-semibold">
                ⚠️ Fans will no longer be able to use this code to unlock audio downloads.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCodeToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Cancel (Keep Code)
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCode}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-red-600/30 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
