const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category.controller');
const { validateMongoId } = require('../../middlewares/mongodb.middleware');
const { authenticateToken } = require('../../middlewares/auth.middleware');

router.post('/', authenticateToken, categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', validateMongoId, categoryController.getCategoryById);
router.put('/:id', authenticateToken, validateMongoId, categoryController.updateCategory);
router.delete('/:id', authenticateToken, validateMongoId, categoryController.deleteCategory);

module.exports = router;
