export default function Statement() {
  const download = () => {
    window.open(
      "http://localhost:5000/api/accounts/ACCOUNT_ID/statement/pdf",
      "_blank"
    );
  };

  return <button onClick={download}>Télécharger Relevé PDF</button>;
}
