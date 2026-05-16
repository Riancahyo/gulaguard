import { useRef } from 'react';
import { Camera, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inputValue: string;
  setInputValue: (v: string) => void;
  selectedImage: string | null;
  setSelectedImage: (v: string | null) => void;
  isAnalyzing: boolean;
  onSubmit: () => void;
}

export default function InputModal({
  isOpen, onClose,
  inputValue, setInputValue,
  selectedImage, setSelectedImage,
  isAnalyzing, onSubmit,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

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
            className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-black uppercase tracking-widest">Tambah Catatan</h2>
              <button onClick={onClose}
                className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <textarea
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Contoh: 1 gelas kopi susu, 2 potong roti..."
                className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium placeholder:text-slate-300 focus:outline-none resize-none border border-slate-100 focus:border-sky-200 transition-colors"
                rows={3}
                onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) onSubmit(); }}
              />

              {selectedImage && (
                <div className="relative inline-block">
                  <img src={selectedImage} className="w-20 h-20 object-cover rounded-2xl border-2 border-slate-100" alt="preview" />
                  <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-slate-900 text-white p-1.5 rounded-full">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center text-sky-400 hover:text-sky-500 transition-colors flex-shrink-0 w-14 h-14"
                  title="Upload foto makanan"
                >
                  <Camera className="w-8 h-8" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />

                <button
                  onClick={onSubmit}
                  disabled={(!inputValue.trim() && !selectedImage) || isAnalyzing}
                  className="flex-1 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-wider text-xs shadow-lg shadow-slate-200 disabled:bg-slate-200 disabled:shadow-none transition-all active:scale-95 h-14"
                >
                  {isAnalyzing
                    ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" />
                    : 'Analisis & Simpan'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}