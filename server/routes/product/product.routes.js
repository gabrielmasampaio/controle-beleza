const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const {validateMongoId} = require('../../middlewares/mongodb.middleware');
const {authenticateToken} = require("../../middlewares/auth.middleware");
const {
    validateProduct,
    validatePartialProduct,
    validateProductQuery
} = require('../../middlewares/product.middleware');

router.post('/', authenticateToken, validateProduct, productController.createProduct);
router.put('/:id', authenticateToken, validateMongoId, validatePartialProduct, productController.updateProduct);
router.get('/', validateProductQuery, productController.getProducts);
router.get('/:id', validateMongoId, productController.getProductById);
router.delete('/:id', authenticateToken, validateMongoId, productController.deleteProduct);

module.exports = router;
