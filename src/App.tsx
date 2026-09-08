import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DriversProvider } from './components/DriversContext'
import { SummaryPage } from './pages/SummaryPage'
import { InputsPage } from './pages/InputsPage'
import { CalculationsPage } from './pages/CalculationsPage'

export default function App() {
  return (
    <DriversProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<SummaryPage />} />
          <Route path="/inputs" element={<InputsPage />} />
          <Route path="/calculations" element={<CalculationsPage />} />
        </Routes>
      </Layout>
    </DriversProvider>
  )
}
