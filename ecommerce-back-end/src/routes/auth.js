const express = require('express')
const router = express.Router()
const {signup, signin, requireSignin} = require('../controller/auth')
const {validateSignupRequest, isRequestValidated} = require('../validators/auth')


// Sign up route
router.post('/signup', validateSignupRequest, isRequestValidated, signup) 

router.post('/signin', signin)

module.exports = router