import React from "react";
import "../Learn.css";
export default function Locate() {
  return (
    <section className="location-section">

      {/* LEFT SIDE INFO */}
      <div className="location-info">
        <h2>San Makeover</h2>

        <p>
          📍 Near Xperia Mall,<br />
          Palava City, Dombivli East,<br />
          Maharashtra 421204<br />
        </p>

        <div className="contact-details">
          <p>
            📞 Contact: <b>+91 98765 43210</b>
          </p>
          <p>
            📧 Email: <b>sanmakeover@gmail.com</b>
          </p>
        </div>

        <a
          href="https://www.google.com/maps/dir//Xperia+Mall,+Kalyan+-+Shilphata+Rd,+Palava,+Dombivli,+Maharashtra+421204"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Directions
        </a>
      </div>

      {/* RIGHT SIDE MAP */}
      <div className="location-map">
        <iframe
          title="San Makeover Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.449870362508!2d73.08534477443679!3d19.169053352625708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b9adf595b9ad%3A0xa9dcaa0f1d1a7b84!2sXperia%20Mall!5e0!3m2!1sen!2sin!4v1692633365205!5m2!1sen!2sin"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

    </section>
  );
}
