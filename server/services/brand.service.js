const Brand = require('../models/Brand');

async function createBrand(data) {
    try {
        const newBrand = new Brand(data);
        return await newBrand.save();
    } catch (error) {
        throw new Error('Erro ao criar marca: ' + error.message);
    }
}

async function getAllBrands() {
    try {
        return await Brand.find();
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
