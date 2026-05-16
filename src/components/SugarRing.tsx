import { fmt, SUGAR_WARNING, SUGAR_HIGH } from '../constants';

interface Props {
  value: number;
  max: number;
}

export default function SugarRing({ value, max }: Props) {
  const pct = Math.min(value / max, 1);
  const r = 36, circ = 2 * Math.PI * r;
  const color = value > SUGAR_HIGH ? '#f43f5e' : value > SUGAR_WARNING ? '#f97316' : '#0ea5e9';
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} fill="none" stroke="#f1f5f9" strokeWidth="7" />
      <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${pct * circ} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 44 44)"
        style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(.4,0,.2,1)' }} />
      <text x="44" y="40" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">{fmt(value)}</text>
      <text x="44" y="53" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#94a3b8">gram</text>
    </svg>
  );
}