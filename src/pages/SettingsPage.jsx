import { useState } from 'react';
import { Building2, Save, ShieldCheck, RotateCcw, Bell, Database } from 'lucide-react';
import { useStock } from '../hooks/useStock.js';
import { formatPrice } from '../utils/index.js';

export default function SettingsPage() {
  const { settings, stats, products, movements, updateSettings, resetDemoData } = useStock();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    updateSettings({
      ...form,
      managerInitials: form.managerInitials.trim().slice(0, 3).toUpperCase() || 'AD'
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const updateField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Paramètres</h2>
          <p className="text-slate-500 text-sm mt-1">Personnalisation et contrôle des données locales</p>
        </div>
        {saved && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <ShieldCheck size={16} /> Modifications enregistrées
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Profil de l'espace</h3>
              <p className="text-xs text-slate-400 mt-0.5">Ces informations personnalisent l'interface</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nom de l'espace</label>
              <input
                value={form.companyName}
                onChange={event => updateField('companyName', event.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                placeholder="StockPro"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Devise</label>
              <select
                value={form.currency}
                onChange={event => updateField('currency', event.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                <option value="MAD">MAD - Dirham marocain</option>
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Gestionnaire</label>
              <input
                value={form.managerName}
                onChange={event => updateField('managerName', event.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                placeholder="Admin User"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Initiales</label>
              <input
                value={form.managerInitials}
                onChange={event => updateField('managerInitials', event.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 uppercase"
                placeholder="AD"
                maxLength={3}
              />
            </div>

            <label className="md:col-span-2 flex items-center justify-between gap-4 border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-amber-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Résumé des alertes stock</p>
                  <p className="text-xs text-slate-400 mt-0.5">Afficher les alertes critiques dans la sidebar</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={form.lowStockDigest}
                onChange={event => updateField('lowStockDigest', event.target.checked)}
                className="h-5 w-5 accent-blue-600"
              />
            </label>

            <label className="md:col-span-2 flex items-center justify-between gap-4 border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Database size={18} className="text-blue-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Sauvegarde locale automatique</p>
                  <p className="text-xs text-slate-400 mt-0.5">Conserver produits, mouvements et paramètres dans le navigateur</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={form.autoSave}
                onChange={event => updateField('autoSave', event.target.checked)}
                className="h-5 w-5 accent-blue-600"
              />
            </label>
          </div>

          <div className="px-6 py-5 border-t border-slate-50 flex flex-wrap gap-3 justify-end">
            <button type="button" onClick={() => setForm(settings)} className="border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">
              Annuler
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors">
              <Save size={17} /> Enregistrer
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4">État des données</h3>
            <div className="space-y-3">
              {[
                ['Produits', products.length],
                ['Mouvements', movements.length],
                ['Valeur stock', formatPrice(stats.totalValue, settings.currency)],
                ['Alertes', stats.outOfStock + stats.lowStock]
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-bold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl border border-red-100 shadow-sm p-6">
            <h3 className="font-bold text-red-900 mb-2">Zone sensible</h3>
            <p className="text-sm text-red-700 mb-4">Cette action remplace les données actuelles par les données de démonstration.</p>
            <button onClick={resetDemoData} className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
              <RotateCcw size={17} /> Réinitialiser les données
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
