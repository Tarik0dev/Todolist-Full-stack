const pool = require("./config/configDatabase");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:4200", "http://localhost:8080"],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Todo List est en ligne !");
});

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const passwordRoutes = require("./routes/passwordRoutes");
app.use("/password", passwordRoutes);

const taskRoutes = require("./routes/taskRoutes");
app.use("/task", taskRoutes);


app.listen(PORT, "0.0.0.0", async () => {

  console.log(`Serveur démarré sur le port ${PORT}`);
  try {

    await pool.query("SELECT NOW()");

  } catch (error) {
    console.error(" Échec de connexion à la Base de données :", error.message);
    process.exit(1);
  }
});
