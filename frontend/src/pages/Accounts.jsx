import { useEffect, useState } from "react";
import accountApi from "../api/account.api";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await accountApi.getMyAccounts();
        setAccounts(res.data);
      } catch (err) {
        setError("Impossible de charger les comptes");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) return <p>Chargement des comptes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>💳 Mes comptes bancaires</h2>

      {accounts.length === 0 ? (
        <p>Aucun compte trouvé</p>
      ) : (
        accounts.map((account) => (
          <div
            key={account._id}
            style={{
              border: "1px solid #ccc",
              padding: 15,
              marginBottom: 10,
              borderRadius: 6
            }}
          >
            <p><strong>Numéro :</strong> {account.accountNumber}</p>
            <p><strong>Solde :</strong> {account.balance} FCFA</p>
            <p><strong>Créé le :</strong> {new Date(account.createdAt).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
