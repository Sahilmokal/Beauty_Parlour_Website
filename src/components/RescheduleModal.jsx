// src/components/RescheduleModal.jsx
import React, { useMemo, useState } from "react";

export default function RescheduleModal({ booking, onClose, onSubmit }) {
  const [form, setForm] = useState({ date: booking.date || "", time: booking.time || "" });

  // generate 30-min slots 10:00 - 20:30
  const slots = useMemo(() => {
    const s = [];
    for (let h = 10; h < 21; h++) {
      ["00", "30"].forEach((mm) => s.push(`${String(h).padStart(2, "0")}:${mm}`));
    }
    return s;
  }, []);

  function formatLabel(slot) {
    const [hhStr, mm] = slot.split(":");
    const hh = parseInt(hhStr, 10);
    const suffix = hh >= 12 ? "PM" : "AM";
    const hour12 = ((hh + 11) % 12) + 1;
    return `${hour12}:${mm} ${suffix}`;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.time) {
      alert("Please pick date and time");
      return;
    }
    onSubmit(form.date, form.time);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3000,
        padding: 16,
      }}
    >
      <div style={{ background: "#fff", borderRadius: 12, width: 480, maxWidth: "100%", padding: 20, boxShadow: "0 18px 50px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18 }}>Reschedule: {booking.serviceName}</h3>
            {booking.name && <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>{booking.name} • {booking.email}</div>}
          </div>
          <button onClick={onClose} style={{ fontSize: 20, background: "none", border: "none" }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 14 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              required
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e6e6e6" }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Time</label>
            <select
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              required
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e6e6e6" }}
            >
              <option value="">-- Select slot --</option>
              {slots.map((s) => (
                <option key={s} value={s}>
                  {formatLabel(s)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} className="btn" style={{ padding: "10px 14px", borderRadius: 8, background: "#f3f3f3", color: "#111" }}>
              Cancel
            </button>
            <button type="submit" className="btn" style={{ padding: "10px 14px", borderRadius: 8, background: "#d4af37", color: "#000", fontWeight: 700 }}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
