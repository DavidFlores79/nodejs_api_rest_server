const { Router } = require('express');
const { check } = require('express-validator')
const { login } = require('../controllers/auth.controller');
const { validateLoginEmail } = require('../helpers/db_validators.helper');
const { Validator } = require('../middlewares/validator.middleware');
const router = Router()

router.post('/login',[
    check('email', 'El email es obligatorio.').not().isEmpty(),
    check('email', 'No es un correo válido.').isEmail(),
    check('password', 'El password es obligatorio.').not().isEmpty(),
    check('email').custom( validateLoginEmail ),
    Validator
], login);

module.exports = router