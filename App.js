import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Parceiros from './pages/Parceiros'
import Livros from './pages/Livros'
import Envios from './pages/Envios'
import './App.css'
import { BookOpen, Users, Send, LayoutDashboard } from 'lucide-react'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <BookOpen size={22} strokeWidth={1.5} />
            <span>Cortesias</span>
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <LayoutDashboard size={18} strokeWidth={1.5} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/parceiros" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Users size={18} strokeWidth={1.5} />
              <span>Parceiros</span>
            </NavLink>
            <NavLink to="/livros" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <BookOpen size={18} strokeWidth={1.5} />
              <span>Livros</span>
            </NavLink>
            <NavLink to="/envios" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Send size={18} strokeWidth={1.5} />
              <span>Envios</span>
            </NavLink>
          </nav>
          <div className="sidebar-footer">
            <span>Sistema de Cortesias</span>
          </div>
        </aside>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/parceiros" element={<Parceiros />} />
            <Route path="/livros" element={<Livros />} />
            <Route path="/envios" element={<Envios />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
