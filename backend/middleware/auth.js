const jwt = require('jsonwebtoken')



/* Midlleware permettant de verifier le token de l'utilisateur connecté.
Elle recupére le token dans le header de la requête, le decode et verifie sa validité 
puis le compare avec celui contenus dans la requête. Si ils sont identiques, la requetes n'est pas arretée.
Si ils sont differents, renvois une erreurs.
En cas d'erreurs lors de l'executions des instructions, renvoie une erreur 401 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1] /* recupere le token dans le header (ne recupere pas "bearer") */
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET') /* enregistre le token decodé et verifié */
        const userId = decodedToken.userId /* recupere le 'userId' present dans le token */
        if (req.body.userId && req.body.userId !== userId) { /*compare le userId du token avec celui de la requête */
            throw 'Invalid UserID !' /* Si erreurs, renvoie un message */
        } else {
            next() /* Si ok, laisse poursuivre l'execution de la requete */
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request !')
        })
    }
}