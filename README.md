# VEH Mobile

Application mobile React Native pour l'univers « Vous Êtes le Héros », connectée à un backend GraphQL. Cette application permet aux joueurs de parcourir des scénarios interactifs, de suivre leur progression et de profiter d'expériences audio immersives.

## Fonctionnalités

- Authentification JWT (connexion, inscription, déconnexion) avec persistance sécurisée du jeton
- Liste des scénarios publiés et navigation vers le détail d'un scénario
- Lecture interactive d'un scénario scène par scène avec choix
- Lecture audio automatique des narrations/ambiances lorsqu'elles sont disponibles
- Sauvegarde et reprise de la progression joueur via l'API GraphQL
- Thème visuel personnalisé (typo Cinzel, palette sombre, boutons stylisés)

## Stack Technique

- **Framework** : React Native
- **Langage** : TypeScript
- **Navigation** : Expo Router (Stack + Tabs)
- **GraphQL** : Apollo Client 4 (HTTP Link + Auth Link + InMemoryCache)
- **Stockage sécurisé** : `expo-secure-store` (mobile) et `localStorage` (web)
- **UI & Thème** : composants maison (`MysticalButton`, `SceneCard`, `SceneAudio`), palette définie dans `src/utils/theme.ts`
- **Audio** : `expo-av` pour la lecture des narrations et musiques d'ambiance

## Prérequis

- Node.js ≥ 18.x et npm ≥ 9 (ou pnpm/yarn si vous préférez)
- Expo CLI (`npm install --global expo`) ou usage via `npx expo`
- Backend GraphQL démarré et accessible (par défaut sur `http://localhost:8000/graphql/`)
- Outils de plateforme Android Studio

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone <url-du-repo>
   cd veh-mobile
   ```
2. **Installer les dépendances**
   ```bash
   npm install
   ```
3. **Configurer l'URL de l'API** (voir section Configuration)
4. **Lancer l'application**
   ```bash
   npm run dev
   ```
   Ou directement avec Expo :
   ```bash
   npx expo start
   ```
   Note : `npm run dev` est recommandé car il désactive la télémétrie Expo.

## API GraphQL

- **Endpoint par défaut** : `/graphql/` (configurable via `EXPO_PUBLIC_API_URL`)
- **Authentification** : mutation `login` retournant un jeton JWT à préfixer avec `JWT ` dans l'entête `Authorization`
- **Queries utilisées** :
  - `GetAllScenarios` pour lister les scénarios publiés
  - `GetScenesByScenario`, `GetChoicesByScene` pour alimenter le jeu
  - `GetMe`, `GetMyProgress`, `GetProgressByScenario` pour l'espace joueur
- **Mutations principales** :
  - `createUser`, `login` pour l'auth
  - `createProgress`, `recordProgress`, `updateProgress` pour la sauvegarde des parties
- **Assets** : les URLs relatives renvoyées par l'API sont concaténées avec la base via `getFullAssetUrl`

Assurez-vous que le backend implémente ces opérations avec les champs attendus (voir `src/graphql/queries.ts` et `src/graphql/mutations.ts`).

## Application React Native

- **Entrée** : `app/_layout.tsx` charge les fonts, installe Apollo et le contexte d'authentification
- **Navigation** : le Stack Expo Router gère `login`, `register` et un groupe d'onglets sécurisé `(tabs)`
- **Contexte d'authentification** : `AuthProvider` gère le jeton, la récupération du profil et expose `login/register/logout`
- **Écrans** :
  - `LoginScreen`, `RegisterScreen` pour l'onboarding (dans `src/screens/`)
  - `ScenarioListScreen` pour lister les scénarios (dans `src/screens/`)
  - `GameScreen` pour l'expérience interactive et l'enregistrement de la progression (dans `src/screens/`)
  - `LogoutScreen` pour la déconnexion (défini dans `app/(tabs)/logout.tsx`)
- **Composants** : `LoadingSpinner`, `MysticalButton`, `SceneCard`, `SceneAudio` encapsulent l'UI/thème

## Sécurité

- Jeton JWT conservé dans `expo-secure-store` (mobile) ou `localStorage` (web) et injecté dans Apollo via un `authLink`
- Redirection automatique vers l'écran `login` si l'utilisateur n'est pas authentifié lorsqu'il accède aux onglets
- Validation côté client lors de l'inscription (mot de passe, email)
- Les erreurs réseau/API sont journalisées dans la console pour faciliter le suivi

Complétez côté backend : rotation de clés JWT, expiration courte, rafraîchissement éventuel, filtrage des données selon les rôles (`role` exposé par `GetMe`).

## Déploiement

- **Expo Go / Développement** : `npm run dev` (ou `npx expo start`)
- **Web statique** : `npm run build:web` génère un bundle dans `dist/`
- **Builds natifs** : utiliser `npx expo prebuild` puis `npx expo run:android`, ou configurer [EAS Build](https://docs.expo.dev/build/introduction/)
- Pensez à définir `EXPO_PUBLIC_API_URL` pour les environnements staging/production (via variables EAS ou `app.config.ts`)

## Configuration

- **Variables d'environnement** : créer un fichier `.env` ou utiliser votre système de variables pour définir
  ```bash
  EXPO_PUBLIC_API_URL=https://mon-backend.example.com
  ```
  Expo injecte automatiquement les variables préfixées par `EXPO_PUBLIC_`.
- **Alias de chemins** : `@/*` pointe vers la racine (`tsconfig.json`)
- **Thème** : personnalisation centralisée dans `src/utils/theme.ts`
- **Apollo Client** : `src/utils/apollo-client.ts` définit la stratégie de cache et les en-têtes d'authentification

## Performance

- Apollo utilise un `InMemoryCache` et une politique `cache-and-network` pour limiter les allers-retours
- Les choix sont triés et mémorisés localement pour réduire le re-rendu
- `SceneAudio` charge et met en cache les sons avec `expo-av`
- Optimisations possibles : préchargement des scénarios clés, compression des assets, instrumentation d'Apollo pour mesurer les temps de réponse

## Monitoring et Debug

- Expo CLI fournit DevTools (logs, profilage, inspection réseau)
- Utilisez React Native Debugger ou Flipper pour inspecter l'état et les requêtes GraphQL
- Apollo DevTools (extension Chrome) peut être connecté lorsque vous lancez l'appli en mode web
- Journalisation explicite côté client (par ex. erreurs audio, erreurs Apollo) pour faciliter l'investigation

## Contribution

1. Forkez le dépôt et créez une branche (`git checkout -b feature/ma-feature`)
2. Développez vos changements et gardez un style typé (`npm run typecheck`)
3. Vérifiez les règles de lint (`npm run lint`)
4. Testez sur au moins une plateforme (web ou mobile)
5. Ouvrez une Pull Request en détaillant le contexte, les changements et les vérifications effectuées

## Licence

MIT
