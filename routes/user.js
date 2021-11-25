/* Modules */
const express = require('express')
const router = express.Router()
/*Importations du controlleurs 'user' et de ses fonctions */
const userCtrl = require('../controller/user')

/* Parametrage des routes/points d'arrêts et fonctions du controlleurs liés */
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login) 

/* Export du routeur et de ses fonctions */
module.exports = router
