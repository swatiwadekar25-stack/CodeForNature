import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import PageIntro from '../components/PageIntro'
import { deleteForest, getForests, updateForest } from '../services/api'

const statuses = ['Healthy', 'Recovering', 'Degraded', 'Restoration Initiated']

function riskClasses(riskLevel) {
  return {
    Green: 'bg-[#e5efd8] text-[#507749]',
    Yellow: 'bg-[#fff3cd] text-[#876b25]',
    Red: 'bg-[#fbe4dc] text-[#9a4d3e]',
  }[riskLevel] || 'bg-[#edf2e9] text-[#5e776b]'
}

function statusClasses(status) {
  return {
    Healthy: 'bg-[#e5efd8] text-[#507749]',
    Recovering: 'bg-[#e7f0f5] text-[#416d85]',
    Degraded: 'bg-[#fbe4dc] text-[#9a4d3e]',
    'Restoration Initiated': 'bg-[#fff3cd] text-[#876b25]',
  }[status] || 'bg-[#edf2e9] text-[#5e776b]'
}

function riskFromScore(score) {
  if (score < 40) return 'Green'
  if (score < 70) return 'Yellow'
  return 'Red'
}

function ForestEditDialog({ forest, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: forest.name,
    location: forest.location,
    degradationScore: String(forest.degradationScore),
    riskLevel: forest.riskLevel,
    restorationStatus: forest.restorationStatus,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleScoreChange(event) {
    const value = event.target.value
    const numericScore = Number(value)
    setForm((current) => ({
      ...current,
      degradationScore: value,
      riskLevel: Number.isFinite(numericScore) ? riskFromScore(numericScore) : current.riskLevel,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      await updateForest(forest._id, {
        ...form,
        degradationScore: Number(form.degradationScore),
        riskLevel: riskFromScore(Number(form.degradationScore)),
      })
      onSaved()
    } catch (saveError) {
      setError(saveError.message)
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#17322b99] p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="w-full max-w-lg rounded-2xl bg-[#fbfcfa] p-6 shadow-2xl" onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="edit-forest-title">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#789176]">Forest management</p>
            <h2 id="edit-forest-title" className="mt-2 text-xl font-semibold text-[#244238]">Edit forest site</h2>
          </div>
          <button type="button" onClick={onClose} className="text-2xl leading-none text-[#789176] hover:text-[#244238]" aria-label="Close edit dialog">×</button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-[#49675b]">Forest name<input required name="name" value={form.name} onChange={handleChange} className="mt-1.5 w-full rounded-lg border border-[#cbd8c9] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6c9561] focus:ring-2 focus:ring-[#dcebd0]" /></label>
          <label className="block text-sm font-medium text-[#49675b]">Location<input required name="location" value={form.location} onChange={handleChange} className="mt-1.5 w-full rounded-lg border border-[#cbd8c9] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6c9561] focus:ring-2 focus:ring-[#dcebd0]" /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[#49675b]">Degradation score<input required min="0" max="100" type="number" name="degradationScore" value={form.degradationScore} onChange={handleScoreChange} className="mt-1.5 w-full rounded-lg border border-[#cbd8c9] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6c9561] focus:ring-2 focus:ring-[#dcebd0]" /></label>
            <label className="block text-sm font-medium text-[#49675b]">Risk level (derived)<select disabled name="riskLevel" value={form.riskLevel} className="mt-1.5 w-full rounded-lg border border-[#cbd8c9] bg-[#eef2eb] px-3 py-2.5 text-sm outline-none"><option>Green</option><option>Yellow</option><option>Red</option></select></label>
          </div>
          <label className="block text-sm font-medium text-[#49675b]">Restoration status<select name="restorationStatus" value={form.restorationStatus} onChange={handleChange} className="mt-1.5 w-full rounded-lg border border-[#cbd8c9] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6c9561] focus:ring-2 focus:ring-[#dcebd0]">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        </div>

        {error && <p className="mt-4 rounded-lg bg-[#fbe4dc] px-3 py-2 text-sm text-[#9a4d3e]">{error}</p>}
        <div className="mt-7 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#cbd8c9] px-4 py-2.5 text-sm font-semibold text-[#49675b] hover:bg-[#eef5e6]">Cancel</button>
          <button disabled={saving} type="submit" className="rounded-lg bg-[#255847] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4839] disabled:cursor-wait disabled:opacity-60">{saving ? 'Saving...' : 'Save changes'}</button>
        </div>
      </form>
    </div>
  )
}

function Forests() {
  const [filters, setFilters] = useState({ search: '', riskLevel: '', restorationStatus: '' })
  const [sortDirection, setSortDirection] = useState('desc')
  const [state, setState] = useState({ forests: null, loading: true, error: null })
  const [reloadKey, setReloadKey] = useState(0)
  const [editingForest, setEditingForest] = useState(null)
  const [mutationError, setMutationError] = useState(null)

  useEffect(() => {
    let active = true
    getForests(filters)
      .then((forests) => {
        if (active) setState({ forests, loading: false, error: null })
      })
      .catch((error) => {
        if (active) setState({ forests: null, loading: false, error })
      })

    return () => {
      active = false
    }
  }, [filters, reloadKey])

  function updateFilter(event) {
    const { name, value } = event.target
    setFilters((current) => ({ ...current, [name]: value }))
  }

  async function handleDelete(forest) {
    if (!window.confirm(`Delete ${forest.name}? This action cannot be undone.`)) return

    setMutationError(null)
    try {
      await deleteForest(forest._id)
      setReloadKey((key) => key + 1)
    } catch (error) {
      setMutationError(error.message)
    }
  }

  const sortedForests = [...(state.forests || [])].sort((first, second) => {
    const difference = first.degradationScore - second.degradationScore
    return sortDirection === 'desc' ? -difference : difference
  })

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Monitoring registry" title="Forest sites" description="Search, review, and manage forest condition records from the connected MongoDB-backed API." />

      <section className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-4 shadow-sm shadow-[#294f3608]" aria-label="Forest filters">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_180px_220px_auto]">
          <label className="sr-only" htmlFor="forest-search">Search forest name</label>
          <input id="forest-search" name="search" value={filters.search} onChange={updateFilter} placeholder="Search forest name" className="rounded-lg border border-[#cbd8c9] bg-white px-3 py-2.5 text-sm outline-none placeholder:text-[#91a59a] focus:border-[#6c9561] focus:ring-2 focus:ring-[#dcebd0]" />
          <label className="sr-only" htmlFor="risk-filter">Filter by risk level</label>
          <select id="risk-filter" name="riskLevel" value={filters.riskLevel} onChange={updateFilter} className="rounded-lg border border-[#cbd8c9] bg-white px-3 py-2.5 text-sm text-[#49675b] outline-none focus:border-[#6c9561] focus:ring-2 focus:ring-[#dcebd0]"><option value="">All risk levels</option><option>Green</option><option>Yellow</option><option>Red</option></select>
          <label className="sr-only" htmlFor="status-filter">Filter by restoration status</label>
          <select id="status-filter" name="restorationStatus" value={filters.restorationStatus} onChange={updateFilter} className="rounded-lg border border-[#cbd8c9] bg-white px-3 py-2.5 text-sm text-[#49675b] outline-none focus:border-[#6c9561] focus:ring-2 focus:ring-[#dcebd0]"><option value="">All restoration statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
          <button type="button" onClick={() => setSortDirection((direction) => direction === 'desc' ? 'asc' : 'desc')} className="rounded-lg border border-[#cbd8c9] px-3 py-2.5 text-sm font-semibold text-[#49675b] hover:bg-[#eef5e6]">Score: {sortDirection === 'desc' ? 'High to low' : 'Low to high'}</button>
        </div>
      </section>

      {mutationError && <div className="rounded-lg bg-[#fbe4dc] px-4 py-3 text-sm text-[#9a4d3e]">{mutationError}</div>}
      {state.loading && <EmptyState title="Loading forest sites" description="Retrieving the latest records from the TeraPlus API." />}
      {state.error && <EmptyState title="Forest sites are unavailable" description={state.error.message} />}
      {!state.loading && !state.error && !sortedForests.length && <EmptyState title="No forest sites found" description="Try changing the search or filters, or seed the backend database." />}

      {!!sortedForests.length && (
        <div className="overflow-x-auto rounded-2xl border border-[#dce5da] bg-[#fbfcfa] shadow-sm shadow-[#294f3608]">
          <table className="min-w-225 w-full text-left">
            <thead className="border-b border-[#dce5da] bg-[#f4f8f2] text-xs uppercase tracking-[0.12em] text-[#789176]">
              <tr><th className="px-5 py-4 font-semibold">Forest site</th><th className="px-5 py-4 font-semibold">Location</th><th className="px-5 py-4 font-semibold">Degradation</th><th className="px-5 py-4 font-semibold">Risk</th><th className="px-5 py-4 font-semibold">Restoration</th><th className="px-5 py-4 text-right font-semibold">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-[#e5ece2]">
              {sortedForests.map((forest) => (
                <tr key={forest._id} className="transition hover:bg-[#f6faf4]">
                  <td className="px-5 py-4"><Link to={`/forests/${forest._id}`} className="font-semibold text-[#244238] hover:text-[#47723d]">{forest.name}</Link></td>
                  <td className="px-5 py-4 text-sm text-[#60786d]">{forest.location}<span className="block text-xs text-[#91a59a]">{forest.state}, {forest.district}</span></td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#244238]">{forest.degradationScore}/100</td>
                  <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${riskClasses(forest.riskLevel)}`}>{forest.riskLevel}</span></td>
                  <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses(forest.restorationStatus)}`}>{forest.restorationStatus}</span></td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-3 text-sm"><Link to={`/forests/${forest._id}`} className="font-semibold text-[#47723d] hover:text-[#244238]">View</Link><button type="button" onClick={() => setEditingForest(forest)} className="font-semibold text-[#416d85] hover:text-[#244238]">Edit</button><button type="button" onClick={() => handleDelete(forest)} className="font-semibold text-[#a85042] hover:text-[#74372d]">Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingForest && <ForestEditDialog forest={editingForest} onClose={() => setEditingForest(null)} onSaved={() => { setEditingForest(null); setReloadKey((key) => key + 1) }} />}
    </div>
  )
}

export default Forests