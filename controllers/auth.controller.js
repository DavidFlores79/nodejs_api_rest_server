const bcryptjs = require('bcryptjs');
const { googleVerifyToken } = require('../helpers/google-auth.helper');
const { generarJWT } = require('../helpers/jwt.helper');
const userModel = require("../models/user.model");

const login = async (req, res) => {

    const { email, password } = req.body

    try {

        const user = await userModel.findOne({ email })

        if(!user) {
            res.status(400).send({
                message: 'Usuario/Password no son correctos - correo'
            })
        }

        if(!user.status) {
            res.status(401).send({
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
            errors: [{
                msg: 'Error en el login'
            }]
        })
    }


}

const googleSignIn = async(req, res) => {


    const { id_token } = req.body

    try {
        const { name, image, email } = await googleVerifyToken( id_token )
        
        const user = await userModel.findOne({ email })

        if(!user) {

            const data = {
                name,
                email,
                image,
                password: ':PPPPP',
                google: true,
            }

            console.log(data);

            const newUser = new userModel( data )
            await newUser.save()
            res.send({
                message: 'Google SignIn Correcto. Usuario creado',
                newUser
            })
        }

        if(!user.status) {
            res.status(401).send({
                message: 'Usuario Bloqueado, favor de validar',
            })
        }


        //guardar en la BD
        const userUpdated = await userModel.findOneAndUpdate({email}, {name, email, image}, {
            new: true
        })
    
        //generar el JWT
        const jwt = await generarJWT(userUpdated)
        console.log(`${userUpdated.name} se ha logueado correctamente con Google SignIn!`);

        res.send({
            message: 'login correcto',
            user,
            jwt,
            
        })


    } catch (error) {
        console.log(error);
        return res.status(401).send({
            errors: [{
                msg: 'Error en Google SignIn!'
            }]
        })
        
    }

}

module.exports = { login, googleSignIn }