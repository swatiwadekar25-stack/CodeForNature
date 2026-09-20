function ChartCard({ title, description, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-5 shadow-sm shadow-[#294f3608] ${className}`}>
      <div>
        <h3 className="font-semibold text-[#244238]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-[#789176]">{description}</p>
      </div>
      <div className="mt-5 h-64">{children}</div>
    </section>
  )
}

export default ChartCard