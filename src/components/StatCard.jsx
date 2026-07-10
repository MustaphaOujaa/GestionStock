import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatCard — Carte de statistique KPI réutilisable.
 *
 * Reproduit le design des cartes KPI du tableau de bord avec
 * la possibilité d'afficher une tendance (hausse / baisse).
 *
 * @param {Object} props
 * @param {import('lucide-react').LucideIcon} props.icon
 *   Composant d'icône Lucide à afficher dans le coin supérieur droit.
 * @param {string} props.label
 *   Libellé affiché en haut de la carte (ex: « Total Produits »).
 * @param {string|number} props.value
 *   Valeur principale affichée en grand (ex: 42, « 1 250 € »).
 * @param {string} [props.subtitle]
 *   Sous-texte descriptif affiché sous la valeur (ex: « articles référencés »).
 * @param {string} [props.colorClass]
 *   Classes Tailwind pour la couleur de fond et de texte de l'icône.
 *   Doit contenir une classe `bg-*` et une classe `text-*`.
 *   Par défaut : `'bg-blue-100 text-blue-600'`.
 * @param {number} [props.trend]
 *   Pourcentage de tendance optionnel. Un nombre positif affiche une
 *   flèche vers le haut en vert, un nombre négatif une flèche vers
 *   le bas en rouge. Si non fourni ou égal à 0, aucune tendance
 *   n'est affichée.
 *
 * @returns {JSX.Element}
 *
 * @example
 * import { Package } from 'lucide-react';
 *
 * <StatCard
 *   icon={Package}
 *   label="Total Produits"
 *   value={42}
 *   subtitle="articles référencés"
 *   colorClass="bg-blue-100 text-blue-600"
 *   trend={12.5}
 * />
 */
export default function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  colorClass = 'bg-blue-100 text-blue-600',
  trend,
}) {
  /**
   * Détermine si la tendance est positive, négative ou neutre.
   * `null` signifie qu'aucune tendance n'est fournie.
   */
  const trendDirection = trend == null || trend === 0
    ? null
    : trend > 0
      ? 'up'
      : 'down';

  /**
   * Sépare les classes de couleur pour extraire le texte
   * (utilisé pour l'icône) et le fond (utilisé pour le conteneur d'icône).
   */
  const bgClass = colorClass
    .split(' ')
    .filter(c => c.startsWith('bg-'))
    .join(' ') || 'bg-blue-100';

  const textClass = colorClass
    .split(' ')
    .filter(c => c.startsWith('text-'))
    .join(' ') || 'text-blue-600';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between min-h-[180px] hover:shadow-md transition-shadow">
      {/* En-tête : label + icône */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>
        </div>
        {Icon && (
          <div className={`w-14 h-14 rounded-3xl ${bgClass} flex items-center justify-center shrink-0`}>
            <Icon size={24} className={textClass} />
          </div>
        )}
      </div>

      {/* Corps : valeur + sous-texte + tendance */}
      <div>
        <div className="flex items-end gap-3 mt-6">
          <p className="text-3xl font-bold text-slate-800">{value}</p>

          {/* Indicateur de tendance */}
          {trendDirection && (
            <span
              className={`flex items-center gap-1 text-xs font-semibold mb-1 ${
                trendDirection === 'up'
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              }`}
            >
              {trendDirection === 'up' ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {Math.abs(trend).toFixed(1)}%
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-slate-400 mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
