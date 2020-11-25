const express = require('express')
const app = express()
const env = require('dotenv')
// const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

// routes
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin/auth')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')

// environment variables / constants
env.config()

// mongodb connection
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true }).then(() => {
    console.log('Database Connected')
})

// app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, 'uploads')))

app.use('/api', authRoutes) // 'api' must be in the URL to access it
app.use('/api/', adminRoutes)
app.use('/api/', categoryRoutes)
app.use('/api/', productRoutes)
app.use('/api/', cartRoutes)

const PORT = process.env.PORT || 2000;

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})