const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Valida login e retorna token JWT
 * @param {String} username
 * @param {String} password
 */
async function loginUser(username, password) {
    const user = await User.findOne({ username, isDeleted: false });

    if (!user) {
        throw new Error('Credenciais inválidas.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Credenciais inválidas.');
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    return { token, user: userWithoutPassword };
}

module.exports = {
    loginUser,
};
