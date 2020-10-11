const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    accountNumber: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(value.toString().length > 10 || value.toString().length < 10){
                throw new Error('Account Number not valid')
            }
        }
    },
    gender: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!value.toLowerCase().match(/\b(male|female)\b/)){
                throw new Error('Gender not accepted')
            }
        }
    },
    bank: {
        type: String,
        required: false,
        default: 'City Bank'
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        trim: true,
        validate(value){
            if(value.toString().length > 10 || value.toString().length < 10){
                throw new Error('PhoneNumber not valid')
            }
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },
    age: {
        type: Number,
        required: true,
        trim: true,
        maxlength: 3,
        validate(value){
            if(value <= 0 || value >= 150){
                throw new Error('Age not valid')
            }
        }
    },
    dateofbirth: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    postalcode: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isPostalCode(value, 'IN')){
                throw new Error('Postal code out of India')
            }
        }
    }
},{
    timestamps: true
})

userSchema.methods.generateAuthToken = function (next) {
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN })
    return token
}

userSchema.statics.findUserByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user){
        throw new Error('Login failed')
    }
    const isVerified = await bcrypt.compare(password, user.password)
    if(!isVerified){
        throw new Error('Login failed')
    }
    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User