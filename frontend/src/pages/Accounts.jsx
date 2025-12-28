import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import accountApi from "../api/account.api";
import "./Accounts.css";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState("");

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
      console.error("Erreur lors du chargement des comptes:", err);
      setError("Impossible de charger vos comptes");
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async () => {
    try {
      setIsCreating(true);
      await accountApi.createAccount();
      await loadAccounts();
    } catch (err) {
      console.error("Erreur lors de la création du compte:", err);
      setError("Impossible de créer un nouveau compte");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!selectedAccount || !amount) return;

    try {
      await accountApi.deposit(selectedAccount._id, parseFloat(amount));
      setShowDepositModal(false);
      setAmount("");
      setSelectedAccount(null);
      await loadAccounts();
    } catch (err) {
      console.error("Erreur lors du dépôt:", err);
      setError("Impossible d'effectuer le dépôt");
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!selectedAccount || !amount) return;

    try {
      await accountApi.withdraw(selectedAccount._id, parseFloat(amount));
      setShowWithdrawModal(false);
      setAmount("");
      setSelectedAccount(null);
      await loadAccounts();
    } catch (err) {
      console.error("Erreur lors du retrait:", err);
      setError("Impossible d'effectuer le retrait");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  };

  return (
    <>
      <Navbar />
      <div className="accounts-container">
        <div className="container">
          {/* En-tête */}
          <div className="accounts-header">
            <div>
              <h1 className="accounts-title">Mes Comptes</h1>
              <p className="accounts-subtitle">
                Gérez vos comptes bancaires
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={createAccount}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <span className="spinner spinner-sm"></span>
                  Création...
                </>
              ) : (
                <>+ Créer un compte</>
              )}
            </button>
          </div>

          {error && (
            <div className="alert alert-error mb-lg">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="accounts-loading">
              <div className="spinner"></div>
              <p>Chargement de vos comptes...</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="card text-center empty-state">
              <div className="empty-state-icon">🏦</div>
              <h3>Aucun compte disponible</h3>
              <p className="text-secondary mb-lg">
                Créez votre premier compte pour commencer
              </p>
              <button className="btn btn-primary" onClick={createAccount}>
                Créer mon premier compte
              </button>
            </div>
          ) : (
            <>
              {/* Résumé */}
              <div className="card summary-card">
                <div className="summary-content">
                  <div className="summary-icon">💰</div>
                  <div>
                    <p className="summary-label">Solde total</p>
                    <h2 className="summary-value">{formatCurrency(getTotalBalance())}</h2>
                  </div>
                </div>
                <div className="summary-info">
                  <span className="badge badge-primary">
                    {accounts.length} compte{accounts.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Liste des comptes */}
              <div className="accounts-grid">
                {accounts.map((account) => (
                  <div key={account._id} className="account-card">
                    <div className="account-card-header">
                      <div className="account-card-icon">🏦</div>
                      <div className="account-card-info">
                        <h3 className="account-card-number">
                          {account.accountNumber}
                        </h3>
                        <p className="account-card-type">Compte bancaire</p>
                      </div>
                    </div>

                    <div className="account-card-balance">
                      <p className="balance-label">Solde disponible</p>
                      <h2 className="balance-value">
                        {formatCurrency(account.balance)}
                      </h2>
                    </div>

                    <div className="account-card-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowDepositModal(true);
                        }}
                      >
                        💵 Dépôt
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowWithdrawModal(true);
                        }}
                      >
                        💸 Retrait
                      </button>
                      <Link
                        to={`/statement/${account._id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        📄 Relevé
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Dépôt */}
      {showDepositModal && (
        <div className="modal-overlay" onClick={() => setShowDepositModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Effectuer un dépôt</h3>
              <button
                className="modal-close"
                onClick={() => setShowDepositModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleDeposit}>
              <div className="form-group">
                <label className="form-label">Compte</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedAccount?.accountNumber}
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Montant (FCFA)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Entrez le montant"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDepositModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Déposer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Retrait */}
      {showWithdrawModal && (
        <div className="modal-overlay" onClick={() => setShowWithdrawModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Effectuer un retrait</h3>
              <button
                className="modal-close"
                onClick={() => setShowWithdrawModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleWithdraw}>
              <div className="form-group">
                <label className="form-label">Compte</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedAccount?.accountNumber}
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Montant (FCFA)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Entrez le montant"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  max={selectedAccount?.balance}
                  required
                />
                <p className="form-help">
                  Solde disponible: {formatCurrency(selectedAccount?.balance || 0)}
                </p>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowWithdrawModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-danger">
                  Retirer
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