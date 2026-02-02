// src/components/AppointmentHeader.jsx
import React from "react";

/**
 * Simple presentational header for the appointment page.
 * Feel free to pass props later (title, subtitle, bgColor) if you want it configurable.
 */
export default function Ap_header() {
  return (
    <div
      style={{
        background: "#111",
        padding: "80px 20px 60px 20px",
        textAlign: "center",
        marginTop: "-20px",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          fontWeight: "700",
          margin: 0,
          color: "#fff",
        }}
      >
        Book Appointment
      </h1>

      <p
        style={{
          fontSize: "20px",
          color: "#d4d4d4",
          marginTop: "12px",
        }}
      >
        Your beauty, our responsibility ✨
      </p>
    </div>
  );
}
