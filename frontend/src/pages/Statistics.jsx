import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartCard from '../components/ChartCard'
import EmptyState from '../components/EmptyState'
import PageIntro from '../components/PageIntro'
import StatCard from '../components/StatCard'
import { useApiRequest } from '../hooks/useApiRequest'
import { getStatistics } from '../services/api'

const riskColors = ['#82a95b', '#d0a94a', '#b95c4c']
const statusColors = ['#6c9561', '#5e8ca4', '#b95c4c', '#d0a94a']

function Statistics() {
  const { data: statistics, loading, error } = useApiRequest(getStatistics)

  const riskDistribution = statistics ? [
    { name: 'Green · Low', value: statistics.greenPrioritySites },
    { name: 'Yellow · Medium', value: statistics.yellowPrioritySites },
    { name: 'Red · High', value: statistics.redPrioritySites },
  ] : []

  const restorationDistribution = statistics ? [
    { name: 'Healthy', value: statistics.healthySites },
    { name: 'Recovering', value: statistics.recoveringSites },
    { name: 'Degraded', value: statistics.degradedSites },
    { name: 'Initiated', value: statistics.restorationInitiatedSites },
  ] : []

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Evidence layer" title="Forest statistics" description="Explore condition, risk, and restoration patterns calculated from the MongoDB Forest collection." />

      {loading && <EmptyState title="Loading statistics" description="Retrieving calculated forest statistics from the TeraPlus API." />}
      {error && <EmptyState title="Statistics are unavailable" description={error.message} />}
      {!loading && !error && !statistics && <EmptyState title="No statistics available" description="The statistics API returned no data for this workspace." />}

      {statistics && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Forest statistics summary">
            <StatCard label="Total forest sites" value={statistics.totalForestSites} detail="MongoDB collection total" />
            <StatCard label="Healthy forests" value={statistics.healthySites} tone="positive" />
            <StatCard label="Recovering forests" value={statistics.recoveringSites} tone="caution" />
            <StatCard label="Degraded forests" value={statistics.degradedSites} tone="danger" />
            <StatCard label="Restoration initiated" value={statistics.restorationInitiatedSites} detail="Current restoration status" />
            <StatCard label="Average degradation" value={`${statistics.averageDegradationScore}/100`} detail="Across all forest sites" />
          </section>

          <section className="grid gap-5 xl:grid-cols-2" aria-label="Distribution charts">
            <ChartCard title="Risk distribution" description="Forest sites grouped by calculated priority level">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>
                    {riskDistribution.map((entry, index) => <Cell key={entry.name} fill={riskColors[index]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={30} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Restoration distribution" description="Forest sites grouped by current restoration status">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={restorationDistribution} margin={{ top: 10, right: 4, left: -24, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#789176', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#789176', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#eef5e6' }} />
                  <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                    {restorationDistribution.map((entry, index) => <Cell key={entry.name} fill={statusColors[index]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.7fr)]">
            <ChartCard title="Degradation score breakdown" description="Average score and calculated risk bands from the Forest collection" className="h-full">
              <div className="flex h-full flex-col justify-center">
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#789176]">Average degradation</p><p className="mt-2 text-4xl font-semibold tracking-tight text-[#244238]">{statistics.averageDegradationScore}<span className="text-base font-normal text-[#80968a]">/100</span></p></div>
                  <p className="max-w-44 text-right text-xs leading-5 text-[#789176]">Lower scores indicate healthier forest condition.</p>
                </div>
                <div className="space-y-4">
                  {[
                    ['Green · Low priority', statistics.greenPrioritySites, 'bg-[#82a95b]'],
                    ['Yellow · Medium priority', statistics.yellowPrioritySites, 'bg-[#d0a94a]'],
                    ['Red · High priority', statistics.redPrioritySites, 'bg-[#b95c4c]'],
                  ].map(([label, value, color]) => {
                    const share = statistics.totalForestSites ? (value / statistics.totalForestSites) * 100 : 0
                    return <div key={label}><div className="flex justify-between text-sm"><span className="text-[#60786d]">{label}</span><strong className="text-[#244238]">{value}</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e5ece2]"><div className={`h-full rounded-full ${color}`} style={{ width: `${share}%` }} /></div></div>
                  })}
                </div>
              </div>
            </ChartCard>

            <section className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-5 shadow-sm shadow-[#294f3608]">
              <h3 className="font-semibold text-[#244238]">Risk distribution table</h3>
              <p className="mt-1 text-xs leading-5 text-[#789176]">Values calculated by the backend</p>
              <div className="mt-5 overflow-hidden rounded-xl border border-[#e5ece2]">
                <table className="w-full text-left text-sm"><thead className="bg-[#f4f8f2] text-xs uppercase tracking-widest text-[#789176]"><tr><th className="px-3 py-3 font-semibold">Priority</th><th className="px-3 py-3 text-right font-semibold">Sites</th></tr></thead><tbody className="divide-y divide-[#e5ece2]">{riskDistribution.map((row) => <tr key={row.name}><td className="px-3 py-3 text-[#60786d]">{row.name}</td><td className="px-3 py-3 text-right font-semibold text-[#244238]">{row.value}</td></tr>)}</tbody></table>
              </div>
            </section>
          </section>

          <section className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-5 shadow-sm shadow-[#294f3608]">
            <h3 className="font-semibold text-[#244238]">Restoration status table</h3>
            <p className="mt-1 text-xs leading-5 text-[#789176]">Current status counts from the Forest collection</p>
            <div className="mt-5 overflow-x-auto"><table className="w-full min-w-150 text-left text-sm"><thead className="border-b border-[#dce5da] text-xs uppercase tracking-widest text-[#789176]"><tr><th className="px-3 py-3 font-semibold">Status</th><th className="px-3 py-3 font-semibold">Sites</th><th className="px-3 py-3 font-semibold">Share of total</th></tr></thead><tbody className="divide-y divide-[#e5ece2]">{restorationDistribution.map((row) => <tr key={row.name}><td className="px-3 py-3 text-[#60786d]">{row.name}</td><td className="px-3 py-3 font-semibold text-[#244238]">{row.value}</td><td className="px-3 py-3 text-[#789176]">{statistics.totalForestSites ? `${Math.round((row.value / statistics.totalForestSites) * 100)}%` : '0%'}</td></tr>)}</tbody></table></div>
          </section>
        </>
      )}
    </div>
  )
}

export default Statistics