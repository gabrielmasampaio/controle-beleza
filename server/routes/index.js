const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth.routes');
const userRoutes = require('./user/user.routes');
const productRoutes = require('./product/product.routes');

router.use('/login', authRoutes);

router.use('/user', userRoutes);
router.use('/product', productRoutes);

module.exports = router;
