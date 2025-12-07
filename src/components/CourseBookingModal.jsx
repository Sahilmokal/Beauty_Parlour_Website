// src/components/CourseBookingModal.jsx
import React, { useState } from "react";

export default function CourseBookingModal({ course, onClose, onBooked }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredStart, setPreferredStart] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!course) return null;

  async function submit(e) {
    e.preventDefault();
    setError(null);

    if (!name || !email) {
      setError("Name and email are required.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be signed in to book this course.");
        setSubmitting(false);
        return;
      }

      const payload = {
        courseId: course._id,
        courseTitle: course.title || course.courseTitle || "",
        name,
        email,
        phone,
        preferredStart: preferredStart || null,
        notes,
      };

      const res = await fetch("/api/course-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // safe parse
      const contentType = res.headers.get("content-type") || "";
      let data = null;
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const txt = await res.text();
        throw new Error("Server returned non-JSON response: " + txt.slice(0, 300));
      }

      if (!res.ok) throw new Error(data.message || "Failed to book");

      // success: data.booking contains saved booking
      onBooked && onBooked(data.booking);
      alert(data.message || "Booking submitted");
      onClose();
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1200,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.45)"
    }}>
      <div style={{ width: 520, maxWidth: "94%", background: "#fff", borderRadius: 12, padding: 18 }}>
        <h3 style={{ marginTop: 0 }}>Book: {course.title || course.courseTitle}</h3>
        <form onSubmit={submit}>
          <div style={{ display: "grid", gap: 8 }}>
            <label>
              Your name *
              <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", padding: 8, marginTop: 6 }} />
            </label>

            <label>
              Email *
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={{ width: "100%", padding: 8, marginTop: 6 }} />
            </label>

            <label>
              Phone
              <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 6 }} />
            </label>

            <label>
              Preferred start date
              <input value={preferredStart} onChange={(e) => setPreferredStart(e.target.value)} type="date" style={{ width: "100%", padding: 8, marginTop: 6 }} />
            </label>

            <label>
              Notes (optional)
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ width: "100%", padding: 8, marginTop: 6 }} />
            </label>
          </div>

          {error && <div style={{ color: "crimson", marginTop: 10 }}>{error}</div>}

          <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={{ padding: "8px 12px", borderRadius: 8 }}>Cancel</button>
            <button type="submit" disabled={submitting} style={{ padding: "8px 12px", borderRadius: 8, background: "#111", color: "#fff" }}>
              {submitting ? "Booking..." : `Book (${course.price ? new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(course.price) : "—"})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
