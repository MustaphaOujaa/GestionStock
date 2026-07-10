import { useState, useMemo } from 'react';

/**
 * Hook personnalisé pour la pagination d'une liste d'éléments.
 * @param {Array} items - Liste complète des éléments
 * @param {number} itemsPerPage - Nombre d'éléments par page
 * @returns {Object} État de la pagination et fonctions de contrôle
 */
export function usePagination(items, itemsPerPage = 20) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / itemsPerPage)),
    [items.length, itemsPerPage]
  );

  // Réinitialiser à la page 1 si les items changent et la page actuelle dépasse
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(
    () => items.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage),
    [items, safePage, itemsPerPage]
  );

  const goToPage = (page) => {
    const target = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(target);
  };

  const nextPage = () => goToPage(safePage + 1);
  const prevPage = () => goToPage(safePage - 1);
  const firstPage = () => goToPage(1);
  const lastPage = () => goToPage(totalPages);

  return {
    currentPage: safePage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
    startIndex: (safePage - 1) * itemsPerPage + 1,
    endIndex: Math.min(safePage * itemsPerPage, items.length),
    totalItems: items.length
  };
}
