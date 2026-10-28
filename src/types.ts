export type PaymentMethodType = 'local' | 'usdt' | 'btc' | 'bnb' | 'pi' | 'sidra' | 'international';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: string;
  genre: string;
  releaseDate: string;
  bpm?: number;
  key?: string;
  priceUSD: number;
  priceLocal: number;
  localCurrencySymbol: string; // e.g. "₦", "KSh", "₵", "R"
  pricePi: number;
  priceSidra: number;
  previewAudioUrl: string; // Can be a URL or 'synth:afrobeats' | 'synth:ambient'
  downloadFileUrl: string;
  fileFormat: string;
  fileSize: string;
  description: string;
  lyrics?: string;
  isFeatured?: boolean;
  totalDownloads: number;
  playsCount: number;
}

export interface DownloadCode {
  id: string;
  code: string; // The editable download code string (e.g. "VIP-AFRO-9021", "PI-LUCKY-01")
  trackId: string; // Track ID or "ALL" for all tracks
  maxUses: number; // e.g., 1 for single-use, 3, or 9999 for unlimited
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  expiresAt: string | null;
  paymentMethod: PaymentMethodType | 'admin_promo';
  customerName?: string;
  customerWhatsApp?: string;
  transactionRef?: string;
  notes?: string;
}

export interface PaymentConfig {
  artistName: string;
  catalogTitle: string; // Editable catalog title (e.g. "Official Music Catalog")
  catalogSubtitle: string; // Editable catalog subtitle
  whatsappNumber: string; // International format without spaces e.g. "+2348012345678"
  whatsappSupportName: string;
  autoVerifyEnabled: boolean;
  verificationSimulationSeconds: number; // Simulated automated verification delay (e.g. 2s)
  
  // Local payment (Bank & Mobile Money)
  localPayment: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    sortOrSwiftCode: string;
    mobileMoneyProvider: string;
    mobileMoneyNumber: string;
    instructions: string;
  };

  // 1. Tether USDT (TRON TRC20)
  usdtPayment: {
    walletAddress: string;
    network: string; // "TRON (TRC20)"
    instructions: string;
  };

  // 2. Bitcoin (BTC Mainnet)
  btcPayment: {
    walletAddress: string;
    network: string; // "Bitcoin Mainnet"
    instructions: string;
  };

  // 3. BNB Smart Chain (BEP20)
  bnbPayment: {
    walletAddress: string;
    network: string; // "BNB Smart Chain (BEP20)"
    instructions: string;
  };

  // Legacy fallback (optional)
  internationalPayment?: {
    paypalEmail: string;
    wiseTag: string;
    cashAppTag: string;
    westernUnionName: string;
    instructions: string;
  };

  masterArtworkUrl: string; // The single master catalog picture used across the entire site
  aboutTitle: string; // e.g. "About LUCKY JAAY"
  aboutBio: string; // e.g. "Lucky Jaay is an Afro pop music singer from Imo State singing about street life, reality, and love songs."
  
  // Social media links in footer
  socialLinks: {
    instagram: string;
    twitter: string;
    tiktok: string;
  };

  // Pricing configuration adjustable in payment section
  globalPricing: {
    priceLocal: number;
    localCurrencySymbol: string;
    priceUSD: number;
    pricePi: number;
    priceSidra: number;
  };

  // Pi Network payment
  piPayment: {
    walletAddress: string;
    memo: string;
    network: string; // "Pi Network Mainnet"
    explorerUrl: string;
    instructions: string;
  };

  // Sidra Chain payment
  sidraPayment: {
    walletAddress: string;
    memo: string;
    network: string; // "Sidra Chain Mainnet"
    explorerUrl: string;
    instructions: string;
  };
}

export interface DownloadLog {
  id: string;
  trackId: string;
  trackTitle: string;
  artist: string;
  codeUsed: string;
  timestamp: string;
}

export interface PaymentSubmission {
  id: string;
  trackId: string;
  trackTitle: string;
  paymentMethod: PaymentMethodType;
  customerName: string;
  customerWhatsApp: string;
  transactionRef: string;
  amountPaid: string;
  status: 'pending' | 'verified' | 'rejected';
  assignedCode?: string;
  submittedAt: string;
  verifiedAt?: string;
  adminNotes?: string;
}
