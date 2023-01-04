const jwt = require('jsonwebtoken');
const { verifyToken } = require('../helpers/jwt.helper');

const validarJWT = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ').pop()
        const tokenData = await verifyToken(token)

        if(tokenData._id) {
            next()
        } else {
            res.status(401)
            res.send({success: false, message: 'Usuario no autorizado'})
        }

    } catch (error) {

        res.status(401)
        res.send({success: false, message: 'Usuario no autorizado'})
        
    }


}


module.exports = { validarJWT }