const express = require('express')
const app = express()
const env = require('dotenv')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// routes
const authRoutes = require('./routes/auth')

// environment variables / constants
env.config()

// mongodb connection
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true }).then(() => {
    console.log('Database Connected')
})

app.use(bodyParser.urlencoded({extended:false}))

app.use('/api', authRoutes)

const PORT = process.env.PORT || 2000;

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})