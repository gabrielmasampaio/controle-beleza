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
