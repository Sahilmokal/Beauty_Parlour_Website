import React, { useEffect, useState } from "react";

export default function CourseBookingModal({ visible, courses, initialCourseId, onClose }) {
  const [courseId, setCourseId] = useState(initialCourseId || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredStart, setPreferredStart] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCourseId(initialCourseId || "");
  }, [initialCourseId]);
useEffect(() => {
  async function loadUser() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setName(data.name || "");
        setEmail(data.email || "");
      }
    } catch (err) {
      console.error("Failed to load user info");
    }
  }

  loadUser();
}, []);

  if (!visible) return null;

  const selectedCourse = courses.find((c) => c._id === courseId);

  async function submit(e) {
    e.preventDefault();
    setError(null);

    if (!name || !email) {
      setError("Name and email are required");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        return;
      }

      // 🔥 CREATE STRIPE CHECKOUT SESSION
      const res = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
  courseId,
  notes, // ✅ SEND USER NOTES
}),

      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment init failed");

      // 🔥 REDIRECT TO STRIPE PAYMENT PAGE
      window.location.href = data.url;

    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="booking-modal__overlay" role="dialog" aria-modal="true">
      <div className="booking-modal__dialog" role="document">
        <header className="booking-modal__header">
          <div>
            <div className="booking-modal__eyebrow">Enrollment</div>
            <h3 className="booking-modal__title">
              Book — {selectedCourse?.title}
            </h3>
          </div>
          <button className="booking-modal__close" onClick={onClose}>✕</button>
        </header>

        <form className="booking-modal__form" onSubmit={submit}>
          <label className="bm-row">
            <span className="bm-label">Course</span>
            <select
              className="bm-input"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} — ₹{c.price}
                </option>
              ))}
            </select>
          </label>

          <label className="bm-row">
            <span className="bm-label">Name *</span>
            <input className="bm-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label className="bm-row">
            <span className="bm-label">Email *</span>
            <input className="bm-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <div className="bm-row bm-row--two">
            <input className="bm-input" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className="bm-input" type="date" value={preferredStart} onChange={(e) => setPreferredStart(e.target.value)} />
          </div>

          <textarea className="bm-input" rows={3} placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

          {error && <div className="bm-error">{error}</div>}

          <div className="bm-actions">
            <button type="button" className="bm-btn bm-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bm-btn bm-btn--primary" disabled={submitting}>
              {submitting ? "Redirecting..." : `Pay ₹${selectedCourse?.price}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
