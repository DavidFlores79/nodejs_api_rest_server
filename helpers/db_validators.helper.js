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

const validateEmail = async (email = '') => {

    const existeEmail = await userModel.findOne({ email })
    if(existeEmail) {
        throw new Error(`El correo ${ email } ya está registrado.`)
    }

}
const existRoleName = async (name = '', id) => {

    const existeName = await roleModel.findOne({ name })
    if(existeName) {
        throw new Error(`El rol ${ name } ya está registrado.`)
    }

}

const validateRoleById = async ( id ) => {

    const userExist = await roleModel.findById(id)
    if(!userExist) {
        throw new Error(`El role con el id: ${ id } no existe en BD.`)
    }

}

module.exports = { validateRole, validateEmail, validateUserById, existRoleName, validateRoleById }