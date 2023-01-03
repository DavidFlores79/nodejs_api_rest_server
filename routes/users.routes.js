const { Router } = require('express');
const { check } = require('express-validator')
const { getData, postData, updateData, deleteData } = require('../controllers/users.controller');
const { validateRole, validateEmail, validateUserById } = require('../helpers/db_validators.helper');
const { Validator } = require('../middlewares/validator.middleware');
const router = Router()

router.get('/', getData);
router.post('/',[
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('password', 'El password es obligatorio.').not().isEmpty(),
    check('password', 'El password debe contener más de 6 caracteres.').isLength({ min: 6 }),
    check('email', 'No es un correo válido.').isEmail(),
    
    //Validacion personalizada que usa el modelo roles
    check('role').custom( validateRole ),
    check('email').custom( validateEmail ),
    
    Validator
], postData);
router.put('/:id', [
    check('id', 'No es un id válido.').isMongoId(),
    check('id').custom( validateUserById ),
    check('role').custom( validateRole ),
    Validator
], updateData);

router.delete('/:id', [
    check('id', 'No es un id válido.').isMongoId(),
    check('id').custom( validateUserById ),
    Validator
], deleteData);

module.exports = router