/* Importation des modules */
const express = require('express')
const app = express()
const mongoose = require('mongoose') /* Base de données */
const path = require('path') /* permet de manipuler les fichiers et dossiers */
const dotenv = require('dotenv') /* Dotenv permet de travailler avec des variables d'environnement */

/* Importation des routeurs */
const userRoutes = require('../backend/routes/user')
const sauceRoutes = require('../backend/routes/sauce')

dotenv.config()

/* Connection a la BDD MongoDB */
mongoose
  .connect(
    process.env.MONGODB_BDD_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))


/* Parametrages des headers pour eviter les erreurs CORS (Cross Origin Resources Sharing) */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*') /* Permet les requetes de toutes origines*/
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  ) /* Headers de requetes autorisés */
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  ) /* Methode/Verbes autorisés et concerné par ce header */
  next()
})


app.use(express.json()) /* Equivalent Body-Parser */

app.use('/images', express.static(path.join(__dirname, 'images'))) /* chemin static pour Multer (images) */

/* Definitions des URI et de leurs routes */
app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)

/* Exportation des fonctions */
module.exports = app
