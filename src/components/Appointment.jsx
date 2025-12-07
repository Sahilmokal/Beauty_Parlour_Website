// src/components/Appointment.jsx
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Generate time slots (10am–9pm)
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);

      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        specialRequests: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed.");
    }
  };

  return (
    <>
      {/* Use the separated header component */}
      

      {/* Main Form Section */}
      <section className="appointment-section">
        <div className="appointment-content">

          {/* Left side form */}
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
                className="time-select"
                value={formData.time}
                onChange={handleChange}
                required
                style={{ marginBottom: "10px" }}
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
                style={{ marginTop: "10px", marginBottom: "20px" }}
              ></textarea>

              <button type="submit" className="submit-btn">
                Confirm Appointment
              </button>
            </form>
          </div>

          {/* Right side info */}
          <div className="appointment-right">
            {isLoggedIn && (
              <button
                className="history-btn"
                onClick={() => (window.location.href = "/appointment-history")}
                style={{ marginBottom: "12px" }}
              >
                📅 View My Appointments
              </button>
            )}

            <div className="location-info">
              <h3>Address</h3>
              <p>Plot No.85/B, Ramanagar, Nagpur, Maharashtra 440027.</p>

              <h3>Phone</h3>
              <p>(+91) 9423-990033</p>

              <h3>Email</h3>
              <p>sahilmokal19@gmail.com</p>
            </div>

            <div className="social-icons">
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
