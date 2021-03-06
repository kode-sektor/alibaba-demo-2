const express = require('express')
const app = express()
const env = require('dotenv')
// const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

// routes
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin/auth')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')
const initialDataRoutes = require('./routes/admin/initialData')
const pageRoutes = require('./routes/admin/page')
const addressRoutes = require('./routes/address')
const orderRoutes = require("./routes/order")
const adminOrderRoute = require("./routes/admin/order.routes")


// environment variables / constants
env.config()

// mongodb connection
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex : true, 
    useFindAndModify: false 
}).then(() => {
    console.log('Database Connected')
})

app.use(cors())
// app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, 'uploads')))

app.use('/api', authRoutes) // 'api' must be in the URL to access it
app.use('/api/', adminRoutes)
app.use('/api/', categoryRoutes)
app.use('/api/', productRoutes)
app.use('/api/', cartRoutes)
app.use('/api/', initialDataRoutes)
app.use('/api/', pageRoutes)
app.use('/api/', addressRoutes)
app.use("/api", orderRoutes);
app.use("/api", adminOrderRoute);


const PORT = process.env.PORT || 2000;

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})