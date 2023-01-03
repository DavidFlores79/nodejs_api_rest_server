const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const userModel = require('../models/user.model')

getData = async (req, res) => {

    const { limite = 0, desde= 0 } = req.query

    const data = await userModel.find({ deleted: false })
            .limit(limite)
            .skip(desde)

    res.send({
        total: data.length,
        data
    })

}

postData = async (req, res) => {

    const { name, email, password, role } = req.body
    const data = new User({ name, email, password, role })
    
    try {

        //encriptar la contraseña
        const salt = bcrypt.genSaltSync()
        data.password = bcrypt.hashSync(password, salt)
        
        //guardar en la BD
        await data.save()

        res.status(201).send({
            message: 'Registro creado correctamente.',
            data
        });
        
    } catch (error) {   
        console.log(error);
        res.status(400).send({
            message: 'Error al guardar el registro',
            error: error
        })
    }
}

updateData = async (req, res) => {
    const { id } = req.params
    const { _id, password, google, email, ...resto } = req.body

    try {

        if( password ) {
            //encriptar la contraseña
            const salt = bcrypt.genSaltSync()
            resto.password = bcrypt.hashSync(password, salt)
        }
        
        //guardar en la BD
        const data = await userModel.findByIdAndUpdate(id, resto)
        res.send({
           message: `Se ha actualizado el registro`,
           data
        });
        
    } catch (error) {   
        console.log(error);
        res.status(400).send({
            message: 'Error al actualizar el registro',
            error: error
        })
    }

}

deleteData = async (req, res) => {
    
    const { id } = req.params

    try {
        //guardar como eliminado en la BD
        const data = await userModel.findByIdAndUpdate(id, {
            deleted: true
        })
        res.send({
           message: `Se ha eliminado el registro.`,
           data
        });        
    } catch (error) {   
        console.log(error);
        res.status(400).send({
            message: 'Error al eliminar el registro',
            error: error
        })
    }
}

module.exports = { getData, postData, updateData, deleteData }