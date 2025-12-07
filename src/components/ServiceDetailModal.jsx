// ServiceDetailModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ServiceDetailModal({ service, onClose }) {
  const navigate = useNavigate();

  const bookNow = () => {
    navigate("/book-service", {
      state: {
        serviceId: service.id,
        serviceName: service.name,
      },
    });
    onClose();
  };

  return (
    <section className={`service-detail ${service ? "active" : ""}`}>
      <span className="close-btn" onClick={onClose}>&times;</span>

      <h2>{service?.name}</h2>
      <p>{service?.description}</p>

      <button className="btn-outline-gold" onClick={bookNow}>
        Book Now
      </button>
    </section>
  );
}
