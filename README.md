# TheraSpace 2.0

Une application mobile de bien-être psychologique générative pour adolescents (13-18 ans).

## 🎨 Caractéristiques

- **Interface Bento Grid** ultra-moderne et responsive
- **Warm Tech Design** avec palette de couleurs sable/beige
- **Animations fluides** avec Framer Motion
- **IA générative** simulée pour personnalisation (prête pour l'API Mistral)
- **Persistance locale** avec localStorage
- **8 modules interactifs** :
  - 🌤️ **Météo Intérieure** : Suivi de l'humeur
  - 🧘 **Respiration** : Exercices guidés 4-4-6-2
  - ⚓ **Ancrage** : Technique 5-4-3-2-1 des sens
  - 💬 **Écho** : Scénarios et analyse IA
  - 🌱 **Jardin** : Suivi d'actions avec croissance animée
  - 👤 **Identité** : Questionnaire dynamique
  - 🤖 **PsIA** : Chat avec assistant IA
  - 📔 **Journal** : Agrégation des données

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Builder pour la production
npm run build

# Prévisualiser le build
npm run preview
```

## 🛠️ Stack technique

- **React 18** avec TypeScript
- **Vite** pour le build et dev server
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **Lucide React** pour les icônes
- **localStorage** pour la persistance

## 📁 Structure du projet

```
src/
├── components/       # Composants réutilisables (Button, Card, Header)
├── modules/          # Modules principaux de l'application
├── hooks/            # Hooks custom (useLocalStorage)
├── lib/              # Utilitaires et mock API
├── App.tsx          # Composant principal avec navigation
├── main.tsx         # Point d'entrée
└── index.css        # Styles globaux
```

## 🎨 Palette de couleurs

- **Fond principal** : Beige (#F7F0EA)
- **Textes** : Noir chaud (#1A1614), Brun terreux (#5C534A)
- **Modules** :
  - Respiration : #E3F0FA
  - Ancrage : #D4F0EC
  - Écho : #FCE8EF
  - Jardin : #DEF5E5
  - Identité : #EDE8FA
  - Journal : #FDFBF7
  - PsIA : #E2F5E9

## 📝 Fonctionnalités

### Persistance des données
Chaque module sauvegarde automatiquement son état dans `localStorage` :
- Historique des sessions Écho
- Réponses du module Identité
- Niveau de croissance du Jardin
- Conversations PsIA
- Notes personnelles du Journal

### Boutons de réinitialisation
Chaque module possède un bouton "Réinitialiser" pour effacer les données locales.

### Bouton SOS
Un bouton d'urgence est disponible sur la page d'accueil avec les numéros importants :
- 3114 - Prévention du suicide
- 119 - Allô Enfance en Danger
- 0800 235 236 - Fil Santé Jeunes

## 🔮 Future : Intégration API Mistral

Le code est structuré pour faciliter l'intégration de l'API Mistral :
- Les fonctions dans `src/lib/mockApi.ts` simulent les appels API
- Remplacer les fonctions mock par de vraies requêtes HTTP
- Ajouter la clé API Mistral dans les variables d'environnement

## 📄 License

Ce projet est développé pour TheraSpace.

## 👥 Auteur

lecuyerpsychologue-lab