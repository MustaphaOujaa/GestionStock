import { useState } from 'react';
import { useStock } from '../context/StockContext';
import { Plus, Search, Edit2, Trash2, X, AlertTriangle, PackageX } from 'lucide-react';

const emptyForm = { name: '', category: '', quantity: 0, minStock: 5, price: 0, supplier: '' };
const CATEGORIES = ['Informatique', 'Périphériques', 'Moniteurs', 'Mobile', 'Accessoires', 'Réseau', 'Autre'];

export default function ProductsPage() {
  const { products, addProduct, editProduct, deleteProduct } = useStock();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('Tous');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.ref.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'Tous' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p) => { setEditing(p.id); setForm({ name: p.name, category: p.category, quantity: p.quantity, minStock: p.minStock, price: p.price, supplier: p.supplier }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      editProduct(editing, { ...form, quantity: Number(form.quantity), minStock: Number(form.minStock), price: Number(form.price) });
    } else {
      addProduct({ ...form, quantity: Number(form.quantity), minStock: Number(form.minStock), price: Number(form.price) });
    }
    closeModal();
  };

  const getStatus = (p) => {
    if (p.quantity === 0) return { label: 'Rupture', color: 'bg-red-100 text-red-700' };
    if (p.quantity < p.minStock) return { label: 'Stock Bas', color: 'bg-amber-100 text-amber-700' };
    return { label: 'Disponible', color: 'bg-emerald-100 text-emerald-700' };
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Catalogue Produits</h2>
          <p className="text-slate-500 text-sm mt-1">{products.length} produits enregistrés</p>
        </div>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm shadow-blue-200 transition-colors">
          <Plus size={18} /> Nouveau Produit
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Rechercher par nom ou référence..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer">
          <option value="Tous">Toutes catégories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-4 font-semibold text-slate-500">Référence</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-500">Produit</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-500">Catégorie</th>
                <th className="text-right px-6 py-4 font-semibold text-slate-500">Stock</th>
                <th className="text-right px-6 py-4 font-semibold text-slate-500">Prix (DH)</th>
                <th className="text-center px-6 py-4 font-semibold text-slate-500">Statut</th>
                <th className="text-center px-6 py-4 font-semibold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-20 text-slate-400">
                  <PackageX size={40} className="mx-auto mb-3 text-slate-200" />
                  <p>Aucun produit trouvé</p>
                </td></tr>
              ) : filtered.map(p => {
                const status = getStatus(p);
                return (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{p.ref}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{p.supplier}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.category}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${p.quantity === 0 ? 'text-red-600' : p.quantity < p.minStock ? 'text-amber-600' : 'text-slate-800'}`}>{p.quantity}</span>
                      {p.quantity < p.minStock && p.quantity > 0 && <AlertTriangle size={12} className="inline ml-1 text-amber-500" />}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-800">{p.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}>{status.label}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={15} /></button>
                        <button onClick={() => setConfirmDelete(p)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">{editing ? 'Modifier le Produit' : 'Ajouter un Produit'}</h3>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nom du Produit *</label>
                  <input required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="ex: MacBook Pro M2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Catégorie *</label>
                  <select required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">-- Choisir --</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Fournisseur</label>
                  <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} placeholder="Nom fournisseur" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Quantité en Stock</label>
                  <input type="number" min="0" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Stock Minimum (alerte)</label>
                  <input type="number" min="0" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" value={form.minStock} onChange={e => setForm(f => ({ ...f, minStock: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Prix Unitaire (DH)</label>
                  <input type="number" min="0" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">Annuler</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors">{editing ? 'Enregistrer' : 'Ajouter'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">Supprimer ce produit ?</h3>
            <p className="text-slate-500 text-sm mb-6">L'article <span className="font-semibold text-slate-700">"{confirmDelete.name}"</span> sera supprimé définitivement.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 border border-slate-200 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">Annuler</button>
              <button onClick={() => { deleteProduct(confirmDelete.id); setConfirmDelete(null); }} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
