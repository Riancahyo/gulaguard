import React, { useState, useEffect } from 'react';
import { Droplet, History, Info, LayoutGrid, Plus, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { IntakeEntry, Tab } from './types';
import { analyzeIntake } from './services/geminiService';

import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import InputModal from './components/InputModal';
import SettingsModal from './components/SettingsModal';

import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import AnalysisPage from './pages/AnalysisPage';
import InfoPage from './pages/InfoPage';

const PAGE_TITLE: Record<Tab, string> = {
  home: 'Beranda',
  history: 'Riwayat Asupan',
  analysis: 'Analisis Mingguan',
  info: 'Info Kesehatan',
};

const NAV_ITEMS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: 'home',     icon: <Droplet className="w-5 h-5" />,    label: 'Beranda'  },
  { id: 'history',  icon: <History className="w-5 h-5" />,    label: 'Riwayat'  },
  { id: 'analysis', icon: <LayoutGrid className="w-5 h-5" />, label: 'Analisis' },
  { id: 'info',     icon: <Info className="w-5 h-5" />,       label: 'Info'     },
];

export default function App() {
  const [entries, setEntries] = useState<IntakeEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem('gulaguard_entries') || '[]'); }
    catch { return []; }
  });
  const [inputValue, setInputValue]     = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing]   = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [isInputOpen, setIsInputOpen]   = useState(false);
  const [activeTab, setActiveTab]       = useState<Tab>('home');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    localStorage.setItem('gulaguard_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 4000);
    return () => clearTimeout(t);
  }, [error]);

  const todaysEntries  = entries.filter(e => e.date === todayStr);
  const totalSugar     = todaysEntries.reduce((s, e) => s + e.analysis.estimated_sugar, 0);
  const totalCalories  = todaysEntries.reduce((s, e) => s + e.analysis.estimated_calories, 0);

  const handleSubmit = async () => {
    if ((!inputValue.trim() && !selectedImage) || isAnalyzing) return;
    setIsAnalyzing(true); setError(null);
    try {
      const analysis = await analyzeIntake(inputValue, totalSugar, selectedImage || undefined);
      const now = new Date();
      setEntries(prev => [{
        id: crypto.randomUUID(),
        timestamp: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        date: todayStr,
        rawInput: inputValue || 'Analisis Gambar',
        imageUrl: selectedImage || undefined,
        analysis,
      }, ...prev]);
      setInputValue(''); setSelectedImage(null); setIsInputOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menganalisis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteEntry = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-900 font-sans">
      <div className="flex min-h-screen">

        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navItems={NAV_ITEMS}
          onSettingsOpen={() => setSettingsOpen(true)}
        />

        <div className="flex-1 md:ml-64 xl:ml-72 pb-28 md:pb-0">

          {/* Mobile Header */}
          <header className="md:hidden fixed top-0 inset-x-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-5 pt-safe h-16">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-sky-500" />
              <span className="text-lg font-black tracking-tight">GulaGuard</span>
            </div>
            <button onClick={() => setSettingsOpen(true)}
              className="w-9 h-9 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
              <Settings className="w-4 h-4 text-slate-900" />
            </button>
          </header>

          {/* Desktop Header */}
          <header className="hidden md:flex items-center justify-between px-8 pt-8 pb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <h2 className="text-2xl font-black mt-0.5">{PAGE_TITLE[activeTab]}</h2>
            </div>
            <button onClick={() => setIsInputOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-slate-200 active:scale-95 transition-transform">
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </header>

          <main className="px-5 md:px-8 space-y-5 max-w-5xl pt-20 md:pt-6">
            {activeTab === 'home' && (
              <HomePage
                todaysEntries={todaysEntries}
                totalSugar={totalSugar}
                totalCalories={totalCalories}
                deleteEntry={deleteEntry}
              />
            )}
            {activeTab === 'history' && (
              <HistoryPage entries={entries} deleteEntry={deleteEntry} />
            )}
            {activeTab === 'analysis' && (
              <AnalysisPage
                entries={entries}
                totalSugar={totalSugar}
                todaysEntries={todaysEntries}
              />
            )}
            {activeTab === 'info' && <InfoPage />}
          </main>
        </div>
      </div>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navItems={NAV_ITEMS}
        onAddClick={() => setIsInputOpen(prev => !prev)}
        isInputOpen={isInputOpen}
      />

      <InputModal
        isOpen={isInputOpen}
        onClose={() => setIsInputOpen(false)}
        inputValue={inputValue}
        setInputValue={setInputValue}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        isAnalyzing={isAnalyzing}
        onSubmit={handleSubmit}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        entries={entries}
        onClearAll={() => setEntries([])}
      />

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-rose-500 text-white px-5 py-3 rounded-full text-xs font-bold shadow-xl max-w-xs text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}