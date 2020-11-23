
// Protected (admin) route
exports.requireSignin = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    console.log('TOKEN >>>', token)
    
    const user = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user
    console.log(token)
    next()
}

