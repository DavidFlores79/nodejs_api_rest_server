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
    const data = await new User({ name, email, password, role })
    
    try {

        //encriptar la contraseña
        const salt = bcrypt.genSaltSync()
        data.password = bcrypt.hashSync(password, salt)
        
        //guardar en la BD
        await data1.save()

        res.status(201).send({
            msg: 'Registro creado correctamente.',
            data
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            errors: [{
                msg: 'Error al guardar el registro'
            }]
        })
    }
}

updateData = async (req, res) => {
    const { id } = req.params
    const { _id, password, google, ...resto } = req.body

    try {

        if( password ) {
            //encriptar la contraseña
            const salt = bcrypt.genSaltSync()
            resto.password = bcrypt.hashSync(password, salt)
        }
        
        //guardar en la BD
        const data = await userModel.findByIdAndUpdate(id, resto, {
            new: true
        })
        res.send({
           msg: `Se ha actualizado el registro`,
           data
        });
        
    } catch (error) {   
        console.log(error);
        res.status(500).send({
            errors: [{
                msg: 'Error al actualizar el registro.'
            }]
        })
    }

}

deleteData = async (req, res) => {
    
    const { id } = req.params

    try {

        //guardar como eliminado en la BD
        const data = await userModel.findByIdAndUpdate(id, {
            status: false,
            deleted: true
        }, { new: true })
        res.send({
           msg: `Se ha eliminado el registro.`,
           data
        });        
    } catch (error) {   
        console.log(error);
        res.status(500).send({
            errors: [{
                msg: 'Error al eliminar el registro.'
            }]
        })
    }
}

module.exports = { getData, postData, updateData, deleteData }