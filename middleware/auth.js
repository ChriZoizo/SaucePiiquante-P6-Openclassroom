const jwt = require('jsonwebtoken')

/* Middleware qui verifie le token du User connecté. Le token est extrais du header de la req.
NOTE

nous extrayons le token du header Authorization de la requête entrante. N'oubliez pas qu'il contiendra également le mot-clé Bearer . 
Nous utilisons donc la fonction split pour récupérer tout après l'espace dans le header. Les erreurs générées ici s'afficheront dans
 le bloc catch ;

nous utilisons ensuite la fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée ;

nous extrayons l'ID utilisateur de notre token ;

si la demande contient un ID utilisateur, nous le comparons à celui extrait du token. S'ils sont différents, nous générons une erreur ;

dans le cas contraire, tout fonctionne et notre utilisateur est authentifié. Nous passons l'exécution à l'aide de la fonction next() .
  */ 

/* Fonction permettant de verifier le token de l'utilisateur connecté.
Elle recupére le token dans le header de la requête, le decode et verifie sa validité 
puis le compare avec celui contenus dans la requête. Si ils sont identiques, la requetes n'est pas arretée.
Si ils sont differents, renvois une erreurs.
En cas d'erreurs lors de l'executions des instructions, renvoie une erreur 401 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1] /* recupere le token dans le header */
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET') /* enregistre le token decodé et verifié */
        const userId = decodedToken.userId /* recupere le 'userId' present dans le token */
        if (req.body.userId && req.body.userId !== userId) { /*compare le userId du token avec celui de la requête */
            throw 'Invalid UserI ID !' /* Si erreurs, renvoie un message */
        } else {
            next() /* Si ok, laisse poursuivre l'execution de la requete */
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request !')
        })
    }
}