const roleModel = require('../models/role.model');
const Role = require('../models/role.model');
const userModel = require('../models/user.model');

const validateRole = async (role = '') => {
    console.log(role);
    const roleExist = await Role.findOne({ name: role })
    if(!roleExist) {
        throw new Error(`El rol ${ role } no está catalogado y no es válido.`)
    }

}

const validateUserById = async ( id ) => {
    console.log(id);
    const userExist = await userModel.findById(id)
    if(!userExist) {
        throw new Error(`El usuario con el id: ${ id } no existe en BD.`)
    }
}

const validateEmail = async (email = '', {req}) => {

    const id = req.params.id
    const existeEmail = await userModel.findOne({ email })

    //valida si el registro a actualizar es el mismo que
    //fue encontrado deja guardar el mismo valor
    if(id && existeEmail) {
        if(String(existeEmail._id) != id) {
            throw new Error(`El correo ${ email } ya está registrado.`)
        }
    } else {
        if(existeEmail) {
            throw new Error(`El correo ${ email } ya está registrado.`)
        }
    }

}

const validateLoginEmail = async (email = '', {req}) => {

    const existeEmail = await userModel.findOne({ email })

    if(!existeEmail) {
        throw new Error(`El email ${ email } no coincide con nuestros registros.`)
    }

}



const existRoleName = async (name = '', {req}) => {

    const id = req.params.id
    const existeName = await roleModel.findOne({ name })
    
    //valida si el registro a actualizar es el mismo que
    //fue encontrado deja guardar el mismo valor
    if(id && existeName) {
        if(String(existeName._id) != id) {
            throw new Error(`El rol ${ name } ya está registrado.`)
        }
    } else {
        if(existeName) {
            throw new Error(`El rol ${ name } ya está registrado.`)
        }
    }

}

const validateRoleById = async ( id ) => {

    const userExist = await roleModel.findById(id)
    if(!userExist) {
        throw new Error(`El role con el id: ${ id } no existe en BD.`)
    }

}

module.exports = { validateRole, validateEmail, validateUserById, existRoleName, validateRoleById, validateLoginEmail }