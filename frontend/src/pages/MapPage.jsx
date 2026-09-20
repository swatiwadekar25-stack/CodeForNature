import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import PageIntro from '../components/PageIntro'
import { getForests } from '../services/api'
import { useApiRequest } from '../hooks/useApiRequest'

const priorityStyles = {
  Green: { label: 'Low', color: '#5f934d', fillColor: '#a9d483' },
  Yellow: { label: 'Medium', color: '#b58a2d', fillColor: '#efd477' },
  Red: { label: 'High', color: '#a85042', fillColor: '#e59a88' },
}

function MapPage() {
  const { data: forests, loading, error } = useApiRequest(getForests)
  const mappedForests = forests?.filter((forest) => Number.isFinite(forest.latitude) && Number.isFinite(forest.longitude)) || []

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Geospatial workspace" title="Forest map" description="Explore forest locations on an OpenStreetMap base layer. Forest markers will be supplied by the API." />
      {error && <EmptyState title="Forest locations are unavailable" description={error.message} />}
      {loading && <p className="text-sm text-[#71867b]">Loading forest locations...</p>}
      <div className="relative h-130 overflow-hidden rounded-2xl border border-[#d5e0d3] bg-[#dce8d8] shadow-sm">
        <MapContainer center={[22.5, 79]} zoom={5} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mappedForests.map((forest) => {
            const priority = priorityStyles[forest.riskLevel] || priorityStyles.Green

            return (
              <CircleMarker key={forest._id} center={[forest.latitude, forest.longitude]} pathOptions={{ color: priority.color, fillColor: priority.fillColor, fillOpacity: 0.9, weight: 2 }} radius={9}>
              <Popup>
                <div className="min-w-48 space-y-2 text-sm text-[#244238]">
                  <strong className="block text-base">{forest.name}</strong>
                  <p className="m-0 text-[#60786d]">{forest.location}, {forest.state}</p>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-[#dce5da] pt-2">
                    <dt className="text-[#789176]">Degradation</dt>
                    <dd className="m-0 font-semibold">{forest.degradationScore}/100</dd>
                    <dt className="text-[#789176]">Priority</dt>
                    <dd className="m-0 font-semibold" style={{ color: priority.color }}>{forest.riskLevel} · {priority.label}</dd>
                    <dt className="text-[#789176]">Status</dt>
                    <dd className="m-0">{forest.restorationStatus}</dd>
                  </dl>
                  <Link to={`/forests/${forest._id}`} className="block border-t border-[#dce5da] pt-2 font-semibold text-[#47723d] hover:text-[#244238]">Open forest profile →</Link>
                </div>
              </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
        <div className="absolute right-4 top-4 z-400 rounded-xl border border-[#dce5da] bg-[#fbfcfa]/95 p-3 shadow-md backdrop-blur-sm" aria-label="Priority legend">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#789176]">Priority</p>
          <div className="space-y-1.5">
            {Object.entries(priorityStyles).map(([risk, priority]) => (
              <div key={risk} className="flex items-center gap-2 text-xs text-[#60786d]">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: priority.fillColor, border: `2px solid ${priority.color}` }} />
                <span>{risk} · {priority.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!loading && !error && !mappedForests.length && <p className="text-sm text-[#71867b]">No forest coordinates were returned by the API.</p>}
    </div>
  )
}

export default MapPage