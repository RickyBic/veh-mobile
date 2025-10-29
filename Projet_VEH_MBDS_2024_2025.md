# Projet d'Innovation 2024/2025 - VEH : Vous Êtes le Héros

## 🎯 Objectif général

Le projet **VEH (Vous Êtes le Héros)** vise à concevoir une **plateforme
complète** composée de deux éléments :
1. Un **moteur de création de scénarios interactifs** permettant à des
auteurs de créer leurs propres aventures à embranchements.
2. Une **application mobile** permettant aux lecteurs de jouer ces
aventures en faisant des choix qui influencent la progression de
l'histoire.

Ce projet fait partie du **module de Travaux Pratiques d'Innovation** du
Master **MBDS 2024/2025** (Université Côte d'Azur).\
Encadrants principaux : **Grégory Galli**, **Michel Syska**, et **Gilles
Menez**.

------------------------------------------------------------------------

## 🧱 Architecture et composantes principales

### 1. Moteur de création de scénarios

Le moteur doit permettre de **créer, modifier et visualiser** des
histoires sous forme d'un **arbre de décision**.\
Chaque **nœud** représente un état narratif de l'histoire, contenant :
- Une description de la scène (texte principal).
- Les **choix** offerts au joueur.
- Les liens vers d'autres nœuds selon les choix effectués.

Ce moteur doit offrir une **interface visuelle intuitive**, par exemple
sous forme de graphe manipulable :
- Ajout, suppression, déplacement de nœuds.
- Connexions entre les nœuds via des arcs.
- Focus et zoom sur les sections de l'arbre.

Les scénaristes doivent pouvoir **éditer facilement** leurs histoires
sans avoir besoin de compétences techniques avancées.

### 2. Application mobile de jeu

L'application mobile permet de **jouer les scénarios créés**.\
Le joueur parcourt l'histoire en faisant des choix et voit son aventure
évoluer selon ses décisions.

Fonctionnalités attendues :
- Navigation entre les nœuds de scénario.
- Gestion des **sauvegardes** et **retours en arrière**.
- Intégration possible d'un **inventaire** : objets collectés qui influencent certains choix (par exemple, une clé permettant d'ouvrir une porte plus tard).

La priorité est donnée à **Android**, soit en **Java/Kotlin natif**,
soit en **React Native** pour un développement hybride.\
Le support **iOS** est optionnel, car plus complexe à mettre en œuvre.

------------------------------------------------------------------------

## 🎨 Immersion multimédia et intelligence artificielle

Pour rendre l'expérience plus immersive, chaque scénario peut inclure :
- Des **illustrations générées par IA** (selon les descriptions des scènes).
- Des **sons et musiques d'ambiance**.
- Éventuellement des **vidéos** pour enrichir certaines séquences.

Le créateur pourra s'appuyer sur des **modèles de langage (LLM)** pour
:
- Générer du texte descriptif ou des idées de scènes.
- Produire des **images illustratives** à partir de descriptions textuelles.

Les musiques et sons ne sont pas obligatoires mais apportent une plus-value immersive.

------------------------------------------------------------------------

## 🗃️ Stockage et modèle de données

Le scénario est une structure arborescente (ou graphe). Deux approches possibles :

- **Base relationnelle (SQL)** : chaque nœud est une entrée liée par des clés de parenté.
- **Base orientée graphe (ex. Neo4j)** : mieux adaptée aux structures hiérarchiques complexes.

L'objectif est d'assurer une **navigation fluide** entre les nœuds et de pouvoir stocker les liens et choix de manière efficace.

------------------------------------------------------------------------

## 🌐 Fonctionnalités supplémentaires

-   **Partage et collaboration** : Possibilité de créer une sorte de **"marketplace"** où les scénarios peuvent être publiés, partagés et joués par d'autres utilisateurs.

-   **Back-end de gestion** : Permet la création, l'enregistrement et la gestion des scénarios, avec authentification optionnelle.

------------------------------------------------------------------------

## 🧭 Organisation du travail et encadrement

-   **Équipe** : 3 à 4 étudiants.
-   **Rôles** : chaque groupe doit désigner un **responsable
    communication**.
-   **Outils** :
    -   Utiliser **GitHub** pour le suivi (issues, Wiki, CI/CD,
        avancement).
    -   **Réunions régulières** avec compte rendu.
    -   **Rapport final** + **soutenance de 30 minutes**.
-   **Encadrement** :
    -   Séances en ligne via **Zoom** animées par **Grégory Galli** et
        **Michel Syska**.
    -   Créneaux de 2 à 3 heures selon le nombre de groupes.
    -   Les rendez-vous sont **facultatifs** mais conseillés pour
        débloquer ou valider des points techniques.

En dehors des séances, les étudiants peuvent contacter les encadrants
par **e-mail** (mettre les deux en copie).

------------------------------------------------------------------------

## ⚙️ Points d'attention et conseils pratiques

-   Ne pas viser un projet trop ambitieux : **prioriser la version
    fonctionnelle minimale (MVP)**.
-   Éviter les technologies trop complexes ou expérimentales.
-   Se concentrer d'abord sur la **construction du scénario** avant
    l'esthétique.
-   Prévoir une **documentation claire** pour le code, la base de
    données et les API.

------------------------------------------------------------------------

© Master MBDS - Université Côte d'Azur, 2024/2025\
Encadrants : Grégory Galli, Michel Syska, Gilles Menez.
