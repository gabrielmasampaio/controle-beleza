const mongoose = require('mongoose');

/**
 * Middleware para validar os dados do produto antes da criação
 */
function validateProduct(req, res, next) {
    const { name, price, storage, categories, brands, availability } = req.body;
    const allowedAvailability = ['A pronta entrega', 'A Caminho', 'Somente Encomenda'];

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: 'Campo "name" é obrigatório e deve ser uma string.' });
    }

    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ message: 'Campo "price" deve ser um número positivo.' });
    }

    if (!Number.isInteger(storage) || storage < 0) {
        return res.status(400).json({ message: 'Campo "storage" deve ser um inteiro positivo.' });
    }

    if (categories !== undefined) {
        if (!Array.isArray(categories) || !categories.every(catId => mongoose.Types.ObjectId.isValid(catId))) {
            return res.status(400).json({ message: 'Campo "categories" deve ser um array de IDs de categoria válidos.' });
        }
    }

    if (brands !== undefined) {
        if (!Array.isArray(brands) || !brands.every(brandId => mongoose.Types.ObjectId.isValid(brandId))) {
            return res.status(400).json({ message: 'Campo "brands" deve ser um array de IDs de marca válidos.' });
        }
    }

    if (availability !== undefined && !allowedAvailability.includes(availability)) {
        return res.status(400).json({ message: `Campo "availability" deve ser um dos seguintes: ${allowedAvailability.join(', ')}.` });
    }

    next();
}

function validatePartialProduct(req, res, next) {
    const { name, price, storage, image, description, categories, brands, availability } = req.body;
    const allowedAvailability = ['A pronta entrega', 'A Caminho', 'Somente Encomenda'];

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
        return res.status(400).json({ message: 'Campo "price" deve ser um número positivo.' });
    }

    if (storage !== undefined && (!Number.isInteger(storage) || storage < 0)) {
        return res.status(400).json({ message: 'Campo "storage" deve ser um inteiro positivo.' });
    }

    if (name !== undefined && typeof name !== 'string') {
        return res.status(400).json({ message: 'Campo "name" deve ser uma string.' });
    }

    if (description !== undefined && typeof description !== 'string') {
        return res.status(400).json({ message: 'Campo "description" deve ser uma string.' });
    }

    if (image !== undefined && typeof image !== 'string') {
        return res.status(400).json({ message: 'Campo "image" deve ser uma string (base64).' });
    }

    if (categories !== undefined) {
        if (!Array.isArray(categories) || !categories.every(catId => mongoose.Types.ObjectId.isValid(catId))) {
            return res.status(400).json({ message: 'Campo "categories" deve ser um array de IDs de categoria válidos.' });
        }
    }

    if (brands !== undefined) {
        if (!Array.isArray(brands) || !brands.every(brandId => mongoose.Types.ObjectId.isValid(brandId))) {
            return res.status(400).json({ message: 'Campo "brands" deve ser um array de IDs de marca válidos.' });
        }
    }

    if (availability !== undefined && !allowedAvailability.includes(availability)) {
        return res.status(400).json({ message: `Campo "availability" deve ser um dos seguintes: ${allowedAvailability.join(', ')}.` });
    }

    next();
}

function validateProductQuery(req, res, next) {
    const { name, minPrice, maxPrice, minStorage, maxStorage, category, brands, page, limit, searchTerm } = req.query;

    if (minPrice !== undefined && isNaN(parseFloat(minPrice))) {
        return res.status(400).json({ message: '"minPrice" deve ser um número válido.' });
    }

    if (maxPrice !== undefined && isNaN(parseFloat(maxPrice))) {
        return res.status(400).json({ message: '"maxPrice" deve ser um número válido.' });
    }

    if (minStorage !== undefined && !Number.isInteger(Number(minStorage))) {
        return res.status(400).json({ message: '"minStorage" deve ser um inteiro válido.' });
    }

    if (maxStorage !== undefined && !Number.isInteger(Number(maxStorage))) {
        return res.status(400).json({ message: '"maxStorage" deve ser um inteiro válido.' });
    }

    if (name !== undefined && typeof name !== 'string') {
        return res.status(400).json({ message: '"name" deve ser uma string.' });
    }

    if (category !== undefined && !mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: '"category" deve ser um ID de categoria válido.' });
    }

    if (brands !== undefined && !mongoose.Types.ObjectId.isValid(brands)) {
        return res.status(400).json({ message: '"brands" deve ser um ID de marca válido.' });
    }

    if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
        return res.status(400).json({ message: '"page" deve ser um número inteiro positivo.' });
    }

    if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1)) {
        return res.status(400).json({ message: '"limit" deve ser um número inteiro positivo.' });
    }

    if (searchTerm !== undefined && typeof searchTerm !== 'string') {
        return res.status(400).json({ message: '"searchTerm" deve ser uma string.' });
    }

    next();
}

module.exports = {
    validateProduct,
    validatePartialProduct,
    validateProductQuery
};
