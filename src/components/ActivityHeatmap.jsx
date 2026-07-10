import { useMemo } from 'react';

/**
 * Construit un tableau de 52 semaines (364 jours) avec le compte
 * de mouvements par jour, en partant du lundi il y a ~52 semaines.
 */
function buildHeatmapData(movements) {
  // Compter les mouvements par date (YYYY-MM-DD)
  const countByDay = {};
  for (const m of movements) {
    // Le format de date est "YYYY-MM-DD HH:mm" ou "DD/MM/YYYY HH:mm"
    let dayKey = '';
    const raw = String(m.date || '');
    // Essayer les deux formats
    const isoMatch = raw.match(/^(\d{4}-\d{2}-\d{2})/);
    const frMatch  = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (isoMatch) {
      dayKey = isoMatch[1];
    } else if (frMatch) {
      dayKey = `${frMatch[3]}-${frMatch[2]}-${frMatch[1]}`;
    } else {
      continue;
    }
    countByDay[dayKey] = (countByDay[dayKey] || 0) + 1;
  }

  // Construire la grille : 52 colonnes (semaines) x 7 lignes (jours)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Aller 364 jours en arrière, puis reculer jusqu'au dimanche précédent
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);
  // Reculer jusqu'au dimanche (0)
  const dayOfWeek = startDate.getDay(); // 0=Sun
  startDate.setDate(startDate.getDate() - dayOfWeek);

  const weeks = [];
  const cursor = new Date(startDate);

  while (cursor <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const iso = cursor.toISOString().slice(0, 10);
      const count = countByDay[iso] || 0;
      const isToday = iso === today.toISOString().slice(0, 10);
      const isFuture = cursor > today;
      week.push({ date: new Date(cursor), iso, count, isToday, isFuture });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return { weeks, countByDay };
}

/**
 * Retourne la classe CSS Tailwind de couleur en fonction du nombre de mouvements.
 * 0 = gris clair, 1 = vert pâle, 2-3 = vert moyen, 4+ = vert foncé
 */
function getColor(count, isFuture) {
  if (isFuture) return 'bg-slate-100';
  if (count === 0) return 'bg-slate-100 hover:bg-slate-200';
  if (count === 1) return 'bg-emerald-200 hover:bg-emerald-300';
  if (count <= 3) return 'bg-emerald-400 hover:bg-emerald-500';
  return 'bg-emerald-600 hover:bg-emerald-700';
}

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const DAY_LABELS   = ['Dim', '', 'Mar', '', 'Jeu', '', 'Sam'];

export default function ActivityHeatmap({ movements }) {
  const { weeks } = useMemo(() => buildHeatmapData(movements), [movements]);

  // Calculer les positions des labels de mois
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstDay = week.find(d => !d.isFuture && d.date);
      if (!firstDay) return;
      const month = firstDay.date.getMonth();
      if (month !== lastMonth) {
        labels.push({ month, weekIndex: wi });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  // Total des mouvements sur la période
  const total = useMemo(
    () => weeks.flat().reduce((s, d) => s + d.count, 0),
    [weeks]
  );

  // Meilleur jour
  const bestDay = useMemo(() => {
    let best = null;
    for (const day of weeks.flat()) {
      if (!best || day.count > best.count) best = day;
    }
    return best;
  }, [weeks]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-slate-800">Activité des Mouvements</h3>
          <p className="text-xs text-slate-400 mt-1">
            {total} mouvement{total !== 1 ? 's' : ''} sur les 12 derniers mois
          </p>
        </div>
        <div className="text-right">
          {bestDay && bestDay.count > 0 && (
            <p className="text-xs text-slate-400">
              Pic :{' '}
              <span className="font-semibold text-emerald-600">
                {bestDay.count} mvt
              </span>{' '}
              le{' '}
              <span className="font-semibold text-slate-600">
                {bestDay.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Grille */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: '680px' }}>
          {/* Labels des mois */}
          <div className="flex mb-1" style={{ paddingLeft: '28px' }}>
            {weeks.map((_, wi) => {
              const label = monthLabels.find(l => l.weekIndex === wi);
              return (
                <div key={wi} style={{ width: '14px', marginRight: '2px', flexShrink: 0 }}>
                  {label ? (
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                      {MONTH_LABELS[label.month]}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Corps : jours de la semaine + carrés */}
          <div className="flex gap-0">
            {/* Labels des jours */}
            <div className="flex flex-col gap-0.5 mr-1.5" style={{ width: '24px' }}>
              {DAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  style={{ height: '14px' }}
                  className="flex items-center"
                >
                  <span className="text-[10px] text-slate-400 leading-none">{label}</span>
                </div>
              ))}
            </div>

            {/* Semaines */}
            <div className="flex gap-0.5">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.5">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      title={
                        day.isFuture
                          ? ''
                          : `${day.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} — ${day.count} mouvement${day.count !== 1 ? 's' : ''}`
                      }
                      className={`w-3.5 h-3.5 rounded-[3px] cursor-default transition-colors ${
                        day.isToday
                          ? 'ring-2 ring-offset-1 ring-blue-400 ' + getColor(day.count, day.isFuture)
                          : getColor(day.count, day.isFuture)
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Légende */}
          <div className="flex items-center gap-2 mt-4 justify-end">
            <span className="text-[11px] text-slate-400">Moins</span>
            {['bg-slate-100', 'bg-emerald-200', 'bg-emerald-400', 'bg-emerald-600'].map((cls, i) => (
              <div key={i} className={`w-3.5 h-3.5 rounded-[3px] ${cls}`} />
            ))}
            <span className="text-[11px] text-slate-400">Plus</span>
          </div>
        </div>
      </div>

      {/* Stats résumé */}
      <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-50">
        {[
          {
            label: 'Total mouvements',
            value: total,
            color: 'text-slate-800'
          },
          {
            label: 'Jours actifs',
            value: weeks.flat().filter(d => d.count > 0 && !d.isFuture).length,
            color: 'text-emerald-600'
          },
          {
            label: 'Moy. / semaine',
            value: weeks.length > 0
              ? (total / weeks.length).toFixed(1)
              : '0',
            color: 'text-blue-600'
          }
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
