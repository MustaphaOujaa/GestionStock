import { useState } from 'react'
import { StockProvider, useStock } from './context/StockContext'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import MovementsPage from './pages/MovementsPage'
import { LayoutDashboard, Package, ArrowRightLeft, Settings, Bell, Search, Menu, X, AlertTriangle } from 'lucide-react'

const navItems = [
  { id: 'dashboard',  label: 'Tableau de Bord', icon: LayoutDashboard },
  { id: 'products',   label: 'Produits',         icon: Package },
  { id: 'movements',  label: 'Mouvements',        icon: ArrowRightLeft },
]

function AppInner() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { stats } = useStock()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white flex flex-col z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              <span className="text-blue-400">Stock</span>Pro
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Gestion d'Inventaire</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon size={19} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Alerts summary */}
        {(stats.outOfStock > 0 || stats.lowStock > 0) && (
          <div className="mx-3 mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={14} className="text-amber-400" />
              <span className="text-xs font-bold text-amber-400">Alertes Stock</span>
            </div>
            {stats.outOfStock > 0 && <p className="text-xs text-slate-400">{stats.outOfStock} rupture(s)</p>}
            {stats.lowStock > 0 && <p className="text-xs text-slate-400">{stats.lowStock} stock(s) faible(s)</p>}
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white text-sm font-semibold transition-colors">
            <Settings size={19} />
            Paramètres
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="h-18 bg-white border-b border-slate-100 flex items-center justify-between px-5 lg:px-8 py-4 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full bg-slate-100 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 transition-all border border-transparent focus:border-blue-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell size={20} />
              {(stats.outOfStock + stats.lowStock) > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            <div className="flex items-center gap-3 cursor-pointer group pl-3 border-l border-slate-100">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                AD
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-700 leading-tight">Admin User</p>
                <p className="text-xs text-slate-400">Gestionnaire</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-8">
          {activeTab === 'dashboard' && <DashboardPage setActiveTab={setActiveTab} />}
          {activeTab === 'products' && <ProductsPage />}
          {activeTab === 'movements' && <MovementsPage />}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <StockProvider>
      <AppInner />
    </StockProvider>
  )
}
