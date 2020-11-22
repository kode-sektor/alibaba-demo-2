const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')     // Form validation

// Signup
exports.signup = (req, res) => {

    // Check if user's mail exists in database.
    User.findOne({ email: req.body.email }).exec((error, user) => {

        if (error || user) {    // User exists, already registered
            console.log('error >>> ', error)
            console.log('user >>> ', user)
            return res.status(400).json({
                message: 'User already registered'
            })
        }
       
        const {
            firstName,
            lastName,
            email,
            password
        } = req.body

        // console.log('body >>> ', req.body)
        // console.log(firstName, lastName, email, password)

        // User does not exist, save User to database
        const _user = new User({ firstName, lastName, email, password, userName: Math.random().toString(), role : 'admin' })    // Save to db
        
        _user.save((error, data) => {
            console.log("error >>> ", error)
            if (error) {
                console.log('sth went wrong')
                return res.status(400).json({
                    message: 'Something went wrong'
                })
            }
            if (data) { // If data saved to MongoDB, return the object for view in Postman
                return res.status(201).json({
                    //user : data
                    message : 'User created successfully!'
                })
            }
        })
    })

}

// Sign in
exports.signin = (req, res) => {
    User.findOne({ email: req.body.email }).exec((error, user) => { // Does email exist?
        if (error) return res.status(400).json({ error })
        
        if (user) {
            // authenticate() method is from the model
            if (user.authenticate(req.body.password) && user.role === 'admin') { // Does password exist and is user admin?
                const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
                const { _id, firstName, lastName, email, role, fullName } = user
                
                res.status(200).json({
                    token, 
                    user: {
                        _id, firstName, lastName, email, role, fullName
                    }
                }) 
            } else {
                return res.status(400).json({
                    message : 'Invalid password'
                })
            }
        } else {
            return res.status(400).json({message : 'Something went wrong'})
        }
    })
} 

// Protected (admin) route
exports.requireSignin = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    console.log('TOKEN >>>', token)
    
    const user = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user
    console.log(token)
    next()
}