
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DatabaseExplorer from './components/DatabaseExplorer';
import AIResearcher from './components/AIResearcher';
import { IntelligenceEntry } from './types';
import { MOCK_DATA_SEED } from './constants';
import { generateIntelligenceData } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [intelData, setIntelData] = useState<IntelligenceEntry[]>(MOCK_DATA_SEED);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Generation (Phase 1)
  useEffect(() => {
    const initResearch = async () => {
      try {
        // We generate a significant chunk initially using the new object-based parameter
        const result = await generateIntelligenceData({ count: 40 }); 
        if (result.length > 0) {
          setIntelData(prev => [...prev, ...result]);
        }
      } catch (err) {
        console.error("Failed initial research", err);
      } finally {
        setIsLoading(false);
      }
    };
    initResearch();
  }, []);

  const handleNewData = (newEntries: IntelligenceEntry[]) => {
    setIntelData(prev => [...prev, ...newEntries]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={intelData} />;
      case 'database':
        return <DatabaseExplorer data={intelData} />;
      case 'research':
        return <AIResearcher onNewData={handleNewData} />;
      default:
        return <Dashboard data={intelData} />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <h2 className="text-white font-bold tracking-widest text-lg">INITIALIZING INTEL ENGINE</h2>
          <p className="text-slate-500 text-xs mono uppercase mt-1">Collecting public records & synthesizing datasets...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
