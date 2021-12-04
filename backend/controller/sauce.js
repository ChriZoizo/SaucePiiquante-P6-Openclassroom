/* Importation des modules */
const Sauce = require('../models/sauce')
const fs = require('fs')
const jwt = require('jsonwebtoken')

/* Fonction qui renvoie tout les sauces de la BDD */
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }))
}

/* Fonction qui renvoie une seul sauce de la BDD via son ID 
> request params = 
{id: String}
  */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
}

/* Fonction pour créer 'sauce'. 
Recupere dans le corps de la requete l'objet 'sauce' et le parse, puis créer un nouvel objet 'Sauce' avec
le schema 'sauce'. Lors de la création, definis l'url de l'image grace a "Multer" et/ou "Path" (?! voir avec Raoul))
et initialise les valeur-compteur et tableaux de likes/dislikes 
> request body = {
name = String,
manufacturer = String,
descritpion = String,
mainpepper = String,
heat = Number,
userId = String}
request file = {
  fichier image
}
  */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  /* Création de l'objet Sauce */
  const sauce = new Sauce({
    ...sauceObject,
    /* definition de l'url de l'image */
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    /* definition des compteurs et tableaux de likes/dislikes */
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

/* fonction pour modifier une sauce , verifie aussi la concordance des 'userId'
cherche la sauce via son ID:
  -SI le 'userId' present dans le token d'authentification est le meme que celui de la sauce a modifié
    -Si une image est detecté dans la requête, efface l'ancienne image du dossier statique,
parametre un nouvel 'imageUrl' en fonction du nouveau fichier puis modifie les modifications via 'updateOne()'.
    -Sinon sauvegarde la modification le body de la requête tel quel via 'updateOne'.
  -SINON renvoie une erreur 403 avec un message
> request params = { id = String}
> request body = {
name = String,
manufacturer = String,
descritpion = String,
mainpepper = String,
heat = Number,
userId = String}
request file = {
  fichier image
}*/
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) /* Cherche la sauce via l'id present dans les params de la requete */
    .then(sauce => {  
      const token = req.headers.authorization.split(' ')[1] /* Recupere le token d'auth present dans le header de la req */
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET') /* decode et verifie l'integrité du token et enregistre l'objet retourné */
      const userId = decodedToken.userId /* recupere le userID de l'objet JSON retourné par verify() */
      /* SI le userID du token est identique au "userID" du createur de la sauce, execute le code */
      if (sauce.userId == userId) {
        console.log(req)
        let newSauce = {} /* Variable qui contiendras l'objet a sauvegarder */
        /* Si la requete contiens un fichier image */
        if (req.file) {
          /* enregistre le corp de requete,  et 'imageUrl' redefinis en fonctions du noms de fichier */
          newSauce = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${
              req.file.filename
            }`
          }
          /* Cherche l'objet initial dans la BDD pour effacer l'image 'lié' du dossier statique */

          const fileName = sauce.imageUrl.split(
            '/images/'
          )[1] /* recupere le nom original du fichier image */
          fs.unlink(
            'images/' + fileName,
            function () {}
          ) /* Efface le fichier */
        } else {
          /* Si pas d'image dans la requete */
          newSauce = { ...req.body } /* Assigne le body tel quel */
        }
        /* Enregistre les modifications */
        Sauce.updateOne(
          { _id: req.params.id },
          { ...newSauce, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'Sauce modifiée !' })) /* requete resolus */
          .catch(error => res.status(400).json({ error })) /* message en cas d'erreur */
          /* Si le 'userID' du token n'est aps celui du createur de la sauce */
      } else {
        res.status(403).json({ message: '403: unauthorized request' }) /* renvoie un erreur 403 et un message specifique */
      }
    })
    .catch(error => res.status(500).json({ error })) /* en cas d'erreur serveur et/ou BDD */
}
/* Fonction pour effacer une 'sauce' via son '_id'.
l'id recherché est recuperer dans les params de la requête. Si une correspoondance dans la BDD est trouvé,
délie puis efface l'image de la 'sauce' puis, via la methode 'deleteOne', efface l'objet de la BDD
> request params = { id = String}*/
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) /* recherche avec l'id du req.params */
    .then(sauce => {
      /* Recupere le nom original du fichier images joint */
      const fileName = sauce.imageUrl.split('/images/')[1]
      /* Suppression de l'image du dossier statique */
      fs.unlink('images/' + fileName, function () {
        /* Suppression de la 'sauce' de la BDD (Promise)*/
        Sauce.deleteOne({ _id: sauce.id })
          .then(() =>
            res.status(200).json({ message: 'Sauce Supprimé !' })
          ) /* Element 'sauce' supprimé */
          .catch(error => res.status(400).json({ error }))
      })
    })
    .catch(error => res.status(500).json({ error }))
}

/* Fonction pour liké/disliké les 'sauces'.
Recherche la sauce concerné via un '_id' recuperé des params de la requête. Le cas échéant,
analyse la valeur 'like' du body de la requête.
-Si 1 : verifie que le 'userId' n'est pas deja inscrit dans le tableau 'userLiked', si absent, augmente la valeur 'like' 
de la sauce de 1 et ajoute le 'userId' dans le tableau concerné.
-Si -1 : verifie que le 'userId' n'est pas deja inscrit dans le tableau 'userDisliked' , si absent, augmente la valeur 'dislike' 
de la sauce de 1 et ajoute le 'userId' dans le tableau concerné.
-Si 0: Verifie dans quel tableau le 'userId' est inscrit. Une fois trouvé, efface le 'userId' puis ajuste la valeur 'like' de la sauce en consequence.
>>> !!! Les verifications d'inscription dans les tableaux sont superflu car le frontend empeche deja certaines erreurs. Neanmoins, par soucis
de securité, des verification du controlleur ont ete implémentés !!! <<<
> request params = { id = String}
> request body = { 
  like = Number
  userId = String}
*/
exports.likeOrDislikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) /* recherche la 'sauce' */
    .then(sauce => {
      /* Si like = 1 et que 'userId' est dans le tableau 'userLiked'*/
      if (req.body.like == 1) {
        if (!sauce.usersLiked.includes(req.body.userId)) {
          /* augmente la valeur de 'likes' de la 'sauce' de 1 */
          sauce.likes = sauce.likes + 1
          /* enregistre le 'userId' dans le tableur 'userLiked' */
          sauce.usersLiked.push(req.body.userId)
        }
      }
      /* Si like = -1 et que 'userId' est dans le tableau 'userDisliked'*/
      if (req.body.like == -1) {
        if (!sauce.usersDisliked.includes(req.body.userId)) {
          /* augmente la valeur de 'dislikes' de la 'sauce' de 1 */
          sauce.dislikes = sauce.dislikes + 1
          /* enregistre le 'userId' dans le tableur 'userDisliked' */
          sauce.usersDisliked.push(req.body.userId)
        }
      }
      /* Si like = 0 */
      if (req.body.like == 0) {
        /* si le userId est dans le tableau 'userLiker' */
        if (sauce.usersLiked.includes(req.body.userId)) {
          sauce.likes = sauce.likes - 1 /* Ajuste la valeur 'like'*/
          let index = sauce.usersLiked.indexOf(
            req.body.userId
          ) /* Cherche l'index du userId dans le tableau */
          sauce.usersLiked.splice(index, 1) /* Efface le 'userId' */
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
