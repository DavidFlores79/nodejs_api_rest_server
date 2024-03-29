const userModel = require('../models/user.model')
const { verifyToken } = require('../helpers/jwt.helper')

const checkRoleAuth = ( roles ) => async (req, res, next) => {

    try {
       
        if(!req.headers.authorization) {
            return res.status(401).send({ errors: [{ msg: `No existe el Token de usuario.` }] })
        }
        const token = req.headers.authorization.split(' ').pop()
        const tokenData = await verifyToken (token)

        if(!tokenData) {
            return res.status(401).send({ errors: [{ msg: `Token no válido.` }] })
        }
        const userData = await userModel.findById(tokenData._id)

        if([].concat(roles).includes(userData.role)) {
            next()
        } else {
            res.status(401).send({ errors: [{ msg: `Perfil de Usuario No Autorizado.` }] })
            console.log(`Perfil ${userData.role} no autorizado para la ruta ${req.baseUrl} con el metodo ${req.method}`);
        }

    } catch (error) {
        res.status(500).send({
            errors: [{
                msg: 'Error al obtener el perfil del usuario.'
            }]
        })
        console.log(`Error al obtener el Perfil de Usuario para la ruta ${req.baseUrl} con el metodo ${req.method}. ${error}`);
    }

}

module.exports = checkRoleAuth