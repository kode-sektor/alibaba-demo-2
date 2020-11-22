const express = require('express')
const router = express.Router()

const User = require('../../models/user')
const {signup, signin, requireSignin} = require('../../controller/admin/auth')

const {validateSignupRequest, isRequestValidated} = require('../../validators/auth') // Validate


router.post('/admin/signup', validateSignupRequest, isRequestValidated, signup) 
router.post('/admin/signin', signin)
// router.post('/profile', requireSignin, (req, res) => {
//     res.status(200).json({
//         user : 'profile'
//     })
// })

module.exports = router