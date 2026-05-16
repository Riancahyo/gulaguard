import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SUGAR_HIGH } from '../constants';
import { IntakeEntry } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entries: IntakeEntry[];
  onClearAll: () => void;
}

export default function SettingsModal({ isOpen, onClose, entries, onClearAll }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-md flex items-end md:items-center justify-center px-4 pb-6 md:pb-0"
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black uppercase tracking-widest">Pengaturan</h2>
              <button onClick={onClose}
                className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl divide-y divide-slate-100">
              <div className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-sm font-black text-slate-800">Batas Gula Harian</p>
                  <p className="text-[10px] text-slate-400 font-medium">Standar WHO</p>
                </div>
                <span className="text-sm font-black text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-100">{SUGAR_HIGH} g</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-sm font-black text-slate-800">Total Catatan</p>
                  <p className="text-[10px] text-slate-400 font-medium">Tersimpan di perangkat</p>
                </div>
                <span className="text-sm font-black text-slate-600">{entries.length} item</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Hapus semua data? Tindakan ini tidak bisa dibatalkan.')) {
                  onClearAll();
                  onClose();
                }
              }}
              className="w-full py-3.5 bg-rose-50 text-rose-600 rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-rose-100 transition-colors active:scale-95"
            >
              Hapus Semua Data
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}