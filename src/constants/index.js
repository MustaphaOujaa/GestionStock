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
