const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    // password : {
    //     type : String,
    //     required : true
    // },
    hash_password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    contactNumber: { type: String },
    profilePicture: { type: String }
    
}, { timestamps: true })

// Ensure 'password' is not part of the schema. 
// userSchema.virtual('password').set(function (password) {
//     this.hash_password = bcrypt.hashSync(password, 10)
// })

// Firstname plus lastname
userSchema.virtual('fullName').get(function (){
    return `${this.firstName} ${this.lastName}`
})

userSchema.methods = {
    authenticate : async function (password) {
        // return bcrypt.compareSync(password, this.hash_password)
        return await bcrypt.compare(password, this.hash_password)
    }
}

module.exports = mongoose.model('User', userSchema)
