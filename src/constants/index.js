/**
 * Constants globales pour l'application GestionStock
 */

export const PRODUCT_CATEGORIES = [
  'Informatique',
  'Périphériques',
  'Moniteurs',
  'Mobile',
  'Accessoires',
  'Réseau',
  'Autre'
];

export const MOVEMENT_TYPES = {
  IN: 'IN',
  OUT: 'OUT'
};

export const MOVEMENT_TYPE_LABELS = {
  IN: 'Entrée',
  OUT: 'Sortie'
};

export const STOCK_STATUS = {
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  LOW_STOCK: 'LOW_STOCK',
  AVAILABLE: 'AVAILABLE'
};

export const STOCK_STATUS_INFO = {
  OUT_OF_STOCK: {
    label: 'Rupture',
    color: 'bg-red-100 text-red-700',
    bgColor: 'bg-red-50'
  },
  LOW_STOCK: {
    label: 'Stock Bas',
    color: 'bg-amber-100 text-amber-700',
    bgColor: 'bg-amber-50'
  },
  AVAILABLE: {
    label: 'Disponible',
    color: 'bg-emerald-100 text-emerald-700',
    bgColor: 'bg-emerald-50'
  }
};

export const EMPTY_PRODUCT_FORM = {
  name: '',
  category: '',
  quantity: 0,
  minStock: 5,
  price: 0,
  supplier: ''
};

export const EMPTY_MOVEMENT_FORM = {
  productId: '',
  type: 'IN',
  quantity: 0,
  note: ''
};

export const MIN_PRODUCT_VALUES = {
  name: 3,
  quantity: 0,
  minStock: 1,
  price: 0,
  supplier: 2
};

export const MAX_PRODUCT_VALUES = {
  name: 100,
  quantity: 999999,
  minStock: 999999,
  price: 999999999,
  supplier: 100
};

/** Devises supportées par l'application */
export const SUPPORTED_CURRENCIES = [
  { code: 'MAD', label: 'MAD - Dirham marocain', symbol: 'DH' },
  { code: 'EUR', label: 'EUR - Euro', symbol: '€' },
  { code: 'USD', label: 'USD - Dollar', symbol: '$' },
  { code: 'GBP', label: 'GBP - Livre sterling', symbol: '£' },
  { code: 'TND', label: 'TND - Dinar tunisien', symbol: 'DT' }
];

/** Configuration des couleurs par priorité */
export const PRIORITY_COLORS = {
  Critique: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  Haute: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  Moyenne: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  Basse: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' }
};

/** Période de rétention par défaut des mouvements (jours) */
export const DEFAULT_RETENTION_DAYS = 365;

/** Version de l'application */
export const APP_VERSION = '1.2.0';

/** Nombre maximum de produits par page dans les tableaux */
export const ITEMS_PER_PAGE = 20;

/** Raccourcis clavier de l'application */
export const KEYBOARD_SHORTCUTS = {
  SEARCH: { key: 'k', modifier: 'ctrl', label: 'Rechercher' },
  NEW_PRODUCT: { key: 'n', modifier: 'ctrl', label: 'Nouveau produit' },
  DASHBOARD: { key: '1', modifier: 'alt', label: 'Tableau de bord' },
  PRODUCTS: { key: '2', modifier: 'alt', label: 'Produits' },
  MOVEMENTS: { key: '3', modifier: 'alt', label: 'Mouvements' },
  REPORTS: { key: '4', modifier: 'alt', label: 'Rapports' },
  AI: { key: '5', modifier: 'alt', label: 'Assistant IA' },
  SETTINGS: { key: '6', modifier: 'alt', label: 'Paramètres' }
};
