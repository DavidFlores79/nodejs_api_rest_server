const { Router } = require('express');
const { getData, postData, updateData, deleteData } = require('../controllers/users.controller');
const router = Router()


router.get('/', getData);
router.post('/', postData);
router.put('/:id', updateData);
router.delete('/:id', deleteData);

module.exports = router