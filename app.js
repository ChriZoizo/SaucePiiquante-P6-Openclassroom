const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv')

/* Importation/enregistrement des routeur */
const userRoutes = require('../backend/routes/user')
const sauceRoutes = require('../backend/routes/sauce')

dotenv.config()

/* Connection a la BDD MongoDB */
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


app.use(express.json()) /* Equivalent Body-Parser */

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/sauce', sauceRoutes)
app.use('/api/auth', userRoutes)

module.exports = app
