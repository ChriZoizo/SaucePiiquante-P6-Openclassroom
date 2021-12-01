/* Fichier de configuration de "Multer" pour les images */
const multer = require('multer')

const MIME_TYPES = {
    'images/jpg': 'jpg',
    'images/jpeg': 'jpeg',
    'images/png': 'png'
}

/* Fonction permettant de definir le lieux de stockage et le nom des images uploader dans la BDD 
Le nom des images est composé du nom d'origine (les ' ' remplacés par des '_') + de la date
via 'Date.now()'*/
const storage = multer.diskStorage({

    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_')
        callback(null, name + Date.now() + '.')
    }
})

/* exportation des fonctions 
Contenant aussi la fonction pour enregistrer l'image dans le dossier images*/
module.exports = multer({storage: storage}).single('image')