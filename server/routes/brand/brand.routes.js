const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/brand.controller');
const { validateMongoId } = require('../../middlewares/mongodb.middleware');
const { authenticateToken } = require('../../middlewares/auth.middleware');

router.post('/', authenticateToken, brandController.createBrand);
router.get('/', brandController.getAllBrands);
router.get('/:id', validateMongoId, brandController.getBrandById);
router.put('/:id', authenticateToken, validateMongoId, brandController.updateBrand);
router.delete('/:id', authenticateToken, validateMongoId, brandController.deleteBrand);

module.exports = router;
