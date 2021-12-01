# Projet 6 - Piiquante

Ceci est une application créé dans le cadre de la formation "Developpeur Web" d'OpenClassrooms.
Créé avec Express, Node.js et MongoDB.

## Prérequis
L'application necessite certaines "dependances"
- Express
- Angular
- Node.js
- nvm
- Node-sass

## Installation

Une fois le telechargement effectué, placez-vous dans le dossier 'backend' puis faites :


- Pour installer les modules necessaires
```bash
npm install 
```

- Puis connectez une base de données Mongo.DB en et mettez l'url (fichier "app.js" ligne 18)

- Puis :
```
nodemon server
```

L'api est normalement sur le port 3000 ( http://localhost:3000 ).


Pour arreter le serveur, utilisez CTRL + C dans votre terminal

### API

Voici quelques indication sur l'API

- POST (/api/auth/signup) = signup user
- POST (/api/auth/login) = login user

- GET (/api/sauces) = Liste des sauces
- GET (/api/sauces/:id) = Une sauce via son id
- POST (api/sauces) = Créer un sauce
- PUT (api/sauces/:id) = Modifier une sauce
- DELETE (/api/sauces/:id) = Supprimer une sauce
- POST (/api/sauces/:id/like) = Liker ou Disliker une sauce.

Pour plus de precisions, consultez la page 2 et 3 de ce document



