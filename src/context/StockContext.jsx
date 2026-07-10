import { useState, useCallback, useEffect } from 'react';
import { StockContext } from './stockContextCore.js';
import { generateProductRef, formatDate, calculateStats, validateProduct, validateMovement } from '../utils/index.js';

const STORAGE_KEY = 'gestionstock:data:v1';

// Données initiales de démonstration
const initialProducts = [
  { id: 1, ref: 'PRD-001', name: 'MacBook Pro M2', category: 'Informatique', quantity: 12, minStock: 5, price: 19999, supplier: 'Apple Inc.' },
  { id: 2, ref: 'PRD-002', name: 'Souris Logitech MX Master', category: 'Périphériques', quantity: 3, minStock: 10, price: 899, supplier: 'Logitech' },
  { id: 3, ref: 'PRD-003', name: 'Clavier Mécanique Keychron', category: 'Périphériques', quantity: 8, minStock: 5, price: 1299, supplier: 'Keychron' },
  { id: 4, ref: 'PRD-004', name: 'Écran Samsung 27"', category: 'Moniteurs', quantity: 0, minStock: 3, price: 3499, supplier: 'Samsung' },
  { id: 5, ref: 'PRD-005', name: 'iPhone 16 Pro', category: 'Mobile', quantity: 25, minStock: 10, price: 14999, supplier: 'Apple Inc.' },
  { id: 6, ref: 'PRD-006', name: 'Câble USB-C 2m', category: 'Accessoires', quantity: 2, minStock: 20, price: 149, supplier: 'Belkin' },
];

const initialMovements = [
  { id: 1, date: '2026-07-06 10:42', productId: 1, productName: 'MacBook Pro M2', type: 'IN', quantity: 5, note: 'Livraison fournisseur', by: 'Admin' },
  { id: 2, date: '2026-07-06 09:15', productId: 2, productName: 'Souris Logitech MX Master', type: 'OUT', quantity: 2, note: 'Vente client #C452', by: 'Othmane S.' },
  { id: 3, date: '2026-07-05 16:30', productId: 3, productName: 'Clavier Mécanique Keychron', type: 'IN', quantity: 10, note: 'Réapprovisionnement', by: 'Admin' },
  { id: 4, date: '2026-07-05 11:00', productId: 5, productName: 'iPhone 16 Pro', type: 'OUT', quantity: 3, note: 'Transfert magasin B', by: 'Admin' },
  { id: 5, date: '2026-07-04 14:20', productId: 6, productName: 'Câble USB-C 2m', type: 'OUT', quantity: 8, note: 'Vente client #C451', by: 'Yassir K.' },
];

function getInitialState() {
  if (typeof window === 'undefined') {
    return { products: initialProducts, movements: initialMovements };
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { products: initialProducts, movements: initialMovements };
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed.products) || !Array.isArray(parsed.movements)) {
      return { products: initialProducts, movements: initialMovements };
    }

    return parsed;
  } catch {
    return { products: initialProducts, movements: initialMovements };
  }
}

/**
 * Provider pour la gestion centralisée du stock
 */
export function StockProvider({ children }) {
  const [initialState] = useState(getInitialState);
  const [products, setProducts] = useState(initialState.products);
  const [movements, setMovements] = useState(initialState.movements);
  const [nextProductId, setNextProductId] = useState(() => Math.max(0, ...initialState.products.map(p => p.id)) + 1);
  const [nextMovementId, setNextMovementId] = useState(() => Math.max(0, ...initialState.movements.map(m => m.id)) + 1);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ products, movements }));
  }, [products, movements]);

  // Ajouter un produit avec validation
  const addProduct = useCallback((product) => {
    const validation = validateProduct(product);
    if (!validation.isValid) {
      throw new Error(Object.values(validation.errors)[0]);
    }

    const newProduct = {
      ...product,
      id: nextProductId,
      ref: generateProductRef(nextProductId),
      quantity: Number(product.quantity),
      minStock: Number(product.minStock),
      price: Number(product.price)
    };
    setProducts(prev => [...prev, newProduct]);
    setNextProductId(prev => prev + 1);
    return newProduct;
  }, [nextProductId]);

  // Éditer un produit existant
  const editProduct = useCallback((id, updated) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) {
        return p;
      }

      const nextProduct = { ...p, ...updated };
      return {
        ...nextProduct,
        quantity: Number(nextProduct.quantity),
        minStock: Number(nextProduct.minStock),
        price: Number(nextProduct.price)
      };
    }));
  }, []);

  // Supprimer un produit
  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setMovements(prev => prev.filter(m => m.productId !== id));
  }, []);

  // Ajouter un mouvement (entrée/sortie de stock)
  const addMovement = useCallback((movement) => {
    const validation = validateMovement(movement);
    if (!validation.isValid) {
      throw new Error(Object.values(validation.errors)[0]);
    }

    const product = products.find(p => p.id === movement.productId);
    if (!product) {
      throw new Error('Produit non trouvé');
    }

    if (movement.type === 'OUT' && Number(movement.quantity) > product.quantity) {
      throw new Error('La quantité de sortie dépasse le stock disponible');
    }

    // Calculer la nouvelle quantité
    const newQty = movement.type === 'IN'
      ? product.quantity + Number(movement.quantity)
      : product.quantity - Number(movement.quantity);

    // Mettre à jour la quantité du produit
    editProduct(movement.productId, { quantity: newQty });

    // Créer le mouvement
    const newMov = {
      ...movement,
      id: nextMovementId,
      productName: product.name,
      quantity: Number(movement.quantity),
      date: formatDate(new Date()),
      by: 'Admin'
    };

    setMovements(prev => [newMov, ...prev]);
    setNextMovementId(prev => prev + 1);
    return newMov;
  }, [products, editProduct, nextMovementId]);

  // Calculer les statistiques
  const stats = calculateStats(products);

  const resetDemoData = useCallback(() => {
    setProducts(initialProducts);
    setMovements(initialMovements);
    setNextProductId(7);
    setNextMovementId(6);
  }, []);

  const value = {
    products,
    movements,
    addProduct,
    editProduct,
    deleteProduct,
    addMovement,
    resetDemoData,
    stats
  };

  return (
    <StockContext.Provider value={value}>
      {children}
    </StockContext.Provider>
  );
}
