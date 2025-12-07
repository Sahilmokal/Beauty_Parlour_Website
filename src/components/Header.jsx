import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <>
      <header>
        <div className="header-container">

          {/* LEFT NAV */}
          <nav className="nav-left">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/courses" className="learn-link">Learn With Us</Link></li>
            </ul>
          </nav>

          {/* LOGO */}
          <div className="logo-container">
            <Link to="/">
              <img src="/images/logo.png" alt="SanMakeover Logo" className="logo-img" />
            </Link>
          </div>

          {/* RIGHT NAV */}
          <nav className="nav-right">
            <ul>
              <li><Link to="/location">Location</Link></li>
              <li><Link to="/services" className="services-btn">Services</Link></li>
              <li><Link to="/appointment">Book Appointment</Link></li>

              {/* LOGIN / DROPDOWN */}
              <li className="auth-item" style={{ listStyle: "none" }}>
                {!isLoggedIn ? (
                  <button className="auth-btn" onClick={() => navigate("/login")}>
                    Sign In
                  </button>
                ) : (
                  <div className="user-menu-wrapper" ref={dropdownRef}>
                    {/* 🔥 THREE-LINE DROPDOWN BUTTON */}
                    <button
                      className="user-menu-btn user-icon-btn"
                      onClick={() => setDropdownOpen(prev => !prev)}
                    >
                      ≡
                    </button>

                    {/* DROPDOWN MENU */}
                    {dropdownOpen && (
                      <div className="user-dropdown">
                        <Link
                          to="/profile"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Profile
                        </Link>

                        <Link
                          to="/appointment-history"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          My Appointments
                        </Link>
                        <Link
                          to="/my-bookings"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          My Bookings
                        </Link>
                       <Link
                          to="/enrollments"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          My Enrollments
                        </Link>

                        <button
                          className="dropdown-item logout"
                          onClick={handleLogout}
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            </ul>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu active">
          <button className="close-btn" onClick={() => setMenuOpen(false)}>×</button>

          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/courses" onClick={() => setMenuOpen(false)}>Learn With Us</Link>
          <Link to="/location" onClick={() => setMenuOpen(false)}>Location</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link to="/appointment" onClick={() => setMenuOpen(false)}>Book Appointment</Link>

          {!isLoggedIn ? (
            <a className="auth-link" onClick={() => { navigate("/login"); setMenuOpen(false); }}>
              Sign In
            </a>
          ) : (
            <>
              <Link className="auth-link" to="/profile" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>

              <a className="auth-link" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                Sign Out
              </a>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Header;
