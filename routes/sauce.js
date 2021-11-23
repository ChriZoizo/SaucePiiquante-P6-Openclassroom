const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const saucesCtrl = require('../controller/sauce')

router.post('/', auth, multer, saucesCtrl.createSauce)
router.get('/', auth, saucesCtrl.getAllSauces)
router.get('/:id', auth, saucesCtrl.getOneSauce)
router.put('/:id', auth, multer, saucesCtrl.modifySauce)
router.delete('/:id', auth, multer, saucesCtrl.deleteSauce)
router.post('/:id/like', auth, multer, saucesCtrl.likeSauce)

module.exports = router
