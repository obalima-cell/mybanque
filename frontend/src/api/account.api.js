// src/api/account.api.js
import api from "./axios";

// =============================
// GESTION DES COMPTES
// =============================

/**
 * Récupérer tous les comptes de l'utilisateur
 */
export const getAccounts = () => {
  return api.get("/accounts");
};

/**
 * Créer un nouveau compte
 */
export const createAccount = () => {
  return api.post("/accounts");
};

/**
 * Effectuer un dépôt sur un compte
 * @param {string} accountId - ID du compte
 * @param {number} amount - Montant à déposer
 */
export const deposit = (accountId, amount) => {
  return api.post(`/accounts/${accountId}/deposit`, { amount });
};

/**
 * Effectuer un retrait sur un compte
 * @param {string} accountId - ID du compte
 * @param {number} amount - Montant à retirer
 */
export const withdraw = (accountId, amount) => {
  return api.post(`/accounts/${accountId}/withdraw`, { amount });
};

/**
 * Effectuer un virement entre deux comptes
 * @param {string} fromAccountId - ID du compte source
 * @param {string} toAccountId - ID du compte destination
 * @param {number} amount - Montant à transférer
 */
export const transfer = (fromAccountId, toAccountId, amount) => {
  return api.post("/accounts/transfer", {
    from: fromAccountId,
    to: toAccountId,
    amount
  });
};

// =============================
// TRANSACTIONS
// =============================

/**
 * Récupérer l'historique des transactions avec pagination
 * @param {number} page - Numéro de page (par défaut: 1)
 * @param {number} limit - Nombre de transactions par page (par défaut: 10)
 */
export const getTransactions = (page = 1, limit = 10) => {
  return api.get(`/accounts/history?page=${page}&limit=${limit}`);
};

// =============================
// RELEVÉ BANCAIRE
// =============================

/**
 * Télécharger le relevé bancaire en PDF
 * @param {string} accountId - ID du compte
 */
export const downloadStatement = (accountId) => {
  return api.get(`/accounts/${accountId}/statement/pdf`, {
    responseType: "blob",
  });
};

// =============================
// EXPORT PAR DÉFAUT
// =============================
export default {
  getAccounts,
  createAccount,
  deposit,
  withdraw,
  transfer,
  getTransactions,
  downloadStatement
};