console.log("ACCOUNT CONTROLLER LOADED FROM =>", __filename);

const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const generateAccountNumber = require("../utils/generateAccountNumber");
const PDFDocument = require("pdfkit");

// =====================
// CRÉATION DE COMPTE
// =====================
const createAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        const account = await Account.create({
            user: userId,
            accountNumber: generateAccountNumber()
        });

        res.status(201).json({
            message: "Compte créé avec succès",
            account
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =====================
// LISTE DES COMPTES
// =====================
const getMyAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ user: req.user._id });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =====================
// DÉPÔT
// =====================
const depositMoney = async (req, res) => {
    try {
        const accountId = req.params.id;
        const { amount } = req.body;

        if (!amount || amount <= 0)
            return res.status(400).json({ message: "Le montant doit être > 0" });

        const account = await Account.findById(accountId);
        if (!account) return res.status(404).json({ message: "Compte introuvable" });

        if (account.user.toString() !== req.user.id)
            return res.status(403).json({ message: "Accès refusé" });

        account.balance += amount;
        await account.save();

        await Transaction.create({
            user: req.user.id,
            account: account._id,
            type: "DEPOSIT",
            amount
        });

        res.json({ message: "Dépôt effectué", account });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =====================
// RETRAIT
// =====================
const withdrawMoney = async (req, res) => {
    try {
        const accountId = req.params.id;
        const { amount } = req.body;

        if (!amount || amount <= 0)
            return res.status(400).json({ message: "Le montant doit être > 0" });

        const account = await Account.findById(accountId);
        if (!account) return res.status(404).json({ message: "Compte introuvable" });

        if (account.user.toString() !== req.user.id)
            return res.status(403).json({ message: "Accès refusé" });

        if (account.balance < amount)
            return res.status(400).json({ message: "Solde insuffisant" });

        account.balance -= amount;
        await account.save();

        await Transaction.create({
            user: req.user.id,
            account: account._id,
            type: "WITHDRAW",
            amount
        });

        res.json({ message: "Retrait effectué", account });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =====================
// VIREMENT
// =====================
const transferMoney = async (req, res) => {
    try {
        const { from, to, amount } = req.body;

        if (!amount || amount <= 0)
            return res.status(400).json({ message: "Montant invalide" });

        const source = await Account.findById(from);
        const dest = await Account.findById(to);

        if (!source || !dest)
            return res.status(404).json({ message: "Compte introuvable" });

        if (source.user.toString() !== req.user.id || dest.user.toString() !== req.user.id)
            return res.status(403).json({ message: "Accès refusé" });

        if (source.balance < amount)
            return res.status(400).json({ message: "Solde insuffisant" });

        source.balance -= amount;
        dest.balance += amount;

        await source.save();
        await dest.save();

        await Transaction.create({
            user: req.user.id,
            account: source._id,
            type: "TRANSFER",
            amount,
            fromAccount: source._id,
            toAccount: dest._id
        });

        res.json({ message: "Virement effectué", from: source, to: dest });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =====================
// HISTORIQUE PAGINÉ
// =====================
const getTransactions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Transaction.countDocuments({ user: req.user.id });

        const transactions = await Transaction.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: transactions
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// RELEVÉ BANCAIRE PDF
// =============================
const generateStatementPDF = async (req, res) => {
    try {
        const accountId = req.params.id;

        const account = await Account.findById(accountId);
        if (!account) return res.status(404).json({ message: "Compte introuvable" });

        if (account.user.toString() !== req.user.id)
            return res.status(403).json({ message: "Accès refusé" });

        const transactions = await Transaction.find({ account: accountId })
            .sort({ createdAt: -1 });

        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=releve-${account.accountNumber}.pdf`);

        doc.pipe(res);

        doc.fontSize(22).text("RELEVÉ BANCAIRE", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).text(`Client : ${req.user.name}`);
        doc.text(`Numéro de compte : ${account.accountNumber}`);
        doc.text(`Date : ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

        doc.moveDown();

        doc.fontSize(14).text("Transactions :", { underline: true });
        doc.moveDown();

        if (transactions.length === 0) {
            doc.text("Aucune transaction disponible.");
        } else {
            transactions.forEach(t => {
                doc.fontSize(12).text(
                    `${t.createdAt.toLocaleDateString()} - ${t.type} - ${t.amount} FCFA`,
                    { indent: 20 }
                );
            });
        }

        doc.end();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================
// EXPORT UNIQUE (IMPORTANT)
// =============================
module.exports = {
    createAccount,
    getMyAccounts,
    depositMoney,
    withdrawMoney,
    transferMoney,
    getTransactions,
    generateStatementPDF
};
