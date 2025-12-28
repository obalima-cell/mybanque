import Navbar from "../components/Navbar";

const Statement = ({ accountId }) => {
  const download = () => {
    window.open(
      `http://localhost:5000/api/accounts/${accountId}/statement/pdf`,
      "_blank"
    );
  };

  return (
    <>
      <Navbar />
      <button onClick={download}>Télécharger le relevé PDF</button>
    </>
  );
};

export default Statement;
