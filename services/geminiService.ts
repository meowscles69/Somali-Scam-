
import { GoogleGenAI, Type } from "@google/genai";
import { IntelligenceEntry, ScamCategory, Severity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface IntelligenceSearchParams {
  count?: number;
  query?: string;
  category?: string;
  platform?: string;
  dateRange?: string;
}

export async function generateIntelligenceData(params: IntelligenceSearchParams = {}): Promise<IntelligenceEntry[]> {
  const { count = 30, query, category, platform, dateRange } = params;

  const systemContext = `Act as an elite OSINT (Open Source Intelligence) Researcher specializing in East African cybercrime networks. 
  Your goal is to synthesize structured intelligence reports based on verifiable public patterns, law enforcement advisories, and investigative journalism.
  
  MANDATORY FINANCIAL DATA REQUIREMENT:
  For every entry, you MUST include financial loss data derived from public reports (FTC, FBI IC3, INTERPOL, UNODC, court filings).
  - Use aggregated/estimated USD values.
  - STRICTLY NO wallet addresses, bank accounts, or private individual attribution.
  - If exact values are unknown, provide realistic estimates based on similar case studies.`;

  let researchFocus = "Generate a broad cross-section of active scam ecosystems in East Africa including their financial impact.";
  const constraints: string[] = [];

  if (query) constraints.push(`Focus on the specific research query: "${query}"`);
  if (category && category !== 'All') constraints.push(`Only generate entries for the category: "${category}"`);
  if (platform) constraints.push(`Focus exclusively on operations active on the platform: "${platform}"`);
  if (dateRange) constraints.push(`The intelligence must reflect activity observed during the timeframe: "${dateRange}"`);

  if (constraints.length > 0) {
    researchFocus = `Strictly prioritize intelligence synthesis with the following constraints:\n- ${constraints.join('\n- ')}`;
  }

  const prompt = `${systemContext}
  
  Task: Generate ${count} distinct, highly realistic intelligence entries with comprehensive financial impact data. 
  ${researchFocus}
  
  Each entry must be grounded in realistic OSINT patterns seen in Somali and East African ecosystems. 
  Focus on technical signals (IOCs), social engineering tactics, and platform-specific behaviors.
  Financial figures must be clearly labeled as reported or estimated.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: { type: Type.STRING, enum: Object.values(ScamCategory) },
              platform: { type: Type.STRING },
              tactic: { type: Type.STRING },
              description: { type: Type.STRING },
              targetRegions: { type: Type.ARRAY, items: { type: Type.STRING } },
              severity: { type: Type.STRING, enum: Object.values(Severity) },
              sourceType: { type: Type.STRING },
              dateAdded: { type: Type.STRING },
              signals: { type: Type.ARRAY, items: { type: Type.STRING } },
              financial_impact: {
                type: Type.OBJECT,
                properties: {
                  reported_loss_usd: { type: Type.NUMBER },
                  estimated_loss_usd: {
                    type: Type.OBJECT,
                    properties: {
                      min: { type: Type.NUMBER },
                      max: { type: Type.NUMBER }
                    },
                    required: ["min", "max"]
                  },
                  time_period: { type: Type.STRING },
                  currency: { type: Type.STRING },
                  confidence: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  recovered_usd: { type: Type.NUMBER },
                  notes: { type: Type.STRING }
                },
                required: ["reported_loss_usd", "estimated_loss_usd", "time_period", "currency", "confidence", "recovered_usd", "notes"]
              }
            },
            required: ["id", "category", "platform", "tactic", "description", "targetRegions", "severity", "sourceType", "dateAdded", "signals", "financial_impact"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating intelligence:", error);
    return [];
  }
}

export async function getDetailedAnalysis(entry: IntelligenceEntry, queryContext?: string): Promise<string> {
  const prompt = `Perform a professional OSINT deep-dive analysis on this intelligence entry: ${JSON.stringify(entry)}. 
  ${queryContext ? `Contextualize this analysis within the user's broader research objective: "${queryContext}".` : ""}
  
  Provide a breakdown including:
  1. Behavioral Psychology: How the victim's trust is exploited.
  2. Technical Infrastructure: Common tools (VPNs, VOIP, money mules) associated with this specific tactic in East Africa.
  3. Strategic Mitigation: Specific advice for NGOs or local authorities to disrupt this pattern.
  4. Syndicate Context: Link this behavior to known public-interest patterns of East African cybercrime clusters.
  5. Financial Flows: Analyze the reported loss of $${entry.financial_impact.reported_loss_usd} and the laundering mechanisms likely used in the region.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    return response.text;
  } catch (error) {
    return "Analysis failed to load.";
  }
}

export async function generateExecutiveSummary(entries: IntelligenceEntry[], query: string): Promise<string> {
  const totalLoss = entries.reduce((acc, curr) => acc + (curr.financial_impact.reported_loss_usd || 0), 0);
  const prompt = `Based on the following ${entries.length} intelligence entries: ${JSON.stringify(entries.slice(0, 10))}, 
  and the user's research query: "${query}", 
  write a concise 3-4 sentence executive summary of the findings. 
  Specifically mention that the reported financial loss across these entries totals approximately $${totalLoss.toLocaleString()} USD.
  Highlight the most critical threats and the geographic focus.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    return response.text;
  } catch (error) {
    return "Summary generation failed.";
  }
}
