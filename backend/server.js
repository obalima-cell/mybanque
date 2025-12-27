console.log("SERVER LOADED FROM =>", __filename);
console.log("REQUIRE CACHE =>", Object.keys(require.cache));

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // ✅ ajout pour gérer CORS
const connectDB = require("./src/config/db");

dotenv.config();

const app = express();

// ✅ Middleware indispensables
app.use(express.json());

// ✅ Autoriser le frontend (localhost:5173) via CORS
app.use(cors({
  origin: "http://localhost:5173", // autorise ton frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Import des routes
const authRoutes = require("./src/routes/authRoutes");
const accountRoutes = require("./src/routes/accountRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");

console.log("AUTH ROUTES  =>", authRoutes);
console.log("ACCOUNT ROUTES =>", accountRoutes);

// ✅ Utilisation des routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

// ✅ Connexion à la base
connectDB();

// ✅ Route de test
app.get("/", (req, res) => {
  res.send("API MYBANQUE 🚀");
});

// ✅ Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));