const { Router } = require('express');
const { check } = require('express-validator')
const { getData, postData, updateData, deleteData } = require('../controllers/roles.controller');
const { existRoleName, validateRoleById } = require('../helpers/db_validators.helper');
const { Validator } = require('../middlewares/validator.middleware');
const router = Router()

router.get('/', getData);
router.post('/',[
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('status', 'El status debe ser de tipo Boolean.').isBoolean(),
    check('name').custom( existRoleName ),
    Validator
], postData);
router.put('/:id', [
    check('id', 'No es un id válido.').isMongoId(),
    check('id').custom( validateRoleById ),
    //TODO: falta validar correo del mismo usuario que se esta actualizando
    Validator
], updateData);

router.delete('/:id', [
    check('id', 'No es un id válido.').isMongoId(),
    check('id').custom( validateRoleById ),
    Validator
], deleteData);

module.exports = router