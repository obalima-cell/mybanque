console.log("SERVER LOADED FROM =>", __filename);
console.log("REQUIRE CACHE =>", Object.keys(require.cache));
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

dotenv.config();

const app = express();

// Middleware indispensable !
app.use(express.json());

// 👉 AJOUTE CES 3 LIGNES :
const authRoutes = require("./src/routes/authRoutes");
const accountRoutes = require("./src/routes/accountRoutes");
console.log("AUTH ROUTES  =>", authRoutes);
console.log("ACCOUNT ROUTES =>", accountRoutes);

// Utilisation des routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", require("./src/routes/transactionRoutes"));

connectDB();

app.get("/", (req, res) => {
    res.send("API MYBANQUE 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
