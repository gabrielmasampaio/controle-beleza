const brandService = require('../services/brand.service');
const productService = require('../services/product.service');

async function createBrand(req, res) {
    try {
        const { name } = req.body;
        const brand = await brandService.createBrand({ name });
        return res.status(201).json(brand);
    } catch (error) {
        console.error('Erro no controller de marca:', error);
        return res.status(500).json({ message: error.message });
    }
}

async function getAllBrands(req, res) {
    try {
        const brands = await brandService.getAllBrands();
        return res.status(200).json(brands);
    } catch (error) {
        console.error('Erro ao buscar marcas:', error);
        return res.status(500).json({ message: error.message });
    }
}

async function getBrandById(req, res) {
    try {
        const { id } = req.params;
        const brand = await brandService.getBrandById(id);
        return res.status(200).json(brand);
    } catch (error) {
        console.error('Erro ao buscar marca por ID:', error.message);
        return res.status(404).json({ message: error.message });
    }
}

async function updateBrand(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updated = await brandService.updateBrandById(id, { name });
        return res.status(200).json(updated);
    } catch (error) {
        console.error('Erro ao atualizar marca:', error.message);
        return res.status(404).json({ message: error.message });
    }
}

async function deleteBrand(req, res) {
    try {
        const { id } = req.params;

        // Count products linked to this brand
        const linkedProductsCount = await productService.countProductsByBrand(id);

        if (req.query.forceDelete === 'true') {
            // If forceDelete is true, remove brand from products and then delete the brand
            await productService.removeBrandFromProducts(id);
            const deleted = await brandService.deleteBrandById(id);
            return res.status(200).json({ message: 'Marca removida com sucesso e de produtos vinculados.', deleted, linkedProductsCount });
        } else {
            // Return count of linked products for confirmation
            return res.status(200).json({ message: 'Confirmação necessária para deletar marca.', linkedProductsCount });
        }
    } catch (error) {
        console.error('Erro ao deletar marca:', error.message);
        return res.status(404).json({ message: error.message });
    }
}

module.exports = {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand
};
