import React from "react";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section contact-info">
          <h3>Contact Info</h3>
          <p><strong>Phone:</strong> +91 9967563589</p>
          <p><strong>Email:</strong> sahilmokal19@gmail.com</p>
        </div>

        <div className="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/courses">Learn with Us</a></li>
            <li><a href="/location">Location</a></li>
            <li><a href="/services">Services</a></li>
          </ul>
        </div>

        <div className="footer-section services">
          <h3>Services</h3>
          <ul>
            <li>Eys Leshh</li>
            <li>BB Glow Facial</li>
            <li>Hydra Facial</li>
            <li>Plumping</li>
            <li>Nail Art</li>
          </ul>
        </div>

        <div className="footer-section social-links">
          <h3>Social Links</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/vanita_makeover_111/"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 SanMakeover. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
