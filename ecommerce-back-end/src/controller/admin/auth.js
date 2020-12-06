const User = require('../../models/user')
const jwt = require('jsonwebtoken')

// Signup
exports.signup = (req, res) => {

    // Check if user's mail exists in database.
    User.findOne({ email: req.body.email }).exec((error, user) => {

        if (error || user) {    // User exists, already registered
            console.log('error >>> ', error)
            console.log('user >>> ', user)
            return res.status(400).json({
                message: 'Admin already registered'
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
        const _user = new User({ 
                            firstName, 
                            lastName, 
                            email, 
                            password, 
                            userName: Math.random().toString(), 
                            role : 'admin' 
                        })    // Save to db
        
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
                    user : data,
                    message : 'Admin created successfully!'
                })
            }
        })
    })
}

// Sign in
exports.signin = (req, res) => {
    // Does email exist in DB?
    User.findOne({ email: req.body.email }).exec((error, user) => { 
        if (error) return res.status(400).json({ error })
        
        // console.log("user >>> ", user)
        // { role: 'admin',
        //     _id: 5fb88125f588df58cc2c630a,
        //     firstName: 'Kayode',
        //     lastName: 'Ibiyemi',
        //     email: 'kodesektor@gmail.com',
        //     hash_password:
        //     '$2b$10$MPGck8yk7Ha.VA3c82cOYuIygy9lMJY/P4umVT1yhh7xSFUXohvue',
        //     userName: '0.9960356620833897',
        //     createdAt: 2020-11-21T02:53:25.235Z,
        //     updatedAt: 2020-11-21T02:53:25.235Z,
        //     __v: 0 
        // }

        if (user) {
            console.log("password >>> : ", req.body.password)
            // authenticate() method is from the model
            // Does password exist and is user admin?
            if (user.authenticate(req.body.password) && user.role === 'admin') {
                const token = jwt.sign(
                    { _id: user.id, role: user.role }, 
                    process.env.JWT_SECRET, { expiresIn: '1h' }
                )
                const { _id, firstName, lastName, email, role, fullName } = user
                res.cookie('token', token, {expiresIn : '1h'})
                
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

// Sign out
exports.signout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
      message: "Signed out successfully!..."
    });
};