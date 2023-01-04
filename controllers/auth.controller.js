const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt.helper');
const userModel = require("../models/user.model");

login = async (req, res) => {

    const { email, password } = req.body

    try {

        const user = await userModel.findOne({ email })

        if(!user) {
            res.status(400).send({
                message: 'Usuario/Password no son correctos - correo'
            })
        }

        if(!user.status) {
            res.status(400).send({
                message: 'Usuario bloqueado - status'
            })
        }

        const validPassword = bcryptjs.compareSync( password, user.password )
        if(!validPassword) {
            res.status(400).send({
                message: 'Usuario/Password no son correctos - pass'
            })
        }

        //generar el JWT
        const jwt = await generarJWT(user)
        console.log(`${user.name} se ha logueado correctamente!`);

        res.send({
            message: 'login correcto',
            user,
            jwt,
            
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: 'Error en el login!',
            error: error
        })
    }


}

module.exports = { login }