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


module.exports = { validateMongoId }