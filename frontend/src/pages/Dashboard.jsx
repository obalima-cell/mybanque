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
  const [error, setError] = useState("");
  const [greeting, setGreeting] = useState("");

  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

  useEffect(() => {
    loadDashboardData();
    setDynamicGreeting();
  }, []);

  const setDynamicGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  };

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await accountApi.getAccounts();
      const accountsData = res.data;
      setAccounts(accountsData);

      const totalBalance = accountsData.reduce((sum, acc) => sum + acc.balance, 0);
      setStats({
        totalBalance,
        accountCount: accountsData.length,
        recentTransactions: 0
      });
    } catch (err) {
      console.error("Erreur dashboard:", err);
      setError("Impossible de charger vos données");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const getBalanceTrend = () => {
    const balance = stats.totalBalance;
    if (balance === 0) return { text: "Commencez à épargner", icon: "📈", color: "neutral" };
    if (balance < 100000) return { text: "+5.2% ce mois", icon: "📈", color: "success" };
    return { text: "+12.8% ce mois", icon: "🚀", color: "success" };
  };

  // Actions rapides pour utilisateurs normaux
  const userQuickActions = [
    {
      to: "/accounts",
      icon: "💳",
      title: "Mes comptes",
      description: "Gérer vos comptes",
      color: "blue"
    },
    {
      to: "/transfer",
      icon: "💸",
      title: "Virement",
      description: "Transférer de l'argent",
      color: "purple"
    },
    {
      to: "/transactions",
      icon: "📜",
      title: "Historique",
      description: "Voir vos transactions",
      color: "green"
    },
    {
      to: "/statement",
      icon: "📄",
      title: "Relevé PDF",
      description: "Télécharger un relevé",
      color: "orange"
    }
  ];

  // Actions rapides pour administrateurs
  const adminQuickActions = [
    {
      to: "/admin/users",
      icon: "👥",
      title: "Gestion utilisateurs",
      description: "Gérer tous les utilisateurs",
      color: "red",
      adminOnly: true
    },
    {
      to: "/admin/create-user",
      icon: "✨",
      title: "Créer utilisateur",
      description: "Ajouter un nouvel utilisateur",
      color: "purple",
      adminOnly: true
    },
    {
      to: "/admin/transactions",
      icon: "📊",
      title: "Toutes transactions",
      description: "Voir toutes les transactions",
      color: "blue",
      adminOnly: true
    },
    {
      to: "/admin/reports",
      icon: "📈",
      title: "Rapports",
      description: "Générer des rapports",
      color: "green",
      adminOnly: true
    }
  ];

  // Actions à afficher selon le rôle
  const quickActions = isAdmin 
    ? [...adminQuickActions, ...userQuickActions.slice(0, 2)] 
    : userQuickActions;

  const balanceTrend = getBalanceTrend();

  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        <div className="dashboard-background">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
        </div>

        <div className="container dashboard-container">
          {/* Header avec badge admin */}
          <header className="dashboard-header">
            <div className="header-content">
              <div className="greeting-section">
                <h1 className="greeting-title">
                  {greeting}, <span className="user-name">{user?.name || "Utilisateur"}</span>
                  <span className="wave-emoji">👋</span>
                </h1>
                <p className="greeting-subtitle">
                  {new Date().toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                  {isAdmin && (
                    <span className="admin-badge">
                      <span className="badge-icon">👑</span>
                      Administrateur
                    </span>
                  )}
                </p>
              </div>
              <div className="header-actions">
                {isAdmin && (
                  <Link to="/admin/create-user" className="btn btn-admin btn-with-icon">
                    <span>Créer utilisateur</span>
                    <span className="btn-icon">👥</span>
                  </Link>
                )}
                <Link to="/accounts" className="btn btn-primary btn-with-icon">
                  <span>Nouveau compte</span>
                  <span className="btn-icon">+</span>
                </Link>
              </div>
            </div>
          </header>

          {error && (
            <div className="alert alert-error mb-lg">
              <span>⚠️</span>
              <span>{error}</span>
              <button onClick={loadDashboardData} className="alert-retry">
                Réessayer
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p className="loading-text">Chargement de votre tableau de bord...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card stat-primary">
                  <div className="stat-card-header">
                    <div className="stat-icon-wrapper">
                      <span className="stat-icon">💰</span>
                    </div>
                    <div className="stat-badge">
                      <span className={`trend-indicator ${balanceTrend.color}`}>
                        {balanceTrend.icon} {balanceTrend.text}
                      </span>
                    </div>
                  </div>
                  <div className="stat-body">
                    <p className="stat-label">Solde total</p>
                    <h2 className="stat-value">{formatCurrency(stats.totalBalance)}</h2>
                  </div>
                  <div className="stat-footer">
                    <Link to="/accounts" className="stat-link">
                      Voir détails →
                    </Link>
                  </div>
                </div>

                <div className="stat-card stat-secondary">
                  <div className="stat-card-header">
                    <div className="stat-icon-wrapper">
                      <span className="stat-icon">🏦</span>
                    </div>
                  </div>
                  <div className="stat-body">
                    <p className="stat-label">Comptes actifs</p>
                    <h2 className="stat-value">{stats.accountCount}</h2>
                  </div>
                  <div className="stat-footer">
                    <Link to="/accounts" className="stat-link">
                      Gérer →
                    </Link>
                  </div>
                </div>

                <div className="stat-card stat-accent">
                  <div className="stat-card-header">
                    <div className="stat-icon-wrapper">
                      <span className="stat-icon">📊</span>
                    </div>
                  </div>
                  <div className="stat-body">
                    <p className="stat-label">Transactions ce mois</p>
                    <h2 className="stat-value">{stats.recentTransactions}</h2>
                  </div>
                  <div className="stat-footer">
                    <Link to="/transactions" className="stat-link">
                      Historique →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Section Admin si l'utilisateur est admin */}
              {isAdmin && (
                <section className="admin-section">
                  <div className="section-header">
                    <h2 className="section-title">
                      <span className="admin-title-icon">👑</span>
                      Administration
                    </h2>
                    <p className="section-subtitle">Gestion du système bancaire</p>
                  </div>
                  <div className="admin-grid">
                    <Link to="/admin/users" className="admin-card">
                      <div className="admin-card-icon">👥</div>
                      <div className="admin-card-content">
                        <h3>Gestion utilisateurs</h3>
                        <p>Gérer tous les comptes utilisateurs</p>
                      </div>
                      <div className="admin-card-badge">12 actifs</div>
                      <div className="admin-card-arrow">→</div>
                    </Link>

                    <Link to="/admin/create-user" className="admin-card">
                      <div className="admin-card-icon">✨</div>
                      <div className="admin-card-content">
                        <h3>Créer un utilisateur</h3>
                        <p>Ajouter un nouvel utilisateur au système</p>
                      </div>
                      <div className="admin-card-badge">Nouveau</div>
                      <div className="admin-card-arrow">→</div>
                    </Link>

                    <Link to="/admin/transactions" className="admin-card">
                      <div className="admin-card-icon">📊</div>
                      <div className="admin-card-content">
                        <h3>Toutes transactions</h3>
                        <p>Voir l'historique complet</p>
                      </div>
                      <div className="admin-card-badge">245</div>
                      <div className="admin-card-arrow">→</div>
                    </Link>

                    <Link to="/admin/reports" className="admin-card">
                      <div className="admin-card-icon">📈</div>
                      <div className="admin-card-content">
                        <h3>Rapports</h3>
                        <p>Générer des rapports détaillés</p>
                      </div>
                      <div className="admin-card-arrow">→</div>
                    </Link>
                  </div>
                </section>
              )}

              {/* Quick Actions */}
              <section className="quick-actions-section">
                <div className="section-header">
                  <h2 className="section-title">
                    {isAdmin ? "Actions rapides" : "Actions rapides"}
                  </h2>
                  <p className="section-subtitle">
                    {isAdmin ? "Accédez rapidement aux fonctionnalités" : "Accédez rapidement à vos opérations"}
                  </p>
                </div>
                <div className="quick-actions-grid">
                  {quickActions.map((action, index) => (
                    <Link 
                      key={index} 
                      to={action.to} 
                      className={`quick-action-card action-${action.color} ${action.adminOnly ? 'admin-action' : ''}`}
                    >
                      <div className="action-icon-wrapper">
                        <span className="action-icon">{action.icon}</span>
                      </div>
                      <div className="action-content">
                        <h3 className="action-title">
                          {action.title}
                          {action.adminOnly && (
                            <span className="action-admin-badge">ADMIN</span>
                          )}
                        </h3>
                        <p className="action-description">{action.description}</p>
                      </div>
                      <div className="action-arrow">→</div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Accounts Overview */}
              {accounts.length > 0 ? (
                <section className="accounts-section">
                  <div className="section-header">
                    <div>
                      <h2 className="section-title">Vos comptes</h2>
                      <p className="section-subtitle">
                        {accounts.length} compte{accounts.length > 1 ? 's' : ''} bancaire{accounts.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <Link to="/accounts" className="btn btn-outline btn-sm">
                      Voir tout
                    </Link>
                  </div>
                  <div className="accounts-grid">
                    {accounts.slice(0, 3).map((account) => (
                      <div key={account._id} className="account-card">
                        <div className="account-card-header">
                          <div className="account-type-badge">
                            <span className="badge-icon">🏦</span>
                            <span>Compte courant</span>
                          </div>
                        </div>
                        <div className="account-card-body">
                          <p className="account-number">{account.accountNumber}</p>
                          <div className="account-balance-wrapper">
                            <p className="balance-label">Solde disponible</p>
                            <h3 className="balance-amount">
                              {formatCurrency(account.balance)}
                            </h3>
                          </div>
                        </div>
                        <div className="account-card-footer">
                          <Link to={`/accounts/${account._id}`} className="account-link">
                            Gérer ce compte
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="empty-state">
                  <div className="empty-state-icon">🏦</div>
                  <h3 className="empty-state-title">Aucun compte</h3>
                  <p className="empty-state-text">
                    Créez votre premier compte pour commencer à utiliser MyBanque
                  </p>
                  <Link to="/accounts" className="btn btn-primary btn-lg">
                    Créer un compte
                  </Link>
                </section>
              )}

              {/* Tips Section */}
              <section className="tips-section">
                <div className="tip-card">
                  <div className="tip-icon">💡</div>
                  <div className="tip-content">
                    <h4 className="tip-title">Astuce du jour</h4>
                    <p className="tip-text">
                      Activez les notifications pour être alerté de chaque transaction sur vos comptes
                    </p>
                  </div>
                  <button className="tip-action">Activer</button>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;