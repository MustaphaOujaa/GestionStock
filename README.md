# StockPro - Gestion d'Inventaire Intelligente 📦

Une application web moderne et performante pour gérer votre inventaire en temps réel avec une interface intuitive et réactive.

## Aperçu

StockPro est une application React/Vite pour suivre un catalogue produits, contrôler les niveaux de stock et enregistrer les entrées/sorties. Les données sont conservées localement dans le navigateur grâce à `localStorage`, ce qui permet de continuer à travailler après un rafraîchissement de page.

## 🚀 Fonctionnalités

✨ **Dashboard Intelligent**
- Vue d'ensemble complète de votre stock
- Statistiques en temps réel (valeur totale, ruptures, stock bas)
- Alertes visuelles pour les produits critiques
- Répartition du stock par catégorie
- Liste de priorités pour les produits à réapprovisionner

📊 **Gestion des Produits**
- CRUD complet (Créer, Lire, Mettre à jour, Supprimer)
- Catégorisation flexible
- Gestion des seuils de stock minimal
- Suivi des prix et fournisseurs
- Recherche et filtrage avancé
- Tri dynamique des colonnes
- Export CSV du catalogue filtré

🔄 **Mouvements de Stock**
- Enregistrement des entrées/sorties
- Historique détaillé de tous les mouvements
- Traçabilité avec date, utilisateur et notes
- Mises à jour automatiques des quantités
- Protection contre les sorties supérieures au stock disponible
- Export CSV de l'historique filtré

💾 **Persistance Locale**
- Sauvegarde automatique des produits et mouvements dans le navigateur
- Restauration des données au prochain chargement
- Réinitialisation rapide vers les données de démonstration

🔎 **Recherche & Alertes**
- Recherche globale depuis l'en-tête (produits et mouvements)
- Centre de notifications pour les alertes stock
- Accès rapide vers les zones concernées

🤖 **Assistant IA Local**
- Score santé du stock calculé automatiquement
- Recommandations de réapprovisionnement par priorité
- Estimation du budget de commande recommandé
- Chat intelligent basé sur les données locales du stock
- Export CSV du plan d'achat proposé par l'IA

⚙️ **Paramètres**
- Personnalisation du nom de l'espace et du gestionnaire
- Choix de la devise d'affichage
- Activation/désactivation du résumé des alertes
- Contrôle de la sauvegarde locale automatique

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
git clone https://github.com/MustaphaOujaa/GestionStock.git
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

### 4. Assistant IA
- Demander quoi commander en priorité
- Identifier les ruptures et stocks faibles
- Obtenir une synthèse financière du stock
- Exporter le plan de réapprovisionnement recommandé

### 5. Paramètres
- Personnaliser le profil de l'application
- Modifier la devise affichée dans les indicateurs
- Gérer les options de sauvegarde locale et d'alertes

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
