import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartCard from '../components/ChartCard'
import EmptyState from '../components/EmptyState'
import PageIntro from '../components/PageIntro'
import RecentForests from '../components/RecentForests'
import RecentReports from '../components/RecentReports'
import StatCard from '../components/StatCard'
import { useApiRequest } from '../hooks/useApiRequest'
import { getForests, getReports, getStatistics } from '../services/api'

const riskColors = ['#82a95b', '#d0a94a', '#b95c4c']

function Dashboard() {
  const statisticsRequest = useApiRequest(getStatistics)
  const forestsRequest = useApiRequest(getForests)
  const reportsRequest = useApiRequest(getReports)
  const { data: statistics, loading: statisticsLoading, error: statisticsError } = statisticsRequest

  const riskData = statistics ? [
    { name: 'Green', value: statistics.greenPrioritySites },
    { name: 'Yellow', value: statistics.yellowPrioritySites },
    { name: 'Red', value: statistics.redPrioritySites },
  ] : []

  const restorationData = statistics ? [
    { name: 'Healthy', value: statistics.healthySites },
    { name: 'Recovering', value: statistics.recoveringSites },
    { name: 'Degraded', value: statistics.degradedSites },
    { name: 'Initiated', value: statistics.restorationInitiatedSites },
  ] : []

  const degradationData = statistics ? [{
    name: 'Average score',
    value: statistics.averageDegradationScore,
  }] : []

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="TeraPlus / Overview"
        title="A clearer view of living landscapes."
        description="Monitor forest condition, understand restoration priorities, and bring community observations into one working space."
        action={<Link to="/map" className="rounded-lg bg-[#255847] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4839]">Open GIS map</Link>}
      />

      {statisticsLoading && <div className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-5 text-sm text-[#60786d]">Loading dashboard statistics from the TeraPlus API...</div>}
      {statisticsError && <EmptyState title="Dashboard statistics are unavailable" description={statisticsError.message} />}
      {!statisticsLoading && !statisticsError && !statistics && <EmptyState title="No dashboard statistics available" description="The statistics API returned no data for this workspace." />}

      {statistics && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Forest statistics">
            <StatCard label="Total forest sites" value={statistics.totalForestSites} detail="Tracked in the forest collection" />
            <StatCard label="Healthy sites" value={statistics.healthySites} tone="positive" />
            <StatCard label="Recovering sites" value={statistics.recoveringSites} tone="caution" />
            <StatCard label="Degraded sites" value={statistics.degradedSites} tone="danger" />
            <StatCard label="Restoration initiated" value={statistics.restorationInitiatedSites} detail="Active restoration status" />
            <StatCard label="High risk sites" value={statistics.redPrioritySites} tone="danger" detail="Red priority classification" />
            <StatCard label="Average degradation" value={`${statistics.averageDegradationScore}/100`} detail="Across all forest sites" />
          </section>

          <section className="grid gap-5 xl:grid-cols-3" aria-label="Forest charts">
            <ChartCard title="Risk distribution" description="Sites grouped by calculated priority level">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>
                    {riskData.map((entry, index) => <Cell key={entry.name} fill={riskColors[index]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={30} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Restoration status" description="Current status across monitored forest sites">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={restorationData} margin={{ top: 10, right: 4, left: -24, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#789176', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#789176', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#eef5e6' }} />
                  <Bar dataKey="value" fill="#6c9561" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Degradation statistics" description="Average degradation score from the Forest collection">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="68%" outerRadius="94%" startAngle={180} endAngle={0} data={degradationData} barSize={18}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={10} fill="#b9d86c" />
                  <Tooltip />
                  <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" className="fill-[#244238] text-2xl font-semibold">{statistics.averageDegradationScore}</text>
                  <text x="50%" y="74%" textAnchor="middle" dominantBaseline="middle" className="fill-[#789176] text-[11px]">out of 100</text>
                </RadialBarChart>
              </ResponsiveContainer>
            </ChartCard>
          </section>
        </>
      )}

      <section className="grid gap-5 xl:grid-cols-2">
        <RecentForests {...forestsRequest} />
        <RecentReports {...reportsRequest} />
      </section>
    </div>
  )
}

export default Dashboard