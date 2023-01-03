const {  Schema, model } = require('mongoose')

const RoleSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    status: {
        type: Boolean,
        default: true
    },
})

module.exports = model( 'Role', RoleSchema )