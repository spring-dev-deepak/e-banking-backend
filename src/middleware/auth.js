const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try{
        const token = await req.header('Authorization').replace('Bearer ', '')
        const verify = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(verify._id)
        if(!user){
            throw new Error()
        }
        req.user = user
        next()
    }catch(e){
        res.status(401).send({ error: 'Unauthorized' })
    }
}

module.exports = auth