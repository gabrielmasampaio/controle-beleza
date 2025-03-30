const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const {validateMongoId} = require('../../middlewares/mongodb.middleware');
const {validateUser, validatePartialUser, validateUserQuery} = require('../../middlewares/user.middleware');

router.post('/', validateUser, userController.createUser);
router.put('/:id', validateMongoId, validatePartialUser, userController.updateUser);
router.get('/', validateUserQuery, userController.getUsers);
router.get('/:id', validateMongoId, userController.getUserById);
router.delete('/:id', validateMongoId, userController.deleteUser);

module.exports = router;
