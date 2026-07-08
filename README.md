# StockPro - Gestion d'Inventaire Intelligente 📦

Une application web moderne et performante pour gérer votre inventaire en temps réel avec une interface intuitive et réactive.

## 🚀 Fonctionnalités

✨ **Dashboard Intelligent**
- Vue d'ensemble complète de votre stock
- Statistiques en temps réel (valeur totale, ruptures, stock bas)
- Alertes visuelles pour les produits critiques

📊 **Gestion des Produits**
- CRUD complet (Créer, Lire, Mettre à jour, Supprimer)
- Catégorisation flexible
- Gestion des seuils de stock minimal
- Suivi des prix et fournisseurs
- Recherche et filtrage avancé

🔄 **Mouvements de Stock**
- Enregistrement des entrées/sorties
- Historique détaillé de tous les mouvements
- Traçabilité avec date, utilisateur et notes
- Mises à jour automatiques des quantités

🎨 **Interface Moderne**
- Design responsive et mobile-first
- Navigation intuitive avec sidebar
- Animations fluides
- Thème professionnel (Tailwind CSS)

📱 **Responsive Design**
- Optimisé pour tous les appareils (desktop, tablette, mobile)
- Menu mobile intelligent avec overlay

## 🛠️ Stack Technique

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Package Manager**: npm

## 📋 Installation & Configuration

### Prérequis
- Node.js >= 18
- npm >= 9

### Étapes

```bash
# Cloner le projet
git clone https://github.com/votre-utilisateur/gestionstock.git
cd gestionstock

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Accéder à l'application
# Ouvrir http://localhost:5173 dans votre navigateur
```

## 🏗️ Structure du Projet

```
src/
├── pages/              # Pages principales
│   ├── DashboardPage.jsx      # Tableau de bord
│   ├── ProductsPage.jsx       # Gestion des produits
│   └── MovementsPage.jsx      # Historique des mouvements
├── context/            # État global (React Context)
│   └── StockContext.jsx       # Logique métier centraliste
├── App.jsx            # Composant principal
├── main.jsx           # Point d'entrée
├── App.css            # Styles global
└── index.css          # Styles de base
```

## 📚 Utilisation

### 1. Dashboard
- Vue d'ensemble des KPIs principaux
- Accès rapide aux fonctionnalités

### 2. Produits
- Ajouter un nouveau produit avec détails
- Rechercher par nom ou référence
- Filtrer par catégorie
- Modifier les propriétés existantes
- Supprimer les produits avec confirmation

### 3. Mouvements
- Enregistrer les entrées/sorties de stock
- Consulter l'historique complet
- Filtrer par type de mouvement
- Exporter les données pour analyse

## 🔧 Scripts Disponibles

```bash
npm run dev       # Démarrer le développement (Vite HMR)
npm run build     # Build de production
npm run lint      # Linter le code (Oxlint)
npm run preview   # Prévisualiser le build
```

## 🌟 Améliorations Futures

- [ ] Base de données (MongoDB/PostgreSQL)
- [ ] Authentification et rôles utilisateur
- [ ] Export PDF/Excel
- [ ] Graphiques d'analyse avancés
- [ ] Gestion multi-entrepôts
- [ ] API REST
- [ ] Mode hors-ligne avec synchronisation

## 📄 Licence

MIT - Libre d'utilisation

## 👨‍💼 Support

Pour toute question ou suggestion, veuillez créer une issue sur le repository.

---

**Version**: 1.0.0  
**Dernière mise à jour**: Juillet 2026
