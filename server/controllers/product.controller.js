const productService = require('../services/product.service');

/**
 * Controller para criar um novo produto
 */
async function createProduct(req, res) {
    try {
        const { name, description, price, storage, image } = req.body;

        const product = await productService.createProduct({
            name,
            description,
            price,
            storage,
            image,
        });

        return res.status(201).json(product);
    } catch (error) {
        console.error('Erro no controller de produto:', error);
        return res.status(500).json({ message: 'Erro ao criar produto' });
    }
}

module.exports = {
    createProduct,
};
