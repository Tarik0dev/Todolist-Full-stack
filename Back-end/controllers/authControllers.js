const bcrypt = require("bcrypt");
const authModel = require("../models/authModels");
const jwt = require("jsonwebtoken");
const registerModel = require("../models/registerModels");
const authService = require("../services/authService");

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const response = await authService.login(email, password);
      res.status(200).json({
        message: "Utilisateur connecté",
        user: response
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      await authService.register(firstName, lastName, email, password);

      res
        .status(201)
        .json({ message: "L'inscription à été réalisé avec succés bravo !!!" });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          error: "Cet email est déjà utilisé",
        });
      }
      console.error("erreur : ", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = authController;
