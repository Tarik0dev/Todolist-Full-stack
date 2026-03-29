const authService = require("../services/authService");

const resetPasswordController = {
    resetPassword: async (req, res) => {
        const { password, token } = req.body;
        try {
            await authService.resetPassword(password, token);
            res.status(200).json({message: "Mot de passe modifié avec succès."})
        } catch (err) {
            console.log('Erreur :', err.message);
            res.status(401).json({message: "Erreur, veuillez retentez.."})
        }
    }
} 

module.exports = resetPasswordController