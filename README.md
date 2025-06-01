# 🚀 IBTIKAR RMS - Reference Management System

**Système de Gestion des Références** développé par IBTIKAR TECHNOLOGIES pour gérer efficacement les projets, clients, et références d'entreprise.

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![tRPC](https://img.shields.io/badge/tRPC-11.1.4-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.8-cyan)

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [API Documentation](#api-documentation)
- [Déploiement](#déploiement)
- [Contribution](#contribution)

## 🌟 Vue d'ensemble

IBTIKAR RMS est une application web moderne de gestion des références et projets d'entreprise. Elle permet de centraliser, organiser et suivre tous les projets, clients, technologies et références de l'entreprise avec une interface utilisateur intuitive et des fonctionnalités avancées.

### 🎯 Objectifs

- **Centralisation** : Gérer tous les projets et références en un seul endroit
- **Traçabilité** : Suivre l'évolution des projets et la satisfaction client
- **Analyse** : Générer des rapports et statistiques de performance
- **Collaboration** : Faciliter le travail d'équipe et le partage d'informations

## ✨ Fonctionnalités

### 🏢 Gestion des Clients

- ✅ CRUD complet (Créer, Lire, Modifier, Supprimer)
- ✅ Informations détaillées (contact, secteur, localisation)
- ✅ Association avec pays et projets
- ✅ Historique des interactions

### 📝 Gestion des Références/Projets

- ✅ Portfolio complet des projets réalisés
- ✅ Suivi des statuts (Actif, Terminé, En cours)
- ✅ Gestion des budgets et équipes
- ✅ Évaluation de satisfaction client
- ✅ Documentation et fichiers associés

### 💻 Gestion des Technologies

- ✅ Catalogue des technologies utilisées
- ✅ Catégorisation (Frontend, Backend, Database, Mobile, DevOps)
- ✅ Association avec les projets
- ✅ Statistiques d'utilisation

### 🌍 Gestion des Pays

- ✅ Base de données des pays avec drapeaux
- ✅ Localisation des clients et projets
- ✅ Statistiques géographiques

### 👥 Gestion des Utilisateurs

- ✅ Système d'authentification sécurisé
- ✅ Rôles et permissions (Admin, User)
- ✅ Profils utilisateurs
- ✅ Audit des actions

### 📊 Interface Moderne

- ✅ Design responsive et mobile-friendly
- ✅ Dashboard avec statistiques en temps réel
- ✅ Filtres et recherche avancée
- ✅ Vues multiples (grille/liste)
- ✅ Pagination intelligente

## 🛠️ Technologies utilisées

### Frontend

- **Next.js 15.3.3** - Framework React pour la production
- **TypeScript** - Typage statique pour JavaScript
- **Tailwind CSS** - Framework CSS utility-first
- **Heroicons** - Icônes SVG optimisées
- **React Hook Form** - Gestion des formulaires
- **Zustand** - Gestion d'état légère

### Backend

- **tRPC** - API type-safe end-to-end
- **Next.js API Routes** - Routes API intégrées
- **NextAuth.js** - Authentification complète
- **Mongoose** - ODM pour MongoDB
- **bcryptjs** - Hachage sécurisé des mots de passe

### Base de données

- **MongoDB Atlas** - Base de données cloud NoSQL
- **Mongoose** - Modélisation des données

### DevOps & Outils

- **ESLint** - Linting du code
- **Prettier** - Formatage du code
- **TypeScript** - Vérification de types
- **Git** - Contrôle de version

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte MongoDB Atlas

### Étapes d'installation

1. **Cloner le repository**

```bash
git clone https://github.com/your-username/ibtikar-rms.git
cd ibtikar-rms
```

2. **Installer les dépendances**

```bash
npm install
# ou
yarn install
```

3. **Configuration des variables d'environnement**

```bash
cp .env.example .env.local
```

4. **Configurer la base de données**

```bash
npm run seed
```

5. **Lancer l'application**

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env.local` avec les variables suivantes :

```env
# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
MONGODB_DB=ibtikar-rms

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key

# JWT Configuration
JWT_SECRET=your-jwt-secret

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./public/uploads

# Application
COMPANY_NAME=IBTIKAR TECHNOLOGIES
COMPANY_COUNTRY=Mauritanie
```

### Base de données

Le projet utilise MongoDB Atlas. Pour configurer :

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster
3. Obtenez la chaîne de connexion
4. Ajoutez-la à `MONGODB_URI` dans `.env.local`
5. Exécutez `npm run seed` pour initialiser les données

## 📱 Utilisation

### Comptes par défaut

Après l'exécution du seed :

- **Admin** : admin@ibtikar.com / admin123
- **Manager** : manager@ibtikar.com / manager123
- **User** : user@ibtikar.com / user123

### Pages principales

- **Dashboard** : `/dashboard` - Vue d'ensemble et statistiques
- **Références** : `/references` - Gestion des projets
- **Clients** : `/clients` - Gestion des clients (à venir)
- **Technologies** : `/technologies` - Catalogue des technologies (à venir)

### Fonctionnalités clés

1. **Recherche et filtrage** : Utilisez la barre de recherche et les filtres
2. **Vues multiples** : Basculez entre vue grille et liste
3. **Gestion des données** : CRUD complet sur toutes les entités
4. **Rapports** : Statistiques et métriques en temps réel

## 📁 Structure du projet

```
ibtikar-rms/
├── components/           # Composants React réutilisables
│   ├── ui/              # Composants UI de base
│   └── Layout/          # Composants de mise en page
├── lib/                 # Utilitaires et configurations
│   ├── models/          # Modèles Mongoose
│   ├── trpc/           # Configuration tRPC
│   └── utils.ts        # Fonctions utilitaires
├── pages/              # Pages Next.js
│   ├── api/            # Routes API
│   ├── auth/           # Pages d'authentification
│   └── references/     # Pages de gestion des références
├── scripts/            # Scripts de maintenance
├── styles/             # Fichiers CSS
├── types/              # Définitions TypeScript
└── public/             # Fichiers statiques
```

## 📡 API Documentation

L'API utilise tRPC pour une communication type-safe. Les routes principales :

### Références (`reference`)

- `getAll()` - Récupérer toutes les références avec pagination
- `getById(id)` - Récupérer une référence par ID
- `create(data)` - Créer une nouvelle référence
- `update(id, data)` - Mettre à jour une référence
- `delete(id)` - Supprimer une référence

### Clients (`client`)

- `getAll()` - Récupérer tous les clients
- `getById(id)` - Récupérer un client par ID
- `create(data)` - Créer un nouveau client
- `update(id, data)` - Mettre à jour un client
- `delete(id)` - Supprimer un client

### Technologies (`technology`)

- `getAll()` - Récupérer toutes les technologies
- `getByCategory(category)` - Récupérer par catégorie
- `create(data)` - Créer une nouvelle technologie

### Pays (`country`)

- `getAll()` - Récupérer tous les pays
- `getByCode(code)` - Récupérer un pays par code

## 🌐 Déploiement

### Vercel (Recommandé)

1. **Connecter le repository**

```bash
vercel
```

2. **Configurer les variables d'environnement** dans le dashboard Vercel

3. **Déployer**

```bash
vercel --prod
```

### Autres plateformes

Le projet peut être déployé sur :

- **Netlify**
- **Railway**
- **Heroku**
- **AWS**
- **DigitalOcean**

## 👨‍💻 Contribution

### Guidelines

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** les changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Standards de code

- Utiliser TypeScript pour tous les nouveaux fichiers
- Suivre les conventions ESLint/Prettier
- Écrire des tests pour les nouvelles fonctionnalités
- Documenter les nouvelles APIs

### Roadmap

- [ ] Gestion avancée des documents
- [ ] Système de notifications
- [ ] Rapports PDF exportables
- [ ] API mobile
- [ ] Intégration avec outils externes
- [ ] Multi-langue (i18n)

## 📞 Support

Pour toute question ou support :

- **Email** : contact@ibtikar.mr
- **Website** : https://www.ibtikar.mr
- **Issues** : [GitHub Issues](https://github.com/your-username/ibtikar-rms/issues)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Développé avec ❤️ par [IBTIKAR TECHNOLOGIES](https://www.ibtikar.mr)**

🇲🇷 **Made in Mauritania** 🇲🇷
