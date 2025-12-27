import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h1>🏦 Dashboard</h1>

      <p>Bienvenue <strong>{user?.name}</strong></p>
      <p>Email : {user?.email}</p>

      <hr />

      <ul>
        <li>📂 Consulter mes comptes</li>
        <li>📊 Voir mes transactions</li>
        <li>📄 Télécharger mes relevés</li>
      </ul>
    </div>
  );
}
