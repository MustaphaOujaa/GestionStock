/**
 * Fonctions utilitaires pour la gestion de stock
 */

import { STOCK_STATUS, MIN_PRODUCT_VALUES, MAX_PRODUCT_VALUES } from '../constants/index.js';

/**
 * Détermine le statut du stock pour un produit
 * @param {Object} product - Produit à vérifier
 * @returns {string} Statut du stock
 */
export function getStockStatus(product) {
  if (!product || product.quantity === 0) return STOCK_STATUS.OUT_OF_STOCK;
  if (product.quantity < product.minStock) return STOCK_STATUS.LOW_STOCK;
  return STOCK_STATUS.AVAILABLE;
}

/**
 * Valide les données d'un produit
 * @param {Object} product - Produit à valider
 * @returns {Object} Objet avec isValid et errors
 */
export function validateProduct(product) {
  const errors = {};

  if (!product.name || product.name.trim().length < MIN_PRODUCT_VALUES.name) {
    errors.name = `Le nom doit contenir au moins ${MIN_PRODUCT_VALUES.name} caractères`;
  }
  if (product.name && product.name.length > MAX_PRODUCT_VALUES.name) {
    errors.name = `Le nom ne peut pas dépasser ${MAX_PRODUCT_VALUES.name} caractères`;
  }

  if (!product.category || product.category.trim() === '') {
    errors.category = 'La catégorie est obligatoire';
  }

  if (product.quantity < MIN_PRODUCT_VALUES.quantity) {
    errors.quantity = 'La quantité ne peut pas être négative';
  }
  if (product.quantity > MAX_PRODUCT_VALUES.quantity) {
    errors.quantity = 'La quantité est trop grande';
  }

  if (product.minStock < MIN_PRODUCT_VALUES.minStock) {
    errors.minStock = `Le stock minimal doit être au minimum ${MIN_PRODUCT_VALUES.minStock}`;
  }

  if (product.price < MIN_PRODUCT_VALUES.price) {
    errors.price = 'Le prix ne peut pas être négatif';
  }
  if (product.price > MAX_PRODUCT_VALUES.price) {
    errors.price = 'Le prix est trop élevé';
  }

  if (!product.supplier || product.supplier.trim().length < MIN_PRODUCT_VALUES.supplier) {
    errors.supplier = `Le fournisseur doit contenir au moins ${MIN_PRODUCT_VALUES.supplier} caractères`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Valide les données d'un mouvement
 * @param {Object} movement - Mouvement à valider
 * @returns {Object} Objet avec isValid et errors
 */
export function validateMovement(movement) {
  const errors = {};

  if (!movement.productId) {
    errors.productId = 'Veuillez sélectionner un produit';
  }

  if (!movement.type || !['IN', 'OUT'].includes(movement.type)) {
    errors.type = 'Type de mouvement invalide';
  }

  if (movement.quantity <= 0) {
    errors.quantity = 'La quantité doit être positive';
  }

  if (movement.note && movement.note.trim().length > 500) {
    errors.note = 'La note ne peut pas dépasser 500 caractères';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Formate une date pour l'affichage
 * @param {string|Date} date - Date à formater
 * @returns {string} Date formatée
 */
export function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formate un prix pour l'affichage
 * @param {number} price - Prix à formater
 * @param {string} currency - Devise ISO à utiliser
 * @returns {string} Prix formaté
 */
export function formatPrice(price, currency = 'MAD') {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Générer une référence de produit unique
 * @param {number} id - ID du produit
 * @returns {string} Référence formatée
 */
export function generateProductRef(id) {
  return `PRD-${String(id).padStart(3, '0')}`;
}

/**
 * Trier les produits
 * @param {Array} products - Liste de produits
 * @param {string} sortBy - Clé de tri
 * @param {string} order - Ordre (asc/desc)
 * @returns {Array} Produits triés
 */
export function sortProducts(products, sortBy = 'name', order = 'asc') {
  const sorted = [...products].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

/**
 * Exporter des lignes au format CSV.
 * @param {string} filename - Nom du fichier à télécharger
 * @param {Array} rows - Données à exporter
 */
export function exportRowsToCsv(filename, rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return;
  }

  const headers = Object.keys(rows[0]);
  const escapeCell = (value) => {
    const cell = String(value ?? '');
    return `"${cell.replaceAll('"', '""')}"`;
  };

  const csv = [
    headers.join(','),
    ...rows.map(row => headers.map(header => escapeCell(row[header])).join(','))
  ].join('\n');

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Générer des recommandations intelligentes à partir du stock et des mouvements.
 * Cette logique reste locale pour fonctionner sans service externe.
 * @param {Array} products - Liste des produits
 * @param {Array} movements - Historique des mouvements
 * @returns {Object} Analyse et recommandations
 */
export function generateAiInventoryInsights(products, movements) {
  const outgoingByProduct = movements
    .filter(movement => movement.type === 'OUT')
    .reduce((acc, movement) => {
      acc[movement.productId] = (acc[movement.productId] || 0) + movement.quantity;
      return acc;
    }, {});

  const recommendations = products.map(product => {
    const outgoing = outgoingByProduct[product.id] || 0;
    const pressure = product.minStock > 0 ? product.quantity / product.minStock : 1;
    const suggestedQty = Math.max(product.minStock * 2 - product.quantity, Math.ceil(outgoing * 0.5), 0);
    const riskScore = product.quantity === 0
      ? 100
      : Math.min(95, Math.round((1 - Math.min(pressure, 1)) * 70 + Math.min(outgoing * 3, 25)));

    let priority = 'Basse';
    if (product.quantity === 0 || riskScore >= 75) {
      priority = 'Critique';
    } else if (product.quantity < product.minStock || riskScore >= 45) {
      priority = 'Haute';
    } else if (outgoing > 0) {
      priority = 'Moyenne';
    }

    return {
      product,
      outgoing,
      suggestedQty,
      riskScore,
      priority,
      reason: product.quantity === 0
        ? 'Produit en rupture totale'
        : product.quantity < product.minStock
          ? 'Stock inférieur au seuil minimum'
          : outgoing > 0
            ? 'Demande récente détectée'
            : 'Stock stable'
    };
  }).sort((a, b) => b.riskScore - a.riskScore);

  const critical = recommendations.filter(item => item.priority === 'Critique');
  const high = recommendations.filter(item => item.priority === 'Haute');
  const totalSuggestedCost = recommendations.reduce((sum, item) => sum + item.suggestedQty * item.product.price, 0);
  const healthScore = products.length === 0
    ? 100
    : Math.max(0, Math.round(100 - ((critical.length * 18 + high.length * 9) / products.length) * 10));

  const topCategory = Object.entries(products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + product.quantity;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1])[0];

  return {
    healthScore,
    totalSuggestedCost,
    criticalCount: critical.length,
    highCount: high.length,
    topCategory: topCategory ? topCategory[0] : 'Aucune',
    recommendations
  };
}

/**
 * Répondre à une question simple avec les données locales du stock.
 * @param {string} prompt - Question utilisateur
 * @param {Array} products - Liste des produits
 * @param {Array} movements - Historique des mouvements
 * @param {Object} stats - Statistiques globales
 * @param {string} currency - Devise
 * @returns {string} Réponse synthétique
 */
export function answerInventoryQuestion(prompt, products, movements, stats, currency = 'MAD') {
  const normalized = prompt.toLowerCase();
  const insights = generateAiInventoryInsights(products, movements);

  if (normalized.includes('rupture') || normalized.includes('epuise') || normalized.includes('épuis')) {
    const out = products.filter(product => product.quantity === 0);
    return out.length === 0
      ? 'Aucune rupture totale détectée pour le moment.'
      : `Produits en rupture: ${out.map(product => product.name).join(', ')}. Priorité: réapprovisionner ces références avant les stocks faibles.`;
  }

  if (normalized.includes('faible') || normalized.includes('bas') || normalized.includes('alerte')) {
    const low = products.filter(product => product.quantity > 0 && product.quantity < product.minStock);
    return low.length === 0
      ? 'Aucun produit en stock faible. Le niveau global est correct.'
      : `Stocks faibles: ${low.map(product => `${product.name} (${product.quantity}/${product.minStock})`).join(', ')}.`;
  }

  if (normalized.includes('acheter') || normalized.includes('commande') || normalized.includes('réappro') || normalized.includes('reappro')) {
    const plan = insights.recommendations.filter(item => item.suggestedQty > 0).slice(0, 4);
    return plan.length === 0
      ? 'Aucune commande urgente recommandée. Surveille surtout les prochains mouvements de sortie.'
      : `Plan recommandé: ${plan.map(item => `${item.product.name}: +${item.suggestedQty}`).join(', ')}. Budget estimé: ${formatPrice(insights.totalSuggestedCost, currency)}.`;
  }

  if (normalized.includes('valeur') || normalized.includes('budget') || normalized.includes('cout') || normalized.includes('coût')) {
    return `Valeur actuelle du stock: ${formatPrice(stats.totalValue, currency)}. Budget estimé pour les réapprovisionnements recommandés: ${formatPrice(insights.totalSuggestedCost, currency)}.`;
  }

  if (normalized.includes('mouvement') || normalized.includes('sortie') || normalized.includes('entrée')) {
    const last = movements.slice(0, 3);
    return last.length === 0
      ? 'Aucun mouvement enregistré.'
      : `Derniers mouvements: ${last.map(movement => `${movement.productName} ${movement.type} ${movement.quantity}`).join(', ')}.`;
  }

  return `Score santé stock: ${insights.healthScore}/100. ${insights.criticalCount} priorité(s) critique(s), ${insights.highCount} priorité(s) haute(s). Demande-moi par exemple: "quoi acheter ?", "stock faible", "rupture" ou "valeur stock".`;
}

/**
 * Calculer les statistiques du stock
 * @param {Array} products - Liste de produits
 * @returns {Object} Statistiques
 */
export function calculateStats(products) {
  return {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
    outOfStock: products.filter(p => p.quantity === 0).length,
    lowStock: products.filter(p => p.quantity > 0 && p.quantity < p.minStock).length,
    categories: [...new Set(products.map(p => p.category))].length,
    avgPrice: products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0
  };
}
