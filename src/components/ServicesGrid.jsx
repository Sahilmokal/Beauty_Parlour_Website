import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from './ServiceCard';

const ServicesGrid = () => {
  const navigate = useNavigate();

  const services = [
    { name: "Hair Styling", image: "images/hair-styling.jpg", description: "Trendy, bridal, or casual styles tailored for every occasion." },
    { name: "Hair Cutting", image: "images/hair-cutting.jpg", description: "Professional haircuts for women and kids by expert stylists." },
    { name: "Hair Colouring", image: "images/hair-colouring.jpg", description: "Global, highlights, streaks & root touch-ups with top brands." },
    { name: "Hair Spa", image: "images/hair-spa.jpg", description: "Deep nourishment and rejuvenation for shiny, healthy hair." },
    { name: "Facials & Cleanups", image: "images/facial.jpg", description: "Glow-enhancing facials for all skin types using premium products." },
    { name: "Bridal Makeup", image: "images/bridal-makeup.jpg", description: "Exclusive bridal packages with makeup, hair, and draping." },
    { name: "Party Makeup", image: "images/party-makeup.jpg", description: "Elegant party looks with HD or airbrush makeup options." },
    { name: "Nail Art", image: "images/nail-art.jpg", description: "Trendy nail extensions, gel polish, and custom nail art designs." },
  ];

  const handleServiceClick = (serviceName) => {
    const service = services.find((s) => s.name === serviceName);

    // Redirect to booking page
    navigate("/book-service", { state: { selectedService: service } });
  };

  return (
    <section className="services-grid">
      {services.map((service) => (
        <ServiceCard
          key={service.name}
          service={service}
          onClick={handleServiceClick}
        />
      ))}
    </section>
  );
};

export default ServicesGrid;
