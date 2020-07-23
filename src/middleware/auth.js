const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Cookies = require('cookies')

const auth = async (req,res,next) => {
    try {
        var cookies = new Cookies(req, res)
        const token = cookies.get('token')
        const decoded = jwt.verify(token, 'tictactoegame')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()

    } catch(e) {
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth