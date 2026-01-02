
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { IntelligenceEntry, ScamCategory } from '../types';

interface DashboardProps {
  data: IntelligenceEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const totalReportedLoss = data.reduce((sum, item) => sum + (item.financial_impact.reported_loss_usd || 0), 0);
  const totalRecovered = data.reduce((sum, item) => sum + (item.financial_impact.recovered_usd || 0), 0);
  const avgLoss = data.length > 0 ? totalReportedLoss / data.length : 0;

  const categoryLosses = Object.values(ScamCategory).map(cat => ({
    name: cat,
    value: data.filter(d => d.category === cat).reduce((sum, item) => sum + (item.financial_impact.reported_loss_usd || 0), 0)
  })).sort((a, b) => b.value - a.value);

  const platformCounts = Array.from(new Set(data.map(d => d.platform))).map(plat => ({
    name: plat,
    count: data.filter(d => d.platform === plat).length
  })).slice(0, 5);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Reported Loss', value: formatCurrency(totalReportedLoss), trend: 'Aggregated', color: 'text-red-500' },
          { label: 'Estimated Recovery', value: formatCurrency(totalRecovered), trend: 'Seized/Returned', color: 'text-green-500' },
          { label: 'Avg. Loss per Case', value: formatCurrency(avgLoss), trend: 'Mean Impact', color: 'text-orange-500' },
          { label: 'Confidence Score', value: 'High-Medium', trend: 'OSINT Verified', color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg hover:border-slate-700 transition-colors">
            <p className="text-slate-500 text-[10px] mono uppercase mb-1 tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className={`text-2xl font-bold tracking-tighter ${stat.color}`}>{stat.value}</h3>
              <span className="text-[9px] mono text-slate-500 bg-slate-800 px-2 py-1 rounded">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Loss by Category Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              Financial Impact by Category (USD)
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryLosses} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickFormatter={(val) => formatCurrency(val)} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={9} width={100} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Reported Loss']}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attack Vector Distribution */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            Primary Platform Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformCounts}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {platformCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {platformCounts.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="mono">{item.name}</span>: {item.count} cases
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ethics & Disclaimer */}
      <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-lg text-xs text-slate-500 flex gap-4">
        <svg className="w-8 h-8 text-red-500/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p className="font-bold text-red-400 mb-1">FINANCIAL DATA DISCLAIMER</p>
          <p>Financial figures are derived from public reports, enforcement actions, and academic estimates. Actual losses may be significantly higher due to systematic underreporting in regional cybercrime ecosystems. This database does not enable tracking of private individuals or active wallets.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
