const authService = require("../services/authService")

const forgotPasswordController = {
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);
      res
        .status(200)
        .json({ message: "Si l'email existe, un lien a été envoyé." });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur, Veuillez réessayer plus tard." });
    }
  },
};

module.exports = forgotPasswordController;
