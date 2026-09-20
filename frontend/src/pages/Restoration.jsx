import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import PageIntro from '../components/PageIntro'
import { getForests } from '../services/api'
import { getRecoveryMetrics, sampleRecoveryProvider } from '../services/recoveryProgress'

const riskClasses = {
  Green: 'bg-[#e5efd8] text-[#507749]',
  Yellow: 'bg-[#fff3cd] text-[#876b25]',
  Red: 'bg-[#fbe4dc] text-[#9a4d3e]',
}

function Restoration() {
  const [state, setState] = useState({ forests: null, loading: true, error: null })

  useEffect(() => {
    let active = true

    getForests({ restorationStatus: 'Restoration Initiated' })
      .then((forests) => {
        if (active) setState({ forests, loading: false, error: null })
      })
      .catch((error) => {
        if (active) setState({ forests: null, loading: false, error })
      })

    return () => {
      active = false
    }
  }, [])

  const forests = state.forests || []
  const averageProgress = forests.length
    ? Math.round(forests.reduce((total, forest) => total + getRecoveryMetrics(forest).progress, 0) / forests.length)
    : 0

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Recovery pipeline" title="Restoration work" description="Track forest sites marked for restoration and keep future recovery evidence ready for integration." />

      <section className="rounded-2xl border border-[#eadfb9] bg-[#fff9e8] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#876b25]">Sample recovery layer</p>
            <h2 className="mt-2 text-lg font-semibold text-[#604d1d]">Recovery metrics are illustrative only.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#806b39]">The progress values below are sample estimates derived from the current degradation score. They do not come from satellites, Proof of Recovery, or a Recovery Progress Index yet.</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#f3e5b3] px-3 py-1.5 text-xs font-semibold text-[#876b25]">{sampleRecoveryProvider.source}</span>
        </div>
      </section>

      {state.loading && <EmptyState title="Loading restoration sites" description="Retrieving forests with Restoration Initiated status from the TeraPlus API." />}
      {state.error && <EmptyState title="Restoration sites are unavailable" description={state.error.message} />}
      {!state.loading && !state.error && !forests.length && <EmptyState title="No restoration sites found" description="No forest records currently have Restoration Initiated status." />}

      {!state.loading && !state.error && !!forests.length && (
        <>
          <section className="grid gap-4 sm:grid-cols-3" aria-label="Restoration summary">
            <article className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-5 shadow-sm shadow-[#294f3608]"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#789176]">Initiated sites</p><p className="mt-3 text-3xl font-semibold text-[#244238]">{forests.length}</p></article>
            <article className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-5 shadow-sm shadow-[#294f3608]"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#789176]">Sample average progress</p><p className="mt-3 text-3xl font-semibold text-[#244238]">{averageProgress}%</p></article>
            <article className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-5 shadow-sm shadow-[#294f3608]"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#789176]">Evidence status</p><p className="mt-3 text-sm font-semibold text-[#876b25]">Sample only</p></article>
          </section>

          <section className="space-y-4">
            {forests.map((forest) => {
              const metrics = getRecoveryMetrics(forest)

              return (
                <article key={forest._id} className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-5 shadow-sm shadow-[#294f3608] sm:p-6">
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                    <div className="min-w-0 lg:w-1/3">
                      <div className="flex items-start justify-between gap-3 lg:block">
                        <div>
                          <Link to={`/forests/${forest._id}`} className="text-lg font-semibold text-[#244238] hover:text-[#47723d]">{forest.name}</Link>
                          <p className="mt-1 text-sm text-[#71867b]">{forest.location}, {forest.state}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${riskClasses[forest.riskLevel] || 'bg-[#edf2e9] text-[#5e776b]'}`}>{forest.riskLevel} risk</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#789176]">
                        <span>Degradation: <strong className="text-[#49675b]">{forest.degradationScore}/100</strong></span>
                        <span>{forest.restorationStatus}</span>
                      </div>
                    </div>

                    <div className="flex-1 lg:max-w-xl">
                      <div className="flex items-center justify-between gap-3 text-sm"><span className="font-semibold text-[#244238]">Recovery progress</span><span className="font-semibold text-[#47723d]">{metrics.progress}%</span></div>
                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#e5ece2]" role="progressbar" aria-label={`Sample recovery progress for ${forest.name}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={metrics.progress}><div className="h-full rounded-full bg-[#82a95b] transition-all" style={{ width: `${metrics.progress}%` }} /></div>
                      <p className="mt-2 text-xs text-[#789176]">{metrics.source} · {metrics.proofStatus}</p>
                    </div>

                    <Link to={`/forests/${forest._id}`} className="shrink-0 text-sm font-semibold text-[#47723d] hover:text-[#244238]">View forest →</Link>
                  </div>
                </article>
              )
            })}
          </section>
        </>
      )}
    </div>
  )
}

export default Restoration