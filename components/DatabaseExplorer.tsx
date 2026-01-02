
import React, { useState } from 'react';
import { IntelligenceEntry, Severity, ScamCategory } from '../types';

interface DatabaseExplorerProps {
  data: IntelligenceEntry[];
}

const DatabaseExplorer: React.FC<DatabaseExplorerProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedEntry, setSelectedEntry] = useState<IntelligenceEntry | null>(null);

  const filteredData = data.filter(entry => {
    const matchesSearch = 
      entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tactic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.platform.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || entry.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case Severity.CRITICAL: return 'bg-red-500/20 text-red-500 border-red-500/50';
      case Severity.HIGH: return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
      case Severity.MEDIUM: return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case Severity.LOW: return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      default: return 'bg-slate-500/20 text-slate-500 border-slate-500/50';
    }
  };

  const formatCurrency = (val: number | null | undefined) => {
    if (val === null || val === undefined) return "$0";
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full md:w-96">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by ID, Tactic, or Platform..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-red-500/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="bg-slate-950 border border-slate-800 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-red-500/50"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {Object.values(ScamCategory).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-400 font-medium uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Platform</th>
                <th className="px-6 py-4">Financial Loss (USD)</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Conf.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredData.map((entry) => (
                <tr 
                  key={entry.id} 
                  className="hover:bg-slate-800/30 cursor-pointer transition-colors group"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <td className="px-6 py-4 mono text-red-400 font-semibold">{entry.id}</td>
                  <td className="px-6 py-4 text-slate-300 font-medium">{entry.category}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-800 px-2 py-1 rounded text-[10px] text-slate-400 mono">{entry.platform}</span>
                  </td>
                  <td className="px-6 py-4 text-red-500 font-bold tabular-nums">
                    {formatCurrency(entry.financial_impact.reported_loss_usd)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-bold border ${getSeverityColor(entry.severity)}`}>
                      {entry.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-1 py-0.5 rounded ${
                      entry.financial_impact.confidence === 'High' ? 'text-green-500 bg-green-500/10' :
                      entry.financial_impact.confidence === 'Medium' ? 'text-yellow-500 bg-yellow-500/10' : 'text-slate-500 bg-slate-500/10'
                    }`}>
                      {entry.financial_impact.confidence}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-500 italic">No intelligence matching filters found in current repository.</p>
          </div>
        )}
      </div>

      {/* Detail View Overlay */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="text-red-500">[{selectedEntry.id}]</span> Tactical Analysis
              </h2>
              <button onClick={() => setSelectedEntry(null)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
              {/* Financial Dashboard in Detail View */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <span className="text-[10px] mono text-slate-500 block mb-1 uppercase tracking-tighter">Reported Loss</span>
                  <span className="font-bold text-red-500 text-lg tabular-nums">{formatCurrency(selectedEntry.financial_impact.reported_loss_usd)}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <span className="text-[10px] mono text-slate-500 block mb-1 uppercase tracking-tighter">Est. Recovery</span>
                  <span className="font-bold text-green-500 text-lg tabular-nums">{formatCurrency(selectedEntry.financial_impact.recovered_usd)}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <span className="text-[10px] mono text-slate-500 block mb-1 uppercase tracking-tighter">Confidence</span>
                  <span className={`font-bold text-lg uppercase ${
                    selectedEntry.financial_impact.confidence === 'High' ? 'text-blue-500' : 'text-slate-400'
                  }`}>{selectedEntry.financial_impact.confidence}</span>
                </div>
              </div>

              <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800">
                 <h4 className="text-[10px] mono text-slate-500 uppercase mb-2">Estimated Loss Range ({selectedEntry.financial_impact.time_period})</h4>
                 <div className="flex items-center gap-4 text-slate-400 font-bold">
                    <span>{formatCurrency(selectedEntry.financial_impact.estimated_loss_usd.min)}</span>
                    <div className="flex-1 h-1 bg-slate-800 rounded-full relative">
                       <div className="absolute inset-y-0 left-0 bg-red-500/50 rounded-full w-full"></div>
                    </div>
                    <span>{formatCurrency(selectedEntry.financial_impact.estimated_loss_usd.max)}</span>
                 </div>
                 <p className="mt-2 text-[10px] text-slate-600 italic">{selectedEntry.financial_impact.notes}</p>
              </div>

              <div>
                <span className="text-[10px] mono text-slate-500 block mb-2 uppercase">Operational Tactic</span>
                <p className="text-slate-300 bg-slate-800/30 p-4 rounded-lg border border-slate-800/50 leading-relaxed">
                  {selectedEntry.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] mono text-slate-500 block mb-2 uppercase">Risk Indicators (IoCs)</span>
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.signals.map((sig, i) => (
                    <span key={i} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-[10px] mono">
                      {sig}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800 text-[10px] mono text-slate-500">
                <span>SOURCE: {selectedEntry.sourceType}</span>
                <span>TARGETS: {selectedEntry.targetRegions.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseExplorer;
