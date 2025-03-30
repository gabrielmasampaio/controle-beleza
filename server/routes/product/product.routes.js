const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const {validateProduct, validatePartialProduct, validateProductQuery} = require('../../middlewares/product.middleware');

router.post('/', validateProduct, productController.createProduct);
router.put('/:id', validatePartialProduct, productController.updateProduct);
router.get('/', validateProductQuery, productController.getProducts);

module.exports = router;
