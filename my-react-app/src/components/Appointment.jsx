import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Appointment() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    specialRequests: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* ================= AUTH CHECK + PREFILL ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (!token) return;

    const fetchProfile = async () => {
      try {
        console.log("📡 Fetching profile from /api/me");

        const res = await axios.get(
          "http://localhost:5000/api/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("✅ Profile fetched:", res.data);

        setFormData((prev) => ({
          ...prev,
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        }));
      } catch (err) {
        console.error(
          "❌ Failed to fetch profile:",
          err.response?.data || err.message
        );
      }
    };

    fetchProfile();
  }, []);

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= TIME SLOTS (30 MIN) ================= */
  const generateSlots = () => {
    const slots = [];
    for (let h = 10; h < 21; h++) {
      ["00", "30"].forEach((mm) => {
        slots.push(`${String(h).padStart(2, "0")}:${mm}`);
      });
    }
    return slots;
  };

  const slots = generateSlots();

  const formatLabel = (slot) => {
    const [hh, mm] = slot.split(":");
    const hour = parseInt(hh);
    const suffix = hour >= 12 ? "PM" : "AM";
    const hr12 = ((hour + 11) % 12) + 1;
    return `${hr12}:${mm} ${suffix}`;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Please login first!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/appointments",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message || "Appointment booked");

      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        specialRequests: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  /* ================= UI ================= */
  return (
    <section className="appointment-section">
      <div className="appointment-content">

        {/* LEFT FORM */}
        <div className="appointment-left">
          <form className="appointment-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Your Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="time-select"
            >
              <option value="" disabled>
                -- Select Time Slot --
              </option>
              {slots.map((s) => (
                <option key={s} value={s}>
                  {formatLabel(s)}
                </option>
              ))}
            </select>

            <textarea
              name="specialRequests"
              rows="3"
              placeholder="Any Special Requests?"
              value={formData.specialRequests}
              onChange={handleChange}
            />

            <button type="submit" className="submit-btn">
              Confirm Appointment
            </button>
          </form>
        </div>

        {/* RIGHT INFO */}
        <div className="appointment-right">
          {isLoggedIn && (
            <button
              className="history-btn"
              onClick={() => (window.location.href = "/appointment-history")}
            >
              📅 View My Appointments
            </button>
          )}

          <div className="location-info">
            <h3>Address</h3>
            <p>Plot No.85/B, Ramanagar, Dombivli, Maharashtra 440027.</p>

            <h3>Phone</h3>
            <p>(+91) 9423-990033</p>

            <h3>Email</h3>
            <p>sahilmokal19@gmail.com</p>
          </div>
        </div>

      </div>
    </section>
  );
}
