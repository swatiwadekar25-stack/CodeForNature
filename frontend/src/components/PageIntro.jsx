function PageIntro({ eyebrow = 'Workspace', title, description, action }) {
  return (
    <div className="flex flex-col gap-5 border-b border-[#dce5da] pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#75936f]">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-[#17322b] sm:text-4xl">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#60786d]">{description}</p>
      </div>
      {action}
    </div>
  )
}

export default PageIntro