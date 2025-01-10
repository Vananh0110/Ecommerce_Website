const { Router } = require('express');
const controller = require('../controller/userController');
const {uploadAvatar} = require('../upload')

const router = Router();

router.post('/login', controller.loginUser);
router.post('/register', controller.registerUser);
router.get('/all', controller.getAllUsers);
router.get('/:id', controller.getUserById);
router.put('/admin-update/:user_id', controller.adminUpdateUser);
router.put('/change-password/:user_id', controller.changePassword);
router.put('/:user_id', uploadAvatar.single('avatar'), controller.updateUser);
router.get('/order-total', controller.getUserWithOrderAmount);
module.exports = router;
