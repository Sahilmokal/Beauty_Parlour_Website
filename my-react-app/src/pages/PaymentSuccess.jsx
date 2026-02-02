import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const courseId = params.get("courseId");

  useEffect(() => {
    async function saveBooking() {
      const token = localStorage.getItem("token");

      await fetch("/api/course-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId,
          paymentStatus: "paid",
          paymentId: "stripe-checkout",
        }),
      });
    }

    if (courseId) saveBooking();
  }, [courseId]);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>✅ Payment Successful</h1>
      <p>Your enrollment is confirmed.</p>

      <button onClick={() => navigate("/enrollments")}>
        Go to My Enrollments
      </button>
    </div>
  );
}
