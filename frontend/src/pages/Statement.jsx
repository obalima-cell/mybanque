import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import accountApi from "../api/account.api";
import "./Statement.css";

const Statement = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(accountId || "");
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccountId) {
      loadAccountDetails(selectedAccountId);
    }
  }, [selectedAccountId]);

  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      const res = await accountApi.getAccounts();
      setAccounts(res.data);
      
      if (!selectedAccountId && res.data.length > 0) {
        setSelectedAccountId(res.data[0]._id);
      }
    } catch (err) {
      console.error("Erreur chargement comptes:", err);
      setError("Impossible de charger vos comptes");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAccountDetails = async (id) => {
    try {
      const accountData = accounts.find(acc => acc._id === id);
      if (accountData) {
        setAccount(accountData);
      } else {
        const res = await accountApi.getAccounts();
        const acc = res.data.find(a => a._id === id);
        setAccount(acc);
      }
    } catch (err) {
      console.error("Erreur chargement compte:", err);
    }
  };

  const downloadStatement = async () => {
    if (!selectedAccountId) {
      setError("Veuillez sélectionner un compte");
      return;
    }

    try {
      setIsDownloading(true);
      setError("");
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/accounts/${selectedAccountId}/statement/pdf`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `releve-${account?.accountNumber || 'compte'}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess("Relevé téléchargé avec succès ! ✅");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Erreur téléchargement:", err);
      setError("Impossible de télécharger le relevé");
    } finally {
      setIsDownloading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  return (
    <>
      <Navbar />
      <div className="statement-page">
        <div className="statement-background">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
        </div>

        <div className="container statement-container">
          {/* Header */}
          <header className="statement-header">
            <div className="header-content">
              <div>
                <h1 className="statement-title">
                  Relevé Bancaire <span className="title-icon">📄</span>
                </h1>
                <p className="statement-subtitle">
                  Téléchargez votre relevé de compte au format PDF
                </p>
              </div>
              <Link to="/accounts" className="btn btn-outline">
                ← Retour aux comptes
              </Link>
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
              <p className="loading-text">Chargement...</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-icon">🏦</div>
              <h2 className="empty-title">Aucun compte disponible</h2>
              <p className="empty-text">
                Créez un compte pour pouvoir télécharger des relevés
              </p>
              <Link to="/accounts" className="btn btn-primary">
                Créer un compte
              </Link>
            </div>
          ) : (
            <div className="statement-content">
              {/* Account Selection */}
              <div className="statement-card select-card">
                <div className="card-header">
                  <div className="card-icon">🏦</div>
                  <div>
                    <h3 className="card-title">Sélectionnez un compte</h3>
                    <p className="card-subtitle">Choisissez le compte pour lequel vous souhaitez un relevé</p>
                  </div>
                </div>

                <div className="accounts-selector">
                  {accounts.map((acc) => (
                    <div
                      key={acc._id}
                      className={`account-option ${selectedAccountId === acc._id ? 'selected' : ''}`}
                      onClick={() => setSelectedAccountId(acc._id)}
                    >
                      <div className="account-option-content">
                        <div className="account-option-icon">💳</div>
                        <div className="account-option-details">
                          <h4 className="account-option-number">{acc.accountNumber}</h4>
                          <p className="account-option-type">Compte bancaire</p>
                        </div>
                      </div>
                      <div className="account-option-balance">
                        <p className="balance-label">Solde</p>
                        <p className="balance-amount">{formatCurrency(acc.balance)}</p>
                      </div>
                      <div className="account-option-check">
                        {selectedAccountId === acc._id && <span>✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Account Preview */}
              {account && (
                <div className="statement-card preview-card">
                  <div className="card-header">
                    <div className="card-icon">📊</div>
                    <div>
                      <h3 className="card-title">Aperçu du compte</h3>
                      <p className="card-subtitle">Informations qui seront incluses dans le relevé</p>
                    </div>
                  </div>

                  <div className="preview-content">
                    <div className="preview-item">
                      <span className="preview-label">Numéro de compte</span>
                      <span className="preview-value">{account.accountNumber}</span>
                    </div>
                    <div className="preview-item">
                      <span className="preview-label">Type de compte</span>
                      <span className="preview-value">Compte courant</span>
                    </div>
                    <div className="preview-item">
                      <span className="preview-label">Solde actuel</span>
                      <span className="preview-value highlight">{formatCurrency(account.balance)}</span>
                    </div>
                    <div className="preview-item">
                      <span className="preview-label">Date du relevé</span>
                      <span className="preview-value">
                        {new Date().toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Download Section */}
              <div className="statement-card download-card">
                <div className="download-content">
                  <div className="download-icon-wrapper">
                    <span className="download-icon">📥</span>
                  </div>
                  <div className="download-details">
                    <h3 className="download-title">Télécharger le relevé PDF</h3>
                    <p className="download-description">
                      Le relevé comprendra l'historique complet de toutes vos transactions
                    </p>
                    <div className="download-features">
                      <div className="feature">
                        <span className="feature-icon">✓</span>
                        <span>Format PDF professionnel</span>
                      </div>
                      <div className="feature">
                        <span className="feature-icon">✓</span>
                        <span>Toutes les transactions</span>
                      </div>
                      <div className="feature">
                        <span className="feature-icon">✓</span>
                        <span>Informations détaillées</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-download"
                  onClick={downloadStatement}
                  disabled={isDownloading || !selectedAccountId}
                >
                  {isDownloading ? (
                    <>
                      <span className="spinner-sm"></span>
                      <span>Génération en cours...</span>
                    </>
                  ) : (
                    <>
                      <span className="download-btn-icon">📥</span>
                      <span>Télécharger le relevé PDF</span>
                    </>
                  )}
                </button>
              </div>

              {/* Info Card */}
              <div className="info-card">
                <div className="info-icon">💡</div>
                <div className="info-content">
                  <h4 className="info-title">Bon à savoir</h4>
                  <ul className="info-list">
                    <li>Le relevé est généré en temps réel avec vos dernières transactions</li>
                    <li>Le document est au format PDF et peut être imprimé</li>
                    <li>Conservez vos relevés pour votre comptabilité personnelle</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Statement;