const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth.routes');
const userRoutes = require('./user/user.routes');
const productRoutes = require('./product/product.routes');
const brandRoutes = require('./brand/brand.routes');
const categoryRoutes = require('./category/category.routes');
const {authenticateToken} = require("../middlewares/auth.middleware");

router.use('/login', authRoutes);

router.get('/auth/validate', authenticateToken, (req, res) => {
    return res.status(200).json({ valid: true });
})

router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/brand', brandRoutes);
router.use('/category', categoryRoutes);

module.exports = router;
