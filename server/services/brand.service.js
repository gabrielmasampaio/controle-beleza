const Brand = require('../models/Brand');

async function createBrand(data) {
    try {
        const newBrand = new Brand(data);
        return await newBrand.save();
    } catch (error) {
        throw new Error('Erro ao criar marca: ' + error.message);
    }
}

async function getAllBrands(filters, page = 1, limit = 20) {
    try {
        const query = {};
        const options = {
            skip: (page - 1) * limit,
            limit: limit,
        };

        if (filters.searchTerm) {
            query.name = { $regex: filters.searchTerm, $options: 'i' };
        }

        const brands = await Brand.find(query, null, options);
        const totalBrands = await Brand.countDocuments(query);

        return {
            brands,
            totalBrands,
            page,
            pages: Math.ceil(totalBrands / limit)
        };
    } catch (error) {
        throw new Error('Erro ao buscar marcas: ' + error.message);
    }
}

async function getBrandById(id) {
    try {
        const brand = await Brand.findById(id);
        if (!brand) {
            throw new Error('Marca não encontrada');
        }
        return brand;
    } catch (error) {
        throw new Error('Erro ao buscar marca por ID: ' + error.message);
    }
}

async function updateBrandById(id, data) {
    try {
        const updatedBrand = await Brand.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
        if (!updatedBrand) {
            throw new Error('Marca não encontrada');
        }
        return updatedBrand;
    } catch (error) {
        throw new Error('Erro ao atualizar marca: ' + error.message);
    }
}

async function deleteBrandById(id) {
    try {
        const deleted = await Brand.findByIdAndDelete(id);
        if (!deleted) {
            throw new Error('Marca não encontrada');
        }
        return deleted;
    } catch (error) {
        throw new Error('Erro ao deletar marca: ' + error.message);
    }
}

module.exports = {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrandById,
    deleteBrandById
};
