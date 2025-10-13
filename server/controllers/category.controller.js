const categoryService = require('../services/category.service');
const productService = require('../services/product.service');

async function createCategory(req, res) {
    try {
        const { name } = req.body;
        const category = await categoryService.createCategory({ name });
        return res.status(201).json(category);
    } catch (error) {
        console.error('Erro no controller de categoria:', error);
        return res.status(500).json({ message: error.message });
    }
}

async function getAllCategories(req, res) {
    try {
        const { page, limit, searchTerm } = req.query;
        const categoriesData = await categoryService.getAllCategories({ searchTerm }, parseInt(page), parseInt(limit));
        return res.status(200).json(categoriesData);
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return res.status(500).json({ message: error.message });
    }
}

async function getCategoryById(req, res) {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id);
        return res.status(200).json(category);
    } catch (error) {
        console.error('Erro ao buscar categoria por ID:', error.message);
        return res.status(404).json({ message: error.message });
    }
}

async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updated = await categoryService.updateCategoryById(id, { name });
        return res.status(200).json(updated);
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error.message);
        return res.status(404).json({ message: error.message });
    }
}

async function deleteCategory(req, res) {
    try {
        const { id } = req.params;

        // Count products linked to this category
        const linkedProductsCount = await productService.countProductsByCategory(id);

        if (req.query.forceDelete === 'true') {
            // If forceDelete is true, remove category from products and then delete the category
            await productService.removeCategoryFromProducts(id);
            const deleted = await categoryService.deleteCategoryById(id);
            return res.status(200).json({ message: 'Categoria removida com sucesso e de produtos vinculados.', deleted, linkedProductsCount });
        } else {
            // Return count of linked products for confirmation
            return res.status(200).json({ message: 'Confirmação necessária para deletar categoria.', linkedProductsCount });
        }
    } catch (error) {
        console.error('Erro ao deletar categoria:', error.message);
        return res.status(404).json({ message: error.message });
    }
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
