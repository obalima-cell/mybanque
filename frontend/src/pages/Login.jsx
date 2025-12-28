import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/auth.api";
import { saveToken } from "../utils/token";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validation email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation côté client
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Adresse email invalide");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.login({ email, password });
      
      if (res.data && res.data.token) {
        saveToken(res.data.token);
        setIsAuth(true);
        
        // Animation de succès avant redirection
        setTimeout(() => {
          navigate("/dashboard");
        }, 300);
      } else {
        setError("Réponse invalide du serveur");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      
      // Gestion des erreurs détaillée
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError("Email ou mot de passe incorrect");
            break;
          case 401:
            setError("Identifiants invalides");
            break;
          case 500:
            setError("Erreur serveur. Veuillez réessayer plus tard");
            break;
          default:
            setError("Une erreur est survenue. Veuillez réessayer");
        }
      } else if (err.request) {
        setError("Impossible de contacter le serveur. Vérifiez votre connexion");
      } else {
        setError("Une erreur inattendue s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* En-tête */}
        <div className="login-header">
          <div className="login-logo">🏦</div>
          <h1 className="login-title">MyBanque</h1>
          <p className="login-subtitle">Connectez-vous à votre espace</p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Champ Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Adresse email
            </label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Champ Mot de passe */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Mot de passe oublié */}
          <div className="form-footer">
            <Link to="/forgot-password" className="forgot-link">
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            className={`submit-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {/* Lien d'inscription */}
        <div className="login-footer">
          <p>
            Pas encore de compte ?{" "}
            <Link to="/register" className="register-link">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>

      {/* Fond décoratif */}
      <div className="background-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </div>
  );
};

export default Login;