const {  Schema, model } = require('mongoose')

const RoleSchema = Schema({
    name: {
        type: String,
        unique: [true, 'El nombre debe ser unico'],
        required: [true, 'El nombre es obligatorio']
    },
    status: {
        type: Boolean,
        default: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
})

RoleSchema.methods.toJSON = function () {
    const { __v, password, ...data } = this.toObject()
    return data
}

module.exports = model( 'Role', RoleSchema )