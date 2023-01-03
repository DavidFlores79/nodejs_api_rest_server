const {  Schema, model } = require('mongoose')

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        
    },
    image: {
        type: String,
        default: 'image01.png'
    },
    role: {
        type: String,
        required: [true, 'El Rol es obligatorio'],
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    google: {
        type: Boolean,
        default: false
    },
})

UserSchema.methods.toJSON = function () {
    const { __v, password, ...user } = this.toObject()
    return user
}

module.exports = model( 'User', UserSchema )

// const user = {
//     nombre: '',
//     email: '',
//     password: '',
//     image: '',
//     role: '',
//     status: true,
//     google: false,
// }