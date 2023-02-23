const { verifyToken } = require('../helpers/jwt.helper')
const productModel = require('../models/product.model')
const userModel = require('../models/user.model')

getData = async (req, res) => {

    const { limite = 0, desde= 0 } = req.query

    const data = await productModel.find({ deleted: false, status: true })
            .populate('user_id', ['name', 'email'])
            .populate('category')
            .limit(limite)
            .skip(desde)

    res.send({
        total: data.length,
        data
    })

}

postData = async (req, res) => {

    const { name, category, status, available  } = req.body
    let NAME = name.toUpperCase()
    const product = await new productModel({ name: NAME, category: category, status: status, available }).populate('category')
    
    try {

        //validar si existe el registro
        const productExist = await productModel.findOne({ name: NAME })
        if( productExist) {
            return res.status(400).send({
                message: 'El nombre ya esta registrado.'
            })
        }
        
        //extraer usuario logueado del token
        const token = req.headers.authorization.split(' ').pop()
        const tokenData = await verifyToken(token)

        if(!tokenData) {
            return res.status(401).send({message: 'Token no válido. *'})
        }
    
        usuario = await userModel.findById(tokenData._id)
        if(!usuario.status || usuario.deleted || !usuario) {
            res.status(401).send({ message: 'Usuario Bloqueado. Sin Permisos' })
            console.log('Usuario Bloqueado. Sin Permisos');
        } else {

            //id del usuario logueado
            product.user_id = tokenData._id 
            //console.log(product);

            //guardar en la BD
            await product.save()
        }    

        res.status(201).send({
            message: 'Registro creado correctamente.',
            product
        });
        
    } catch (error) {   
        console.log(error);
        res.status(500).send({
            message: 'Error al guardar el registro',
            error
        })
    }
}

updateData = async (req, res) => {
    const { id } = req.params
    const { _id, ...resto } = req.body

    try {
       
        //guardar en la BD
        const data = await productModel.findByIdAndUpdate(id, resto, {
            new: true
        }).populate('category').populate('user_id', ['name', 'email'])
        
        res.send({
           message: `Se ha actualizado el registro`,
           data
        });
        
    } catch (error) {   
        console.log(error);
        res.status(500).send({
            message: 'Error al actualizar el registro',
            error
        })
    }

}

deleteData = async (req, res) => {
    
    const { id } = req.params

    try {
        //guardar como eliminado en la BD
        const data = await productModel.findByIdAndUpdate(id, {
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