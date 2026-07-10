import { useState } from 'react';
import { useStock } from '../context/StockContext';
import { Plus, X, ArrowDownCircle, ArrowUpCircle, TrendingUp, TrendingDown } from 'lucide-react';

const emptyForm = { productId: '', type: 'IN', quantity: 1, note: '' };

export default function MovementsPage() {
  const { movements, products, addMovement } = useStock();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [filterType, setFilterType] = useState('TOUS');
  const [error, setError] = useState(null);

  const filtered = movements.filter(m => filterType === 'TOUS' || m.type === filterType);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    try {
      addMovement({ ...form, productId: Number(form.productId), quantity: Number(form.quantity) });
      setShowModal(false);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    }
  };

  const totalIn = movements.filter(m => m.type === 'IN').reduce((s, m) => s + m.quantity, 0);
  const totalOut = movements.filter(m => m.type === 'OUT').reduce((s, m) => s + m.quantity, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Mouvements de Stock</h2>
          <p className="text-slate-500 text-sm mt-1">{movements.length} opérations enregistrées</p>
        </div>
        <button onClick={() => { setShowModal(true); setError(null); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm shadow-blue-200 transition-colors">
          <Plus size={18} /> Nouveau Mouvement
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
            <TrendingUp size={28} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Total Entrées (IN)</p>
            <p className="text-3xl font-bold text-emerald-600">+{totalIn}</p>
            <p className="text-xs text-slate-400 mt-0.5">unités reçues</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-5">
          <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center shrink-0">
            <TrendingDown size={28} className="text-rose-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Total Sorties (OUT)</p>
            <p className="text-3xl font-bold text-rose-600">-{totalOut}</p>
            <p className="text-xs text-slate-400 mt-0.5">unités expédiées</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6">
        <div className="flex border-b border-slate-100">
          {['TOUS', 'IN', 'OUT'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${filterType === type ? 'text-blue-600 border-b-2 border-blue-600 -mb-px' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {type === 'TOUS' ? 'Tous les mouvements' : type === 'IN' ? '📥 Entrées' : '📤 Sorties'}
            </button>
          ))}
        </div>

        <div className="divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <ArrowUpCircle size={40} className="mx-auto mb-3 text-slate-200" />
              <p>Aucun mouvement enregistré</p>
            </div>
          ) : filtered.map(m => (
            <div key={m.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${m.type === 'IN' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                  {m.type === 'IN'
                    ? <ArrowDownCircle size={20} className="text-emerald-600" />
                    : <ArrowUpCircle size={20} className="text-rose-600" />
                  }
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{m.productName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {m.note && <span>{m.note} • </span>}
                    Par <span className="font-medium text-slate-600">{m.by}</span> • {m.date}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-xl font-bold ${m.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {m.type === 'IN' ? '+' : '-'}{m.quantity}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">unités</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Movement Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Nouveau Mouvement</h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Produit *</label>
                <select required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer" value={form.productId} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))}>
                  <option value="">-- Sélectionner un produit --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Type de Mouvement *</label>
                <div className="grid grid-cols-2 gap-3">
                  {['IN', 'OUT'].map(t => (
                    <button
                      key={t} type="button"
                      onClick={() => setForm(f => ({ ...f, type: t }))}
                      className={`py-3 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all ${form.type === t ? (t === 'IN' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-rose-500 bg-rose-50 text-rose-700') : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}
                    >
                      {t === 'IN' ? <><ArrowDownCircle size={16} /> Entrée</> : <><ArrowUpCircle size={16} /> Sortie</>}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Quantité *</label>
                <input type="number" min="1" required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Note (optionnel)</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="ex: Vente client #C120" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setError(null); }} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">Annuler</button>
                <button type="submit" className={`flex-1 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors ${form.type === 'IN' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}>Confirmer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
