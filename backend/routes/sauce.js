/* Modules */
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth') /* Authorize pour la gestion des accées */
const multer = require('../middleware/multer-config') /* Multer pour gerer les images */

/*Importations du controlleurs 'sauce' et de ses fonctions */
const saucesCtrl = require('../controller/sauce')

/* Parametrage des routes/points d'arrêts et fonctions du controlleurs liés. 
"Authorize" est ajouté (auth) a toutes les routes */
router.post('/', auth, multer, saucesCtrl.createSauce)
router.get('/', auth, saucesCtrl.getAllSauces)
router.get('/:id', auth, saucesCtrl.getOneSauce)
router.put('/:id', auth, multer, saucesCtrl.modifySauce)
router.delete('/:id', auth, multer, saucesCtrl.deleteSauce)
router.post('/:id/like', auth, multer, saucesCtrl.likeOrDislikeSauce)

/* Export du routeur et de ses fonctions */
module.exports = router


