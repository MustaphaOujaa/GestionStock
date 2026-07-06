import { useState } from 'react'
import { LayoutDashboard, Package, ArrowRightLeft, Settings, Bell, Search, Plus } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-400">StockPro</h1>
          <p className="text-xs text-slate-400 mt-1">Gestion d'Inventaire</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Tableau de Bord</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Package size={20} />
            <span className="font-medium">Produits</span>
          </button>

          <button 
            onClick={() => setActiveTab('movements')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'movements' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <ArrowRightLeft size={20} />
            <span className="font-medium">Mouvements</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors">
            <Settings size={20} />
            <span className="font-medium">Paramètres</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un produit, une référence..." 
              className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg pl-10 pr-4 py-2 text-sm transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                AD
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Admin User</p>
                <p className="text-xs text-slate-400">Gestionnaire</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Vue d'ensemble</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm shadow-blue-200 transition-colors">
                  <Plus size={18} />
                  Nouveau Mouvement
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: "Total Produits", value: "1,248", trend: "+12% ce mois", color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Valeur du Stock", value: "45,200 DH", trend: "+5% ce mois", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Rupture de Stock", value: "14", trend: "À surveiller", color: "text-rose-600", bg: "bg-rose-50" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    <p className="text-slate-500 font-medium text-sm mb-2">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-slate-800 mb-4">{stat.value}</h3>
                    <div className={`mt-auto inline-flex px-3 py-1 rounded-full text-xs font-semibold w-max ${stat.color} ${stat.bg}`}>
                      {stat.trend}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Mouvements Récents</h3>
                <div className="space-y-4">
                  {[
                    { type: 'IN', prod: 'MacBook Pro M2', qty: '+5', date: 'Aujourd\'hui, 10:42', by: 'Admin User' },
                    { type: 'OUT', prod: 'Souris Logitech MX', qty: '-2', date: 'Aujourd\'hui, 09:15', by: 'Othmane S.' },
                    { type: 'IN', prod: 'Clavier Mécanique', qty: '+10', date: 'Hier, 16:30', by: 'Admin User' },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${m.type === 'IN' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          {m.type}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{m.prod}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Par {m.by} • {m.date}</p>
                        </div>
                      </div>
                      <div className={`font-bold ${m.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {m.qty}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col items-center justify-center text-slate-400">
              <Package size={64} className="mb-4 text-slate-200" />
              <h2 className="text-xl font-bold text-slate-700">Gestion des Produits</h2>
              <p className="mt-2 text-sm text-center max-w-md">La liste des produits apparaîtra ici. Vous pourrez ajouter, modifier, ou supprimer des articles du catalogue.</p>
            </div>
          )}

          {activeTab === 'movements' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col items-center justify-center text-slate-400">
              <ArrowRightLeft size={64} className="mb-4 text-slate-200" />
              <h2 className="text-xl font-bold text-slate-700">Historique des Mouvements</h2>
              <p className="mt-2 text-sm text-center max-w-md">L'historique complet des entrées (IN) et sorties (OUT) de stock avec filtrage par date et produit.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
