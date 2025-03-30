const express = require('express');
const router = express.Router();

const userRoutes = require('./user/user.routes');
const productRoutes = require('./product/product.routes');

router.use('/user', userRoutes);
router.use('/product', productRoutes);

module.exports = router;
