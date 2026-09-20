import { useLocation } from 'react-router-dom'

const pageNames = {
  '/': 'Overview',
  '/forests': 'Forest sites',
  '/map': 'GIS map',
  '/reports': 'Community reports',
  '/restoration': 'Restoration',
  '/statistics': 'Statistics',
}

function Header() {
  const location = useLocation()
  const title = location.pathname.startsWith('/forests/') ? 'Forest profile' : pageNames[location.pathname] || 'TeraPlus'

  return (
    <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between border-b border-[#dce5da] bg-[#f8faf7e8] px-4 py-4 shadow-sm shadow-[#294f3608] backdrop-blur-md sm:px-8 lg:px-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d8a7d]">Restoration intelligence</p>
        <h1 className="mt-1 text-lg font-semibold tracking-tight text-[#17322b] sm:text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-[#dce5da] bg-[#fbfcfa] px-3 py-1.5">
        <span className="size-2 rounded-full bg-[#8dbb4c] shadow-[0_0_0_3px_#e5efd8]" aria-hidden="true" />
        <span className="text-xs font-semibold text-[#5e776b] sm:text-sm">API workspace</span>
      </div>
    </header>
  )
}

export default Header