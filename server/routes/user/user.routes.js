const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const {validateMongoId} = require('../../middlewares/mongodb.middleware');
const {validateUser, validatePartialUser, validateUserQuery} = require('../../middlewares/user.middleware');
const {authenticateToken} = require("../../middlewares/auth.middleware");

router.post('/', authenticateToken, validateUser, userController.createUser);
router.put('/:id', authenticateToken, validateMongoId, validatePartialUser, userController.updateUser);
router.get('/', authenticateToken, validateUserQuery, userController.getUsers);
router.get('/:id', authenticateToken, validateMongoId, userController.getUserById);
router.delete('/:id', authenticateToken, validateMongoId, userController.deleteUser);

module.exports = router;
