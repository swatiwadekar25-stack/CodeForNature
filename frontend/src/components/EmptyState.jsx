function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#cbd8c9] bg-[#f8faf7cc] px-6 py-14 text-center shadow-sm shadow-[#294f3608]" role="status" aria-live="polite">
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#e5efd8] text-lg font-semibold text-[#557c48] shadow-inner shadow-[#82a95b22]">+</div>
      <h3 className="mt-4 text-base font-semibold text-[#244238]">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#70877b]">{description}</p>
    </div>
  )
}

export default EmptyState