const User = required('../models/user')

exports.createUser = (req, res, next) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    })
    user.save().then(
        () => {
            res.status(201).json({message: 'User account created and saved successfully'})
        }
    )
}