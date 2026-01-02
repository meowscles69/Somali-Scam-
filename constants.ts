
import { ScamCategory, Severity, IntelligenceEntry } from './types';

export const CATEGORIES = Object.values(ScamCategory);
export const REGIONS = ["US", "EU", "Middle East", "Asia", "Africa", "Global"];
export const PLATFORMS = ["Telegram", "WhatsApp", "Facebook", "Instagram", "Dating Apps", "Email", "Fake Websites"];
export const SOURCE_TYPES = ["Gov Report", "Police Advisory", "Court Record", "NGO Report", "Academic Research", "Investigative Journalism", "OSINT"];

export const MOCK_DATA_SEED: IntelligenceEntry[] = [
  {
    id: "SC-001",
    category: ScamCategory.ROMANCE,
    platform: "Facebook",
    tactic: "Long-term relationship building",
    description: "Multi-month grooming process involving fake identities claiming to be foreign military personnel stationed in East Africa.",
    targetRegions: ["US", "EU"],
    severity: Severity.HIGH,
    sourceType: "FBI IC3 Report",
    dateAdded: "2024-03-01",
    signals: ["Poor grammar", "Urgent request for travel funds", "Refusal of video calls"],
    financial_impact: {
      reported_loss_usd: 450000,
      estimated_loss_usd: { min: 1200000, max: 5000000 },
      time_period: "2023",
      currency: "USD",
      confidence: "High",
      recovered_usd: 12000,
      notes: "Aggregated from regional victim clusters reported to IC3."
    }
  },
  {
    id: "SC-002",
    category: ScamCategory.FAKE_JOB,
    platform: "WhatsApp",
    tactic: "Task-based payment fraud",
    description: "Victims are 'hired' to like YouTube videos for pay, eventually forced to deposit money to unlock higher tiers.",
    targetRegions: ["Middle East", "Africa"],
    severity: Severity.CRITICAL,
    sourceType: "NGO Humanitarian Alert",
    dateAdded: "2024-02-15",
    signals: ["Guaranteed high returns", "Encrypted messaging usage", "No formal contract"],
    financial_impact: {
      reported_loss_usd: 890000,
      estimated_loss_usd: { min: 2500000, max: 10000000 },
      time_period: "2023–2024",
      currency: "USD",
      confidence: "Medium",
      recovered_usd: 0,
      notes: "Estimates based on viral growth and average deposit loss per user."
    }
  },
  {
    id: "SC-003",
    category: ScamCategory.CRYPTO_FRAUD,
    platform: "Instagram",
    tactic: "Pig butchering / Investment lure",
    description: "Displaying fake luxury lifestyles to lure users into high-yield crypto platforms linked to East African money laundering nodes.",
    targetRegions: ["Global"],
    severity: Severity.HIGH,
    sourceType: "Chainalysis Report",
    dateAdded: "2024-04-10",
    signals: ["Unsolicited messages", "Profit screenshots", "Complex technical jargon"],
    financial_impact: {
      reported_loss_usd: 2100000,
      estimated_loss_usd: { min: 15000000, max: 50000000 },
      time_period: "2024",
      currency: "USD",
      confidence: "High",
      recovered_usd: 145000,
      notes: "Blockchain analysis of linked wallet clusters (anonymized nodes)."
    }
  }
];
