// src/pages/Learn.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseBookingModal from "./CourseBookingModal";

import "../css/learn.css";
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

/**
 * Learn page — dynamic courses with prices + integrated themed booking modal
 *
 * Expects CSS rules for .booking-modal__* present in ../css/learn.css
 *
 * API:
 *  - GET /api/courses
 *  - POST /api/course-bookings  { courseId, name, email, phone, preferredStart, notes }
 */

const sampleCourses = [
  {
    _id: "hair-001",
    title: "Professional Hair Styling",
    duration: "6–8 weeks",
    image: "/images/course-hair.jpg",
    bullets: [
      "Sectioning, blow-dry, ironing, tonging, braids, updos.",
      "Chemical basics: Global, root touch-up, highlights, toners.",
      "Cutting: Layers, graduation, face-framing; men's basics.",
      "Hygiene, tool care & consultation per face shape.",
    ],
    meta: ["Live models", "Kit guidance", "Portfolio day"],
    price: 12500,
  },
  {
    _id: "makeup-001",
    title: "Bridal & Party Makeup",
    duration: "5–6 weeks",
    image: "/images/course-makeup.jpg",
    bullets: [
      "Skin prep, color correction & long-wear base building.",
      "Eye styles: Glam, cut-crease, halo, smokey; lashes.",
      "Bridal looks: Traditional, reception, cocktail.",
      "Product mapping by skin type & undertone.",
    ],
    meta: ["HD/Non-HD", "Draping basics", "Photoshoot support"],
    price: 9500,
  },
  {
    _id: "skin-001",
    title: "Skin & Beauty Treatments",
    duration: "4–6 weeks",
    image: "/images/course-skin.jpg",
    bullets: [
      "Facials: Cleanup, exfoliation, massage lines.",
      "Skin analysis & treatment mapping.",
      "Threading, waxing, de-tan, masque layering.",
      "Clinic-grade hygiene & consultation.",
    ],
    meta: ["Derm basics", "SOPs", "Retail upsell"],
    price: 8500,
  },
  {
    _id: "nail-001",
    title: "Nail Art & Extensions",
    duration: "3–5 weeks",
    image: "/images/course-nail.jpg",
    bullets: [
      "Cuticle care, prep, tips/forms, gel polish.",
      "Gel/Acrygel extensions, refills & repairs.",
      "Art: French, chrome, ombré, decals, foils.",
      "Hygiene, pricing & client maintenance.",
    ],
    meta: ["Starter kit", "Sanitation", "Aftercare"],
    price: 6500,
  },
];

function fmtINR(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

/* Themed booking modal (uses CSS classes in learn.css) */
function BookingModal({ visible, courses, initialCourseId, onClose, onBooked }) {
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
    if (!courseId && Array.isArray(courses) && courses.length > 0) {
      setCourseId(courses[0]._id);
    }
  }, [courses, courseId]);

  if (!visible) return null;

  const selectedCourse = courses.find((c) => c._id === courseId);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    if (!courseId) { setError("Please select a course."); return; }
    if (!name || !email) { setError("Name and email are required."); return; }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/course-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          courseId,
          name,
          email,
          phone,
          preferredStart: preferredStart || null,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create booking");
      onBooked && onBooked(data.booking);
      // reset fields
      setName(""); setEmail(""); setPhone(""); setPreferredStart(""); setNotes("");
      onClose();
    } catch (err) {
      setError(err.message || "Booking failed");
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
            <h3 className="booking-modal__title">{selectedCourse ? `Book — ${selectedCourse.title}` : "Book a Course"}</h3>
          </div>
          <button className="booking-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <form className="booking-modal__form" onSubmit={submit}>
          <label className="bm-row">
            <span className="bm-label">Course</span>
            <select className="bm-input" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} — {c.duration} — {fmtINR(c.price ?? 0)}
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
            <label>
              <span className="bm-label">Phone</span>
              <input className="bm-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>

            <label>
              <span className="bm-label">Preferred start</span>
              <input className="bm-input" type="date" value={preferredStart} onChange={(e) => setPreferredStart(e.target.value)} />
            </label>
          </div>

          <label className="bm-row">
            <span className="bm-label">Notes</span>
            <textarea className="bm-input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>

          {error && <div className="bm-error">{error}</div>}

          <div className="bm-actions">
            <button type="button" className="bm-btn bm-btn--ghost" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="bm-btn bm-btn--primary" disabled={submitting}>
              {submitting ? "Booking..." : `Book ${selectedCourse ? `(${fmtINR(selectedCourse.price ?? 0)})` : ""}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Learn() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCourseId, setModalCourseId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // check auth to show My Enrollments

  useEffect(() => {
    let mounted = true;

    async function loadCourses() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error("No API or network error");
        const data = await res.json();

        if (mounted && Array.isArray(data) && data.length) setCourses(data);
        else if (mounted) setCourses(sampleCourses);
      } catch (err) {
        if (mounted) {
          setError("Using local sample courses (API unreachable).");
          setCourses(sampleCourses);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCourses();
    return () => { mounted = false; };
  }, []);

  function openModalWithCourse(courseId = null) {
    setModalCourseId(courseId);
    setModalOpen(true);
  }

  function handleBooked(booking) {
    alert("Booking received — we will contact you soon.");
    setModalOpen(false);
    setModalCourseId(null);
  }

  function handleEnrollClick(course) {
    openModalWithCourse(course._id);
  }

  return (
    <div className="learn">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-inner container">
          <p className="eyebrow">Learn With Us</p>
          <h1 className="h1">
            Professional Beauty Education by <span className="accent">Vanita</span>
          </h1>
          <p className="lead">
            Career-focused training with real salon practice. <br />
            Small batches • Personalized attention • Job-ready skills.
          </p>

          <div className="hero-actions">
  <button className="btn btn-primary" onClick={() => openModalWithCourse(null)}>Enroll Now</button>

  {token && (
    <button
      className="btn btn-secondary gap-4"
      onClick={() => navigate("/enrollments")}
    >
      My Enrollments
    </button>
  )}
</div>

        </div>
      </section>

      {/* TRAINER SECTION */}
      <section className="trainer container">
        <div className="wrap">
          <div className="trainer-card">
            <img src="/images/founder.jpg" alt="Vanita – Founder & Lead Trainer" />
          </div>

          <div className="texty">
            <p className="eyebrow">Your Mentor</p>
            <h2 className="h2">Vanita — Founder & Beauty Expert</h2>
            <p className="lead2">
              With extensive salon and bridal experience, Vanita mentors every learner
              personally, focusing on technique, hygiene, client handling, and
              portfolio building.
            </p>

            <ul className="bullets">
              <li>One-to-one guidance and hands-on practice on live models.</li>
              <li>Product knowledge, tool handling & sanitation.</li>
              <li>Portfolio & shoot day support for freelancing or salon jobs.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* COURSE INTRO */}
      <div className="container">
        <div className="intro center">
          <p className="eyebrow">Courses</p>
          <h2 className="h2">Our Professional Programs</h2>
          <p className="lead2">
            Carefully curated, industry-relevant modules to make you job-ready.
            Replace images with your own photos in the <code>images</code> folder.
          </p>
        </div>

        {/* Show loading / error */}
        {loading && <p style={{ textAlign: "center", color: "#6b7280" }}>Loading courses...</p>}
        {error && <p style={{ textAlign: "center", color: "#b45309" }}>{error}</p>}

        {/* COURSES GRID */}
        <div className="grid course-grid" aria-live="polite">
          {courses.map((c) => (
            <article key={c._id} className="course">
              <img src={c.image || "/images/course-placeholder.jpg"} alt={c.title} />
              <div className="course-body">
                <div className="course-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <h3 className="h3" style={{ margin: 0 }}>{c.title}</h3>
                  <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <span className="badge">{c.duration}</span>
                    <div style={{ fontWeight: 700, marginTop: 6 }}>{fmtINR(c.price ?? 0)}</div>
                  </div>
                </div>

                <ul className="bullets" style={{ marginTop: 10 }}>
                  {(c.bullets || []).map((b, i) => <li key={i}>{b}</li>)}
                </ul>

                <div className="meta" style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  {(c.meta || []).map((m, i) => <span key={i} style={{ fontSize: 13, color: "#6b7280" }}>{m}</span>)}
                </div>

                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button className="btn" onClick={() => handleEnrollClick(c)} aria-label={`Enroll in ${c.title}`}>
                    Enroll
                  </button>

                  <a className="btn" href={`/courses/${c._id}`} style={{ background: "transparent", border: "1px solid rgba(0,0,0,0.06)", marginLeft: "auto" }}>
                    More
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* CTA Panel */}
      <section className="cta container" style={{ marginTop: 18 }}>
        <div className="panel center">
          <h2 className="h2">Ready to Start?</h2>
          <p className="lead">
            Limited seats per batch for focused learning.
            Replace images and content as needed — layout adapts automatically.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={() => openModalWithCourse(null)}>Contact & Enrollment</button>
            {token && (
              <button
                className="btn"
                onClick={() => navigate("/enrollments")}
                style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                My Enrollments
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Booking modal */}
      <CourseBookingModal
  visible={modalOpen}
  courses={courses}
  initialCourseId={modalCourseId}
  onClose={() => {
    setModalOpen(false);
    setModalCourseId(null);
  }}
/>

    </div>
  );
}
