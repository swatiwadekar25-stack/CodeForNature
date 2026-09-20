import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

function MainLayout() {
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1 bg-[#f8faf755]">
        <Header />
        <main className="mx-auto max-w-360 px-4 py-6 sm:px-8 sm:py-9 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout