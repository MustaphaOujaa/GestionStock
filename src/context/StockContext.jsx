import { createContext, useContext, useState } from 'react';

const StockContext = createContext(null);

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

export function StockProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [movements, setMovements] = useState(initialMovements);
  const [nextProductId, setNextProductId] = useState(7);
  const [nextMovementId, setNextMovementId] = useState(6);

  const addProduct = (product) => {
    const newProduct = { ...product, id: nextProductId, ref: `PRD-00${nextProductId}` };
    setProducts(prev => [...prev, newProduct]);
    setNextProductId(prev => prev + 1);
  };

  const editProduct = (id, updated) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addMovement = (movement) => {
    const product = products.find(p => p.id === movement.productId);
    if (!product) return;

    const newQty = movement.type === 'IN'
      ? product.quantity + movement.quantity
      : Math.max(0, product.quantity - movement.quantity);

    editProduct(movement.productId, { quantity: newQty });

    const newMov = {
      ...movement,
      id: nextMovementId,
      productName: product.name,
      date: new Date().toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      by: 'Admin',
    };
    setMovements(prev => [newMov, ...prev]);
    setNextMovementId(prev => prev + 1);
  };

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    outOfStock: products.filter(p => p.quantity === 0).length,
    lowStock: products.filter(p => p.quantity > 0 && p.quantity < p.minStock).length,
  };

  return (
    <StockContext.Provider value={{ products, movements, addProduct, editProduct, deleteProduct, addMovement, stats }}>
      {children}
    </StockContext.Provider>
  );
}

export const useStock = () => useContext(StockContext);
