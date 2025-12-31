import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import accountApi from "../api/account.api";
import "./ManageAccount.css";

const ManageAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Modals state
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalAmount, setModalAmount] = useState("");
  const [modalError, setModalError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadAccountDetails();
  }, [id]);

  const loadAccountDetails = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await accountApi.getAccountById(id);
      setAccount(res.data);
      // Charger aussi les dernières transactions
      const txRes = await accountApi.getTransactions(id);
      setTransactions(txRes.data.slice(0, 10)); // 10 dernières transactions
    } catch (err) {
      console.error("Erreur chargement compte:", err);
      setError("Impossible de charger les détails du compte");
    } finally {
      setIsLoading(false);
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
      await accountApi.deposit(id, amount);
      setShowDepositModal(false);
      setModalAmount("");
      await loadAccountDetails();
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

    if (amount > account.balance) {
      setModalError("Solde insuffisant");
      return;
    }

    try {
      setIsProcessing(true);
      await accountApi.withdraw(id, amount);
      setShowWithdrawModal(false);
      setModalAmount("");
      await loadAccountDetails();
      setSuccess(`Retrait de ${formatCurrency(amount)} effectué ! ✅`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Erreur retrait:", err);
      setModalError(err.response?.data?.message || "Erreur lors du retrait");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsProcessing(true);
      await accountApi.deleteAccount(id);
      navigate('/accounts');
    } catch (err) {
      console.error("Erreur suppression:", err);
      setError(err.response?.data?.message || "Impossible de supprimer ce compte");
      setShowDeleteModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const closeModals = () => {
    setShowDepositModal(false);
    setShowWithdrawModal(false);
    setShowDeleteModal(false);
    setModalAmount("");
    setModalError("");
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Chargement...</p>
      </div>
    );
  }

  if (error && !account) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2 className="error-title">Erreur</h2>
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/accounts')} className="btn btn-primary">
          Retour aux comptes
        </button>
      </div>
    );
  }

  return (
    <div className="manage-account-page">
      <div className="page-background">
        <div className="bg-gradient"></div>
      </div>

      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate('/accounts')} className="breadcrumb-link">
            ← Mes comptes
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Gestion du compte</span>
        </nav>

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

        {/* Account Header Card */}
        <div className="account-header-card">
          <div className="account-info-section">
            <div className="account-type-badge">
              <span className="badge-icon">🏦</span>
              <span>Compte courant</span>
            </div>
            <h1 className="account-number-large">{account?.accountNumber}</h1>
            <div className="account-status">
              <span className="status-badge status-active">
                <span className="status-dot"></span>
                Compte actif
              </span>
              <span className="account-created">
                Créé le {formatDate(account?.createdAt)}
              </span>
            </div>
          </div>

          <div className="balance-display">
            <p className="balance-label">Solde disponible</p>
            <h2 className="balance-amount-large">{formatCurrency(account?.balance || 0)}</h2>
            <div className="quick-actions">
              <button 
                className="quick-action-btn action-deposit"
                onClick={() => setShowDepositModal(true)}
              >
                <span className="action-icon">💵</span>
                <span>Dépôt</span>
              </button>
              <button 
                className="quick-action-btn action-withdraw"
                onClick={() => setShowWithdrawModal(true)}
              >
                <span className="action-icon">💸</span>
                <span>Retrait</span>
              </button>
            </div>
          </div>
        </div>

        {/* Actions Grid */}
        <section className="actions-section">
          <h2 className="section-title">Actions disponibles</h2>
          <div className="actions-grid">
            <div className="action-card" onClick={() => setShowDepositModal(true)}>
              <div className="action-card-icon deposit-icon">💵</div>
              <h3 className="action-card-title">Effectuer un dépôt</h3>
              <p className="action-card-desc">Alimentez votre compte en espèces</p>
              <div className="action-card-arrow">→</div>
            </div>

            <div className="action-card" onClick={() => setShowWithdrawModal(true)}>
              <div className="action-card-icon withdraw-icon">💸</div>
              <h3 className="action-card-title">Effectuer un retrait</h3>
              <p className="action-card-desc">Retirez de l'argent de votre compte</p>
              <div className="action-card-arrow">→</div>
            </div>

            <div className="action-card" onClick={() => navigate(`/statement/${id}`)}>
              <div className="action-card-icon statement-icon">📄</div>
              <h3 className="action-card-title">Consulter le relevé</h3>
              <p className="action-card-desc">Téléchargez votre relevé de compte</p>
              <div className="action-card-arrow">→</div>
            </div>

            <div className="action-card" onClick={() => navigate(`/transactions`)}>
              <div className="action-card-icon history-icon">📊</div>
              <h3 className="action-card-title">Historique complet</h3>
              <p className="action-card-desc">Consultez toutes vos transactions</p>
              <div className="action-card-arrow">→</div>
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="transactions-section">
          <div className="section-header">
            <h2 className="section-title">Dernières transactions</h2>
            <button 
              onClick={() => navigate(`/transactions`)}
              className="btn btn-outline btn-sm"
            >
              Voir tout →
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="empty-transactions">
              <span className="empty-icon">📭</span>
              <p>Aucune transaction pour le moment</p>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.map((tx) => (
                <div key={tx._id} className="transaction-item">
                  <div className="transaction-icon-wrapper">
                    <span className="transaction-icon">
                      {tx.type === 'deposit' ? '💵' : '💸'}
                    </span>
                  </div>
                  <div className="transaction-details">
                    <h4 className="transaction-type">
                      {tx.type === 'deposit' ? 'Dépôt' : 'Retrait'}
                    </h4>
                    <p className="transaction-date">{formatDate(tx.date)}</p>
                  </div>
                  <div className={`transaction-amount ${tx.type === 'deposit' ? 'amount-positive' : 'amount-negative'}`}>
                    {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Danger Zone */}
        <section className="danger-section">
          <h2 className="section-title danger-title">Zone dangereuse</h2>
          <div className="danger-card">
            <div className="danger-content">
              <div className="danger-icon">⚠️</div>
              <div>
                <h3 className="danger-card-title">Supprimer ce compte</h3>
                <p className="danger-card-desc">
                  Cette action est irréversible. Le compte doit avoir un solde de 0 FCFA.
                </p>
              </div>
            </div>
            <button 
              className="btn btn-danger"
              onClick={() => setShowDeleteModal(true)}
              disabled={account?.balance > 0}
            >
              Supprimer le compte
            </button>
          </div>
          {account?.balance > 0 && (
            <p className="danger-notice">
              ℹ️ Vous devez d'abord retirer tout l'argent de ce compte avant de pouvoir le supprimer.
            </p>
          )}
        </section>
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
                  value={account?.accountNumber}
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
                  value={account?.accountNumber}
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
                  max={account?.balance}
                  step="1"
                  required
                  autoFocus
                />
                <p className="form-help">
                  Solde disponible : <strong>{formatCurrency(account?.balance || 0)}</strong>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay active" onClick={closeModals}>
          <div className="modal-card modal-danger" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon danger-icon">⚠️</div>
              <h3 className="modal-title">Confirmer la suppression</h3>
              <button className="modal-close" onClick={closeModals}>✕</button>
            </div>

            <div className="modal-body">
              <p className="modal-text">
                Êtes-vous absolument sûr de vouloir supprimer le compte <strong>{account?.accountNumber}</strong> ?
              </p>
              <p className="modal-warning">
                ⚠️ Cette action est <strong>irréversible</strong>. Toutes les données liées à ce compte seront définitivement supprimées.
              </p>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={closeModals}>
                Annuler
              </button>
              <button 
                onClick={handleDeleteAccount} 
                className="btn btn-danger"
                disabled={isProcessing}
              >
                {isProcessing ? "Suppression..." : "Oui, supprimer définitivement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAccount;