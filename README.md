# web3-Projet-Groupe7
# Système Solaire 3D avec Babylon.js

Ce projet est une simulation interactive du système solaire utilisant Babylon.js. Il permet de visualiser les orbites et caractéristiques des planètes en 3D avec des animations, des étiquettes et un menu pour interagir facilement avec chaque astre. Les données des planètes sont fournies par l'API [Le Système Solaire API](https://api.le-systeme-solaire.net/rest/bodies/).

Le site est déployé à l'adresse suivante :
https://robert-ailenei-vinci.github.io/web3-Projet-Groupe7/.
La branche gh-pages est utilisée pour gérer le déploiement.


Si le site est inaccessible, vous pouvez l'installer et le lancer localement en suivant les étapes ci-dessous.

Une video de presentation est disponible ici : https://www.youtube.com/watch?v=I2x58_137Oc

Membre du groupe
 - Robert Ailenei
 - Flaviu Bilic
 - Lars Hanquet
 - Rafael Millor
 - Resul Ramadani

## Fonctionnalités

- Visualisation des orbites des planètes en 3D.
- Animation des planètes autour du Soleil avec gestion de la caméra.
- Informations détaillées sur chaque planète en utilisant les données d'une API.
- Menu interactif pour sélectionner chaque astre et afficher ses détails.
- Interface discrète et intuitive.

## Pré-requis

- [Node.js](https://nodejs.org/) (si vous avez besoin de gestion de dépendances supplémentaires, bien que ce projet puisse fonctionner sans serveur Node en local).
- Visual Studio Code avec l'extension **Live Server** installée.

## Installation

1. **Téléchargez le projet**  
   Clonez ce dépôt Git ou téléchargez-le en tant que fichier ZIP et extrayez-le dans votre dossier de choix.

   ```bash
   git clone <URL_DU_DEPOT_GIT>

2. **Ouvrez le projet dans Visual Studio Code**
    Lancez Visual Studio Code et ouvrez le dossier contenant le projet.

3. **Installez l'extension Live Server**
    Si vous ne l'avez pas déjà, installez l'extension **Live Server** pour Visual Studio Code. Elle permet de lancer le projet sur un serveur local pour un rendu correct des fichiers HTML et JavaScript.

### Pour installer Live Server :

1. Allez dans la section **Extensions** de Visual Studio Code.
2. Recherchez "Live Server".
3. Installez l'extension de **Ritwick Dey**.

### Lancez le projet avec Live Server

1. Cliquez avec le bouton droit sur le fichier `index.html` dans l'explorateur de fichiers.
2. Sélectionnez **Open with Live Server**.
3. Votre navigateur par défaut s'ouvrira et affichera le projet en cours d'exécution sur un serveur local.

### Utilisez le projet

Une fois lancé, vous pouvez interagir avec le système solaire, sélectionner des planètes, et afficher leurs détails. Le menu discret en bas à droite indique la source des données de l'API.

## Structure des fichiers

- `index.html` : La page principale contenant la scène Babylon.js.
  - `app.js` : Le script principal lançant les scenes et engines.
  - `CelestialBody.js` : Définit la classe pour gérer chaque astre (planètes et Soleil).
  - `planetDataRetrieval.js` : Contient le code pour récupérer les données de l'API.
  - `uiPlanetDetails.js` : Gère l'interface utilisateur pour afficher les détails des planètes.
- `assets/` : Contient les images et textures pour les planètes.
- `style.css` : Styles de base pour le projet.

## API Utilisée

Les données des planètes sont fournies par **[Le Système Solaire API](https://api.le-systeme-solaire.net/rest/bodies/)**. Pour chaque astre, cette API fournit des informations détaillées telles que :

- Nom de la planète
- Masse, densité, gravité, etc.
- Détails orbitaux (aphélie, périhélie, inclinaison)
- Température moyenne et autres caractéristiques

