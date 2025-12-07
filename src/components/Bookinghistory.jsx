import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RescheduleModal from "../components/RescheduleModal";

/**
 * MyBookings page (color-graded & polished)
 * - Improved color palette, contrast and hover states
 * - Uses shared style constants for easy tuning
 */

function isPastDateString(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

export default function Bookinghistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [rescheduleBooking, setRescheduleBooking] = useState(null);
  const [reschedulingId, setReschedulingId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);
      const res = await axios.get("/api/service-bookings", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const data = Array.isArray(res.data) ? res.data : res.data.bookings || [];
      setBookings(data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setCancellingId(id);
      await axios.delete(`/api/service-bookings/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  }

  function openRescheduleModal(booking) {
    setRescheduleBooking(booking);
  }

  async function submitReschedule(id, newDate, newTime) {
    try {
      setReschedulingId(id);
      const res = await axios.put(
        `/api/service-bookings/${id}`,
        { date: newDate, time: newTime },
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, date: newDate, time: newTime } : b)));
      setRescheduleBooking(null);
      alert(res.data.message || "Rescheduled");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to reschedule");
    } finally {
      setReschedulingId(null);
    }
  }

  // ---------- Color / style tokens (easy to tweak) ----------
  const COLORS = {
    pageBg: "#f4f7fb",          // soft page background
    panelBg: "#ffffff",         // card background
    cardBorder: "rgba(15,23,42,0.04)",
    primary: "#0f1724",         // dark primary (buttons)
    accent: "#d4af37",          // gold accent (kept from original)
    accentSoft: "rgba(212,175,55,0.08)",
    muted: "#6b7280",
    success: "#16a34a",         // green for upcoming
    pastBg: "#eef2f6",          // subtle past background
    subtleShadow: "0 8px 30px rgba(2,6,23,0.06)",
    hoverLift: "0 12px 40px rgba(2,6,23,0.08)",
  };

  const containerStyle = {
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    background: COLORS.pageBg,
    minHeight: "calc(100vh - 80px)",
  };

  const cardStyle = {
    display: "flex",
    gap: 18,
    alignItems: "center",
    padding: 18,
    borderRadius: 12,
    background: COLORS.panelBg,
    boxShadow: COLORS.subtleShadow,
    minHeight: 120,
    border: `1px solid ${COLORS.cardBorder}`,
    transition: "box-shadow 180ms ease, transform 180ms ease",
  };

  const imageWrapStyle = {
    width: 120,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    background: "#f7f8fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (loading) return <div className="container" style={{ padding: "40px 20px" }}>Loading your bookings…</div>;

  return (
    <div className="container" style={containerStyle}>
      <div style={{ width: "100%", maxWidth: 1100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 className="h2" style={{ fontSize: 28, margin: 0, color: COLORS.primary }}>My Bookings</h2>
          <button
            className="btn"
            onClick={() => navigate("/services")}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              background: COLORS.accent,
              color: "#000",
              fontWeight: 700,
              border: "none",
              boxShadow: "0 8px 22px rgba(212,175,55,0.12)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Browse Services
          </button>
        </div>

        {(!Array.isArray(bookings) || bookings.length === 0) ? (
          <div style={{
            background: COLORS.panelBg,
            padding: 28,
            borderRadius: 12,
            textAlign: "center",
            boxShadow: COLORS.subtleShadow
          }}>
            <p style={{ margin: 0, fontSize: 16, color: COLORS.muted }}>You have no bookings yet.</p>
            <div style={{ marginTop: 12 }}>
              <button
                className="btn"
                onClick={() => navigate("/services")}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  background: COLORS.primary,
                  color: "#fff",
                  border: "none",
                  marginTop: 12,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.95")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Book a Service
              </button>
            </div>
          </div>
        ) : (
          <div className="bookings-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 18,
          }}>
            {bookings.map((b) => {
              const past = isPastDateString(b.date);
              return (
                <div
                  key={b._id}
                  className="service-card"
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = COLORS.hoverLift;
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = COLORS.subtleShadow;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* left: image */}
                  <div style={{ flex: "0 0 120px", minWidth: 120 }}>
                    <div style={imageWrapStyle}>
                      {b.serviceImage ? (
                        <img src={b.serviceImage} alt={b.serviceName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ color: "#97a0ac", fontSize: 13 }}>{b.serviceName}</span>
                      )}
                    </div>
                  </div>

                  {/* middle: details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 18, color: COLORS.primary }}>{b.serviceName}</h3>
                        <p style={{ margin: "6px 0 0", color: COLORS.muted, fontSize: 14 }}>{b.name} • {b.email}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, color: "#9aa3af" }}>{new Date(b.createdAt).toLocaleString()}</div>
                        <div style={{
                          marginTop: 8,
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: 20,
                          background: past ? COLORS.pastBg : "rgba(22,163,74,0.08)",
                          color: past ? "#55606a" : COLORS.success,
                          fontSize: 12,
                          fontWeight: 600,
                        }}>
                          {past ? "Past" : "Upcoming"}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 12, display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ fontSize: 15, color: "#111827", fontWeight: 600 }}>
                        {b.date} • {b.time}
                      </div>

                      {b.specialRequests && (
                        <div style={{
                          fontSize: 13,
                          color: "#6b513a",
                          background: "#fff7eb",
                          padding: "6px 10px",
                          borderRadius: 8,
                          border: `1px solid ${COLORS.accentSoft}`
                        }}>
                          {b.specialRequests}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* right: actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <button
                      onClick={() => navigate("/book-service", { state: { selectedService: { name: b.serviceName, id: b.serviceId } } })}
                      className="btn"
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid rgba(0,0,0,0.06)",
                        background: COLORS.primary,
                        color: "#fff",
                        fontWeight: 700,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.95")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      Book again
                    </button>

                    {!past && (
                      <>
                        <button
                          className="btn"
                          onClick={() => openRescheduleModal(b)}
                          disabled={reschedulingId === b._id}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            background: "#f8fafc",
                            color: "#0b1220",
                            border: "1px solid #e6edf3",
                            minWidth: 120,
                          }}
                        >
                          {reschedulingId === b._id ? "Rescheduling..." : "Reschedule"}
                        </button>

                        <button
                          onClick={() => handleCancel(b._id)}
                          disabled={cancellingId === b._id}
                          className="history-btn"
                          style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            background: "#fff5f5",
                            color: "#a00",
                            border: "1px solid #f7c8c8",
                            minWidth: 120,
                          }}
                        >
                          {cancellingId === b._id ? "Cancelling..." : "Cancel"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {rescheduleBooking && (
        <RescheduleModal
          booking={rescheduleBooking}
          onClose={() => setRescheduleBooking(null)}
          onSubmit={(date, time) => submitReschedule(rescheduleBooking._id, date, time)}
        />
      )}
    </div>
  );
}
