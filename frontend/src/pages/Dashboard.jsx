import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import accountApi from "../api/account.api";
import { useAuth } from "../hooks/useAuth";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [stats, setStats] = useState({
    totalBalance: 0,
    accountCount: 0,
    recentTransactions: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await accountApi.getAccounts();
      const accountsData = res.data;
      setAccounts(accountsData);

      // Calculer les statistiques
      const totalBalance = accountsData.reduce((sum, acc) => sum + acc.balance, 0);
      setStats({
        totalBalance,
        accountCount: accountsData.length,
        recentTransactions: 0 // À implémenter côté backend
      });
    } catch (error) {
      console.error("Erreur lors du chargement du dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="container">
          {/* En-tête */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">
                Bonjour {user?.name} 👋
              </h1>
              <p className="dashboard-subtitle">
                Voici un aperçu de vos finances
              </p>
            </div>
            <Link to="/accounts" className="btn btn-primary">
              Gérer mes comptes
            </Link>
          </div>

          {isLoading ? (
            <div className="dashboard-loading">
              <div className="spinner"></div>
              <p>Chargement de vos données...</p>
            </div>
          ) : (
            <>
              {/* Cartes de statistiques */}
              <div className="stats-grid">
                <div className="stat-card stat-primary">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <p className="stat-label">Solde total</p>
                    <h2 className="stat-value">{formatCurrency(stats.totalBalance)}</h2>
                  </div>
                </div>

                <div className="stat-card stat-secondary">
                  <div className="stat-icon">🏦</div>
                  <div className="stat-content">
                    <p className="stat-label">Mes comptes</p>
                    <h2 className="stat-value">{stats.accountCount}</h2>
                  </div>
                </div>

                <div className="stat-card stat-accent">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <p className="stat-label">Transactions ce mois</p>
                    <h2 className="stat-value">{stats.recentTransactions}</h2>
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="card quick-actions-card">
                <h3 className="card-title mb-lg">Actions rapides</h3>
                <div className="quick-actions-grid">
                  <Link to="/accounts" className="quick-action-item">
                    <div className="quick-action-icon">💳</div>
                    <div className="quick-action-content">
                      <h4>Mes comptes</h4>
                      <p>Consulter vos comptes</p>
                    </div>
                  </Link>

                  <Link to="/transfer" className="quick-action-item">
                    <div className="quick-action-icon">💸</div>
                    <div className="quick-action-content">
                      <h4>Virement</h4>
                      <p>Transférer de l'argent</p>
                    </div>
                  </Link>

                  <Link to="/transactions" className="quick-action-item">
                    <div className="quick-action-icon">📜</div>
                    <div className="quick-action-content">
                      <h4>Historique</h4>
                      <p>Voir vos transactions</p>
                    </div>
                  </Link>

                  <Link to="/statement" className="quick-action-item">
                    <div className="quick-action-icon">📄</div>
                    <div className="quick-action-content">
                      <h4>Relevé bancaire</h4>
                      <p>Télécharger un relevé</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Liste des comptes */}
              {accounts.length > 0 && (
                <div className="card accounts-overview-card">
                  <div className="card-header-flex">
                    <h3 className="card-title mb-0">Mes comptes</h3>
                    <Link to="/accounts" className="btn btn-secondary btn-sm">
                      Voir tout
                    </Link>
                  </div>
                  
                  <div className="accounts-list">
                    {accounts.slice(0, 3).map((account) => (
                      <div key={account._id} className="account-item">
                        <div className="account-info">
                          <div className="account-icon">🏦</div>
                          <div>
                            <h4 className="account-number">{account.accountNumber}</h4>
                            <p className="account-label">Compte bancaire</p>
                          </div>
                        </div>
                        <div className="account-balance">
                          {formatCurrency(account.balance)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;