import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
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
  const [filter, setFilter] = useState("ALL"); // ALL, DEPOSIT, WITHDRAW, TRANSFER

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
      console.error("Erreur lors du chargement des transactions:", err);
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

  const getTransactionIcon = (type) => {
    switch (type) {
      case "DEPOSIT":
        return "💵";
      case "WITHDRAW":
        return "💸";
      case "TRANSFER":
        return "🔄";
      default:
        return "📝";
    }
  };

  const getTransactionLabel = (type) => {
    switch (type) {
      case "DEPOSIT":
        return "Dépôt";
      case "WITHDRAW":
        return "Retrait";
      case "TRANSFER":
        return "Virement";
      default:
        return type;
    }
  };

  const getTransactionClass = (type) => {
    switch (type) {
      case "DEPOSIT":
        return "transaction-deposit";
      case "WITHDRAW":
        return "transaction-withdraw";
      case "TRANSFER":
        return "transaction-transfer";
      default:
        return "";
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    filter === "ALL" || tx.type === filter
  );

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      setPagination({ ...pagination, page: pagination.page - 1 });
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination({ ...pagination, page: pagination.page + 1 });
    }
  };

  return (
    <>
      <Navbar />
      <div className="transactions-container">
        <div className="container">
          {/* En-tête */}
          <div className="transactions-header">
            <div>
              <h1 className="transactions-title">Historique des transactions</h1>
              <p className="transactions-subtitle">
                Consultez toutes vos opérations
              </p>
            </div>
          </div>

          {error && (
            <div className="alert alert-error mb-lg">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="transactions-loading">
              <div className="spinner"></div>
              <p>Chargement de vos transactions...</p>
            </div>
          ) : (
            <>
              {/* Filtres */}
              <div className="card filters-card">
                <div className="filters-group">
                  <button
                    className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
                    onClick={() => setFilter("ALL")}
                  >
                    Toutes
                  </button>
                  <button
                    className={`filter-btn ${filter === "DEPOSIT" ? "active" : ""}`}
                    onClick={() => setFilter("DEPOSIT")}
                  >
                    💵 Dépôts
                  </button>
                  <button
                    className={`filter-btn ${filter === "WITHDRAW" ? "active" : ""}`}
                    onClick={() => setFilter("WITHDRAW")}
                  >
                    💸 Retraits
                  </button>
                  <button
                    className={`filter-btn ${filter === "TRANSFER" ? "active" : ""}`}
                    onClick={() => setFilter("TRANSFER")}
                  >
                    🔄 Virements
                  </button>
                </div>
              </div>

              {/* Liste des transactions */}
              {filteredTransactions.length === 0 ? (
                <div className="card text-center empty-state">
                  <div className="empty-state-icon">📭</div>
                  <h3>Aucune transaction</h3>
                  <p className="text-secondary">
                    {filter === "ALL" 
                      ? "Vous n'avez effectué aucune transaction pour le moment"
                      : `Aucune transaction de type "${getTransactionLabel(filter)}"`
                    }
                  </p>
                </div>
              ) : (
                <>
                  <div className="card transactions-card">
                    <div className="transactions-list">
                      {filteredTransactions.map((tx) => (
                        <div
                          key={tx._id}
                          className={`transaction-item ${getTransactionClass(tx.type)}`}
                        >
                          <div className="transaction-icon-wrapper">
                            <div className="transaction-icon">
                              {getTransactionIcon(tx.type)}
                            </div>
                          </div>
                          
                          <div className="transaction-info">
                            <h4 className="transaction-type">
                              {getTransactionLabel(tx.type)}
                            </h4>
                            <p className="transaction-date">
                              {formatDate(tx.createdAt)}
                            </p>
                          </div>

                          <div className="transaction-amount-wrapper">
                            <div className={`transaction-amount ${tx.type === "WITHDRAW" ? "negative" : "positive"}`}>
                              {tx.type === "WITHDRAW" ? "-" : "+"} {formatCurrency(tx.amount)}
                            </div>
                            <span className={`badge badge-${tx.type === "DEPOSIT" ? "success" : tx.type === "WITHDRAW" ? "error" : "primary"}`}>
                              {getTransactionLabel(tx.type)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="pagination">
                      <button
                        className="btn btn-secondary"
                        onClick={handlePreviousPage}
                        disabled={pagination.page === 1}
                      >
                        ← Précédent
                      </button>
                      
                      <div className="pagination-info">
                        Page {pagination.page} sur {pagination.totalPages}
                        <span className="pagination-total">
                          ({pagination.total} transaction{pagination.total > 1 ? 's' : ''})
                        </span>
                      </div>

                      <button
                        className="btn btn-secondary"
                        onClick={handleNextPage}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        Suivant →
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Transactions;