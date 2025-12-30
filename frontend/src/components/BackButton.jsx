// components/BackButton.jsx
import { useNavigate } from 'react-router-dom';
import './BackButton.css'; // Créez aussi ce fichier CSS

const BackButton = ({ to = -1, label = "Retour", variant = "default" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to === -1) {
      navigate(-1);
    } else {
      navigate(to);
    }
  };

  return (
    <button 
      className={`back-button ${variant}`} 
      onClick={handleClick}
      aria-label={label}
    >
      <span className="back-icon">←</span>
      <span className="back-label">{label}</span>
    </button>
  );
};

export default BackButton;