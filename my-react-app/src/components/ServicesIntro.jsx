import React from 'react';

const ServicesIntro = () => {
  return (
    <section className="services-intro">
      <div className="overlay"></div>
      <div className="container">
        <div className="icon">
          <i className="fa-solid fa-spa"></i>
        </div>
        <h2>OUR SERVICES</h2>
        <p>
          Step into elegance and indulge in luxury.  
          At <span className="highlight">SanMakeover</span>, we believe beauty is an experience — not just a service.  
          From <strong>premium hair styling</strong> to <strong>bridal transformations</strong>,  
          every detail is crafted with care, passion, and expertise.  
          Let us pamper you with treatments that rejuvenate your skin, refresh your look,  
          and uplift your spirit.  
        </p>
      </div>
    </section>
  );
};

export default ServicesIntro;
