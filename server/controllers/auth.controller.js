const authService = require('../services/auth.service');

async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
        }

        const { token, user } = await authService.loginUser(username, password);
        return res.status(200).json({ token, user });
    } catch (error) {
        console.error('Erro no login:', error.message);
        return res.status(401).json({ message: error.message });
    }
}

module.exports = {
    login,
};
