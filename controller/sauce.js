/* 'use strict'; */

const Sauce = require('../models/sauce')
const fs = require('fs')
/* Fonction qui renvoie tout les sauces de la BDD */
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
}

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  /*   delete sauceObject._id */
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: '',
    usersDisliked: ''
  })
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }))
}

/* fonction pour modifier une sauce. Si une image est detecté dans la requête, celui ci est effacé via "js.unlink()"
et la assigne le body de la requete avec une valeur 'imageUrl' modifiée avec la nouvelle image. 
Sinon assigne le body de la requête tel quel.
Puis sauvegarde la modification via 'updateOne' en passant la variable 'newSauce' dans l'objet en second parametre*/
exports.modifySauce = (req, res, next) => {
  let newSauce = {} /* Variable qui contiendras l'objet a sauvegarder */
  if (req.file) {
    /* Si la requete contiens un fichier */
    newSauce = { /* On recupere le body de la requpete, on le parse et on modifie la valeur d''imageUrl'  */
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`
    }
    /* Puis on cherche l'objet initial dans la BDD pour effecaer l'image 'lié' */
    Sauce.findOne({ _id: req.params.id }) 
      .then(sauce => {
        const fileName = sauce.imageUrl.split('/images/')[1]
        fs.unlink('images/' + fileName, function () {}) /* Efface le fichier */
      })
      .catch(error => res.status(500).json({ error }))
  } else { /* Si pas d'image dans la requete */
    newSauce = { ...req.body } /* Assigne le body en entier */
  }
  /* Modification de la sauce */
  Sauce.updateOne({ _id: req.params.id }, { ...newSauce, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => {
    const fileName = sauce.imageUrl.split('/images/')[1]
    fs.unlink('images/' + fileName, function() {
      Sauce.deleteOne({ _id: sauce.id})
      .then(() => res.status(200).json({ message : "Sauce Supprimé !"}))
      .catch(error => res.status(400).json({ error}))
    })
  })
}

exports.likeSauce = (req, res, next) => {}
