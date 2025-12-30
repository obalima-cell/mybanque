import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import './CreateUser.css';

const CreateUser = () => {
  const navigate = useNavigate();
  
  // États du formulaire
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'user',
    notifications: true,
  });

  // États de validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Vérification de l'email en temps réel
  const [emailValid, setEmailValid] = useState(null);
  const [emailChecking, setEmailChecking] = useState(false);

  // Calculate password strength
  useEffect(() => {
    const calculateStrength = () => {
      let strength = 0;
      const password = formData.password;
      
      if (password.length >= 8) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[a-z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      
      setPasswordStrength(strength);
    };
    
    calculateStrength();
  }, [formData.password]);

  // Validation de l'email avec délai
  useEffect(() => {
    if (!formData.email.includes('@')) {
      setEmailValid(null);
      return;
    }

    const validateEmail = async () => {
      setEmailChecking(true);
      // Simuler une vérification d'email
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Vérification basique pour la démo
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      setEmailValid(isValid);
      setEmailChecking(false);
    };

    const timeoutId = setTimeout(validateEmail, 800);
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    } else if (emailValid === false) {
      newErrors.email = 'Cet email est déjà utilisé';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (passwordStrength < 3) {
      newErrors.password = 'Le mot de passe n\'est pas assez fort';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer le mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (formData.phone && !/^[0-9+\-\s]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    return newErrors;
  };

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simuler une API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('User created:', formData);
      setSuccess(true);
      
      // Reset après succès
      setTimeout(() => {
        setSuccess(false);
        navigate('/users'); // Redirection vers la liste des utilisateurs
      }, 2000);
      
    } catch (error) {
      console.error('Error creating user:', error);
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Réinitialisation
  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      role: 'user',
      notifications: true,
    });
    setErrors({});
  };

  // Fonction pour obtenir le texte de force du mot de passe
  const getPasswordStrengthText = () => {
    if (formData.password.length === 0) return 'Saisissez un mot de passe';
    if (passwordStrength <= 1) return 'Faible';
    if (passwordStrength <= 2) return 'Moyen';
    if (passwordStrength <= 3) return 'Bon';
    return 'Excellent';
  };

  // Fonction pour obtenir la couleur de la force
  const getStrengthColor = () => {
    if (formData.password.length === 0) return '#94a3b8';
    if (passwordStrength <= 1) return '#ef4444';
    if (passwordStrength <= 2) return '#f59e0b';
    if (passwordStrength <= 3) return '#3b82f6';
    return '#10b981';
  };

  return (
    <div className="create-user-page">
      <div className="page-container">
        {/* Header avec bouton retour */}
        <div className="page-header">
          <div className="header-title">
            <div className="title-icon">👥</div>
            <div className="title-text">
              <h1>Créer un utilisateur</h1>
              <p>Ajoutez un nouvel utilisateur à votre système</p>
            </div>
          </div>
          <BackButton to="/admin/users" variant="primary" />
        </div>

        {/* Formulaire principal */}
        <div className="user-card">
          <div className="card-bg"></div>
          
          <form onSubmit={handleSubmit} noValidate>
            {/* Section 1: Informations personnelles */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">👤</div>
                <h3 className="section-title">Informations personnelles</h3>
              </div>
              <p className="section-description">
                Renseignez les informations de base de l'utilisateur
              </p>

              <div className="form-grid">
                {/* Nom complet */}
                <div className="form-field full-width">
                  <label className="form-label required">
                    Nom complet
                  </label>
                  <div className="input-container">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`form-input ${errors.fullName ? 'error' : formData.fullName.length > 2 ? 'success' : ''}`}
                      placeholder="John Doe"
                      required
                    />
                    {formData.fullName.length > 2 && !errors.fullName && (
                      <div className="input-icon success-icon">✓</div>
                    )}
                  </div>
                  {errors.fullName && (
                    <p className="error-message">⚠️ {errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="form-field full-width">
                  <label className="form-label required">
                    Email
                  </label>
                  <div className="input-container">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : emailValid ? 'success' : ''}`}
                      placeholder="john@example.com"
                      required
                    />
                    {emailChecking && (
                      <div className="input-icon loading-icon">⟳</div>
                    )}
                    {emailValid && !emailChecking && !errors.email && (
                      <div className="input-icon success-icon">✓</div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="error-message">⚠️ {errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Sécurité */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">🔒</div>
                <h3 className="section-title">Sécurité</h3>
              </div>
              <p className="section-description">
                Définissez un mot de passe sécurisé pour l'utilisateur
              </p>

              <div className="form-grid">
                {/* Mot de passe */}
                <div className="form-field">
                  <label className="form-label required">
                    Mot de passe
                  </label>
                  <div className="input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Masquer" : "Afficher"}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  
                  {/* Indicateur de force */}
                  {formData.password && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div 
                          className="strength-fill"
                          style={{
                            width: `${(passwordStrength / 5) * 100}%`,
                            background: getStrengthColor()
                          }}
                        />
                      </div>
                      <div className="strength-text">
                        <span>Force :</span>
                        <span style={{ color: getStrengthColor(), fontWeight: 600 }}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="error-message">⚠️ {errors.password}</p>
                  )}
                </div>

                {/* Confirmation mot de passe */}
                <div className="form-field">
                  <label className="form-label required">
                    Confirmer le mot de passe
                  </label>
                  <div className="input-container">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`form-input ${errors.confirmPassword ? 'error' : formData.confirmPassword && formData.password === formData.confirmPassword ? 'success' : ''}`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      title={showConfirmPassword ? "Masquer" : "Afficher"}
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                    {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                      <div className="input-icon success-icon">✓</div>
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="error-message">⚠️ {errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Informations supplémentaires */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">📋</div>
                <h3 className="section-title">Informations supplémentaires</h3>
              </div>
              <p className="section-description">
                Informations optionnelles pour compléter le profil
              </p>

              <div className="form-grid">
                {/* Téléphone */}
                <div className="form-field">
                  <label className="form-label">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="+33 1 23 45 67 89"
                  />
                  {errors.phone && (
                    <p className="error-message">⚠️ {errors.phone}</p>
                  )}
                </div>

                {/* Adresse */}
                <div className="form-field">
                  <label className="form-label">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="123 Rue Example, Paris"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Rôle et préférences */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">🎭</div>
                <h3 className="section-title">Rôle et préférences</h3>
              </div>

              <div className="form-grid">
                {/* Rôle */}
                <div className="form-field">
                  <label className="form-label required">
                    Rôle de l'utilisateur
                  </label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={formData.role === 'user'}
                        onChange={handleChange}
                        className="radio-input"
                      />
                      <span className="radio-label">Utilisateur</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={formData.role === 'admin'}
                        onChange={handleChange}
                        className="radio-input"
                      />
                      <span className="radio-label">Administrateur</span>
                    </label>
                  </div>
                </div>

                {/* Notifications */}
                <div className="form-field">
                  <label className="form-label">
                    Notifications
                  </label>
                  <label className="switch-container">
                    <div className="switch">
                      <input
                        type="checkbox"
                        name="notifications"
                        checked={formData.notifications}
                        onChange={handleChange}
                        className="switch-checkbox"
                      />
                      <span className="switch-slider"></span>
                    </div>
                    <span className="switch-label">
                      Activer les notifications
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-cancel"
                disabled={isSubmitting}
              >
                <span className="btn-icon">↻</span>
                Réinitialiser
              </button>
              
              <button
                type="submit"
                className="btn btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-border"></div>
                    Création...
                  </>
                ) : (
                  <>
                    Créer l'utilisateur
                    <span className="btn-icon btn-arrow">→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Animation de succès */}
        {success && (
          <div className="success-overlay">
            <div className="success-card">
              <div className="success-icon-large">✅</div>
              <div className="success-text">
                <h2>Utilisateur créé !</h2>
                <p>
                  L'utilisateur {formData.fullName} a été créé avec succès.
                  Redirection vers la liste des utilisateurs...
                </p>
              </div>
            </div>
            
            {/* Confettis */}
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}vw`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateUser;