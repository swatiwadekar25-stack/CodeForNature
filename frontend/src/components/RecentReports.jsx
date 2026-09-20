import EmptyState from './EmptyState'

function RecentReports({ reports, loading, error }) {
  return (
    <section className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-5 shadow-sm shadow-[#294f3608]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-[#244238]">Recent reports</h3>
          <p className="mt-1 text-xs text-[#789176]">Latest community observations</p>
        </div>
        <span className="rounded-full bg-[#edf2e9] px-2.5 py-1 text-xs font-semibold text-[#5e776b]">Live</span>
      </div>
      {loading && <p className="py-10 text-center text-sm text-[#789176]">Loading reports...</p>}
      {error && <p className="py-10 text-center text-sm text-[#a85a4a]">{error.message}</p>}
      {!loading && !error && !reports?.length && <EmptyState title="No reports yet" description="Community reports will appear here when submitted." />}
      {!!reports?.length && (
        <div className="mt-5 divide-y divide-[#e5ece2]">
          {reports.slice(0, 4).map((report) => (
            <article key={report._id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold text-[#244238]">{report.title}</h4>
                  <p className="mt-1 truncate text-xs text-[#789176]">{report.reportType} · {report.location || 'Location pending'}</p>
                </div>
                <span className="shrink-0 text-xs text-[#789176]">{report.status}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default RecentReports