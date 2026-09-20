import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import ForestDetail from './pages/ForestDetail'
import Forests from './pages/Forests'
import MapPage from './pages/MapPage'
import Reports from './pages/Reports'
import Restoration from './pages/Restoration'
import Statistics from './pages/Statistics'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/forests" element={<Forests />} />
        <Route path="/forests/:id" element={<ForestDetail />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/restoration" element={<Restoration />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App