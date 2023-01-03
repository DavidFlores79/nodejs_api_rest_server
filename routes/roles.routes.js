const { Router } = require('express');
const { check } = require('express-validator')
const { getData, postData, updateData, deleteData } = require('../controllers/roles.controller');
const { Validator } = require('../middlewares/validator.middleware');
const router = Router()

router.get('/', getData);
router.post('/',[
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('status', 'El status debe ser de tipo Boolean.').isBoolean(),
    Validator
], postData);
router.put('/:id', updateData);
router.delete('/:id', deleteData);

module.exports = router