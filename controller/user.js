const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


/* Fonction 'signup', si l'utilisateur renseigne un email valide (unique) et un mots de passe
, le mots de passe est hashé via 'bcrypt' et un nouvel objet est créé puis sauvegarder dans la BDD. 
Si le resultat est negatif, renvoie une erreur
*/
exports.signup = (req, res, next) => {
  bcrypt /* hashage du mots de passe - Promise */
    .hash(req.body.password, 10)
    .then(hash => {
      const user = new User({ /*creation de l'objet JSON 'user'*/
        email: req.body.email,
        password: hash
      })
      user
        .save() /* Sauvegarde dans la BDD */
        .then(() =>
          res.status(201).json({ message: 'Utilisateur créé avec succés ! ' })
        )
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}

/* Fonction 'login', elle recherche dans la BDD l'utilisateur via son email. Le cas echeant, utilise la fonction
'compare' de "bcrypt" pour comparer le hash enregistré dans la BDD avec celui que l'utilisateur a entré. 
Si le resultats est positif (true), envoie un objet contenant l''_id' de l'utilisateur ainsi qu'un token sur la base de l'id
de l'utilisaateur via "jws"

Si le resultat est negatif, renvoie une erreur
*/
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email})/*  Recherche dans la BDD l'utilisateur */
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: "Utilisateur introuvable !"})
        }
        bcrypt.compare(req.body.password, user.password)  /* Comparaison des hash*/
        .then(valid =>{
            if (!valid){
                return res.status(401).json({ error: 'Mot de passe incorrect !'})
            }
            res.status(200).json({
                userId: user._id, 
                token: jwt.sign(
                    { userId : user._id }, 
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn : '24h'}
                )
            }) /* Création de l'objet JSON contenant l'_id et le token généré */
        })
        .catch(error => res.status(500).json({ error}))
    })
    .catch(error => res.status(500).json({ error}))
}


/* exports.indexer = (req, res, index) =>{
    User.find()
    .then((users) => res.status(200).json(users))
    .catch(error => res.status(400).json({error }))
} */
