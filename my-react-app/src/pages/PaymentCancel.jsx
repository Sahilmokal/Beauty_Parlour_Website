import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>❌ Payment Cancelled</h1>
      <p>No amount was deducted.</p>

      <button onClick={() => navigate("/learn")}>
        Try Again
      </button>
    </div>
  );
}
