const express = require('express');
const userController = require('./user.controller');

const router = express.Router();

router.post('/signup', userController.signup);
router.put('/:id',userController.updateUser);
router.get('/by-email', userController.getUserByEmail); 
router.get('/:id', userController.getUserById);
module.exports = router;