import React, { useState, useEffect } from "react";


export default function Contact() {
  // ------------------ REVIEW SLIDER LOGIC ------------------
  const reviews = [
    {
      text: "Absolutely loved the facial treatment! My skin has never looked better!",
      author: "– Priya Sharma, Customer",
    },
    {
      text: "SanMakeover provides top-class service. Highly recommended!",
      author: "– Anjali Mehta, Regular Client",
    },
    {
      text: "The staff is friendly and professional. Loved the ambience!",
      author: "– Riya Kapoor, First-Time Visitor",
    },
    {
      text: "Tried their hair spa, and it was super relaxing. 10/10!",
      author: "– Sneha Patil, Client",
    },
    {
      text: "One of the best salons in town. They never disappoint.",
      author: "– Megha Nair, Happy Customer",
    },
  ];

  const [currentReview, setCurrentReview] = useState(0);

  const showNext = () =>
    setCurrentReview((prev) => (prev + 1) % reviews.length);

  const showPrev = () =>
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    const interval = setInterval(showNext, 5000);
    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------------------

  return (
    <>
      {/* ------------------- APPOINTMENT SECTION ------------------- */}
      <section className="appointment-section">
        <div className="appointment-content">

          {/* LEFT SIDE (FORM) */}
          <div className="appointment-left">
            <form className="appointment-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <input type="tel" placeholder="Your Phone" required />
              <input type="date" required />
              <input type="time" required />
              <textarea placeholder="Special Requests" rows="3"></textarea>
              <button type="submit">Confirm Appointment</button>
            </form>
          </div>

          {/* RIGHT SIDE (INFO + SOCIALS) */}
          <div className="appointment-right">
            <div className="location-info">
              <h3>Address</h3>
              <p>
                Plot No.85/B, Ramanagar, <br />
                Shatabdi Square, Beltarodi Road, <br />
                Nagpur, Maharashtra 440027.
              </p>

              <h3>Phone:</h3>
              <p>(+91) 9423-990033</p>

              <h3>Email:</h3>
              <p>sahilmokal19@gmail.com</p>
            </div>

            <div className="social-icons">
              <a
                href="https://www.instagram.com/vanita_makeover_111/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------- REVIEW SECTION ------------------- */}
      <div className="reviews">

        {/* Divider Title */}
        <section className="section-divider">
          <div className="divider-line"></div>
          <h2 className="divider-title">Your Review Matters!!!</h2>
          <div className="divider-line"></div>
        </section>

        {/* Review Slider */}
        <section className="review-section">
          <button className="arrow left" onClick={showPrev}>
            &#10094;
          </button>

          <div className="review-box">
            {reviews.map((rev, index) => (
              <div
                key={index}
                className={`review ${
                  index === currentReview ? "active" : ""
                }`}
              >
                <p className="review-text">"{rev.text}"</p>
                <p className="review-author">{rev.author}</p>
              </div>
            ))}
          </div>

          <button className="arrow right" onClick={showNext}>
            &#10095;
          </button>
        </section>
      </div>
    </>
  );
}
