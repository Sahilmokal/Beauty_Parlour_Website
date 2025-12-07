// src/pages/Enrollments.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/enrollments.css";

export default function Enroll() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  async function fetchBookings() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/course-bookings", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const contentType = res.headers.get("content-type") || "";
      // handle non-JSON responses nicely
      if (!res.ok) {
        if (contentType.includes("application/json")) {
          const data = await res.json();
          throw new Error(data.message || "Failed to load enrollments");
        } else {
          const txt = await res.text();
          throw new Error(txt.slice(0, 400));
        }
      }

      if (!contentType.includes("application/json")) {
        const txt = await res.text();
        throw new Error("Expected JSON but got: " + txt.slice(0, 200));
      }

      // correct shape: { bookings: [...] }
      const body = await res.json();
      const list = Array.isArray(body.bookings) ? body.bookings : [];
      setBookings(list);
    } catch (err) {
      console.error("fetchBookings error:", err);
      setError(err.message || "Unable to fetch enrollments");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm("Are you sure you want to cancel this enrollment?")) return;
    try {
      setCancellingId(id);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/course-bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const contentType = res.headers.get("content-type") || "";
      let data = null;
      if (contentType.includes("application/json")) data = await res.json();
      else data = { message: await res.text() };

      if (!res.ok) throw new Error(data.message || "Cancel failed");

      // reflect soft-cancel in UI (or remove)
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)));
      alert(data.message || "Enrollment cancelled");
    } catch (err) {
      console.error("cancel error:", err);
      alert(err.message || "Cancel failed");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="enrollments-page container">
      <h1> My Courses</h1>

      <main>
        {loading && <div className="empty">Loading your enrollments…</div>}
        {error && <div className="empty error">{error}</div>}

        {!loading && bookings.length === 0 && !error && (
          <div className="empty">
            <p>You have no enrollments yet.</p>
            <div style={{ marginTop: 10 }}>
              <button className="btn" onClick={() => navigate("/courses")}>Browse Courses</button>
            </div>
          </div>
        )}

        <div className="enrollments-grid">
          {bookings.map((b) => (
            <article key={b._id} className={`enrollment-card ${b.status === "cancelled" ? "muted" : ""}`}>
              <div className="middle">
                <div className="title-row">
                  <h3 className="title">{b.courseTitle || b.courseId}</h3>
                  <div className="status">{b.status ?? "pending"}</div>
                </div>

                <div className="meta-row">
                  <div className="muted">Booked on</div>
                  <div>{new Date(b.createdAt).toLocaleString()}</div>
                </div>

                {b.preferredStart && (
                  <div className="meta-row">
                    <div className="muted">Preferred start</div>
                    <div>{new Date(b.preferredStart).toLocaleDateString()}</div>
                  </div>
                )}

                {b.notes && (
                  <div className="notes">
                    <strong>Notes:</strong>
                    <div style={{ marginTop: 6 }}>{b.notes}</div>
                  </div>
                )}
              </div>

              <div className="right">
                <div className="price">
                  {b.coursePrice ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(b.coursePrice) : ""}
                </div>

                <div className="actions">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancel(b._id)}
                    disabled={cancellingId === b._id || b.status === "cancelled"}
                    title={b.status === "cancelled" ? "Already cancelled" : "Cancel enrollment"}
                  >
                    {cancellingId === b._id ? "Cancelling..." : b.status === "cancelled" ? "Cancelled" : "Cancel"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
