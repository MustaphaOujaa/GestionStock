import { useState, useEffect, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';

/**
 * Couleurs par défaut pour les barres du graphique.
 * Utilisées lorsque l'élément de données ne fournit pas de couleur personnalisée.
 */
const DEFAULT_COLORS = [
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#0ea5e9', // sky-500
  '#14b8a6', // teal-500
  '#22c55e', // green-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
];

/**
 * StockChart — Composant de graphique en barres horizontales en CSS pur.
 *
 * Affiche un graphique en barres horizontal animé, sans aucune dépendance
 * à une bibliothèque de graphiques. Les barres s'animent de 0 à leur
 * largeur calculée au montage du composant.
 *
 * @param {Object} props
 * @param {Array<{ label: string, value: number, color?: string }>} props.data
 *   Tableau d'objets représentant chaque barre. Chaque objet doit contenir
 *   un `label` (texte affiché à gauche), une `value` (valeur numérique),
 *   et éventuellement une `color` (couleur CSS personnalisée).
 * @param {string} [props.title] — Titre affiché en haut de la carte.
 * @param {number} [props.maxBars=8] — Nombre maximum de barres affichées.
 *   Si `data` contient plus d'éléments, seuls les premiers `maxBars` sont montrés.
 *
 * @returns {JSX.Element}
 *
 * @example
 * <StockChart
 *   title="Top Produits"
 *   data={[
 *     { label: 'Écran 24"', value: 150 },
 *     { label: 'Clavier', value: 85, color: '#22c55e' },
 *   ]}
 *   maxBars={5}
 * />
 */
export default function StockChart({ data = [], title, maxBars = 8 }) {
  /**
   * État d'animation — passe à `true` après le premier rendu
   * pour déclencher la transition CSS sur la largeur des barres.
   */
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Petit délai pour laisser le navigateur effectuer le premier paint
    // avec les barres à largeur 0, puis déclencher l'animation.
    const timer = requestAnimationFrame(() => {
      setAnimated(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  /** Données tronquées au nombre maximal de barres */
  const visibleData = useMemo(
    () => data.slice(0, maxBars),
    [data, maxBars]
  );

  /** Valeur maximale parmi les données visibles (pour le calcul proportionnel) */
  const maxValue = useMemo(
    () => Math.max(...visibleData.map(d => d.value), 0),
    [visibleData]
  );

  // ── État vide ──────────────────────────────────────────────────
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800">{title}</h3>
            <BarChart3 size={18} className="text-slate-300" />
          </div>
        )}
        <div className="text-center py-10 text-slate-400">
          <BarChart3 size={36} className="mx-auto mb-3 text-slate-200" />
          <p className="text-sm">Aucune donnée</p>
        </div>
      </div>
    );
  }

  // ── Rendu principal ────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      {/* En-tête */}
      {title && (
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-slate-800">{title}</h3>
            <p className="text-xs text-slate-400 mt-1">
              {visibleData.length} élément{visibleData.length > 1 ? 's' : ''}
              {data.length > maxBars && ` sur ${data.length}`}
            </p>
          </div>
          <BarChart3 size={18} className="text-slate-300" />
        </div>
      )}

      {/* Barres */}
      <div className="space-y-3">
        {visibleData.map((item, index) => {
          const percent = maxValue > 0
            ? Math.round((item.value / maxValue) * 100)
            : 0;
          const barColor = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

          return (
            <div key={`${item.label}-${index}`} className="group">
              {/* Label et valeur */}
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="text-sm font-semibold text-slate-700 truncate">
                  {item.label}
                </span>
                <span className="text-xs font-bold text-slate-500 tabular-nums shrink-0">
                  {typeof item.value === 'number'
                    ? item.value.toLocaleString('fr-FR')
                    : item.value}
                </span>
              </div>

              {/* Barre */}
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full group-hover:opacity-80 transition-all duration-700 ease-out"
                  style={{
                    width: animated ? `${percent}%` : '0%',
                    backgroundColor: barColor,
                    transitionProperty: 'width',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Indication du nombre masqué */}
      {data.length > maxBars && (
        <p className="text-xs text-slate-400 text-center mt-4 pt-4 border-t border-slate-50">
          +{data.length - maxBars} élément{data.length - maxBars > 1 ? 's' : ''} non affiché{data.length - maxBars > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
