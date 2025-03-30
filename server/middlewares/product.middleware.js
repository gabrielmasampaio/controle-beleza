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

    next(); // dados válidos, segue para o controller
}

module.exports = validateProduct;
