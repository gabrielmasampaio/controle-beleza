/**
 * Middleware para validar criação de usuário
 */
function validateUser(req, res, next) {
    const { username, password } = req.body;

    if (!username || typeof username !== 'string') {
        return res.status(400).json({ message: 'Campo "username" é obrigatório e deve ser uma string.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ message: 'Campo "password" é obrigatório, deve ser string e ter no mínimo 6 caracteres.' });
    }

    next();
}

function validatePartialUser(req, res, next) {
    const { username, password } = req.body;

    if (
        username !== undefined &&
        (typeof username !== 'string' || username.trim() === '')
    ) {
        return res.status(400).json({ message: '"username" deve ser uma string não vazia.' });
    }

    if (
        password !== undefined &&
        (typeof password !== 'string' || password.length < 6)
    ) {
        return res.status(400).json({ message: '"password" deve ter no mínimo 6 caracteres.' });
    }

    next();
}

function validateUserQuery(req, res, next) {
    const { username } = req.query;

    if (username !== undefined && typeof username !== 'string') {
        return res.status(400).json({ message: '"username" deve ser uma string.' });
    }

    next();
}


module.exports = {
    validateUser,
    validatePartialUser,
    validateUserQuery
};
