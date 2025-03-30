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



module.exports = {
    createUser,
    updateUserById
};
