const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const {validateProduct, validatePartialProduct} = require('../../middlewares/product.middleware');

router.post('/', validateProduct, productController.createProduct);
router.put('/:id', validatePartialProduct, productController.updateProduct);


module.exports = router;
