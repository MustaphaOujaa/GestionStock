import { useStock } from '../context/StockContext';
import { Package, TrendingUp, TrendingDown, AlertTriangle, BarChart2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function DashboardPage({ setActiveTab }) {
  const { stats, movements, products } = useStock();

  const quickActions = [
    { id: 'products', icon: Package, title: 'Catalogue', subtitle: 'Gérer les produits', target: 'products' },
    { id: 'movements', icon: ArrowDownCircle, title: 'Mouvements', subtitle: 'Voir les entrées / sorties', target: 'movements' },
    { id: 'stock', icon: TrendingUp, title: 'Statistiques', subtitle: 'Analyser le stock', target: 'dashboard' }
  ];

  const recentMovements = movements.slice(0, 5);
  const lowStockItems = products.filter(p => p.quantity > 0 && p.quantity < p.minStock);
  const outOfStock = products.filter(p => p.quantity === 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Tableau de Bord</h2>
          <p className="text-sm text-slate-400 mt-1">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Quick Action Squares */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {quickActions.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => setActiveTab(action.target)}
              className="group bg-white rounded-3xl border border-slate-100 shadow-sm p-6 aspect-square flex flex-col justify-between text-left hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{action.subtitle}</p>
                  <h3 className="mt-3 text-2xl font-bold text-slate-800 leading-tight">{action.title}</h3>
                </div>
                <div className="w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                  <Icon size={24} />
                </div>
              </div>
              <span className="mt-4 text-xs font-semibold text-blue-600 opacity-80 group-hover:opacity-100 transition-opacity">Ouvrir maintenant</span>
            </button>
          );
        })}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[
          { icon: Package, label: 'Total Produits', value: stats.totalProducts, sub: 'articles référencés', color: 'blue', bg: 'bg-blue-100', text: 'text-blue-600' },
          { icon: BarChart2, label: 'Valeur du Stock', value: `${stats.totalValue.toLocaleString()} DH`, sub: 'valeur estimée', color: 'violet', bg: 'bg-violet-100', text: 'text-violet-600' },
          { icon: AlertTriangle, label: 'Stock Faible', value: stats.lowStock, sub: 'sous le seuil', color: 'amber', bg: 'bg-amber-100', text: 'text-amber-600' },
          { icon: TrendingDown, label: 'Rupture de Stock', value: stats.outOfStock, sub: 'articles épuisés', color: 'rose', bg: 'bg-rose-100', text: 'text-rose-600' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between min-h-[180px] hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{card.label}</p>
                </div>
                <div className={`w-14 h-14 rounded-3xl ${card.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={24} className={card.text} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mt-6">{card.value}</p>
                <p className="text-xs text-slate-400 mt-2">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Movements */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
            <h3 className="font-bold text-slate-800">Derniers Mouvements</h3>
            <button onClick={() => setActiveTab('movements')} className="text-xs text-blue-600 font-semibold hover:underline">Voir tout →</button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentMovements.map(m => (
              <div key={m.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${m.type === 'IN' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                    {m.type === 'IN' ? <ArrowDownCircle size={17} className="text-emerald-600" /> : <ArrowUpCircle size={17} className="text-rose-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{m.productName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Par {m.by} • {m.date}</p>
                  </div>
                </div>
                <span className={`text-base font-bold ${m.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {m.type === 'IN' ? '+' : '-'}{m.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-50">
            <h3 className="font-bold text-slate-800">Alertes Stock</h3>
          </div>
          <div className="p-4 space-y-3">
            {outOfStock.length === 0 && lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <TrendingUp size={32} className="mx-auto mb-2 text-emerald-300" />
                <p className="text-sm">Tout est en ordre ! ✅</p>
              </div>
            ) : (
              <>
                {outOfStock.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                    <div className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-0.5"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-red-800 truncate">{p.name}</p>
                      <p className="text-xs text-red-500 mt-0.5">Rupture totale</p>
                    </div>
                  </div>
                ))}
                {lowStockItems.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="w-2 h-2 bg-amber-500 rounded-full shrink-0 mt-0.5"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-amber-800 truncate">{p.name}</p>
                      <p className="text-xs text-amber-600 mt-0.5">Stock: {p.quantity} / min {p.minStock}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
