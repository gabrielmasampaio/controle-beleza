const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const validateProduct = require('../../middlewares/product.middleware');

router.post('/', validateProduct, productController.createProduct);

module.exports = router;
