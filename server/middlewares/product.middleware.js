const mongoose = require('mongoose');

/**
 * Middleware para validar os dados do produto antes da criação
 */
function validateProduct(req, res, next) {
    const { name, price, stock, categories, brand, disponibilidade } = req.body;
    const allowedDisponibilidade = ['Pronta entrega', 'Sob encomenda', 'Disponível em breve'];

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: 'Campo "name" é obrigatório e deve ser uma string.' });
    }

    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ message: 'Campo "price" deve ser um número positivo.' });
    }

    if (!Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({ message: 'Campo "stock" deve ser um inteiro positivo.' });
    }

    if (categories !== undefined) {
        if (!Array.isArray(categories) || !categories.every(catId => mongoose.Types.ObjectId.isValid(catId))) {
            return res.status(400).json({ message: 'Campo "categories" deve ser um array de IDs de categoria válidos.' });
        }
    }

    if (brand !== undefined && !mongoose.Types.ObjectId.isValid(brand)) {
        return res.status(400).json({ message: 'Campo "brand" deve ser um ID de marca válido.' });
    }

    if (disponibilidade !== undefined && !allowedDisponibilidade.includes(disponibilidade)) {
        return res.status(400).json({ message: `Campo "disponibilidade" deve ser um dos seguintes: ${allowedDisponibilidade.join(', ')}.` });
    }

    next();
}

function validatePartialProduct(req, res, next) {
    const { name, price, stock, image, description, categories, brand, disponibilidade } = req.body;
    const allowedDisponibilidade = ['Pronta entrega', 'Sob encomenda', 'Disponível em breve'];

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
        return res.status(400).json({ message: 'Campo "price" deve ser um número positivo.' });
    }

    if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) {
        return res.status(400).json({ message: 'Campo "stock" deve ser um inteiro positivo.' });
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

    if (brand !== undefined && !mongoose.Types.ObjectId.isValid(brand)) {
        return res.status(400).json({ message: 'Campo "brand" deve ser um ID de marca válido.' });
    }

    if (disponibilidade !== undefined && !allowedDisponibilidade.includes(disponibilidade)) {
        return res.status(400).json({ message: `Campo "disponibilidade" deve ser um dos seguintes: ${allowedDisponibilidade.join(', ')}.` });
    }

    next();
}

function validateProductQuery(req, res, next) {
    const { name, minPrice, maxPrice, minStock, maxStock, category, brand, page, limit, searchTerm } = req.query;

    if (minPrice !== undefined && isNaN(parseFloat(minPrice))) {
        return res.status(400).json({ message: '"minPrice" deve ser um número válido.' });
    }

    if (maxPrice !== undefined && isNaN(parseFloat(maxPrice))) {
        return res.status(400).json({ message: '"maxPrice" deve ser um número válido.' });
    }

    if (minStock !== undefined && !Number.isInteger(Number(minStock))) {
        return res.status(400).json({ message: '"minStock" deve ser um inteiro válido.' });
    }

    if (maxStock !== undefined && !Number.isInteger(Number(maxStock))) {
        return res.status(400).json({ message: '"maxStock" deve ser um inteiro válido.' });
    }

    if (name !== undefined && typeof name !== 'string') {
        return res.status(400).json({ message: '"name" deve ser uma string.' });
    }

    if (category !== undefined && !mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: '"category" deve ser um ID de categoria válido.' });
    }

    if (brand !== undefined && !mongoose.Types.ObjectId.isValid(brand)) {
        return res.status(400).json({ message: '"brand" deve ser um ID de marca válido.' });
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
