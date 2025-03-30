const userService = require('../services/user.service');

/**
 * Cria um novo usuário
 */
async function createUser(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Campos "username" e "password" são obrigatórios.' });
        }

        const user = await userService.createUser({ username, password });

        const { password: _, ...userWithoutPassword } = user.toObject();

        return res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error('Erro ao criar usuário:', error.message);
        return res.status(400).json({ message: error.message });
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;

        const user = await userService.updateUserById(id, data);

        const { password: _, ...userWithoutPassword } = user.toObject();

        return res.status(201).json(userWithoutPassword);

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error.message);
        return res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createUser,
    updateUser
};
