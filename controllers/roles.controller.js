const Role = require('../models/role.model')

getData = (req, res) => {

    res.send({
        message: 'Todos los registros',
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
        res.status(400).send({
            message: 'Error al guardar el registro',
            error: error
        })
    }
}

updateData = (req, res) => {
    const { id } = req.params
    res.send({
       message: `Se ha actualizado el registro ${id}`,
    });
}

deleteData = (req, res) => {
    
    const { id } = req.params
    res.send({
       message: `Se ha eliminado el registro ${id}`,
    });
}

module.exports = { getData, postData, updateData, deleteData }