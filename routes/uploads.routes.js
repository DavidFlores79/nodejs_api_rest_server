const { Router } = require('express');
const { check } = require('express-validator');
const { updateImage, uploadFile, showImage } = require('../controllers/uploads.controller');
const { coleccionesPermitidas, validateUserById } = require('../helpers/db_validators.helper');

const { Validator } = require('../middlewares/validator.middleware');

const router = Router()

router.post('/', uploadFile)
router.put('/:coleccion/:id', [
    check('id', 'No es un id válido.').isMongoId(),
    // TODO: checkIdExistInCollection(['id', 'coleccion']),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['users', 'products']) ),
    Validator
], updateImage)
router.get('/:coleccion/:id', [
    check('id', 'No es un id válido.').isMongoId(),
    // TODO: checkIdExistInCollection(['id', 'coleccion']),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['users', 'products']) ),
    Validator
], showImage)


module.exports = router