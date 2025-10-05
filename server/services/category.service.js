const Category = require('../models/Category');

async function createCategory(data) {
    try {
        const newCategory = new Category(data);
        return await newCategory.save();
    } catch (error) {
        throw new Error('Erro ao criar categoria: ' + error.message);
    }
}

async function getAllCategories() {
    try {
        return await Category.find();
    } catch (error) {
        throw new Error('Erro ao buscar categorias: ' + error.message);
    }
}

async function getCategoryById(id) {
    try {
        const category = await Category.findById(id);
        if (!category) {
            throw new Error('Categoria não encontrada');
        }
        return category;
    } catch (error) {
        throw new Error('Erro ao buscar categoria por ID: ' + error.message);
    }
}

async function updateCategoryById(id, data) {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
        if (!updatedCategory) {
            throw new Error('Categoria não encontrada');
        }
        return updatedCategory;
    } catch (error) {
        throw new Error('Erro ao atualizar categoria: ' + error.message);
    }
}

async function deleteCategoryById(id) {
    try {
        const deleted = await Category.findByIdAndDelete(id);
        if (!deleted) {
            throw new Error('Categoria não encontrada');
        }
        return deleted;
    } catch (error) {
        throw new Error('Erro ao deletar categoria: ' + error.message);
    }
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
};
