const card = 'bg-white rounded-3xl border border-slate-100 shadow-sm';

const INFO_ITEMS = [
  {
    title: 'Batas Gula Harian WHO',
    body: 'WHO merekomendasikan asupan gula bebas maksimal 25g/hari (5% dari total kalori) untuk manfaat kesehatan optimal, dan tidak lebih dari 50g/hari.',
    dot: 'bg-sky-400',
  },
  {
    title: 'Tanda Konsumsi Gula Berlebih',
    body: 'Sering haus, cepat lapar setelah makan, energi naik turun drastis, jerawat, dan berat badan naik bisa menjadi indikator asupan gula terlalu tinggi.',
    dot: 'bg-orange-400',
  },
  {
    title: 'Tips Mengurangi Gula',
    body: 'Baca label nutrisi sebelum membeli, ganti minuman manis dengan air putih, pilih buah utuh daripada jus, dan masak sendiri untuk kontrol lebih baik.',
    dot: 'bg-emerald-400',
  },
  {
    title: 'Gula Tersembunyi',
    body: 'Banyak produk "sehat" mengandung gula tersembunyi: yogurt rasa, granola, saus tomat, roti tawar, dan minuman energi sering mengandung gula sangat tinggi.',
    dot: 'bg-rose-400',
  },
];

export default function InfoPage() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {INFO_ITEMS.map(c => (
        <div key={c.title} className={`${card} p-6`}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${c.dot}`} />
            <h3 className="text-sm font-black text-slate-800">{c.title}</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium text-justify">{c.body}</p>
        </div>
      ))}
    </div>
  );
}