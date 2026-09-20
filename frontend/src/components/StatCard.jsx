function StatCard({ label, value, detail, tone = 'default' }) {
  const toneClasses = {
    default: 'bg-[#fbfcfa] border-[#dce5da] text-[#244238]',
    positive: 'bg-[#eef5e6] border-[#d8e8c8] text-[#3f6c39]',
    caution: 'bg-[#fff7df] border-[#f0e2af] text-[#876b25]',
    danger: 'bg-[#fff0eb] border-[#f2d5ca] text-[#9a4d3e]',
  }

  return (
    <article className={`rounded-2xl border p-5 shadow-sm shadow-[#294f3608] ${toneClasses[tone] || toneClasses.default}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value ?? '—'}</p>
      {detail && <p className="mt-2 text-xs opacity-70">{detail}</p>}
    </article>
  )
}

export default StatCard