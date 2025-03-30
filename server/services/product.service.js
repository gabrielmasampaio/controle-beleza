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

/**
 * Retorna lista de produtos com filtros opcionais
 */
async function getAllProducts(filters) {
    try {
        const query = {};

        if (filters.name) {
            query.name = { $regex: filters.name, $options: 'i' };
        }

        if (filters.minPrice || filters.maxPrice) {
            query.price = {};
            if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
            if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
        }

        if (filters.minStorage || filters.maxStorage) {
            query.storage = {};
            if (filters.minStorage) query.storage.$gte = parseInt(filters.minStorage);
            if (filters.maxStorage) query.storage.$lte = parseInt(filters.maxStorage);
        }

        return await Product.find(query);
    } catch (error) {
        throw new Error('Erro ao buscar produtos: ' + error.message);
    }
}

/**
 * Busca um produto pelo ID
 * @param {String} id - ID do produto
 * @returns {Promise<Object>} - Produto encontrado ou null
 */
async function getProductById(id) {
    try {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Produto não encontrado');
        }
        return product;
    } catch (error) {
        throw new Error('Erro ao buscar produto por ID: ' + error.message);
    }
}



module.exports = {
    createProduct,
    updateProductById,
    getAllProducts,
    getProductById
};