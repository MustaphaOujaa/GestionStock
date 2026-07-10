import { useMemo } from 'react';
import { useStock } from '../hooks/useStock.js';
import { formatPrice, exportRowsToCsv } from '../utils/index.js';
import { BarChart2, Printer, Download, TrendingUp, Package, Users, AlertTriangle, PieChart } from 'lucide-react';

const BAR_COLORS = [
  '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444',
  '#06b6d4', '#ec4899', '#6366f1', '#14b8a6', '#f97316',
];

export default function ReportsPage() {
  const { products, movements, stats, settings } = useStock();

  // ──────────────── Date range summary ────────────────
  const dateRange = useMemo(() => {
    if (movements.length === 0) return null;
    const dates = movements.map(m => new Date(m.date));
    const min = new Date(Math.min(...dates));
    const max = new Date(Math.max(...dates));
    const fmt = d => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    return { from: fmt(min), to: fmt(max), count: movements.length };
  }, [movements]);

  // ──────────────── KPI calculations ────────────────
  const kpis = useMemo(() => {
    const totalOutgoing = movements.filter(m => m.type === 'OUT').reduce((s, m) => s + m.quantity, 0);
    const totalStock = products.reduce((s, p) => s + p.quantity, 0);
    const turnoverRate = totalStock > 0 ? (totalOutgoing / totalStock) : 0;

    const avgValuePerProduct = products.length > 0
      ? products.reduce((s, p) => s + p.price * p.quantity, 0) / products.length
      : 0;

    const productIdsWithMovements = new Set(movements.map(m => m.productId));
    const activeProducts = products.filter(p => productIdsWithMovements.has(p.id)).length;

    const alertProducts = products.filter(p => p.quantity === 0 || (p.quantity > 0 && p.quantity < p.minStock)).length;
    const alertRate = products.length > 0 ? (alertProducts / products.length) * 100 : 0;

    return { turnoverRate, avgValuePerProduct, activeProducts, alertRate, alertProducts };
  }, [products, movements]);

  // ──────────────── Stock value distribution by category ────────────────
  const categoryDistribution = useMemo(() => {
    const grouped = products.reduce((acc, p) => {
      const cat = p.category || 'Sans catégorie';
      acc[cat] = (acc[cat] || 0) + p.price * p.quantity;
      return acc;
    }, {});
    const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    const maxValue = entries.length > 0 ? entries[0][1] : 0;
    return entries.map(([category, value], i) => ({
      category,
      value,
      percent: maxValue > 0 ? (value / maxValue) * 100 : 0,
      color: BAR_COLORS[i % BAR_COLORS.length],
    }));
  }, [products]);

  // ──────────────── Top 5 most moved products ────────────────
  const topMovedProducts = useMemo(() => {
    const movementMap = movements.reduce((acc, m) => {
      acc[m.productId] = (acc[m.productId] || { name: m.productName, totalIn: 0, totalOut: 0 });
      if (m.type === 'IN') acc[m.productId].totalIn += m.quantity;
      else acc[m.productId].totalOut += m.quantity;
      return acc;
    }, {});
    return Object.entries(movementMap)
      .map(([id, data]) => ({ id, ...data, total: data.totalIn + data.totalOut }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [movements]);

  // ──────────────── Supplier summary ────────────────
  const supplierSummary = useMemo(() => {
    const grouped = products.reduce((acc, p) => {
      const supplier = p.supplier || 'Inconnu';
      if (!acc[supplier]) acc[supplier] = { count: 0, totalValue: 0 };
      acc[supplier].count += 1;
      acc[supplier].totalValue += p.price * p.quantity;
      return acc;
    }, {});
    return Object.entries(grouped)
      .map(([supplier, data]) => ({ supplier, ...data }))
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [products]);

  // ──────────────── CSV export ────────────────
  const handleExportCsv = () => {
    const rows = products.map(p => {
      const mvts = movements.filter(m => m.productId === p.id);
      const totalIn = mvts.filter(m => m.type === 'IN').reduce((s, m) => s + m.quantity, 0);
      const totalOut = mvts.filter(m => m.type === 'OUT').reduce((s, m) => s + m.quantity, 0);
      return {
        Référence: p.ref || `PRD-${String(p.id).padStart(3, '0')}`,
        Nom: p.name,
        Catégorie: p.category,
        Fournisseur: p.supplier,
        Quantité: p.quantity,
        'Stock Min': p.minStock,
        Prix: p.price,
        'Valeur Stock': p.price * p.quantity,
        'Total Entrées': totalIn,
        'Total Sorties': totalOut,
      };
    });
    exportRowsToCsv(`rapport-stock-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  };

  // ──────────────── KPI card config ────────────────
  const kpiCards = [
    {
      icon: TrendingUp,
      label: 'Taux de Rotation',
      value: `${(kpis.turnoverRate * 100).toFixed(1)}%`,
      sub: 'sorties / stock total',
      bg: 'bg-blue-100',
      text: 'text-blue-600',
    },
    {
      icon: PieChart,
      label: 'Valeur Moy. / Produit',
      value: formatPrice(kpis.avgValuePerProduct, settings.currency),
      sub: 'valeur stock par article',
      bg: 'bg-violet-100',
      text: 'text-violet-600',
    },
    {
      icon: Package,
      label: 'Produits Actifs',
      value: kpis.activeProducts,
      sub: 'avec mouvements enregistrés',
      bg: 'bg-emerald-100',
      text: 'text-emerald-600',
    },
    {
      icon: AlertTriangle,
      label: "Taux d'Alerte",
      value: `${kpis.alertRate.toFixed(1)}%`,
      sub: `${kpis.alertProducts} produit(s) en alerte`,
      bg: 'bg-amber-100',
      text: 'text-amber-600',
    },
  ];

  const totalStockValue = products.reduce((s, p) => s + p.price * p.quantity, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Rapports & Analytique</h2>
          <p className="text-sm text-slate-400 mt-1">
            Vue d'ensemble détaillée de votre inventaire et des performances du stock
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-600 hover:shadow-sm"
          >
            <Printer size={16} />
            Imprimer
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200 hover:bg-emerald-700"
          >
            <Download size={16} />
            Exporter CSV
          </button>
        </div>
      </div>

      {/* ── Date Range Summary ── */}
      {dateRange && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <BarChart2 size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Période couverte</p>
              <p className="text-xs text-slate-400">Du {dateRange.from} au {dateRange.to}</p>
            </div>
          </div>
          <span className="text-sm font-bold text-slate-600">{dateRange.count} mouvement(s) enregistré(s)</span>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between min-h-[180px] hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{card.label}</p>
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

      {/* ── Distribution & Top Mouvements ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Stock Value by Category (bar chart) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
            <div>
              <h3 className="font-bold text-slate-800">Valeur du Stock par Catégorie</h3>
              <p className="text-xs text-slate-400 mt-1">
                Valeur totale : {formatPrice(totalStockValue, settings.currency)}
              </p>
            </div>
            <PieChart size={18} className="text-slate-300" />
          </div>
          <div className="p-6 space-y-4">
            {categoryDistribution.length === 0 ? (
              <p className="text-sm text-slate-400">Aucune donnée disponible</p>
            ) : (
              categoryDistribution.map(({ category, value, percent, color }) => (
                <div key={category}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-sm font-semibold text-slate-700">{category}</span>
                    <span className="text-xs font-semibold text-slate-400">
                      {formatPrice(value, settings.currency)}
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${percent}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top 5 Most Moved Products */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-50">
            <h3 className="font-bold text-slate-800">Top 5 – Produits les Plus Mouvementés</h3>
            <p className="text-xs text-slate-400 mt-1">Par quantité totale (entrées + sorties)</p>
          </div>
          <div className="p-4 space-y-3">
            {topMovedProducts.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <TrendingUp size={32} className="mx-auto mb-2 text-emerald-300" />
                <p className="text-sm">Aucun mouvement enregistré</p>
              </div>
            ) : (
              topMovedProducts.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                  <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ↑ {item.totalIn} entrées · ↓ {item.totalOut} sorties
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{item.total}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Supplier Summary ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
          <div>
            <h3 className="font-bold text-slate-800">Résumé par Fournisseur</h3>
            <p className="text-xs text-slate-400 mt-1">
              {supplierSummary.length} fournisseur(s) · {stats.totalProducts} produit(s)
            </p>
          </div>
          <Users size={18} className="text-slate-300" />
        </div>

        {supplierSummary.length === 0 ? (
          <div className="p-6 text-sm text-slate-400">Aucun fournisseur trouvé</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Fournisseur</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 text-center">Nb Produits</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 text-right">Valeur Totale</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 text-right">% du Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {supplierSummary.map(({ supplier, count, totalValue }) => {
                  const pct = totalStockValue > 0 ? ((totalValue / totalStockValue) * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={supplier} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">{supplier}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{count}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 text-right">
                        {formatPrice(totalValue, settings.currency)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Footer note ── */}
      <div className="text-center py-4">
        <p className="text-xs text-slate-300">
          Rapport généré le {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
