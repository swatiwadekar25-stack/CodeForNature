import EmptyState from './EmptyState'

function RecentForests({ forests, loading, error }) {
  return (
    <section className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-5 shadow-sm shadow-[#294f3608]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-[#244238]">Recent forest sites</h3>
          <p className="mt-1 text-xs text-[#789176]">Latest monitored landscapes</p>
        </div>
        <span className="rounded-full bg-[#e5efd8] px-2.5 py-1 text-xs font-semibold text-[#507749]">Live</span>
      </div>
      {loading && <p className="py-10 text-center text-sm text-[#789176]">Loading forest sites...</p>}
      {error && <p className="py-10 text-center text-sm text-[#a85a4a]">{error.message}</p>}
      {!loading && !error && !forests?.length && <EmptyState title="No forest sites yet" description="Seed the backend database to populate this summary." />}
      {!!forests?.length && (
        <div className="mt-5 divide-y divide-[#e5ece2]">
          {forests.slice(0, 4).map((forest) => (
            <article key={forest._id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <h4 className="truncate text-sm font-semibold text-[#244238]">{forest.name}</h4>
                <p className="mt-1 truncate text-xs text-[#789176]">{forest.state} · {forest.restorationStatus}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-[#244238]">{forest.degradationScore}/100</p>
                <p className="mt-1 text-xs text-[#789176]">{forest.riskLevel}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default RecentForests