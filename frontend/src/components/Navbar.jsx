import { Link, useNavigate } from "react-router-dom";
import { clearToken } from "../utils/token";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const logout = () => {
    clearToken();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: 15,
        background: "#222",
        color: "#fff"
      }}
    >
      <strong>MyBanque</strong>

      {user && (
        <div>
          <Link to="/dashboard" style={{ color: "#fff", marginRight: 10 }}>
            Dashboard
          </Link>

          <Link to="/accounts" style={{ color: "#fff", marginRight: 10 }}>
            Comptes
          </Link>

          <button onClick={logout}>Déconnexion</button>
        </div>
      )}
    </nav>
  );
}
