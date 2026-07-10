import { useEffect, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer les raccourcis clavier de l'application.
 * @param {Object} shortcuts - Map de raccourcis {key+modifier: callback}
 * @param {boolean} enabled - Activer/désactiver les raccourcis
 */
export function useKeyboardShortcuts(shortcuts, enabled = true) {
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;
    
    // Ne pas intercepter les raccourcis si un input est focus
    const tagName = event.target.tagName.toLowerCase();
    if (['input', 'textarea', 'select'].includes(tagName)) return;

    const key = event.key.toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey;
    const alt = event.altKey;

    for (const [shortcut, callback] of Object.entries(shortcuts)) {
      const parts = shortcut.split('+');
      const targetKey = parts[parts.length - 1].toLowerCase();
      const needsCtrl = parts.includes('ctrl');
      const needsAlt = parts.includes('alt');

      if (
        key === targetKey &&
        ctrl === needsCtrl &&
        alt === needsAlt
      ) {
        event.preventDefault();
        callback(event);
        return;
      }
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}
