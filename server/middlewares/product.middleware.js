/**
 * Middleware para validar os dados do produto antes da criação
 */
function validateProduct(req, res, next) {
    const { name, price, storage } = req.body;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: 'Campo "name" é obrigatório e deve ser uma string.' });
    }

    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ message: 'Campo "price" deve ser um número positivo.' });
    }

    if (!Number.isInteger(storage) || storage < 0) {
        return res.status(400).json({ message: 'Campo "storage" deve ser um inteiro positivo.' });
    }

    next();
}

function validatePartialProduct(req, res, next) {
    const { name, price, storage, image, description } = req.body;

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

    next();
}

function validateProductQuery(req, res, next) {
    const { name, minPrice, maxPrice, minStorage, maxStorage } = req.query;

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

    next();
}

const mongoose = require('mongoose');

/**
 * Middleware para validar se o :id é um ObjectId válido do MongoDB
 */
function validateMongoId(req, res, next) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID inválido.' });
    }

    next();
}

module.exports = {
    validateProduct,
    validatePartialProduct,
    validateProductQuery,
    validateMongoId
};
