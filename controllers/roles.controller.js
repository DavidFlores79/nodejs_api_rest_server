const roleModel = require('../models/role.model')
const Role = require('../models/role.model')

getData = async (req, res) => {

    const { limite = 0, desde= 0 } = req.query

    const data = await Role.find({ deleted: false, status: true })
            .limit(limite)
            .skip(desde)

    res.send({
        total: data.length,
        data
    })

}

postData = async (req, res) => {

    const { name, status } = req.body
    const role = new Role({ name, status })
    
    try {

        //validar si existe el rol
        const roleExist = await Role.findOne({ name })
        if( roleExist) {
            return res.status(400).send({
                message: 'El rol ya esta registrado.'
            })
        }
           
        //guardar en la BD
        await role.save()

        res.status(201).send({
            message: 'Registro creado correctamente.',
            role
        });
        
    } catch (error) {   
        console.log(error);
        res.status(500).send({
            message: 'Error al guardar el registro',
            error: error
        })
    }
}

updateData = async (req, res) => {
    const { id } = req.params
    const { _id, ...resto } = req.body

    try {
       
        //guardar en la BD
        const data = await roleModel.findByIdAndUpdate(id, resto, {
            new: true
        })
        res.send({
           message: `Se ha actualizado el registro`,
           data
        });
        
    } catch (error) {   
        console.log(error);
        res.status(500).send({
            message: 'Error al actualizar el registro',
            error: error
        })
    }

}

deleteData = async (req, res) => {
    
    const { id } = req.params

    try {
        //guardar como eliminado en la BD
        const data = await Role.findByIdAndUpdate(id, {
            status: false,
            deleted: true
        }, { new: true })
        res.send({
           message: `Se ha eliminado el registro.`,
           data
        });        
    } catch (error) {   
        console.log(error);
        res.status(500).send({
            message: 'Error al eliminar el registro',
            error: error
        })
    }
}

module.exports = { getData, postData, updateData, deleteData }