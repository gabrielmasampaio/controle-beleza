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

async function getUsers(req, res) {
    try {
        const filters = req.query;
        const users = await userService.getAllUsers(filters);
        return res.status(200).json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        return res.status(200).json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário por ID:', error.message);
        return res.status(404).json({ message: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const deleted = await userService.deleteUserById(id);
        return res.status(200).json({
            message: 'Usuário deletado com sucesso',
            deleted,
        });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error.message);
        return res.status(404).json({ message: error.message });
    }
}


module.exports = {
    createUser,
    updateUser,
    getUsers,
    getUserById,
    deleteUser
};
