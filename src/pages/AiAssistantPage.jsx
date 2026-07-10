import { useMemo, useState } from 'react';
import { Bot, BrainCircuit, Send, Sparkles, AlertTriangle, ShoppingCart, Download, Activity } from 'lucide-react';
import { useStock } from '../hooks/useStock.js';
import { answerInventoryQuestion, exportRowsToCsv, formatPrice, generateAiInventoryInsights } from '../utils/index.js';

const suggestedPrompts = [
  'Quoi acheter cette semaine ?',
  'Quels produits sont en rupture ?',
  'Montre le stock faible',
  'Quelle est la valeur du stock ?'
];

export default function AiAssistantPage() {
  const { products, movements, stats, settings } = useStock();
  const insights = useMemo(() => generateAiInventoryInsights(products, movements), [products, movements]);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Analyse prête. Score santé stock: ${insights.healthScore}/100. Pose une question ou lance une recommandation.`
    }
  ]);

  const askAssistant = (question = prompt) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) {
      return;
    }

    const answer = answerInventoryQuestion(cleanQuestion, products, movements, stats, settings.currency);
    setMessages(current => [
      ...current,
      { role: 'user', content: cleanQuestion },
      { role: 'assistant', content: answer }
    ]);
    setPrompt('');
  };

  const exportAiPlan = () => {
    const rows = insights.recommendations
      .filter(item => item.suggestedQty > 0)
      .map(item => ({
        produit: item.product.name,
        reference: item.product.ref,
        priorite: item.priority,
        stock_actuel: item.product.quantity,
        stock_minimum: item.product.minStock,
        quantite_recommandee: item.suggestedQty,
        budget_estime: item.suggestedQty * item.product.price,
        raison: item.reason
      }));

    exportRowsToCsv('stockpro-plan-ai.csv', rows);
  };

  const topRecommendations = insights.recommendations.slice(0, 6);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Bot className="text-blue-600" size={28} />
            Assistant IA
          </h2>
          <p className="text-slate-500 text-sm mt-1">Analyse locale du stock, recommandations et réponses instantanées</p>
        </div>
        <button onClick={exportAiPlan} className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors">
          <Download size={18} /> Export plan IA
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 mb-6">
        {[
          { label: 'Score santé', value: `${insights.healthScore}/100`, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Priorités critiques', value: insights.criticalCount, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Budget recommandé', value: formatPrice(insights.totalSuggestedCost, settings.currency), icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Catégorie dominante', value: insights.topCategory, icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-50' }
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{card.label}</p>
                <div className={`w-11 h-11 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="mt-5 text-2xl font-bold text-slate-800 truncate">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3">
            <BrainCircuit size={20} className="text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-800">Recommandations IA</h3>
              <p className="text-xs text-slate-400 mt-0.5">Priorisées selon seuil minimum, sorties récentes et rupture</p>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {topRecommendations.map(item => (
              <div key={item.product.id} className="p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-bold text-slate-800">{item.product.name}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item.priority === 'Critique' ? 'bg-red-100 text-red-700' :
                        item.priority === 'Haute' ? 'bg-amber-100 text-amber-700' :
                          item.priority === 'Moyenne' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-600'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{item.reason}</p>
                  <p className="text-xs text-slate-400 mt-1">Stock {item.product.quantity} / min {item.product.minStock} • Sorties récentes {item.outgoing}</p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div>
                    <p className="text-xs text-slate-400">Risque</p>
                    <p className="text-lg font-bold text-slate-800">{item.riskScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Commander</p>
                    <p className="text-lg font-bold text-blue-600">+{item.suggestedQty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col min-h-[560px]">
          <div className="px-6 py-5 border-b border-slate-50">
            <h3 className="font-bold text-slate-800">Chat stock</h3>
            <p className="text-xs text-slate-400 mt-0.5">Réponses calculées depuis les données locales</p>
          </div>

          <div className="p-4 flex flex-wrap gap-2 border-b border-slate-50">
            {suggestedPrompts.map(item => (
              <button key={item} onClick={() => askAssistant(item)} className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-full transition-colors">
                {item}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={event => { event.preventDefault(); askAssistant(); }} className="p-4 border-t border-slate-50 flex gap-2">
            <input
              value={prompt}
              onChange={event => setPrompt(event.target.value)}
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              placeholder="Demander à l'IA..."
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-11 h-11 rounded-xl flex items-center justify-center transition-colors">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
