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

/**
 * Controller para fazer um update de um produto
 */
async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;

        const updated = await productService.updateProductById(id, data);
        return res.status(200).json(updated);
    } catch (error) {
        console.error('Erro no update de produto:', error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createProduct,
    updateProduct,
};
