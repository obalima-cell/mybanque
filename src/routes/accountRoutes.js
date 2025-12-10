const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

// Charger le controller ENTIER
const controller = require("../controllers/accountController");

const {
    createAccount,
    getMyAccounts,
    depositMoney,
    withdrawMoney,
    transferMoney,
    getTransactions,
    generateStatementPDF
} = controller;

const router = express.Router();

console.log("=== DEBUG ROUTES ===");
console.log("createAccount =", createAccount);
console.log("getMyAccounts =", getMyAccounts);
console.log("depositMoney =", depositMoney);
console.log("withdrawMoney =", withdrawMoney);
console.log("transferMoney =", transferMoney);
console.log("getTransactions =", getTransactions);
console.log("generateStatementPDF =", generateStatementPDF);
console.log("====================");

// ➕ Créer un compte
router.post("/", authMiddleware, createAccount);

// 📄 Lister les comptes
router.get("/", authMiddleware, getMyAccounts);

// 💰 Dépôt
router.post("/:id/deposit", authMiddleware, depositMoney);

// 💸 Retrait
router.post("/:id/withdraw", authMiddleware, withdrawMoney);

// 🔄 Virement interne
router.post("/transfer", authMiddleware, transferMoney);

// 📜 Historique des transactions
router.get("/history", authMiddleware, getTransactions);

// 📄 Relevé bancaire PDF
router.get("/:id/statement/pdf", authMiddleware, generateStatementPDF);

module.exports = router;
