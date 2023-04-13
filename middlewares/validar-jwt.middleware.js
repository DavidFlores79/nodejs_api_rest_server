const jwt = require('jsonwebtoken');
const { verifyToken } = require('../helpers/jwt.helper');
const userModel = require('../models/user.model');

const validarJWT = async (req, res, next) => {

    try {
        if(!req.headers.authorization) {
            return res.status(401).send({
                errors: [{
                    msg: 'No existe el token de usuario.'
                }]
            })
        }

        const token = req.headers.authorization.split(' ').pop()
        const tokenData = await verifyToken(token)

        if(!tokenData) {
            return res.status(401).send({
                errors: [{
                    msg: 'Token no válido.'
                }]
            })
        }

        usuario = await userModel.findById(tokenData._id)
        if(!usuario.status || usuario.deleted || !usuario) {
            console.log('Usuario Bloqueado. Sin Permisos');
            return res.status(401).send({
                errors: [{
                    msg: 'Usuario Bloqueado Sin Permisos.'
                }]
            })
        } else {
            next()
        }


    } catch (error) {

        res.status(401).send({
            errors: [{
                msg: 'Usuario No Autorizado.'
            }]
        })
        
    }


}


module.exports = { validarJWT }