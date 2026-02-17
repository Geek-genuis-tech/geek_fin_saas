# GEEK-FIN - Application Comptable pour PME

Une application web moderne et complète de gestion comptable et financière conçue spécifiquement pour les petites et moyennes entreprises (PME). Interface intuitive, analyses avancées et fonctionnalités complètes pour une gestion financière efficace.

# Fonctionnalités Principales

# Tableau de Bord
- Vue d'ensemble : Indicateurs clés de performance (KPI) en temps réel
- Graphiques interactifs : Évolution des revenus et dépenses
- Alertes intelligentes : Notifications automatiques sur les seuils financiers
- Widgets personnalisables : Adaptation à vos besoins
# Gestion des Opérations
- **Saisie simplifiée : Revenus et dépenses par catégories
- Catégorisation intelligente** : 10 catégories prédéfinies (Salaires, Ventes, Services, etc.)
- Historique complet** : Suivi chronologique de toutes les transactions
- Filtrage avancé : Recherche et tri par date, montant, catégorie

# Analyse et KPI Avancés
- Ratios financiers : Marge brute, nette, ratio d'endettement, fonds de roulement
- Évolution temporelle : Graphiques sur 6-12 mois
- **Comparaisons : Mois N vs N-1, tendances par catégorie
- Projections annuelles : Estimations de fin d'année basées sur les données actuelles
- Alertes configurables : Seuils personnalisables pour les indicateurs critiques

# Gestion Budgétaire
- Budgets par catégorie : Allocation et suivi des dépenses
- Suivi en temps réel : Comparaison budgétée vs réalisé
- Alertes de dépassement : Notifications automatiques
- Historique budgétaire : Évolution sur plusieurs périodes

# Caisse
- Suivi quotidien : Ouverture, transactions, fermeture
- Types d'opérations : Entrées et sorties détaillées
- Rapports de caisse : États quotidiens et cumulés
- Réconciliation : Vérification des soldes

# Facturation
- Création de factures : Interface intuitive avec calculs automatiques
- Gestion des clients : Base de données clients intégrée
- Statuts de paiement : Brouillon, Envoyée, Payée, En retard, Annulée
- Numérotation automatique : Format FAC-AAAA-XXX
- Exports PDF : Génération de factures professionnelles

# Ressources Humaines
- Gestion des employés : Fiches détaillées (coordonnées, poste, salaire)
- Statuts : Actif, Inactif, Congé
- Départements : Organisation hiérarchique
- Historique : Suivi des embauches et départs

# Exports et Rapports
- Formats multiples : CSV, Excel, PDF
- Rapports personnalisables : Périodes, catégories, filtres
- Exports automatisés : Planification des rapports
- Archivage : Historique des exports

# Technologies Utilisées

# Frontend
- Next.js 16 - Framework React avec App Router
- TypeScript - Typage statique pour la robustesse
- Tailwind CSS 4 - Framework CSS utilitaire
- shadcn/ui - Composants UI accessibles et modernes
- Recharts - Bibliothèque de graphiques React
- React Hook Form - Gestion des formulaires
- Zod - Validation des données

# État et Données
- Local Storage - Persistance des données (version actuelle)
- Context API - Gestion globale de l'état
- Custom Hooks - Logique métier réutilisable

# Outils de Développement
- ESLint - Linting du code
- PostCSS - Traitement CSS
- TypeScript Compiler - Compilation TypeScript

# Installation et Configuration

# Prérequis
- Node.js 18.0 ou supérieur
- npm, yarn ou pnpm
- Navigateur moderne (Chrome, Firefox, Safari, Edge)

# Installation

2. Installer les dépendances
   ```bash
   # Avec npm
   npm install

3. Configuration de l'environnement (optionnel)
   ```bash
   # Créer un fichier .env.local
   cp .env.example .env.local
   ```

4. Démarrer le serveur de développement
   ```bash
   # Avec npm
   npm run dev

  
5. Accéder à l'application
   Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

### Build pour la Production

```bash
# Build de l'application
npm run build

# Démarrage en mode production
npm start
```

## Utilisation

### Première Connexion
L'application inclut des comptes de démonstration :

| Rôle | Utilisateur | Mot de passe |
|------|-------------|--------------|
| Administrateur | admin | admin123 |
| Manager | manager | manager123 |
| Utilisateur | user | user123 |

### Navigation
- Tableau de bord : Vue d'ensemble des KPIs
- Opérations : Saisie des transactions
- Analyse : Rapports détaillés et graphiques
- Budget : Gestion budgétaire
- Caisse : Suivi de trésorerie
- Facturation : Gestion des clients et factures
- RH : Gestion des employés
- Exports : Génération de rapports

### Fonctionnalités Avancées

#### Analyses Financières
- Ratios automatiques** : Calculs en temps réel des indicateurs clés
- Graphiques interactifs** : Zoom, filtres, exports
- Alertes intelligentes** : Notifications basées sur des seuils configurables
- Projections** : Estimations annuelles basées sur les tendances

#### Gestion Budgétaire
- Allocation par catégorie : Répartition des budgets
- Suivi en temps réel** : Comparaison dépensé/alloué
- Alertes de dépassement** : Prévention des dérives

##  Structure du Projet

```
geek-fin/
├── app/                          # Pages Next.js (App Router)
│   ├── globals.css              # Styles globaux
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Page d'accueil
├── components/                   # Composants React
│   ├── ui/                      # Composants UI réutilisables
│   ├── analyse.tsx              # Module d'analyse
│   ├── app-sidebar.tsx          # Barre latérale
│   ├── budget.tsx               # Gestion budgétaire
│   ├── caisse.tsx               # Module caisse
│   ├── dashboard.tsx            # Tableau de bord
│   ├── export.tsx               # Exports
│   ├── facturation.tsx          # Facturation
│   ├── login-form.tsx           # Formulaire de connexion
│   ├── operations.tsx           # Opérations
│   └── rh.tsx                   # Ressources humaines
├── hooks/                        # Hooks personnalisés
├── lib/                          # Utilitaires et logique métier
│   ├── auth-context.tsx         # Contexte d'authentification
│   ├── store.ts                 # Gestion des données
│   ├── types.ts                 # Types TypeScript
│   └── utils.ts                 # Fonctions utilitaires
├── public/                       # Assets statiques
├── styles/                       # Styles additionnels
├── .gitignore                    # Fichiers ignorés par Git
├── components.json               # Configuration shadcn/ui
├── next.config.mjs               # Configuration Next.js
├── package.json                  # Dépendances et scripts
├── postcss.config.mjs            # Configuration PostCSS
├── tailwind.config.ts            # Configuration Tailwind
└── tsconfig.json                 # Configuration TypeScript
```

##  Configuration Avancée

### Variables d'Environnement
```env
# .env.local
NEXT_PUBLIC_APP_NAME=GEEK-FIN
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Personnalisation des Thèmes
L'application utilise Tailwind CSS avec support des thèmes sombre/clair. Les couleurs sont configurées dans `tailwind.config.ts`.

### Extension des Fonctionnalités
- **Nouvelles catégories** : Ajouter dans `lib/types.ts`
- **Nouveaux rapports** : Étendre `lib/store.ts`
- **Nouveaux composants UI** : Utiliser shadcn/ui

## Tests

```bash
Lancer les tests
npm run test

Linting
npm run lint

Vérification des types
npm run type-check
```

