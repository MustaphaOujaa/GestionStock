import { useContext } from 'react';
import { StockContext } from '../context/stockContextCore.js';

/**
 * Hook pour accéder au contexte du stock.
 */
export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock doit être utilisé à l\'intérieur de StockProvider');
  }
  return context;
};
