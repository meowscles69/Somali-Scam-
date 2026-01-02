
export enum ScamCategory {
  ROMANCE = "Romance Scams",
  SEXTORTION = "Sextortion / Blackmail",
  FAKE_JOB = "Fake Job & Task Scams",
  CRYPTO_FRAUD = "Crypto / Forex Fraud",
  IMPERSONATION = "Impersonation",
  CHARITY_FRAUD = "Charity & Donation",
  BEC = "Business Email Compromise (BEC)"
}

export enum Severity {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical"
}

export type ConfidenceLevel = "High" | "Medium" | "Low";

export interface FinancialImpact {
  reported_loss_usd: number | null;
  estimated_loss_usd: {
    min: number | null;
    max: number | null;
  };
  time_period: string; // YYYY or YYYY–YYYY
  currency: "USD";
  confidence: ConfidenceLevel;
  recovered_usd: number | null;
  notes: string;
}

export interface IntelligenceEntry {
  id: string;
  category: ScamCategory;
  platform: string;
  tactic: string;
  description: string;
  targetRegions: string[];
  severity: Severity;
  sourceType: string;
  dateAdded: string;
  signals: string[];
  financial_impact: FinancialImpact;
}

export interface Stats {
  totalEntries: number;
  topCategory: string;
  topPlatform: string;
  mostTargetedRegion: string;
  totalReportedLoss: number;
  totalRecovered: number;
}
