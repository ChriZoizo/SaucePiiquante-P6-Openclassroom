const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()


/* Importation puis enregistrement du routeur */
const userRoutes = require('../backend/routes/user')
app.use('/api/auth', userRoutes)


/* Connection a la BDD Mongo */
mongoose
  .connect(
    'mongodb+srv://christopher:Freedom@cluster0.nwitx.mongodb.net/piiquanteDB?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))







  /* Regler le probleme de cross origine */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})

/* requete de test*/
app.use((req, res, next) => {
    res.json({ message : "REQUETE REçUS !"})
})

module.exports = app