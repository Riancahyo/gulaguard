import { AlertTriangle, CheckCircle2, Utensils, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IntakeEntry } from '../types';
import { SUGAR_WARNING, SUGAR_HIGH, fmt } from '../constants';
import SugarRing from '../components/SugarRing';
import { getFoodIcon } from '../utils/foodIcon';

interface Props {
  todaysEntries: IntakeEntry[];
  totalSugar: number;
  totalCalories: number;
  deleteEntry: (id: string) => void;
}

const card = 'bg-white rounded-3xl border border-slate-100 shadow-sm';

export default function HomePage({ todaysEntries, totalSugar, totalCalories, deleteEntry }: Props) {
  const status = (() => {
    if (totalSugar > SUGAR_HIGH) return {
      label: 'PERLU PERHATIAN', colorText: 'text-rose-600',
      border: 'border-rose-300', bg: 'bg-rose-50',
      msg: 'Batas gula harian terlampaui!',
      icon: <AlertTriangle className="w-5 h-5" />,
    };
    if (totalSugar > SUGAR_WARNING) return {
      label: 'WASPADAI', colorText: 'text-orange-600',
      border: 'border-orange-300', bg: 'bg-orange-50',
      msg: 'Asupan gula cukup tinggi hari ini',
      icon: <AlertTriangle className="w-5 h-5" />,
    };
    return {
      label: 'AMAN', colorText: 'text-sky-600',
      border: 'border-sky-200', bg: 'bg-sky-50',
      msg: 'Asupan gula masih terkontrol',
      icon: <CheckCircle2 className="w-5 h-5" />,
    };
  })();

  return (
    <>
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Sugar hero card */}
        <div className={`${card} col-span-2 p-5 flex items-center justify-between`}>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gula Hari Ini</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold tabular-nums leading-none">{fmt(totalSugar)}</span>
              <span className="text-base font-bold text-slate-400">g</span>
              <span className="text-sm text-slate-500 font-medium">/ {SUGAR_HIGH}g</span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">{totalCalories.toFixed(0)} kkal dikonsumsi</p>
            <div className="mt-3 w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${
                totalSugar > SUGAR_HIGH ? 'bg-rose-400' : totalSugar > SUGAR_WARNING ? 'bg-orange-400' : 'bg-sky-400'
              }`} style={{ width: `${Math.min((totalSugar / SUGAR_HIGH) * 100, 100)}%` }} />
            </div>
          </div>
          <SugarRing value={totalSugar} max={SUGAR_HIGH} />
        </div>

        {/* Items count */}
        <div className={`${card} p-5 flex flex-col justify-between`}>
          <Utensils className="w-5 h-5 text-indigo-400 mb-3" />
          <div>
            <p className="text-2xl font-extrabold">{todaysEntries.length}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Item hari ini</p>
          </div>
        </div>

        {/* Status card */}
        <div className={`${card} p-5 flex flex-col justify-between ${status.bg} border ${status.border}`}>
          <span className={`mb-3 ${status.colorText}`}>{status.icon}</span>
          <div>
            <p className={`text-xs font-black uppercase tracking-wider ${status.colorText}`}>{status.label}</p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-tight">{status.msg}</p>
          </div>
        </div>
      </div>

      {/* Today's entries */}
      <div className={`${card} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">Catatan Hari Ini</h3>
          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">
            {todaysEntries.length} item
          </span>
        </div>

        {todaysEntries.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 border border-dashed border-slate-200 rounded-2xl">
            <Utensils className="w-7 h-7 text-slate-200" />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">
              Belum ada makanan yang dicatat
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <AnimatePresence mode="popLayout">
              {todaysEntries.map(entry => (
                <motion.div
                  key={entry.id} layout
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  className="bg-[#F7F8FA] border border-slate-100 rounded-3xl p-4 flex flex-col items-center relative group active:scale-95 transition-all overflow-hidden"
                >
                  <button
                    onClick={e => { e.stopPropagation(); deleteEntry(entry.id); }}
                    className="absolute top-3 right-3 text-slate-200 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute top-3.5 left-3.5">
                    <div className={`w-2 h-2 rounded-full ${entry.analysis.estimated_sugar > 15 ? 'bg-orange-400' : 'bg-emerald-400'}`} />
                  </div>

                  <p className="text-[9px] font-black text-slate-600 line-clamp-1 w-full text-center uppercase tracking-tight mb-3 px-2">
                    {entry.rawInput}
                  </p>

                  <div className="w-14 h-14 mb-3 overflow-hidden flex items-center justify-center">
                    {entry.imageUrl
                      ? <img src={entry.imageUrl} className="w-full h-full object-cover rounded-2xl" alt="" />
                      : getFoodIcon(entry.rawInput)}
                  </div>

                  <p className="text-sm font-extrabold text-slate-900 tabular-nums">{fmt(entry.analysis.estimated_sugar)} g</p>
                  <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">{entry.timestamp}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}