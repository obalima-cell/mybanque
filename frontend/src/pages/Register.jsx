import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/auth.api";
import { saveToken } from "../utils/token";
import { AuthContext } from "../context/AuthContext";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Nouveau champ
    adminCode: "" // Code secret pour admin
  });
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: "", color: "#94a3b8" });
  
  const { setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validations améliorées
  const validators = {
    name: (value) => {
      if (!value) return "Le nom est requis";
      if (value.length < 2) return "Minimum 2 caractères";
      if (value.length > 50) return "Maximum 50 caractères";
      if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) return "Caractères non autorisés";
      return null;
    },
    email: (value) => {
      if (!value) return "L'email est requis";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Format d'email invalide (ex: exemple@domaine.com)";
      }
      if (value.length > 100) return "Email trop long";
      return null;
    },
    password: (value) => {
      if (!value) return "Le mot de passe est requis";
      if (value.length < 8) return "Minimum 8 caractères";
      if (!/(?=.*[a-z])/.test(value)) return "Inclure une lettre minuscule";
      if (!/(?=.*[A-Z])/.test(value)) return "Inclure une lettre majuscule";
      if (!/(?=.*\d)/.test(value)) return "Inclure un chiffre";
      if (!/(?=.*[@$!%*?&])/.test(value)) return "Inclure un caractère spécial (@$!%*?&)";
      return null;
    },
    confirmPassword: (value) => {
      if (!value) return "Confirmer le mot de passe";
      if (value !== formData.password) return "Les mots de passe ne correspondent pas";
      return null;
    },
    adminCode: (value) => {
      if (formData.role === "admin") {
        if (!value) return "Le code administrateur est requis";
        if (value !== "ADMIN123") return "Code administrateur incorrect"; // Code temporaire
      }
      return null;
    }
  };

  // Calcul de la force du mot de passe en temps réel
  const calculatePasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "#94a3b8" };
    
    let strength = 0;
    const requirements = [
      password.length >= 8,
      password.length >= 12,
      /(?=.*[a-z])/.test(password),
      /(?=.*[A-Z])/.test(password),
      /(?=.*\d)/.test(password),
      /(?=.*[@$!%*?&])/.test(password),
    ];

    strength = requirements.filter(Boolean).length;

    if (strength <= 2) return { strength: 33, label: "Faible", color: "#ef4444", level: 1 };
    if (strength <= 4) return { strength: 66, label: "Moyen", color: "#f59e0b", level: 2 };
    return { strength: 100, label: "Fort", color: "#10b981", level: 3 };
  };

  // Gestion des changements avec validation en temps réel
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validation en temps réel
    if (validators[name]) {
      const error = validators[name](value);
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
    
    // Calcul de la force du mot de passe
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    if (error) setError("");
  };

  // Gestion du changement de rôle
  const handleRoleChange = (role) => {
    setFormData(prev => ({ 
      ...prev, 
      role,
      adminCode: role === "user" ? "" : prev.adminCode
    }));
    
    if (role === "user") {
      setFieldErrors(prev => ({ ...prev, adminCode: null }));
    }
  };

  // Validation complète du formulaire
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      if (field === "adminCode" && formData.role === "user") return;
      
      const error = validators[field]?.(formData[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });
    
    if (!acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation");
      isValid = false;
    }
    
    setFieldErrors(errors);
    return isValid;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const { name, email, password, role } = formData;
      const res = await authApi.register({ 
        name, 
        email, 
        password,
        role // Ajout du rôle
      });
      
      if (res.data?.token) {
        saveToken(res.data.token);
        setIsAuth(true);
        
        // Message de succès personnalisé selon le rôle
        const successMessage = role === "admin" 
          ? "🎉 Compte administrateur créé avec succès !"
          : "✅ Compte utilisateur créé avec succès !";
        
        console.log(successMessage);
        
        // Redirection vers le dashboard
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        setError("Réponse serveur invalide");
      }
    } catch (err) {
      console.error("Registration error:", err);
      
      const errorMessages = {
        400: "Données invalides. Vérifiez vos informations.",
        409: "Un compte existe déjà avec cet email.",
        403: "Vous n'êtes pas autorisé à créer un compte administrateur.",
        422: "Validation échouée. Vérifiez vos données.",
        500: "Erreur serveur. Réessayez plus tard.",
        default: "Une erreur inattendue est survenue."
      };

      if (err.response) {
        setError(errorMessages[err.response.status] || errorMessages.default);
      } else if (err.request) {
        setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
      } else {
        setError(errorMessages.default);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Classes CSS pour les inputs
  const getInputClassName = (fieldName) => {
    const baseClass = "form-input input-with-icon-padding";
    if (fieldErrors[fieldName]) return `${baseClass} input-error`;
    if (formData[fieldName] && !fieldErrors[fieldName]) return `${baseClass} input-success`;
    return baseClass;
  };

  // Exigences du mot de passe
  const passwordRequirements = [
    { label: "8 caractères minimum", met: formData.password.length >= 8 },
    { label: "Une lettre majuscule", met: /(?=.*[A-Z])/.test(formData.password) },
    { label: "Une lettre minuscule", met: /(?=.*[a-z])/.test(formData.password) },
    { label: "Un chiffre", met: /(?=.*\d)/.test(formData.password) },
    { label: "Un caractère spécial (@$!%*?&)", met: /(?=.*[@$!%*?&])/.test(formData.password) },
  ];

  return (
    <div className="register-page">
      {/* Background animé amélioré */}
      <div className="register-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-gradient"></div>
      </div>

      {/* Carte d'inscription */}
      <div className="register-card">
        {/* Header avec logo animé */}
        <div className="register-header">
          <div className="logo-container">
            <div className="logo-icon">🏦</div>
            <div className="logo-ring"></div>
          </div>
          <h1 className="register-title">
            Rejoignez <span className="brand-gradient">MyBanque</span>
          </h1>
          <p className="register-subtitle">
            Créez votre compte et accédez à votre espace bancaire sécurisé
          </p>
        </div>

        {/* Message d'erreur global */}
        {error && (
          <div className="alert alert-error animate-shake">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <strong>Attention</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="register-form" noValidate>
          {/* Nom complet */}
          <div className="form-field">
            <label htmlFor="name" className="form-label">
              <span className="label-icon">👤</span>
              Nom complet
            </label>
            <div className="input-container">
              <input
                type="text"
                id="name"
                name="name"
                className={getInputClassName("name")}
                placeholder="Jean Dupont"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                autoComplete="name"
                autoFocus
              />
              {formData.name && !fieldErrors.name && (
                <span className="input-icon success-icon">✓</span>
              )}
            </div>
            {fieldErrors.name && (
              <p className="field-error">
                <span className="error-icon">⚠️</span>
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="form-field">
            <label htmlFor="email" className="form-label">
              <span className="label-icon">📧</span>
              Adresse email
            </label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                name="email"
                className={getInputClassName("email")}
                placeholder="exemple@email.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                autoComplete="email"
              />
              {formData.email && !fieldErrors.email && (
                <span className="input-icon success-icon">✓</span>
              )}
            </div>
            {fieldErrors.email && (
              <p className="field-error">
                <span className="error-icon">⚠️</span>
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Sélection du rôle */}
          <div className="form-field">
            <label className="form-label">
              <span className="label-icon">👥</span>
              Type de compte
            </label>
            <div className="role-selection">
              <div className={`role-option ${formData.role === "user" ? "selected" : ""}`}>
                <input
                  type="radio"
                  id="role-user"
                  name="role"
                  value="user"
                  checked={formData.role === "user"}
                  onChange={() => handleRoleChange("user")}
                  className="role-radio"
                />
                <label htmlFor="role-user" className="role-label">
                  <div className="role-icon">👤</div>
                  <div className="role-content">
                    <h4>Utilisateur Standard</h4>
                    <p>Gestion de vos comptes et opérations bancaires</p>
                    <div className="role-badge">Recommandé</div>
                  </div>
                </label>
              </div>

              <div className={`role-option ${formData.role === "admin" ? "selected" : ""}`}>
                <input
                  type="radio"
                  id="role-admin"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={() => handleRoleChange("admin")}
                  className="role-radio"
                />
                <label htmlFor="role-admin" className="role-label">
                  <div className="role-icon">👑</div>
                  <div className="role-content">
                    <h4>Administrateur</h4>
                    <p>Accès complet + gestion des utilisateurs</p>
                    <div className="role-badge admin">Avancé</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Code administrateur (si admin sélectionné) */}
          {formData.role === "admin" && (
            <div className="form-field">
              <label htmlFor="adminCode" className="form-label">
                <span className="label-icon">🔐</span>
                Code administrateur
              </label>
              <div className="input-container">
                <input
                  type="password"
                  id="adminCode"
                  name="adminCode"
                  className={getInputClassName("adminCode")}
                  placeholder="Entrez le code secret administrateur"
                  value={formData.adminCode}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="toggle-btn info-btn"
                  title="Le code administrateur est requis pour créer un compte avec privilèges"
                  disabled={isLoading}
                >
                  ℹ️
                </button>
              </div>
              {fieldErrors.adminCode && (
                <p className="field-error">
                  <span className="error-icon">⚠️</span>
                  {fieldErrors.adminCode}
                </p>
              )}
              <p className="admin-code-hint">
                <small>Code temporaire: <code>ADMIN123</code></small>
              </p>
            </div>
          )}

          {/* Mot de passe */}
          <div className="form-field">
            <label htmlFor="password" className="form-label">
              <span className="label-icon">🔒</span>
              Mot de passe
            </label>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={getInputClassName("password")}
                placeholder="Créez un mot de passe sécurisé"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            
            {/* Indicateur de force */}
            {formData.password && (
              <div className="password-strength-container">
                <div className="strength-header">
                  <span>Force du mot de passe:</span>
                  <span className="strength-label" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ 
                      width: `${passwordStrength.strength}%`,
                      backgroundColor: passwordStrength.color 
                    }}
                  ></div>
                </div>
                
                {/* Exigences */}
                <div className="password-requirements">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className={`requirement ${req.met ? "met" : "unmet"}`}>
                      <span className="requirement-icon">
                        {req.met ? "✓" : "○"}
                      </span>
                      <span className="requirement-text">{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {fieldErrors.password && (
              <p className="field-error">
                <span className="error-icon">⚠️</span>
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirmation mot de passe */}
          <div className="form-field">
            <label htmlFor="confirmPassword" className="form-label">
              <span className="label-icon">🔒</span>
              Confirmer le mot de passe
            </label>
            <div className="input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className={getInputClassName("confirmPassword")}
                placeholder="Répétez votre mot de passe"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                aria-label={showConfirmPassword ? "Masquer" : "Afficher"}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="field-error">
                <span className="error-icon">⚠️</span>
                {fieldErrors.confirmPassword}
              </p>
            )}
            {formData.confirmPassword && !fieldErrors.confirmPassword && (
              <p className="field-success">
                <span className="success-icon">✓</span>
                Les mots de passe correspondent
              </p>
            )}
          </div>

          {/* Conditions d'utilisation */}
          <div className="terms-field">
            <label className="checkbox-container">
              <input
                type="checkbox"
                className="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={isLoading}
              />
              <span className="checkmark"></span>
              <span className="checkbox-label">
                Je déclare avoir lu et accepté les{" "}
                <Link to="/terms" className="link-primary">conditions d'utilisation</Link>
                {" "}et la{" "}
                <Link to="/privacy" className="link-primary">politique de confidentialité</Link>
                {" "}de MyBanque.
              </span>
            </label>
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            className={`btn btn-primary btn-register ${isLoading ? "btn-loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border"></span>
                <span>Création en cours...</span>
              </>
            ) : (
              <>
                <span>Créer mon compte {formData.role === "admin" ? "Administrateur" : ""}</span>
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>

          {/* Note de sécurité */}
          <div className="security-note">
            <div className="security-icon">🔐</div>
            <div className="security-text">
              <strong>Vos données sont sécurisées</strong>
              <small>Toutes vos informations sont cryptées et protégées.</small>
            </div>
          </div>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>Déjà membre ?</span>
        </div>

        {/* Lien vers connexion */}
        <div className="login-section">
          <Link to="/login" className="btn btn-outline btn-block">
            <span>Se connecter à mon compte</span>
            <span className="btn-icon">→</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="register-footer">
          <p className="footer-text">
            <span className="footer-icon">🛡️</span>
            MyBanque utilise le cryptage SSL 256-bit pour protéger vos données.
          </p>
        </div>
      </div>

      {/* Indicateurs de confiance */}
      <div className="trust-indicators">
        <div className="trust-item">
          <span className="trust-icon">✅</span>
          <span>Inscription gratuite</span>
        </div>
        <div className="trust-item">
          <span className="trust-icon">⚡</span>
          <span>Activation immédiate</span>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🔒</span>
          <span>100% sécurisé</span>
        </div>
      </div>
    </div>
  );
};

export default Register;