const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * Cria um novo usuário com senha criptografada
 * @param {Object} data - { username, password }
 */
async function createUser(data) {
    try {
        const { username, password } = data;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new Error('Usuário já existe');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
        });

        return await newUser.save();
    } catch (error) {
        throw new Error('Erro ao criar usuário: ' + error.message);
    }
}

/**
 * Atualiza um usuário por ID com os campos fornecidos
 * @param {String} id - ID do usuário
 * @param {Object} data - Campos a atualizar (username e/ou password)
 */
async function updateUserById(id, data) {
    try {
        const updateData = {};

        if (data.username) {
            updateData.username = data.username;
        }

        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            throw new Error('Usuário não encontrado');
        }

        return updatedUser;
    } catch (error) {
        throw new Error('Erro ao atualizar usuário: ' + error.message);
    }
}

/**
 * Retorna usuários com filtros opcionais (por enquanto: apenas username)
 * Sempre ignora usuários marcados como isDeleted: true
 */
async function getAllUsers(filters) {
    try {
        const query = { isDeleted: false };

        if (filters.username) {
            query.username = { $regex: filters.username, $options: 'i' };
        }

        return await User.find(query).select('-password');
    } catch (error) {
        throw new Error('Erro ao buscar usuários: ' + error.message);
    }
}

/**
 * Retorna um usuário pelo ID (se não estiver deletado)
 * @param {String} id
 */
async function getUserById(id) {
    try {
        const user = await User.findOne({ _id: id, isDeleted: false }).select('-password');
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        return user;
    } catch (error) {
        throw new Error('Erro ao buscar usuário por ID: ' + error.message);
    }
}


module.exports = {
    createUser,
    updateUserById,
    getAllUsers,
    getUserById
};
