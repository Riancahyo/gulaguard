import { Activity, CheckCircle2, Droplet, TrendingUp } from 'lucide-react';
import { IntakeEntry } from '../types';
import { SUGAR_WARNING, SUGAR_HIGH, fmt } from '../constants';

interface Props {
  entries: IntakeEntry[];
  totalSugar: number;
  todaysEntries: IntakeEntry[];
}

const card = 'bg-white rounded-3xl border border-slate-100 shadow-sm';

export default function AnalysisPage({ entries, totalSugar, todaysEntries }: Props) {
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().split('T')[0];
    const sugar = entries.filter(e => e.date === key).reduce((s, e) => s + e.analysis.estimated_sugar, 0);
    return { key, label: d.toLocaleDateString('id-ID', { weekday: 'short' }), sugar, isToday: i === 0 };
  }).reverse();

  const maxBar = Math.max(...last7.map(d => d.sugar), SUGAR_HIGH);
  const activeCount = last7.filter(d => d.sugar > 0).length;
  const weekAvg = activeCount > 0 ? last7.reduce((s, d) => s + d.sugar, 0) / activeCount : 0;

  const summaryCards = [
    { label: 'Rata-rata Harian', value: `${fmt(weekAvg)} g`, sub: '7 hari terakhir', icon: <TrendingUp className="w-4 h-4 text-sky-500" /> },
    { label: 'Total Minggu', value: `${fmt(last7.reduce((s, d) => s + d.sugar, 0))} g`, sub: 'semua gula', icon: <Activity className="w-4 h-4 text-indigo-500" /> },
    { label: 'Hari Aktif', value: `${activeCount} hari`, sub: 'dari 7 hari', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
    { label: 'Hari Ini', value: `${fmt(totalSugar)} g`, sub: `${todaysEntries.length} item`, icon: <Droplet className="w-4 h-4 text-orange-500" /> },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map(s => (
          <div key={s.label} className={`${card} p-5`}>
            <span className="mb-3 block">{s.icon}</span>
            <p className="text-xl font-extrabold">{s.value}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
            <p className="text-[9px] text-slate-300 font-medium">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className={`${card} p-6`}>
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 mb-5">Konsumsi Gula 7 Hari</h3>
        <div className="flex items-end gap-2 h-36">
          {last7.map(day => {
            const pct = maxBar > 0 ? day.sugar / maxBar : 0;
            const col = day.sugar > SUGAR_HIGH ? 'bg-rose-400' : day.sugar > SUGAR_WARNING ? 'bg-orange-400' : day.sugar > 0 ? 'bg-sky-400' : 'bg-slate-100';
            return (
              <div key={day.key} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-[8px] font-bold text-slate-600 h-3 flex items-center">
                  {day.sugar > 0 ? `${fmt(day.sugar)}` : ''}
                </p>
                <div className="w-full flex items-end" style={{ height: 96 }}>
                  <div className={`w-full rounded-xl ${col} transition-all duration-700 ${day.isToday ? 'ring-2 ring-offset-2 ring-sky-300' : ''}`}
                    style={{ height: Math.max(pct * 96, day.sugar > 0 ? 6 : 0) }} />
                </div>
                <p className={`text-[9px] font-black uppercase ${day.isToday ? 'text-sky-600' : 'text-slate-300'}`}>{day.label}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between gap-1 text-[10px] font-bold uppercase tracking-tighter text-slate-400">
        {[['bg-sky-400', 'Aman (<25g)'], ['bg-orange-400', 'Sedang (25-50g)'], ['bg-rose-400', 'Tinggi (>50g)']].map(([c, l]) => (
            <span key={l} className="flex items-center gap-1 whitespace-nowrap">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c}`} />
            {l}
            </span>
        ))}
        </div>
      </div>
    </div>
  );
}