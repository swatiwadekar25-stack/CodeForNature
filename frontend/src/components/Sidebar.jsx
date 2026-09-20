import { NavLink } from 'react-router-dom'

const navigation = [
  { label: 'Overview', to: '/' },
  { label: 'Forest sites', to: '/forests' },
  { label: 'Restoration', to: '/restoration' },
  { label: 'Community reports', to: '/reports' },
  { label: 'GIS map', to: '/map' },
  { label: 'Statistics', to: '/statistics' },
]

function Sidebar() {
  return (
    <aside className="flex w-full flex-col border-b border-[#d7e0d5] bg-[#173b31] text-[#d9e7da] lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:border-[#245246]">
      <div className="flex items-center justify-between px-4 py-5 sm:px-6 sm:py-6 lg:block">
        <NavLink to="/" className="group inline-flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#b9d86c] text-lg font-black text-[#173b31] shadow-sm">T+</span>
          <span>
            <span className="block text-lg font-semibold tracking-tight text-white">TeraPlus</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9ebeb0]">Living landscapes</span>
          </span>
        </NavLink>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:flex-1 lg:space-y-1 lg:overflow-y-auto lg:px-3 lg:pb-0" aria-label="Primary navigation">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `block whitespace-nowrap rounded-lg border-l-2 px-3 py-2.5 text-sm transition-colors ${isActive ? 'border-[#b9d86c] bg-[#2b5d4e] font-semibold text-white' : 'border-transparent text-[#b6cec0] hover:bg-[#214c40] hover:text-white'}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="hidden border-t border-[#2b5d4e] p-5 lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8eafa0]">Data workspace</p>
        <p className="mt-2 text-sm leading-5 text-[#c1d5c9]">Connected to your restoration data services.</p>
      </div>
    </aside>
  )
}

export default Sidebar