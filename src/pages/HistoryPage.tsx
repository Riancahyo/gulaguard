import { History, X } from 'lucide-react';
import { IntakeEntry } from '../types';
import { fmt } from '../constants';
import { getDayLabel } from '../utils/dateUtils';
import { getFoodIconSmall } from '../utils/foodIcon';

interface Props {
  entries: IntakeEntry[];
  deleteEntry: (id: string) => void;
}

const card = 'bg-white rounded-3xl border border-slate-100 shadow-sm';

export default function HistoryPage({ entries, deleteEntry }: Props) {
  const grouped = entries.reduce<Record<string, IntakeEntry[]>>((acc, e) => {
    (acc[e.date] ??= []).push(e); return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-5">
      {sortedDates.length === 0 ? (
        <div className={`${card} py-20 flex flex-col items-center gap-3`}>
          <History className="w-10 h-10 text-slate-200" />
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Belum ada riwayat</p>
        </div>
      ) : sortedDates.map(date => {
        const dayEntries = grouped[date];
        const daySugar = dayEntries.reduce((s, e) => s + e.analysis.estimated_sugar, 0);
        const dayCal = dayEntries.reduce((s, e) => s + e.analysis.estimated_calories, 0);
        return (
          <div key={date} className={`${card} overflow-hidden`}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <p className="text-sm font-black text-slate-700 uppercase tracking-wide">{getDayLabel(date)}</p>
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase">
                <span>{fmt(daySugar)} g gula</span>
                <span className="text-slate-200">·</span>
                <span>{dayCal.toFixed(0)} kkal</span>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {dayEntries.map(entry => (
                <div key={entry.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group">
                  <div className="w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {entry.imageUrl
                      ? <img src={entry.imageUrl} className="w-full h-full object-cover" alt="" />
                      : getFoodIconSmall(entry.rawInput)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 truncate uppercase tracking-tight">{entry.rawInput}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{entry.timestamp} · {entry.analysis.estimated_calories.toFixed(0)} kkal</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">{fmt(entry.analysis.estimated_sugar)} g</p>
                      <span className={`text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full ${
                        entry.analysis.risk_status === 'High' ? 'bg-rose-50 text-rose-500'
                        : entry.analysis.risk_status === 'Warning' ? 'bg-orange-50 text-orange-500'
                        : 'bg-emerald-50 text-emerald-500'
                      }`}>
                        {entry.analysis.risk_status === 'High' ? 'Tinggi' : entry.analysis.risk_status === 'Warning' ? 'Sedang' : 'Aman'}
                      </span>
                    </div>
                    <button onClick={() => deleteEntry(entry.id)}
                      className="text-slate-200 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}