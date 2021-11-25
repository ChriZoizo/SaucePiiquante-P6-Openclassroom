const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator') /* permet de verifier l'unicité d'une entrée */

/* Schema des objets 'user' dans la collections 'User' */
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true  },
    password : { type : String, required: true}
})
userSchema.plugin(uniqueValidator)

/* Exportations du schema */
module.exports = mongoose.model('User', userSchema)