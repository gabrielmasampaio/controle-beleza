const Product = require('../models/Product');

/**
 * Cria um novo produto no banco
 * @param {Object} data - Dados do produto já formatados
 * @returns {Promise<Object>} - Produto salvo no banco
 */
async function createProduct(data) {
    try {
        const newProduct = new Product(data);
        return await newProduct.save();
    } catch (error) {
        throw new Error('Erro ao criar produto: ' + error.message);
    }
}

module.exports = {
    createProduct,
};

/**
 * Atualiza um produto por ID com os campos fornecidos
 * @param {String} id - ID do produto
 * @param {Object} data - Campos a serem atualizados
 */
async function updateProductById(id, data) {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });

        if (!updatedProduct) {
            throw new Error('Produto não encontrado');
        }

        return updatedProduct;
    } catch (error) {
        throw new Error('Erro ao atualizar produto: ' + error.message);
    }
}

module.exports = {
    createProduct,
    updateProductById,
};