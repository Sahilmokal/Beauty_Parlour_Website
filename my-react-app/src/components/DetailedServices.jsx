import React from 'react';
import { useNavigate } from 'react-router-dom';

const DetailedServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      name: "Hair Styling",
      image: "images/hair-styling.jpg",
      description: `From bridal buns to glam waves and sleek ponytails, every look is tailored to your outfit and face shape.
We prep with heat protectants and volumizers, then finish with humidity-resistant setting.
Trials available for brides/events. Pins and accessories can be arranged on request.
Expect a comfortable prep flow and photo-ready finish that lasts for hours.`,
    },
    {
      name: "Hair Cutting",
      image: "images/hair-cutting.jpg",
      description: `Precision cuts designed around your lifestyle—bobs, layers, fringes, or trims for women and kids.
We begin with a face-shape & density consult, then shape for movement and easy home styling.
Includes cleanse and basic blow-dry. Style education and maintenance tips provided.
Leave with a fresh silhouette that grows out beautifully.`,
    },
    {
      name: "Hair Colouring",
      image: "images/hair-colouring.jpg",
      description: `Global colour, highlights, lowlights, balayage, or root touch-ups using salon-grade brands.
Shade mapping is done to suit your undertone and workplace needs.
We use bond-protect technology (where applicable) to preserve hair strength and shine.
Post-colour care plan included for long-lasting tone and gloss.`,
    },
    {
      name: "Hair Spa",
      image: "images/hair-spa.jpg",
      description: `Deep-nourishing rituals for dryness, frizz, dandruff, or hair fall.
Cleanse, targeted mask, and relaxing scalp massage to boost circulation.
Steam or warm-towel therapy enhances absorption and softness.
Expect calmer scalp, smoother lengths, and a healthy, mirror-like shine.`,
    },
    {
      name: "Facials & Cleanups",
      image: "images/facial.jpg",
      description: `Customized facials for hydration, tan removal, brightening, or anti-aging—chosen after a quick skin check.
Includes cleanse, exfoliation, massage, mask, and targeted serums.
Products are carefully selected to suit oily, dry, or sensitive skin.
Walk out with visible glow, refined texture, and relaxed facial muscles.`,
    },
    {
      name: "Bridal Makeup",
      image: "images/bridal-makeup.jpg",
      description: `Flawless HD or airbrush base, soft-focus eyes, and sculpting tailored to your features and outfit.
Includes hairstyling and draping as per package. Trial can be scheduled beforehand.
Long-wear, flash-proof products for ceremonies and photography.
Calm, timely execution so you enjoy your big day, stress-free.`,
    },
    {
      name: "Party Makeup",
      image: "images/party-makeup.jpg",
      description: `From soft glam to bold evening looks, we match your event vibe and outfit colours.
Skin is prepped for a smooth, long-lasting base; eyes and lips balanced for elegance.
False lashes optional. Quick hair touch-ups available.
Perfect for receptions, birthdays, and corporate events.`,
    },
    {
      name: "Nail Art",
      image: "images/nail-art.jpg",
      description: `Gel polish, French, ombré, chrome, and custom nail art with clean cuticle work.
Extensions available in natural, square, or almond shapes.
We use quality gels for shine and chip-resistance.
Aftercare guidance ensures your manicure stays flawless longer.`,
    },
  ];

  const goToBooking = (serviceName) => {
    const selected = services.find((s) => s.name === serviceName);

    navigate("/book-service", {
      state: { selectedService: selected }
    });
  };

  return (
    <section className="services-details">
      <div className="sd-wrap">
        <div className="sd-head">
          <span className="sd-icon">
            <i className="fa-solid fa-spa"></i>
          </span>
          <h2>Detailed Services</h2>
          <p className="sd-sub">
            Premium care with expert hands. Explore what each service includes so you know exactly what to expect.
          </p>
        </div>

        <div className="sd-grid">
          {services.map((svc) => (
            <article key={svc.name} className="sd-card">
              <h3>{svc.name}</h3>
              <p style={{ whiteSpace: "pre-line" }}>{svc.description}</p>

              <button
                className="btn-outline-gold"
                onClick={() => goToBooking(svc.name)}
              >
                Book Now
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedServices;
