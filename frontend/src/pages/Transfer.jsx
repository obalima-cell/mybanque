import { useState, useEffect } from "react";
import "./Transfer.css";
const Transfer = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    sourceAccount: null,
    destinationAccount: null,
    amount: "",
    note: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  // Mock data - Remplacez par votre API
  const recentBeneficiaries = [
    { id: 1, number: "ACC-111222", name: "Jean Dupont", favorite: true },
    { id: 2, number: "ACC-333444", name: "Marie Kaboré", favorite: false },
    { id: 3, number: "ACC-555666", name: "Pierre Ouédraogo", favorite: true },
    { id: 4, number: "ACC-777888", name: "Fatimata Traoré", favorite: false }
  ];

  useEffect(() => {
    loadUserAccounts();
  }, []);

  const loadUserAccounts = async () => {
    setLoadingAccounts(true);
    // Simulation appel API - Remplacez par accountApi.getAccounts()
    setTimeout(() => {
      setAccounts([
        { id: 1, number: "ACC-123456", balance: 150000, type: "Courant" },
        { id: 2, number: "ACC-789012", balance: 85000, type: "Épargne" },
        { id: 3, number: "ACC-456789", balance: 225000, type: "Business" }
      ]);
      setLoadingAccounts(false);
    }, 800);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const formatAmount = (value) => {
    const numStr = value.replace(/\D/g, '');
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const filteredBeneficiaries = recentBeneficiaries.filter(b =>
    b.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSourceSelect = (account) => {
    setFormData(prev => ({ ...prev, sourceAccount: account }));
    setStep(2);
  };

  const handleDestinationSelect = (beneficiary) => {
    setFormData(prev => ({ ...prev, destinationAccount: beneficiary }));
    setSearchQuery("");
    setStep(3);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, amount: value }));
    }
  };

  const handleAmountSuggestion = (percentage) => {
    if (!formData.sourceAccount) return;
    const amount = Math.floor(formData.sourceAccount.balance * (percentage / 100));
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  const handleTransfer = async () => {
    setIsLoading(true);
    
    // Simulation appel API - Remplacez par votre API de transfert
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      
      // Réinitialisation après succès
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          sourceAccount: null,
          destinationAccount: null,
          amount: "",
          note: ""
        });
        setStep(1);
      }, 3500);
    }, 1500);
  };

  const canProceed = () => {
    if (step === 3) {
      const amount = parseInt(formData.amount);
      return amount > 0 && amount <= formData.sourceAccount?.balance;
    }
    return false;
  };

  const getAmountError = () => {
    const amount = parseInt(formData.amount);
    if (!amount || amount === 0) return "Veuillez entrer un montant";
    if (amount > formData.sourceAccount?.balance) return "Solde insuffisant";
    if (amount < 100) return "Montant minimum: 100 FCFA";
    return null;
  };

  if (showSuccess) {
    return (
      <div style={styles.successOverlay}>
        <div style={styles.successCard}>
          <div style={styles.confettiContainer}>
            {[...Array(20)].map((_, i) => (
              <div key={i} style={{
                ...styles.confetti,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`
              }}>
                {['🎉', '✨', '🎊', '💫'][Math.floor(Math.random() * 4)]}
              </div>
            ))}
          </div>
          <div style={styles.successIconWrapper}>
            <div style={styles.successIcon}>✓</div>
          </div>
          <h2 style={styles.successTitle}>Virement réussi !</h2>
          <p style={styles.successText}>
            {formatCurrency(parseInt(formData.amount))} transféré avec succès
          </p>
          <div style={styles.successDetails}>
            <div style={styles.successRow}>
              <span style={styles.successLabel}>De:</span>
              <span style={styles.successValue}>{formData.sourceAccount?.number}</span>
            </div>
            <div style={styles.successDivider}></div>
            <div style={styles.successRow}>
              <span style={styles.successLabel}>Vers:</span>
              <span style={styles.successValue}>{formData.destinationAccount?.number}</span>
            </div>
            <div style={styles.successDivider}></div>
            <div style={styles.successRow}>
              <span style={styles.successLabel}>Bénéficiaire:</span>
              <span style={styles.successValue}>{formData.destinationAccount?.name}</span>
            </div>
            {formData.note && (
              <>
                <div style={styles.successDivider}></div>
                <div style={styles.successRow}>
                  <span style={styles.successLabel}>Note:</span>
                  <span style={styles.successValue}>{formData.note}</span>
                </div>
              </>
            )}
          </div>
          <div style={styles.successActions}>
            <button style={styles.successBtnSecondary} onClick={() => window.print()}>
              📄 Télécharger reçu
            </button>
            <button style={styles.successBtnPrimary} onClick={() => setShowSuccess(false)}>
              ✓ Terminer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.background}>
        <div style={styles.bgShape1}></div>
        <div style={styles.bgShape2}></div>
        <div style={styles.bgShape3}></div>
      </div>

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => window.history.back()} style={styles.backBtn}>
            ← Retour
          </button>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>
              <span style={styles.titleIcon}>💸</span>
              Effectuer un virement
            </h1>
            <p style={styles.subtitle}>Transférez de l'argent en toute sécurité entre comptes</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={styles.stepsContainer}>
          <div style={styles.stepWrapper}>
            <div style={step >= 1 ? styles.stepDotActive : styles.stepDot}>
              {step > 1 ? "✓" : "1"}
            </div>
            <span style={step >= 1 ? styles.stepLabelActive : styles.stepLabel}>
              Compte source
            </span>
          </div>
          <div style={step >= 2 ? styles.lineActive : styles.line}></div>
          <div style={styles.stepWrapper}>
            <div style={step >= 2 ? styles.stepDotActive : styles.stepDot}>
              {step > 2 ? "✓" : "2"}
            </div>
            <span style={step >= 2 ? styles.stepLabelActive : styles.stepLabel}>
              Destination
            </span>
          </div>
          <div style={step >= 3 ? styles.lineActive : styles.line}></div>
          <div style={styles.stepWrapper}>
            <div style={step >= 3 ? styles.stepDotActive : styles.stepDot}>3</div>
            <span style={step >= 3 ? styles.stepLabelActive : styles.stepLabel}>
              Montant
            </span>
          </div>
        </div>

        <div style={styles.card}>
          {/* Step 1: Source Account */}
          {step === 1 && (
            <div style={styles.stepContent}>
              <h2 style={styles.stepTitle}>
                <span style={styles.stepIcon}>💳</span>
                Sélectionnez votre compte source
              </h2>
              <p style={styles.stepDescription}>
                Choisissez le compte depuis lequel vous souhaitez effectuer le virement
              </p>

              {loadingAccounts ? (
                <div style={styles.loadingState}>
                  <div style={styles.miniSpinner}></div>
                  <p>Chargement de vos comptes...</p>
                </div>
              ) : accounts.length === 0 ? (
                <div style={styles.emptyState}>
                  <span style={styles.emptyIcon}>🏦</span>
                  <p style={styles.emptyText}>Aucun compte disponible</p>
                  <button style={styles.emptyBtn}>Créer un compte</button>
                </div>
              ) : (
                <div style={styles.accountsGrid}>
                  {accounts.map(account => (
                    <button
                      key={account.id}
                      onClick={() => handleSourceSelect(account)}
                      style={styles.accountCard}
                    >
                      <div style={styles.accountHeader}>
                        <span style={styles.accountType}>{account.type}</span>
                        <span style={styles.accountCardIcon}>💳</span>
                      </div>
                      <p style={styles.accountNumber}>{account.number}</p>
                      <div style={styles.accountBalanceSection}>
                        <span style={styles.balanceLabel}>Solde disponible</span>
                        <span style={styles.balanceAmount}>{formatCurrency(account.balance)}</span>
                      </div>
                      <div style={styles.accountFooter}>
                        <span style={styles.selectText}>Sélectionner →</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Destination Account */}
          {step === 2 && (
            <div style={styles.stepContent}>
              <button onClick={() => setStep(1)} style={styles.changeBtn}>
                ← Changer le compte source
              </button>
              
              <div style={styles.selectedAccount}>
                <div style={styles.selectedCheckmark}>✓</div>
                <div style={styles.selectedInfo}>
                  <p style={styles.selectedLabel}>Compte source sélectionné</p>
                  <p style={styles.selectedNumber}>{formData.sourceAccount?.number}</p>
                  <p style={styles.selectedBalance}>
                    Disponible: {formatCurrency(formData.sourceAccount?.balance)}
                  </p>
                </div>
              </div>

              <div style={styles.transferArrowSection}>
                <div style={styles.transferArrow}>
                  <span>↓</span>
                  <span style={styles.transferIcon}>💸</span>
                </div>
              </div>

              <h2 style={styles.stepTitle}>
                <span style={styles.stepIcon}>🎯</span>
                Vers quel compte souhaitez-vous transférer ?
              </h2>

              <div style={styles.searchBox}>
                <span style={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Rechercher par numéro de compte ou nom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={styles.clearSearch}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div style={styles.beneficiariesSection}>
                <div style={styles.sectionHeader}>
                  <h3 style={styles.sectionTitle}>
                    {filteredBeneficiaries.length === recentBeneficiaries.length 
                      ? "Bénéficiaires récents" 
                      : `${filteredBeneficiaries.length} résultat(s)`}
                  </h3>
                  <button style={styles.addNewBtn}>+ Nouveau</button>
                </div>

                {filteredBeneficiaries.length === 0 ? (
                  <div style={styles.noResults}>
                    <span>🔍</span>
                    <p>Aucun bénéficiaire trouvé</p>
                  </div>
                ) : (
                  <div style={styles.beneficiariesList}>
                    {filteredBeneficiaries.map(beneficiary => (
                      <button
                        key={beneficiary.id}
                        onClick={() => handleDestinationSelect(beneficiary)}
                        style={styles.beneficiaryCard}
                      >
                        <div style={styles.beneficiaryAvatar}>
                          {beneficiary.name.charAt(0)}
                        </div>
                        <div style={styles.beneficiaryInfo}>
                          <p style={styles.beneficiaryName}>
                            {beneficiary.name}
                            {beneficiary.favorite && (
                              <span style={styles.favoriteIcon}>⭐</span>
                            )}
                          </p>
                          <p style={styles.beneficiaryNumber}>{beneficiary.number}</p>
                        </div>
                        <span style={styles.arrowIcon}>→</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Amount */}
          {step === 3 && (
            <div style={styles.stepContent}>
              <button onClick={() => setStep(2)} style={styles.changeBtn}>
                ← Changer le bénéficiaire
              </button>

              <div style={styles.transferSummary}>
                <div style={styles.summaryCard}>
                  <span style={styles.summaryIcon}>📤</span>
                  <div>
                    <span style={styles.summaryLabel}>De</span>
                    <p style={styles.summaryValue}>{formData.sourceAccount?.number}</p>
                    <p style={styles.summaryBalance}>
                      {formatCurrency(formData.sourceAccount?.balance)}
                    </p>
                  </div>
                </div>
                
                <div style={styles.summaryArrow}>→</div>
                
                <div style={styles.summaryCard}>
                  <span style={styles.summaryIcon}>📥</span>
                  <div>
                    <span style={styles.summaryLabel}>Vers</span>
                    <p style={styles.summaryValue}>{formData.destinationAccount?.number}</p>
                    <p style={styles.summaryName}>{formData.destinationAccount?.name}</p>
                  </div>
                </div>
              </div>

              <h2 style={styles.stepTitle}>
                <span style={styles.stepIcon}>💰</span>
                Quel montant souhaitez-vous transférer ?
              </h2>

              <div style={styles.amountSection}>
                <div style={styles.amountInputWrapper}>
                  <input
                    type="text"
                    value={formatAmount(formData.amount)}
                    onChange={handleAmountChange}
                    placeholder="0"
                    style={styles.amountInput}
                    autoFocus
                  />
                  <span style={styles.currency}>FCFA</span>
                </div>
                {getAmountError() && (
                  <p style={styles.amountError}>⚠️ {getAmountError()}</p>
                )}
              </div>

              <div style={styles.suggestions}>
                <p style={styles.suggestionsLabel}>💡 Suggestions rapides</p>
                <div style={styles.suggestionsGrid}>
                  {[
                    { label: "25%", value: 25 },
                    { label: "50%", value: 50 },
                    { label: "75%", value: 75 },
                    { label: "Tout", value: 100 }
                  ].map(suggestion => (
                    <button
                      key={suggestion.value}
                      onClick={() => handleAmountSuggestion(suggestion.value)}
                      style={styles.suggestionBtn}
                    >
                      {suggestion.label}
                      <span style={styles.suggestionAmount}>
                        {formatCurrency(Math.floor(formData.sourceAccount?.balance * (suggestion.value / 100)))}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.noteSection}>
                <label style={styles.noteLabel}>
                  <span style={styles.noteIcon}>📝</span>
                  Note ou motif (optionnel)
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Ex: Remboursement, Cadeau, Loyer..."
                  style={styles.noteInput}
                  rows={3}
                  maxLength={200}
                />
                <span style={styles.charCount}>{formData.note.length}/200</span>
              </div>

              <button
                onClick={handleTransfer}
                disabled={!canProceed() || isLoading}
                style={{
                  ...styles.submitBtn,
                  opacity: !canProceed() ? 0.5 : 1,
                  cursor: !canProceed() ? "not-allowed" : "pointer"
                }}
              >
                {isLoading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={styles.spinner}></span>
                    Traitement en cours...
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span>🚀</span>
                    Confirmer le virement
                    <span style={styles.submitAmount}>
                      {formData.amount ? formatCurrency(parseInt(formData.amount)) : ""}
                    </span>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Security Banner */}
        <div style={styles.securityBanner}>
          <span style={styles.securityIcon}>🔒</span>
          <div style={styles.securityContent}>
            <strong style={styles.securityTitle}>Transfert sécurisé</strong>
            <p style={styles.securityText}>
              Vos transactions sont protégées par un cryptage SSL 256-bit
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes confettiFall {
          0% { 
            transform: translateY(-100%) rotate(0deg);
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #e8edf3 100%)",
    position: "relative",
    padding: "2rem 1rem 4rem"
  },
  background: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden"
  },
  bgShape1: {
    position: "absolute",
    width: "500px",
    height: "500px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "50%",
    filter: "blur(100px)",
    opacity: 0.1,
    top: "-150px",
    right: "-150px",
    animation: "float 20s ease-in-out infinite"
  },
  bgShape2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    borderRadius: "50%",
    filter: "blur(100px)",
    opacity: 0.1,
    bottom: "-100px",
    left: "-100px",
    animation: "float 15s ease-in-out infinite reverse"
  },
  bgShape3: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "linear-gradient(135deg, #f59e0b, #f97316)",
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: 0.08,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    animation: "pulse 10s ease-in-out infinite"
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1
  },
  header: {
    marginBottom: "2rem"
  },
  backBtn: {
    background: "white",
    border: "1px solid #e2e8f0",
    padding: "0.75rem 1.5rem",
    borderRadius: "12px",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#475569",
    cursor: "pointer",
    marginBottom: "1.5rem",
    transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
  },
  headerContent: {
    textAlign: "center"
  },
  title: {
    fontSize: "2.25rem",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem"
  },
  titleIcon: {
    fontSize: "2.5rem"
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "#64748b",
    fontWeight: 500
  },
  stepsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "2.5rem",
    background: "white",
    padding: "2rem",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)"
  },
  stepWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem"
  },
  stepDot: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#f1f5f9",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "1.125rem",
    transition: "all 0.3s"
  },
  stepDotActive: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "1.125rem",
    boxShadow: "0 6px 20px rgba(99, 102, 241, 0.4)",
    animation: "pulse 2s infinite"
  },
  stepLabel: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#94a3b8",
    textAlign: "center"
  },
  stepLabelActive: {
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#6366f1",
    textAlign: "center"
  },
  line: {
    width: "100px",
    height: "3px",
    background: "#e2e8f0",
    margin: "0 1.5rem",
    transition: "all 0.3s"
  },
  lineActive: {
    width: "100px",
    height: "3px",
    background: "linear-gradient(to right, #6366f1, #8b5cf6)",
    margin: "0 1.5rem"
  },
  card: {
    background: "white",
    borderRadius: "24px",
    padding: "3rem",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
    marginBottom: "2rem"
  },
  stepContent: {
    animation: "fadeIn 0.4s ease-out"
  },
  stepTitle: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem"
  },
  stepIcon: {
    fontSize: "2rem"
  },
  stepDescription: {
    fontSize: "1rem",
    color: "#64748b",
    marginBottom: "2rem"
  },
  changeBtn: {
    background: "none",
    border: "none",
    color: "#6366f1",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "2rem",
    padding: "0.5rem 0",
    transition: "all 0.2s"
  },
  loadingState: {
    textAlign: "center",
    padding: "3rem",
    color: "#64748b"
  },
  miniSpinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e2e8f0",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto 1rem"
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem",
    background: "#f8fafc",
    borderRadius: "16px"
  },
  emptyIcon: {
    fontSize: "4rem",
    display: "block",
    marginBottom: "1rem"
  },
  emptyText: {
    fontSize: "1rem",
    color: "#64748b",
    marginBottom: "1.5rem"
  },
  emptyBtn: {
    padding: "0.75rem 1.5rem",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: 600,
    cursor: "pointer"
  },
  accountsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem"
  },
  accountCard: {
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))",
    border: "2px solid #e2e8f0",
    borderRadius: "20px",
    padding: "1.75rem",
    cursor: "pointer",
    transition: "all 0.3s",
    textAlign: "left"
  },
  accountHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem"
  },
  accountType: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#6366f1",
    background: "rgba(99, 102, 241, 0.15)",
    padding: "0.5rem 1rem",
    borderRadius: "8px"
  },
  accountCardIcon: {
    fontSize: "1.75rem"
  },
  accountNumber: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: "1.5rem",
    fontFamily: "monospace",
    letterSpacing: "1px"
  },
 
  balanceLabel: {
    fontSize: "0.75rem",
    color: "#64748b",
    fontWeight: 600
  },
  balanceAmount: {
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#0f172a"
  },
  // ... votre code précédent reste inchangé ...

  accountFooter: {
    textAlign: "right"
  },
  selectText: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#6366f1"
  },
  selectedAccount: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))",
    border: "2px solid #10b981",
    borderRadius: "16px",
    padding: "1.25rem",
    marginBottom: "2rem"
  },
  selectedCheckmark: {
    width: "40px",
    height: "40px",
    background: "#10b981",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "1.25rem",
    flexShrink: 0
  },
  selectedInfo: {
    flex: 1
  },
  selectedLabel: {
    fontSize: "0.75rem",
    color: "#059669",
    fontWeight: 600,
    marginBottom: "0.25rem"
  },
  selectedNumber: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: "0.25rem",
    fontFamily: "monospace"
  },
  selectedBalance: {
    fontSize: "0.875rem",
    color: "#64748b",
    fontWeight: 500
  },
  transferArrowSection: {
    display: "flex",
    justifyContent: "center",
    margin: "1.5rem 0 2.5rem"
  },
  transferArrow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem"
  },
  transferIcon: {
    fontSize: "2.5rem",
    animation: "float 3s ease-in-out infinite"
  },
  searchBox: {
    position: "relative",
    marginBottom: "2rem"
  },
  searchIcon: {
    position: "absolute",
    left: "1.25rem",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "1.25rem",
    color: "#94a3b8"
  },
  searchInput: {
    width: "100%",
    padding: "1.125rem 1.25rem 1.125rem 3.5rem",
    fontSize: "1rem",
    border: "2px solid #e2e8f0",
    borderRadius: "16px",
    background: "#f8fafc",
    color: "#0f172a",
    transition: "all 0.2s"
  },
  clearSearch: {
    position: "absolute",
    right: "1.25rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    fontSize: "1.25rem",
    color: "#94a3b8",
    cursor: "pointer",
    padding: 0
  },
  beneficiariesSection: {
    marginTop: "1.5rem"
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem"
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0
  },
  addNewBtn: {
    padding: "0.75rem 1.25rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer"
  },
  noResults: {
    textAlign: "center",
    padding: "3rem",
    color: "#64748b",
    background: "#f8fafc",
    borderRadius: "16px"
  },
  beneficiariesList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem"
  },
  beneficiaryCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.25rem",
    background: "white",
    border: "2px solid #e2e8f0",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
    width: "100%"
  },
  beneficiaryAvatar: {
    width: "48px",
    height: "48px",
    background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "white",
    flexShrink: 0
  },
  beneficiaryInfo: {
    flex: 1
  },
  beneficiaryName: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.25rem 0",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  favoriteIcon: {
    fontSize: "0.875rem",
    color: "#f59e0b"
  },
  beneficiaryNumber: {
    fontSize: "0.875rem",
    color: "#64748b",
    margin: 0,
    fontFamily: "monospace"
  },
  arrowIcon: {
    fontSize: "1.5rem",
    color: "#94a3b8",
    transition: "transform 0.2s"
  },
  transferSummary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "2rem",
    marginBottom: "3rem",
    flexWrap: "wrap"
  },
  summaryCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    background: "#f8fafc",
    padding: "1.5rem",
    borderRadius: "20px",
    minWidth: "250px"
  },
  summaryIcon: {
    fontSize: "2.5rem",
    flexShrink: 0
  },
  summaryLabel: {
    fontSize: "0.75rem",
    color: "#64748b",
    fontWeight: 600,
    display: "block",
    marginBottom: "0.25rem"
  },
  summaryValue: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.25rem 0",
    fontFamily: "monospace"
  },
  summaryBalance: {
    fontSize: "0.875rem",
    color: "#10b981",
    fontWeight: 600,
    margin: 0
  },
  summaryName: {
    fontSize: "0.875rem",
    color: "#475569",
    margin: 0
  },
  summaryArrow: {
    fontSize: "2rem",
    color: "#94a3b8",
    animation: "pulse 2s infinite"
  },
  amountSection: {
    marginBottom: "2rem"
  },
  amountInputWrapper: {
    position: "relative",
    marginBottom: "0.5rem"
  },
  amountInput: {
    width: "100%",
    padding: "1.5rem",
    fontSize: "3rem",
    fontWeight: 800,
    textAlign: "center",
    border: "3px solid #e2e8f0",
    borderRadius: "20px",
    background: "#f8fafc",
    color: "#0f172a",
    transition: "all 0.2s",
    fontFamily: "monospace",
    letterSpacing: "1px"
  },
  currency: {
    position: "absolute",
    right: "1.5rem",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#64748b"
  },
  amountError: {
    fontSize: "0.875rem",
    color: "#ef4444",
    fontWeight: 600,
    textAlign: "center",
    margin: "0.5rem 0 0 0"
  },
  suggestions: {
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))",
    padding: "1.5rem",
    borderRadius: "20px",
    marginBottom: "2rem"
  },
  suggestionsLabel: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#6366f1",
    marginBottom: "1rem"
  },
  suggestionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1rem"
  },
  suggestionBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem",
    background: "white",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  suggestionAmount: {
    fontSize: "0.75rem",
    color: "#64748b",
    fontWeight: 500
  },
  noteSection: {
    marginBottom: "2.5rem"
  },
  noteLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#334155",
    marginBottom: "0.75rem"
  },
  noteIcon: {
    fontSize: "1.125rem"
  },
  noteInput: {
    width: "100%",
    padding: "1rem",
    fontSize: "0.9375rem",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    background: "#f8fafc",
    color: "#0f172a",
    transition: "all 0.2s",
    resize: "vertical",
    minHeight: "80px",
    fontFamily: "inherit"
  },
  charCount: {
    display: "block",
    textAlign: "right",
    fontSize: "0.75rem",
    color: "#94a3b8",
    marginTop: "0.5rem"
  },
  submitBtn: {
    width: "100%",
    padding: "1.5rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "white",
    border: "none",
    borderRadius: "16px",
    fontSize: "1.125rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)"
  },
  spinner: {
    width: "24px",
    height: "24px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  },
  submitAmount: {
    fontSize: "1.5rem",
    fontWeight: 800,
    marginLeft: "auto"
  },
  securityBanner: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))",
    padding: "1.25rem",
    borderRadius: "16px",
    border: "1px solid rgba(16, 185, 129, 0.2)"
  },
  securityIcon: {
    fontSize: "2rem",
    flexShrink: 0
  },
  securityContent: {
    flex: 1
  },
  securityTitle: {
    display: "block",
    fontSize: "1rem",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: "0.25rem"
  },
  securityText: {
    fontSize: "0.875rem",
    color: "#475569",
    margin: 0
  },
  // Success Overlay Styles
  successOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.95)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem"
  },
  successCard: {
    background: "white",
    padding: "3rem",
    borderRadius: "24px",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
    position: "relative",
    overflow: "hidden"
  },
  confettiContainer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none"
  },
  confetti: {
    position: "absolute",
    fontSize: "1.5rem",
    opacity: 0,
    animation: "confettiFall 3s ease-out forwards"
  },
  successIconWrapper: {
    marginBottom: "1.5rem"
  },
  successIcon: {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    fontWeight: 700,
    margin: "0 auto",
    animation: "pulse 2s infinite"
  },
  successTitle: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "1rem"
  },
  successText: {
    fontSize: "1.125rem",
    color: "#64748b",
    marginBottom: "2rem"
  },
  successDetails: {
    background: "#f8fafc",
    padding: "1.5rem",
    borderRadius: "16px",
    marginBottom: "2rem"
  },
  successRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem"
  },
  successLabel: {
    fontSize: "0.875rem",
    color: "#64748b",
    fontWeight: 600
  },
  successValue: {
    fontSize: "0.875rem",
    color: "#0f172a",
    fontWeight: 700,
    fontFamily: "monospace"
  },
  successDivider: {
    height: "1px",
    background: "#e2e8f0",
    margin: "1rem 0"
  },
  successActions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center"
  },
  successBtnSecondary: {
    padding: "0.875rem 1.5rem",
    background: "white",
    border: "2px solid #e2e8f0",
    color: "#475569",
    borderRadius: "10px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s"
  },
  successBtnPrimary: {
    padding: "0.875rem 1.5rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s"
  }
}; // ← ACCOLADE FERMANTE DE L'OBJET STYLES ICI

export default Transfer; // ← CETTE LIGNE DOIT ÊTRE EN DEHORS DE L'OBJET