import React from "react";
const services = [
  { img: "/images/hair-styling.jpg", title: "Hair Styling", desc: "Trendy and bridal styles." },
  { img: "/images/hair-cutting.jpg", title: "Hair Cutting", desc: "Professional haircuts." },
  { img: "/images/hair-colouring.jpg", title: "Hair Colouring", desc: "Global, highlights and streaks." },
  { img: "/images/hair-spa.jpg", title: "Hair Spa", desc: "Deep nourishment for hair." },
  { img: "/images/facial.jpg", title: "Facials & Cleanups", desc: "Glow-enhancing facials." },
  { img: "/images/bridal-makeup.jpg", title: "Bridal Makeup", desc: "Exclusive bridal packages." },
  { img: "/images/party-makeup.jpg", title: "Party Makeup", desc: "Elegant party looks." },
  { img: "/images/nail-art.jpg", title: "Nail Art", desc: "Trendy nail extensions & gel polish." }
];

function Services() {
  return (
    <div className="services-section">
      <section className="section-divider">
        <div className="divider-line"></div>
        <h2 className="divider-title">Our Beauty Services</h2>
        <div className="divider-line"></div>
      </section>

      <section className="services-grid">
        {services.map((s, i) => (
          <div key={i} className="service-card">
            <img src={s.img} alt={s.title} />
            <div className="service-content">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Services;
