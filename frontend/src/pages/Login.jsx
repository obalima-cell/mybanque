import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/auth.api";
import { saveToken } from "../utils/token";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  const { setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validation helpers
  const validators = {
    email: (value) => {
      if (!value) return "L'email est requis";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Format d'email invalide";
      }
      return null;
    },
    password: (value) => {
      if (!value) return "Le mot de passe est requis";
      if (value.length < 6) {
        return "Minimum 6 caractères requis";
      }
      return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Clear global error
    if (error) setError("");
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(field => {
      const error = validators[field]?.(formData[field]);
      if (error) errors[field] = error;
    });
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await authApi.login(formData);
      
      if (res.data?.token) {
        saveToken(res.data.token);
        setIsAuth(true);
        
        // Success feedback
        setTimeout(() => navigate("/dashboard"), 300);
      } else {
        setError("Réponse serveur invalide");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      const errorMessages = {
        400: "Identifiants incorrects",
        401: "Email ou mot de passe invalide",
        403: "Accès refusé",
        500: "Erreur serveur. Réessayez plus tard",
        default: "Une erreur est survenue"
      };

      if (err.response) {
        setError(errorMessages[err.response.status] || errorMessages.default);
      } else if (err.request) {
        setError("Impossible de contacter le serveur");
      } else {
        setError(errorMessages.default);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClass = "form-input input-with-icon-padding";
    if (fieldErrors[fieldName]) return `${baseClass} input-error`;
    if (formData[fieldName] && !fieldErrors[fieldName]) return `${baseClass} input-success`;
    return baseClass;
  };

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-gradient"></div>
      </div>

      {/* Login Card */}
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">🏦</div>
            <div className="logo-ring"></div>
          </div>
          <h1 className="login-title">
            Bienvenue sur <span className="brand-gradient">MyBanque</span>
          </h1>
          <p className="login-subtitle">
            Connectez-vous pour accéder à votre espace bancaire sécurisé
          </p>
        </div>

        {/* Global Error Alert */}
        {error && (
          <div className="alert alert-error animate-shake">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <strong>Erreur</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Email Field */}
          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Adresse email
            </label>
            <div className="input-container">
              <span className="input-icon icon-left">📧</span>
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
                autoFocus
              />
              {formData.email && !fieldErrors.email && (
                <span className="input-icon icon-right success-icon">✓</span>
              )}
            </div>
            {fieldErrors.email && (
              <p className="field-error">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="form-field">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <div className="input-container">
              <span className="input-icon icon-left">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={getInputClassName("password")}
                placeholder="Entrez votre mot de passe"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-icon icon-right toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="field-error">{fieldErrors.password}</p>
            )}
          </div>

          {/* Options Row */}
          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox" />
              <span>Se souvenir de moi</span>
            </label>
            <Link to="/forgot-password" className="link-primary">
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn btn-primary btn-login ${isLoading ? "btn-loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border"></span>
                <span>Connexion en cours...</span>
              </>
            ) : (
              <>
                <span>Se connecter</span>
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>ou</span>
        </div>

        {/* Register Link */}
        <div className="register-section">
          <p className="register-text">
            Vous n'avez pas encore de compte ?
          </p>
          <Link to="/register" className="btn btn-outline btn-block">
            <span>Créer un compte</span>
            <span className="btn-icon">✨</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="login-card-footer">
          <p className="footer-text">
            En vous connectant, vous acceptez nos{" "}
            <Link to="/terms" className="footer-link">Conditions d'utilisation</Link>
            {" "}et notre{" "}
            <Link to="/privacy" className="footer-link">Politique de confidentialité</Link>
          </p>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="trust-indicators">
        <div className="trust-item">
          <span className="trust-icon">🔒</span>
          <span>Connexion sécurisée</span>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🛡️</span>
          <span>Données protégées</span>
        </div>
        <div className="trust-item">
          <span className="trust-icon">⚡</span>
          <span>Accès instantané</span>
        </div>
      </div>
    </div>
  );
};

export default Login;