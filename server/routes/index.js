const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth.routes');
const userRoutes = require('./user/user.routes');
const productRoutes = require('./product/product.routes');
const {authenticateToken} = require("../middlewares/auth.middleware");

router.use('/login', authRoutes);

router.get('/auth/validate', authenticateToken, (req, res) => {
    return res.status(200).json({ valid: true });
})

router.use('/user', userRoutes);
router.use('/product', productRoutes);

module.exports = router;
