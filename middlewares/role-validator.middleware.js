const userModel = require('../models/user.model')
const { verifyToken } = require('../helpers/jwt.helper')

const checkRoleAuth = ( roles ) => async (req, res, next) => {

    try {
       
        if(!req.headers.authorization) {
            return res.status(401).send({message: 'No existe el token del Usuario'})
        }
        const token = req.headers.authorization.split(' ').pop()
        const tokenData = await verifyToken (token)

        if(!tokenData) {
            return res.status(401).send({message: 'Token no válido. **'})
        }
        const userData = await userModel.findById(tokenData._id)

        if([].concat(roles).includes(userData.role)) {
            next()
        } else {
            res.status(401).send({message: 'Perfil de Usuario No Autorizado'})
            console.log(`Perfil ${userData.role} no autorizado para la ruta ${req.baseUrl} con el metodo ${req.method}`);
        }

    } catch (error) {
        res.status(500).send({message: 'Error al obtener el Perfil de Usuario'})
        console.log(`Error al obtener el Perfil de Usuario para la ruta ${req.baseUrl} con el metodo ${req.method}. ${error}`);
    }

}

module.exports = checkRoleAuth