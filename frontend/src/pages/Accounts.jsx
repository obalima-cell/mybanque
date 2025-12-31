import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import accountApi from "../api/account.api";
import "./Accounts.css";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [modalAmount, setModalAmount] = useState("");
  const [modalError, setModalError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await accountApi.getAccounts();
      setAccounts(res.data);
    } catch (err) {
      console.error("Erreur chargement comptes:", err);
      setError("Impossible de charger vos comptes");
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async () => {
    try {
      setIsCreating(true);
      setError("");
      setSuccess("");
      await accountApi.createAccount();
      await loadAccounts();
      setSuccess("Compte créé avec succès ! 🎉");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Erreur création compte:", err);
      setError("Impossible de créer un compte");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setModalError("");
    
    const amount = parseFloat(modalAmount);
    if (!amount || amount <= 0) {
      setModalError("Montant invalide");
      return;
    }

    try {
      setIsProcessing(true);
      await accountApi.deposit(selectedAccount._id, amount);
      setShowDepositModal(false);
      setModalAmount("");
      setSelectedAccount(null);
      await loadAccounts();
      setSuccess(`Dépôt de ${formatCurrency(amount)} effectué ! ✅`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Erreur dépôt:", err);
      setModalError(err.response?.data?.message || "Erreur lors du dépôt");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setModalError("");
    
    const amount = parseFloat(modalAmount);
    if (!amount || amount <= 0) {
      setModalError("Montant invalide");
      return;
    }

    if (amount > selectedAccount.balance) {
      setModalError("Solde insuffisant");
      return;
    }

    try {
      setIsProcessing(true);
      await accountApi.withdraw(selectedAccount._id, amount);
      setShowWithdrawModal(false);
      setModalAmount("");
      setSelectedAccount(null);
      await loadAccounts();
      setSuccess(`Retrait de ${formatCurrency(amount)} effectué ! ✅`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Erreur retrait:", err);
      setModalError(err.response?.data?.message || "Erreur lors du retrait");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  };

  const openModal = (type, account) => {
    setSelectedAccount(account);
    setModalAmount("");
    setModalError("");
    if (type === "deposit") setShowDepositModal(true);
    else setShowWithdrawModal(true);
  };

  const closeModals = () => {
    setShowDepositModal(false);
    setShowWithdrawModal(false);
    setSelectedAccount(null);
    setModalAmount("");
    setModalError("");
  };

  return (
    <>
 
      <div className="accounts-page">
        <div className="accounts-background">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
        </div>

        <div className="container accounts-container">
          {/* Header */}
          <header className="accounts-header">
            <div className="header-content">
              <div>
                <h1 className="accounts-title">
                  Mes Comptes <span className="title-icon">💳</span>
                </h1>
                <p className="accounts-subtitle">
                  Gérez vos comptes bancaires en toute simplicité
                </p>
              </div>
              <button
                className="btn btn-primary btn-create"
                onClick={createAccount}
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <span className="spinner-sm"></span>
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <span>Nouveau compte</span>
                    <span className="btn-icon">+</span>
                  </>
                )}
              </button>
            </div>
          </header>

          {/* Alerts */}
          {error && (
            <div className="alert alert-error animate-slide-down">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
              <button onClick={() => setError("")} className="alert-close">✕</button>
            </div>
          )}

          {success && (
            <div className="alert alert-success animate-slide-down">
              <span className="alert-icon">✓</span>
              <span>{success}</span>
            </div>
          )}

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p className="loading-text">Chargement de vos comptes...</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-icon">🏦</div>
              <h2 className="empty-title">Aucun compte bancaire</h2>
              <p className="empty-text">
                Créez votre premier compte pour commencer à gérer vos finances
              </p>
              <button className="btn btn-primary btn-lg" onClick={createAccount}>
                <span>Créer mon premier compte</span>
                <span className="btn-icon">→</span>
              </button>
            </div>
          ) : (
            <>
              {/* Summary Card */}
              <div className="summary-banner">
                <div className="summary-content">
                  <div className="summary-icon-wrapper">
                    <span className="summary-icon">💰</span>
                  </div>
                  <div className="summary-details">
                    <p className="summary-label">Patrimoine total</p>
                    <h2 className="summary-amount">{formatCurrency(getTotalBalance())}</h2>
                    <p className="summary-info">
                      Réparti sur {accounts.length} compte{accounts.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="summary-badge">
                  <div className="badge badge-success">
                    <span className="badge-icon">✓</span>
                    <span>Tous vos comptes sont actifs</span>
                  </div>
                </div>
              </div>

              {/* Accounts Grid */}
              <section className="accounts-section">
                <div className="section-header">
                  <h2 className="section-title">Vos comptes</h2>
                  <p className="section-count">{accounts.length} compte{accounts.length > 1 ? 's' : ''}</p>
                </div>
                <div className="accounts-grid">
                  {accounts.map((account, index) => (
                    <article key={account._id} className="account-card" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="account-header">
                        <div className="account-type-badge">
                          <span className="badge-icon">🏦</span>
                          <span>Compte courant</span>
                        </div>
                        <div className="account-menu">⋮</div>
                      </div>

                      <div className="account-body">
                        <p className="account-label">Numéro de compte</p>
                        <h3 className="account-number">{account.accountNumber}</h3>
                        
                        <div className="balance-section">
                          <p className="balance-label">Solde disponible</p>
                          <h2 className="balance-amount">{formatCurrency(account.balance)}</h2>
                        </div>
                      </div>

                      <div className="account-actions">
                        <button
                          className="action-btn action-deposit"
                          onClick={() => openModal("deposit", account)}
                        >
                          <span className="action-icon">💵</span>
                          <span>Dépôt</span>
                        </button>
                        <button
                          className="action-btn action-withdraw"
                          onClick={() => openModal("withdraw", account)}
                        >
                          <span className="action-icon">💸</span>
                          <span>Retrait</span>
                        </button>
                        <Link
                          to={`/statement/${account._id}`}
                          className="action-btn action-statement"
                        >
                          <span className="action-icon">📄</span>
                          <span>Relevé</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="modal-overlay active" onClick={closeModals}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon deposit-icon">💵</div>
              <h3 className="modal-title">Effectuer un dépôt</h3>
              <button className="modal-close" onClick={closeModals}>✕</button>
            </div>

            {modalError && (
              <div className="modal-alert alert-error">
                <span>⚠️</span>
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleDeposit} className="modal-form">
              <div className="form-field">
                <label className="form-label">Compte</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedAccount?.accountNumber}
                  disabled
                />
              </div>

              <div className="form-field">
                <label className="form-label">Montant (FCFA)</label>
                <input
                  type="number"
                  className="form-input input-amount"
                  placeholder="Ex: 50000"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                  min="1"
                  step="1"
                  required
                  autoFocus
                />
                <p className="form-help">Montant minimum : 1 FCFA</p>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeModals}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={isProcessing}>
                  {isProcessing ? "Traitement..." : "Confirmer le dépôt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="modal-overlay active" onClick={closeModals}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon withdraw-icon">💸</div>
              <h3 className="modal-title">Effectuer un retrait</h3>
              <button className="modal-close" onClick={closeModals}>✕</button>
            </div>

            {modalError && (
              <div className="modal-alert alert-error">
                <span>⚠️</span>
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleWithdraw} className="modal-form">
              <div className="form-field">
                <label className="form-label">Compte</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedAccount?.accountNumber}
                  disabled
                />
              </div>

              <div className="form-field">
                <label className="form-label">Montant (FCFA)</label>
                <input
                  type="number"
                  className="form-input input-amount"
                  placeholder="Ex: 25000"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                  min="1"
                  max={selectedAccount?.balance}
                  step="1"
                  required
                  autoFocus
                />
                <p className="form-help">
                  Solde disponible : <strong>{formatCurrency(selectedAccount?.balance || 0)}</strong>
                </p>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeModals}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-danger" disabled={isProcessing}>
                  {isProcessing ? "Traitement..." : "Confirmer le retrait"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Accounts;