import { useEffect, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import PageIntro from '../components/PageIntro'
import { getForestById } from '../services/api'

const priorityStyles = {
  Green: { label: 'Low priority', color: '#5f934d', fillColor: '#a9d483', badge: 'bg-[#e5efd8] text-[#507749]' },
  Yellow: { label: 'Medium priority', color: '#b58a2d', fillColor: '#efd477', badge: 'bg-[#fff3cd] text-[#876b25]' },
  Red: { label: 'High priority', color: '#a85042', fillColor: '#e59a88', badge: 'bg-[#fbe4dc] text-[#9a4d3e]' },
}

function DetailField({ label, value }) {
  return (
    <div className="border-b border-[#e5ece2] pb-4 last:border-0 last:pb-0">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#789176]">{label}</dt>
      <dd className="mt-2 text-sm leading-6 text-[#244238]">{value || 'Not provided'}</dd>
    </div>
  )
}

function ForestDetail() {
  const { id } = useParams()
  const [state, setState] = useState({ forest: null, loading: true, error: null, id: null })

  useEffect(() => {
    let active = true

    getForestById(id)
      .then((forest) => {
        if (active) setState({ forest, loading: false, error: null, id })
      })
      .catch((error) => {
        if (active) setState({ forest: null, loading: false, error, id })
      })

    return () => {
      active = false
    }
  }, [id])

  const isCurrentRecord = state.id === id
  const forest = isCurrentRecord ? state.forest : null
  const loading = !isCurrentRecord || state.loading
  const priority = priorityStyles[forest?.riskLevel] || priorityStyles.Green
  const hasCoordinates = forest && Number.isFinite(forest.latitude) && Number.isFinite(forest.longitude)

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Forest profile"
        title={forest?.name || 'Forest site details'}
        description={forest ? `${forest.location}, ${forest.state}` : 'Retrieving the selected forest record from the TeraPlus API.'}
        action={<Link to="/forests" className="text-sm font-semibold text-[#47723d] hover:text-[#244238]">← Back to forest sites</Link>}
      />

      {loading && <EmptyState title="Loading forest profile" description="Retrieving this forest record from the TeraPlus API." />}
      {isCurrentRecord && state.error && <EmptyState title="Forest profile is unavailable" description={state.error.message} />}

      {forest && (
        <>
          <section className="grid gap-4 sm:grid-cols-3" aria-label="Forest condition summary">
            <article className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-6 shadow-sm shadow-[#294f3608]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#789176]">Degradation score</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-[#244238]">{forest.degradationScore}<span className="text-base font-normal text-[#80968a]">/100</span></p>
            </article>
            <article className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-6 shadow-sm shadow-[#294f3608]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#789176]">Risk level</p>
              <span className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${priority.badge}`}>{forest.riskLevel} · {priority.label}</span>
            </article>
            <article className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-6 shadow-sm shadow-[#294f3608]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#789176]">Restoration status</p>
              <p className="mt-4 text-sm font-semibold text-[#244238]">{forest.restorationStatus}</p>
            </article>
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
            <article className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-6 shadow-sm shadow-[#294f3608] sm:p-8">
              <h3 className="text-lg font-semibold text-[#244238]">Forest information</h3>
              <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <DetailField label="Location" value={forest.location} />
                <DetailField label="State" value={forest.state} />
                <DetailField label="District" value={forest.district} />
                <DetailField label="Area" value={forest.area !== undefined ? `${forest.area} km²` : undefined} />
                <DetailField label="Latitude" value={forest.latitude} />
                <DetailField label="Longitude" value={forest.longitude} />
                <div className="sm:col-span-2"><DetailField label="Biodiversity status" value={forest.biodiversityStatus} /></div>
              </dl>

              <div className="mt-8 border-t border-[#e5ece2] pt-6">
                <h3 className="text-lg font-semibold text-[#244238]">Description</h3>
                <p className="mt-3 text-sm leading-7 text-[#60786d]">{forest.description || 'No description provided.'}</p>
              </div>

              <div className="mt-8 border-t border-[#e5ece2] pt-6">
                <h3 className="text-lg font-semibold text-[#244238]">Damage types</h3>
                {forest.damageTypes?.length ? <div className="mt-3 flex flex-wrap gap-2">{forest.damageTypes.map((damageType) => <span key={damageType} className="rounded-full bg-[#edf2e9] px-3 py-1.5 text-xs font-semibold text-[#5e776b]">{damageType}</span>)}</div> : <p className="mt-3 text-sm text-[#789176]">No damage types reported.</p>}
              </div>
            </article>

            <article className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-5 shadow-sm shadow-[#294f3608]">
              <div className="flex items-start justify-between gap-4 px-1">
                <div>
                  <h3 className="font-semibold text-[#244238]">Forest location</h3>
                  <p className="mt-1 text-xs text-[#789176]">OpenStreetMap</p>
                </div>
                <span className="text-xs text-[#789176]">{hasCoordinates ? `${forest.latitude}, ${forest.longitude}` : 'Coordinates unavailable'}</span>
              </div>
              {hasCoordinates ? (
                <div className="mt-5 h-96 overflow-hidden rounded-xl">
                  <MapContainer center={[forest.latitude, forest.longitude]} zoom={10} scrollWheelZoom className="h-full w-full">
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <CircleMarker center={[forest.latitude, forest.longitude]} pathOptions={{ color: priority.color, fillColor: priority.fillColor, fillOpacity: 0.9, weight: 2 }} radius={11}>
                      <Popup>{forest.name}</Popup>
                    </CircleMarker>
                  </MapContainer>
                </div>
              ) : <div className="mt-5"><EmptyState title="No map location available" description="This forest record does not include valid latitude and longitude values." /></div>}
            </article>
          </section>
        </>
      )}
    </div>
  )
}

export default ForestDetail