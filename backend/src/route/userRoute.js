const { Router } = require('express');
const controller = require('../controller/userController');

const router = Router();

router.post('/login', controller.loginUser);
router.post('/register', controller.registerUser);
router.get('/all', controller.getAllUsers);
router.get('/:id', controller.getUserById);
router.put('/admin-update/:user_id', controller.adminUpdateUser);

module.exports = router;
