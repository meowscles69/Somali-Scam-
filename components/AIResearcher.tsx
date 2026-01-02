
import React, { useState } from 'react';
import { generateIntelligenceData, generateExecutiveSummary } from '../services/geminiService';
import { IntelligenceEntry, ScamCategory } from '../types';
import { PLATFORMS } from '../constants';

interface AIResearcherProps {
  onNewData: (entries: IntelligenceEntry[]) => void;
}

const AIResearcher: React.FC<AIResearcherProps> = ({ onNewData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [researchTopic, setResearchTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleDeepResearch = async () => {
    setIsGenerating(true);
    setSummary(null);
    try {
      const searchParams = {
        count: 12,
        query: researchTopic,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        platform: selectedPlatform || undefined,
        dateRange: dateRange || undefined
      };

      const newEntries = await generateIntelligenceData(searchParams);
      
      if (newEntries.length > 0) {
        onNewData(newEntries);
        const displayQuery = [researchTopic, selectedCategory !== 'All' ? selectedCategory : '', selectedPlatform, dateRange].filter(Boolean).join(' | ');
        const execSummary = await generateExecutiveSummary(newEntries, displayQuery);
        setSummary(execSummary);
      } else {
        setSummary("No specific new intelligence could be synthesized for these parameters. Try broadening your research scope.");
      }
    } catch (e) {
      console.error(e);
      setSummary("An error occurred during the intelligence synthesis process.");
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestions = [
    "Telegram romance scams in Mogadishu 2024",
    "Facebook task-scams targeting youth in Nairobi",
    "Fake NGO donation fraud on WhatsApp during Ramadan",
    "Crypto-mining malware trends in East African internet cafes"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-1000 pb-20">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-red-500/10 p-8 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-red-400 mb-2 flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            High-Precision Intelligence Synthesis
          </h2>
          <p className="text-slate-400 text-sm">
            Leverage Gemini-3 Pro for deep OSINT synthesis. Filter by platform, category, and timeframe for tactical precision.
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-xs mono uppercase text-slate-500 font-bold">Research Objective</label>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="text-[10px] mono text-red-400 hover:text-red-300 transition-colors uppercase flex items-center gap-1"
              >
                {showFilters ? 'Hide Granular Filters' : 'Show Granular Filters'}
                <svg className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <input
              type="text"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-slate-200 focus:outline-none focus:border-red-500 transition-all placeholder:text-slate-700"
              placeholder="e.g., 'Recent recruitment tactics used by regional BEC syndicates'"
              value={researchTopic}
              onChange={(e) => setResearchTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDeepResearch()}
            />

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 animate-in slide-in-from-top-2">
                <div className="space-y-1">
                  <label className="text-[10px] mono text-slate-600 uppercase">Category</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-red-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {Object.values(ScamCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] mono text-slate-600 uppercase">Platform</label>
                  <input
                    type="text"
                    list="platforms-list"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-red-500"
                    placeholder="e.g., Telegram"
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                  />
                  <datalist id="platforms-list">
                    {PLATFORMS.map(p => <option key={p} value={p} />)}
                  </datalist>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] mono text-slate-600 uppercase">Date Range / Timeframe</label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-red-500"
                    placeholder="e.g., Q1 2024"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-[10px] text-slate-500 mono pt-1 uppercase">Quick Queries:</span>
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => setResearchTopic(s)}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-1 rounded transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleDeepResearch}
            disabled={isGenerating || (!researchTopic.trim() && !selectedCategory && !selectedPlatform)}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
              isGenerating || (!researchTopic.trim() && selectedCategory === 'All' && !selectedPlatform)
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                Synthesizing Granular Intel...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Initiate Tactical Analysis
              </>
            )}
          </button>

          {summary && (
            <div className="mt-8 animate-in slide-in-from-top-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] mono text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded">Analysis Successful</span>
                  </div>
                  <span className="text-[10px] mono text-slate-500">INTEL_NODE: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                </div>
                <div className="prose prose-invert text-sm text-slate-300 whitespace-pre-wrap leading-relaxed italic border-l-2 border-red-500/30 pl-4">
                  "{summary}"
                </div>
                <p className="mt-4 text-[10px] text-slate-600 mono text-right uppercase tracking-tighter">
                  New TTPs identified and mapped to database
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09a10.116 10.116 0 001.283-3.562L7 12l1.913-1.434a10.015 10.015 0 001.283-3.562l.054-.09V9a2 2 0 012-2h1.5M9 11l3 3m0 0l3-3m-3 3V8', label: 'News Scraping', status: 'ACTIVE' },
          { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Platform Indicators', status: 'MONITORING' },
          { icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'OSINT Verifier', status: 'ONLINE' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800/50 p-4 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-400">{item.label}</p>
              <p className="text-[9px] mono text-slate-600">{item.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIResearcher;
