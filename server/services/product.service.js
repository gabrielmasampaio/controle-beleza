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

        if (filters.minStock || filters.maxStock) {
            query.stock = {};
            if (filters.minStock) query.stock.$gte = parseInt(filters.minStock);
            if (filters.maxStock) query.stock.$lte = parseInt(filters.maxStock);
        }

        if (filters.category) {
            query.categories = filters.category; // Filter by category ID
        }

        if (filters.brand) {
            query.brand = filters.brand; // Filter by brand ID
        }

        return await Product.find(query)
            .populate('categories') // Populate category details
            .populate('brand'); // Populate brand details
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
        const product = await Product.findById(id)
            .populate('categories')
            .populate('brand');
        if (!product) {
            throw new Error('Produto não encontrado');
        }
        return product;
    } catch (error) {
        throw new Error('Erro ao buscar produto por ID: ' + error.message);
    }
}

/**
 * Remove um produto pelo ID
 * @param {String} id - ID do produto
 */
async function deleteProductById(id) {
    try {
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            throw new Error('Produto não encontrado');
        }
        return deleted;
    } catch (error) {
        throw new Error('Erro ao deletar produto: ' + error.message);
    }
}


module.exports = {
    createProduct,
    updateProductById,
    getAllProducts,
    getProductById,
    deleteProductById,
    countProductsByCategory,
    countProductsByBrand,
    removeCategoryFromProducts,
    removeBrandFromProducts
};

async function countProductsByCategory(categoryId) {
    try {
        return await Product.countDocuments({ categories: categoryId });
    } catch (error) {
        throw new Error('Erro ao contar produtos por categoria: ' + error.message);
    }
}

async function countProductsByBrand(brandId) {
    try {
        return await Product.countDocuments({ brand: brandId });
    } catch (error) {
        throw new Error('Erro ao contar produtos por marca: ' + error.message);
    }
}

async function removeCategoryFromProducts(categoryId) {
    try {
        await Product.updateMany(
            { categories: categoryId },
            { $pull: { categories: categoryId } }
        );
    } catch (error) {
        throw new Error('Erro ao remover categoria de produtos: ' + error.message);
    }
}

async function removeBrandFromProducts(brandId) {
    try {
        await Product.updateMany(
            { brand: brandId },
            { $unset: { brand: 1 } } // Unset the brand field
        );
    } catch (error) {
        throw new Error('Erro ao remover marca de produtos: ' + error.message);
    }
}