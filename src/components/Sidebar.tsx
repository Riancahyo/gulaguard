import { Droplet, Settings } from 'lucide-react';
import { Tab } from '../types';

interface NavItem {
  id: Tab;
  icon: React.ReactNode;
  label: string;
}

interface Props {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  navItems: NavItem[];
  onSettingsOpen: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, navItems, onSettingsOpen }: Props) {
  return (
    <aside className="hidden md:flex flex-col w-64 xl:w-72 fixed top-0 left-0 h-full bg-white border-r border-slate-100 shadow-sm z-40 px-5 py-8">
      <div className="flex items-center gap-3 mb-10 px-2">
        <Droplet className="w-6 h-6 text-sky-500" />
        <span className="text-lg font-black tracking-tight">GulaGuard</span>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ id, icon, label }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === id ? 'bg-sky-50 text-sky-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
            }`}>
            {icon} {label}
          </button>
        ))}
      </nav>
      <button onClick={onSettingsOpen}
        className="mt-3 flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 text-sm font-bold transition-all">
        <Settings className="w-5 h-5" /> Pengaturan
      </button>
    </aside>
  );
}