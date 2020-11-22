const {check, validationResult} = require('express-validator')     // Form validation

exports.validateSignupRequest = [
    check('firstName')
    .notEmpty()
    .withMessage('First name is required'),
    check('lastName')
    .notEmpty()
    .withMessage('Last name is required'),
    //check('lastName'),
    check('email')
    .isEmail()
    .withMessage('Valid email is required'),
    check('password')
    .isLength({min : 6})
    .withMessage('Password msut be at least 6 characters long')
]

exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req)

    if (errors.array().length > 0) {
        return res.status(400).json({error : errors.array()[0].msg})
    }
    next()
}
