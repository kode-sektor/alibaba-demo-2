const express = require('express')
const app = express()
const env = require('dotenv')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

env.config()

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Database Connected')
})

app.use(bodyParser.urlencoded({extended:false}))

app.get('/', (req, res, next) => {
    res.status(200).json({
        message : 'Hello from server'
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})