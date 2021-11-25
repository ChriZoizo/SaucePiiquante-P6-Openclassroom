/* Importation des modules */
const Sauce = require('../models/sauce')
const fs = require('fs')

/* Fonction qui renvoie tout les sauces de la BDD */
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }))
}

/* Fonction qui renvoie une seul sauce de la BDD via son ID */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
}

/* Fonction pour créer 'sauce'. 
recupere dans le corps de la requete l'objet 'sauce' et le parse puis créer un nouvel objet 'Sauce' avec
le schema 'sauce'. Lors de la création, definis l'url de l'image grace a "Multer" et/ou "Path"     (!!!!!!!!!!!!)
et initialise les champs-compteur et tableaux de likes/dislikes*/
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  /*   delete sauceObject._id */
  /* Création de l'objet Sauce */
  const sauce = new Sauce({
    ...sauceObject,
    /* definition de l'url de l'image */
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    /* declaration des compteurs et tableaux de likes/dislikes */
    likes: 0,
    dislikes: 0,
    usersLiked: '',
    usersDisliked: ''
  })
  /* Sauvegarde de l'objet créé en base de données */
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }))
}

/* fonction pour modifier une sauce. Si une image est detecté dans la requête, efface l'ancienne image du dossier statique,
parametre un nouvel 'imageUrl' en fonction du nouveau fichier puis modifie les modifications via 'updateOne()'.
Sinon sauvegarde la modification le body de la requête tel quel via 'updateOne'.*/
exports.modifySauce = (req, res, next) => {
  let newSauce = {} /* Variable qui contiendras l'objet a sauvegarder */
  /* Si la requete contiens un fichier */
  if (req.file) {
    /* Nouvel Objet a partir du corp de requete  et 'imageUrl' definis en fonctions du noms de fichier */
    newSauce = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`
    }
    /* Puis on cherche l'objet initial dans la BDD pour effecaer l'image 'lié' du dossier statique */
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const fileName = sauce.imageUrl.split('/images/')[1] /* recupere le nom original du fichier image */
        fs.unlink('images/' + fileName, function () {}) /* Efface le fichier */
      })
      .catch(error => res.status(500).json({ error }))
  } else {
    /* Si pas d'image dans la requete */
    newSauce = { ...req.body } /* Assigne le body tel quel */
  }
  /* Enregistre les modifications */
  Sauce.updateOne({ _id: req.params.id }, { ...newSauce, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }))
}


exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const fileName = sauce.imageUrl.split('/images/')[1]
      fs.unlink('images/' + fileName, function () {
        Sauce.deleteOne({ _id: sauce.id })
          .then(() => res.status(200).json({ message: 'Sauce Supprimé !' }))
          .catch(error => res.status(400).json({ error }))
      })
    })
    .catch(error => res.status(500).json({ error }))
}

exports.likeOrDislikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (req.body.like == 1) {
        if (!sauce.usersLiked.includes(req.body.userId)) {
          sauce.likes = sauce.likes + 1
          sauce.usersLiked.push(req.body.userId)
        }
      }

      if (req.body.like == -1) {
        if (!sauce.usersDisliked.includes(req.body.userId)) {
          sauce.dislikes = sauce.dislikes + 1
          sauce.usersDisliked.push(req.body.userId)
        }
      }

      if (req.body.like == 0) {
        if (sauce.usersLiked.includes(req.body.userId)) {
          sauce.likes = sauce.likes - 1
          let index = sauce.usersLiked.indexOf(req.body.userId)
          sauce.usersLiked.splice(index, 1)
        }
        if (sauce.usersDisliked.includes(req.body.userId)) {
          sauce.dislikes = sauce.dislikes - 1
          let index = sauce.usersDisliked.indexOf(req.body.userId)
          sauce.usersDisliked.splice(index, 1)
        }
      }

      sauce.save()

      res.status(200).json({ message: 'Updated ! ' })
    })

    .catch(error => res.status(500).json({ error }))
}
