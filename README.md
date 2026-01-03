# TheraSpace 2.0

Une application mobile de bien-être psychologique générative pour adolescents (13-18 ans).

![TheraSpace Banner](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.3-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple)

## 🌟 Vision

TheraSpace est une application mobile de bien-être psychologique conçue spécifiquement pour les adolescents. Elle se distingue par :

- **Interface Bento Grid** ultra-moderne et responsive
- **IA générative** (via mock API Mistral) pour personnaliser chaque expérience
- **Design Warm Tech** avec des couleurs douces et apaisantes
- **Persistance locale** avec localStorage pour sauvegarder toutes les données

## 🎨 Philosophie de Design

### Warm Tech
- Couleurs sables, beiges, transitions douces
- Pas de blanc clinique
- Ambiance chaleureuse et accueillante

### Typographie
- **Playfair Display** pour les titres (élégant, serif)
- **Inter** pour le corps du texte (moderne, sans-serif)

### Palette de Couleurs
- **Fond principal**: Beige (#F7F0EA)
- **Textes**: Noir chaud (#1A1614), Brun terreux (#5C534A)
- **Accents par module**:
  - Respiration: #E3F0FA (bleu calme)
  - Ancrage: #D4F0EC (vert menthe)
  - Écho: #FCE8EF (rose pâle)
  - Jardin: #DEF5E5 (vert doux)
  - Identité: #EDE8FA (violet clair)
  - Journal: #FDFBF7 (crème)
  - PsIA: #E2F5E9 (vert clair)

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/lecuyerpsychologue-lab/theraspacefinal.git
cd theraspacefinal

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Builder pour la production
npm run build

# Preview de la production
npm run preview
```

## 📁 Structure du Projet

```
theraspacefinal/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── hooks/               # Hooks personnalisés
│   │   └── useLocalStorage.ts
│   ├── lib/                 # Fonctions utilitaires
│   │   └── mockApi.ts      # Mock de l'API Mistral
│   ├── modules/             # Modules de l'application
│   │   ├── Home.tsx        # Page d'accueil Bento Grid
│   │   ├── RespirationModule.tsx
│   │   ├── AncrageModule.tsx
│   │   ├── EchoModule.tsx
│   │   ├── GardenModule.tsx
│   │   ├── IdentityModule.tsx
│   │   ├── PsiAModule.tsx
│   │   └── JournalModule.tsx
│   ├── App.tsx             # Composant principal avec navigation
│   ├── main.tsx            # Point d'entrée
│   └── index.css           # Styles globaux
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎯 Modules de l'Application

### 🏠 Page d'Accueil (Bento Grid)
- Header avec logo typographique et bouton SOS
- Widget "Météo Intérieure" (6 états émotionnels avec icônes)
- Cartes cliquables pour chaque module

### 🫁 Respiration
- Exercice de respiration guidée 4-4-6-2
- Animation de cercle qui grandit/rétrécit
- Tracking des sessions et du temps total
- Contrôles Play/Pause/Restart

### 👣 Ancrage
- Technique de pleine conscience 5-4-3-2-1
- 5 sens: Vue, Toucher, Ouïe, Odorat, Goût
- Navigation pas à pas
- Indicateurs de progression

### 💬 Écho (IA)
- Scénarios générés par l'IA avec 4 choix de réactions
- Analyse personnalisée de chaque choix
- Questions de réflexion
- Historique des sessions sauvegardé

### 🌱 Jardin (IA)
- Choix de domaine de vie (Relations, Confiance, Émotions, Créativité)
- 3 actions concrètes suggérées par l'IA
- Visualisation de la croissance (plante animée, 10 niveaux)
- Tracking des actions complétées

### 🎭 Identité (IA)
- Questions infinies générées par l'IA
- 3 types: Ping-pong (texte libre), QCM, Vrai/Faux
- Génération de portrait narratif basé sur les réponses
- Historique des réponses

### 🧠 PsIA (IA)
- Interface de chat avec l'IA
- Réponses contextuelles et empathiques
- Historique de conversation persistant
- Suggestions adaptées selon les mots-clés

### 📔 Journal
- Agrégation de toutes les données des modules
- Notes personnelles avec textarea
- Statistiques d'utilisation
- Résumé du parcours

## 🛠️ Stack Technique

- **React 18**: Framework UI avec hooks
- **TypeScript**: Typage statique
- **Vite**: Build tool ultra-rapide
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animations fluides
- **Lucide-React**: Icônes modernes (pas d'emojis)
- **localStorage**: Persistance des données

## 💾 Persistance des Données

Toutes les données sont sauvegardées localement avec localStorage:

- `echo-history`: Historique des sessions Écho
- `garden-growth`: Niveau de croissance du jardin
- `identity-answers`: Réponses aux questions d'identité
- `psia-messages`: Messages du chat PsIA
- `respiration-sessions`: Nombre de sessions de respiration
- `respiration-total-time`: Temps total de respiration
- `ancrage-sessions`: Nombre de sessions d'ancrage
- `journal-notes`: Notes personnelles du journal

Chaque module possède un bouton "Réinitialiser" pour effacer ses données.

## 🎬 Animations

Animations fluides et "snappy" avec Framer Motion:
- Transitions de page avec `AnimatePresence`
- Hover effects sur les cartes (scale + translation Y)
- Animations de chargement
- Cercle de respiration animé
- Croissance de plante
- Messages de chat qui apparaissent

## 🔒 Sécurité & Confidentialité

- **Aucune donnée n'est envoyée à un serveur**
- Toutes les données restent sur l'appareil de l'utilisateur
- Mock API pour simuler les réponses de l'IA
- Prêt pour intégration avec l'API Mistral réelle

## 📱 Responsive Design

L'application est entièrement responsive:
- **Mobile First**: Optimisé pour les smartphones
- **Tablet**: Grille adaptative
- **Desktop**: Bento Grid étendu

Breakpoints Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🚦 État du Projet

✅ **Complet et fonctionnel**
- Tous les modules implémentés
- Build de production réussi (302KB)
- Aucune erreur TypeScript
- Toutes les fonctionnalités testées
- localStorage fonctionnel
- Animations fluides

## 🔮 Prochaines Étapes

Pour passer en production:
1. Intégrer l'API Mistral réelle (remplacer `mockApi.ts`)
2. Ajouter un système de comptes utilisateurs
3. Implémenter un backend pour la synchronisation cross-device
4. Ajouter des notifications push pour les rappels
5. Tests unitaires et E2E
6. Optimisation des performances
7. PWA pour installation mobile

## 📄 Licence

Copyright © 2026 TheraSpace. Tous droits réservés.

## 👥 Contribution

Pour contribuer au projet:
1. Fork le repository
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit les changements (`git commit -m 'Ajout de...'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou support, contactez l'équipe TheraSpace.

---

Fait avec ❤️ pour le bien-être des adolescents