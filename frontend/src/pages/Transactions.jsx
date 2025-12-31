import { useEffect, useState } from "react";

import accountApi from "../api/account.api";
import "./Transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, [pagination.page]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await accountApi.getTransactions(pagination.page, pagination.limit);
      
      setTransactions(res.data.data || []);
      setPagination({
        page: res.data.page,
        limit: res.data.limit,
        total: res.data.total,
        totalPages: res.data.totalPages
      });
    } catch (err) {
      console.error("Erreur transactions:", err);
      setError("Impossible de charger l'historique");
    } finally {
      setIsLoading(false);
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

  const formatDateShort = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTransactionIcon = (type) => {
    const icons = {
      DEPOSIT: "💵",
      WITHDRAW: "💸",
      TRANSFER: "🔄"
    };
    return icons[type] || "📝";
  };

  const getTransactionLabel = (type) => {
    const labels = {
      DEPOSIT: "Dépôt",
      WITHDRAW: "Retrait",
      TRANSFER: "Virement"
    };
    return labels[type] || type;
  };

  const getTransactionColor = (type) => {
    const colors = {
      DEPOSIT: "success",
      WITHDRAW: "error",
      TRANSFER: "primary"
    };
    return colors[type] || "neutral";
  };

  const filteredTransactions = transactions
    .filter(tx => filter === "ALL" || tx.type === filter)
    .filter(tx => {
      if (!searchTerm) return true;
      return (
        tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.amount.toString().includes(searchTerm)
      );
    });

  const getTotalAmount = () => {
    return filteredTransactions.reduce((sum, tx) => {
      return tx.type === "WITHDRAW" ? sum - tx.amount : sum + tx.amount;
    }, 0);
  };

  const getFilterCount = (filterType) => {
    if (filterType === "ALL") return transactions.length;
    return transactions.filter(tx => tx.type === filterType).length;
  };

  const changePage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      
      <div className="transactions-page">
        <div className="transactions-background">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
        </div>

        <div className="container transactions-container">
          {/* Header */}
          <header className="transactions-header">
            <div className="header-content">
              <div>
                <h1 className="transactions-title">
                  Historique <span className="title-icon">📜</span>
                </h1>
                <p className="transactions-subtitle">
                  {pagination.total} transaction{pagination.total > 1 ? 's' : ''} enregistrée{pagination.total > 1 ? 's' : ''}
                </p>
              </div>
              <div className="header-stats">
                <div className="stat-pill">
                  <span className="stat-label">Bilan</span>
                  <span className={`stat-value ${getTotalAmount() >= 0 ? 'positive' : 'negative'}`}>
                    {getTotalAmount() >= 0 ? '+' : ''}{formatCurrency(getTotalAmount())}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {error && (
            <div className="alert alert-error animate-slide-down">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
              <button onClick={loadTransactions} className="alert-retry">
                Réessayer
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p className="loading-text">Chargement de vos transactions...</p>
            </div>
          ) : (
            <>
              {/* Filters & Search */}
              <div className="controls-section">
                <div className="filters-wrapper">
                  <div className="filter-tabs">
                    {[
                      { key: "ALL", label: "Toutes", icon: "📊" },
                      { key: "DEPOSIT", label: "Dépôts", icon: "💵" },
                      { key: "WITHDRAW", label: "Retraits", icon: "💸" },
                      { key: "TRANSFER", label: "Virements", icon: "🔄" }
                    ].map(({ key, label, icon }) => (
                      <button
                        key={key}
                        className={`filter-tab ${filter === key ? "active" : ""}`}
                        onClick={() => setFilter(key)}
                      >
                        <span className="filter-icon">{icon}</span>
                        <span className="filter-label">{label}</span>
                        <span className="filter-count">{getFilterCount(key)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="search-wrapper">
                  <div className="search-input-container">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Rechercher une transaction..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="search-clear"
                        onClick={() => setSearchTerm("")}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Transactions List */}
              {filteredTransactions.length === 0 ? (
                <div className="empty-state-card">
                  <div className="empty-icon">
                    {searchTerm ? "🔍" : "📭"}
                  </div>
                  <h2 className="empty-title">
                    {searchTerm ? "Aucun résultat" : "Aucune transaction"}
                  </h2>
                  <p className="empty-text">
                    {searchTerm 
                      ? `Aucune transaction ne correspond à "${searchTerm}"`
                      : filter === "ALL"
                        ? "Vous n'avez effectué aucune transaction pour le moment"
                        : `Aucune transaction de type "${getTransactionLabel(filter)}"`
                    }
                  </p>
                  {searchTerm && (
                    <button className="btn btn-outline" onClick={() => setSearchTerm("")}>
                      Effacer la recherche
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="transactions-grid">
                    {filteredTransactions.map((tx, index) => (
                      <article
                        key={tx._id}
                        className={`transaction-card transaction-${getTransactionColor(tx.type)}`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onClick={() => setSelectedTransaction(tx)}
                      >
                        <div className="transaction-header">
                          <div className="transaction-icon-wrapper">
                            <span className="transaction-icon">
                              {getTransactionIcon(tx.type)}
                            </span>
                          </div>
                          <div className="transaction-badge">
                            <span className={`badge badge-${getTransactionColor(tx.type)}`}>
                              {getTransactionLabel(tx.type)}
                            </span>
                          </div>
                        </div>

                        <div className="transaction-body">
                          <div className="transaction-details">
                            <p className="transaction-type-label">
                              {getTransactionLabel(tx.type)}
                            </p>
                            <p className="transaction-date">
                              {formatDateShort(tx.createdAt)}
                            </p>
                          </div>

                          <div className="transaction-amount-section">
                            <div className={`transaction-amount ${tx.type === "WITHDRAW" ? "negative" : "positive"}`}>
                              <span className="amount-sign">
                                {tx.type === "WITHDRAW" ? "−" : "+"}
                              </span>
                              <span className="amount-value">
                                {formatCurrency(tx.amount)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="transaction-footer">
                          <button className="transaction-details-btn">
                            Voir détails →
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <nav className="pagination-nav">
                      <button
                        className="btn btn-outline pagination-btn"
                        onClick={() => changePage(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        <span>←</span>
                        <span>Précédent</span>
                      </button>
                      
                      <div className="pagination-pages">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                          .filter(page => {
                            const current = pagination.page;
                            return page === 1 || 
                                   page === pagination.totalPages || 
                                   (page >= current - 1 && page <= current + 1);
                          })
                          .map((page, index, array) => (
                            <div key={page}>
                              {index > 0 && array[index - 1] !== page - 1 && (
                                <span className="pagination-ellipsis">...</span>
                              )}
                              <button
                                className={`pagination-page ${pagination.page === page ? 'active' : ''}`}
                                onClick={() => changePage(page)}
                              >
                                {page}
                              </button>
                            </div>
                          ))}
                      </div>

                      <button
                        className="btn btn-outline pagination-btn"
                        onClick={() => changePage(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        <span>Suivant</span>
                        <span>→</span>
                      </button>
                    </nav>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="modal-overlay active" onClick={() => setSelectedTransaction(null)}>
          <div className="modal-card transaction-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className={`modal-icon transaction-${getTransactionColor(selectedTransaction.type)}`}>
                {getTransactionIcon(selectedTransaction.type)}
              </div>
              <h3 className="modal-title">Détails de la transaction</h3>
              <button className="modal-close" onClick={() => setSelectedTransaction(null)}>
                ✕
              </button>
            </div>

            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">Type</span>
                <span className={`badge badge-${getTransactionColor(selectedTransaction.type)}`}>
                  {getTransactionLabel(selectedTransaction.type)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Montant</span>
                <span className={`detail-value amount ${selectedTransaction.type === "WITHDRAW" ? "negative" : "positive"}`}>
                  {selectedTransaction.type === "WITHDRAW" ? "−" : "+"} {formatCurrency(selectedTransaction.amount)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date et heure</span>
                <span className="detail-value">{formatDate(selectedTransaction.createdAt)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Référence</span>
                <span className="detail-value mono">{selectedTransaction._id.slice(-12)}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline btn-block" onClick={() => setSelectedTransaction(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Transactions;