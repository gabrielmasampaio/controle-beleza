const Product = require('../models/Product');
const Category = require('../models/Category'); // Import Category model
const Brand = require('../models/Brand'); // Import Brand model

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
 * Retorna lista de produtos com filtros opcionais, paginação e busca wildcard
 */
async function getAllProducts(filters, page = 1, limit = 20) {
    try {
        const query = {};
        const options = {
            skip: (page - 1) * limit,
            limit: limit,
            populate: ['categories', 'brand']
        };

        // Wildcard search
        if (filters.searchTerm) {
            const searchRegex = { $regex: filters.searchTerm, $options: 'i' };
            const orConditions = [
                { name: searchRegex },
                { description: searchRegex },
            ];

            // Search in categories by name
            const matchingCategories = await Category.find({ name: searchRegex }).select('_id');
            if (matchingCategories.length > 0) {
                orConditions.push({ categories: { $in: matchingCategories.map(cat => cat._id) } });
            }

            // Search in brands by name
            const matchingBrands = await Brand.find({ name: searchRegex }).select('_id');
            if (matchingBrands.length > 0) {
                orConditions.push({ brand: { $in: matchingBrands.map(b => b._id) } });
            }

            query.$or = orConditions;
        }

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

        if (filters.category) {
            query.categories = filters.category; // Filter by category ID
        }

        if (filters.brand) {
            query.brand = filters.brand; // Filter by brand ID
        }

        if (filters.disponibilidade) {
            query.disponibilidade = filters.disponibilidade;
        }

        const products = await Product.find(query, null, options);
        const totalProducts = await Product.countDocuments(query);

        return {
            products,
            totalProducts,
            page,
            pages: Math.ceil(totalProducts / limit)
        };
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