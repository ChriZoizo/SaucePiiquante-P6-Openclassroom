const multer = require('multer')

const MIME_TYPES = {
    'images/jpg': 'jpg',
    'images/jpeg': 'jpeg',
    'images/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_')
        callback(null, name + Date.now() + '.')
    }
})

module.exports = multer({storage: storage}).single('image')