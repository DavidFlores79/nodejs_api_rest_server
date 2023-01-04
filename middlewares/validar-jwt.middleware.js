const jwt = require('jsonwebtoken');
const { verifyToken } = require('../helpers/jwt.helper');
const userModel = require('../models/user.model');

const validarJWT = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ').pop()
        const tokenData = await verifyToken(token)

        if(tokenData._id) {

            usuario = await userModel.findById(tokenData._id)
            if(!usuario.status || usuario.deleted || !usuario) {
                res.status(401).send({ message: 'Usuario Bloqueado. Sin Permisos' })
                console.log('Usuario Bloqueado. Sin Permisos');
            } else {
                next()
            }

        } else {
            res.status(401).send({ message: 'Usuario no autorizado' })
        }

    } catch (error) {

        res.status(401).send({ message: 'Usuario no autorizado' })
        
    }


}


module.exports = { validarJWT }