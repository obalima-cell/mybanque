import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/token";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <nav>
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button onClick={() => navigate("/accounts")}>Comptes</button>
      <button onClick={() => navigate("/transactions")}>Transactions</button>
      <button onClick={logout}>Déconnexion</button>
    </nav>
  );
};

export default Navbar;
