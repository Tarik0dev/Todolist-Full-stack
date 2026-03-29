const jwt = require("jsonwebtoken");
const authModel = require("../models/authModels");
const bcrypt = require("bcrypt");
const transporter = require("../config/nodemailer");
const registerModel = require("../models/registerModels");

async function resetPassword(password, token) {
  if (!password || password.length < 6) {
    throw new Error("Mot de passe non renseigné ou incorrecte.");
  }
  if (!token || token.length === 0) {
    throw new Error("Token incorrecte");
  }
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const email = payload.email;

  const user = await authModel.findByEmail(email);

  if (!user) {
    console.log("2. Utilisateur inconnu. On ne fait rien.");
    throw new Error("Utilisateur inexistant.");
  }

  await authModel.resetPassword(email, await bcrypt.hash(password, 10));
}

async function forgotPassword(email) {
  const user = await authModel.findByEmail(email);

  if (!user) {
    console.log("2. Utilisateur inconnu. On ne fait rien.");
    throw new Error("Utilisateur inexistant.");
  }

  const secret = process.env.RESET_PASSWORD_SECRET;
  const token = jwt.sign({ email }, secret, { expiresIn: "1h" });

  const link = `http://localhost:4200/reset-password/${token}`;

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Réinitialisation de mot de passe",
    html: `
                    <h3>Demande de réinitialisation</h3>
                    <p>Cliquez ici : <a href="${link}">Changer mon mot de passe</a></p>
                `,
  });
}

async function register(firstName, lastName, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await registerModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
}

async function login(email, password) {
  const user = await authModel.findByEmail(email);

  if (!user) {
    throw new Error("Utilisateur inexistant.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Mot de passe incorrecte.");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      firstName: user.firstname,
      lastName: user.lastname,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  return {
    id: user.id,
    email: user.email,
    token: token,
  };
}

module.exports = {
  resetPassword,
  forgotPassword,
  register,
  login,
};
