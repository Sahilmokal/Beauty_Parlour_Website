// src/pages/RegisterPage.jsx
import React, { useState, useLayoutEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Force-remove top padding/margin (html/body/#root) while this page is mounted
  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById("root");

    const prev = {
      htmlPadding: html.style.paddingTop,
      bodyPadding: body.style.paddingTop,
      rootPadding: root ? root.style.paddingTop : "",
      htmlMargin: html.style.marginTop,
      bodyMargin: body.style.marginTop,
    };

    html.style.paddingTop = "0px";
    body.style.paddingTop = "0px";
    if (root) root.style.paddingTop = "0px";
    html.style.marginTop = "0px";
    body.style.marginTop = "0px";
    body.classList.add("auth-no-pad");

    return () => {
      html.style.paddingTop = prev.htmlPadding || "";
      body.style.paddingTop = prev.bodyPadding || "";
      if (root) root.style.paddingTop = prev.rootPadding || "";
      html.style.marginTop = prev.htmlMargin || "";
      body.style.marginTop = prev.bodyMargin || "";
      body.classList.remove("auth-no-pad");
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post("/api/auth/register", {
        username,
        password,
      });

      alert(res.data.message || "Registered successfully");
      navigate("/login");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        /* fallback class if global CSS has !important */
        .auth-no-pad { padding-top: 0 !important; margin-top: 0 !important; }

        :root { --gold: #d4af37; --white: #fff; --muted: #aaa; }

        html, body, #root { height: 100%; }

        .auth-root {
          min-height: 100vh;
          box-sizing: border-box;
          display: flex;
          background:
            linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.55)),
            url('/images/login-bg.jpg') center/cover no-repeat;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .reg-card {
          width: 100%;
          max-width: 520px;
          background: rgba(15,15,15,0.92);
          border-radius: 14px;
          padding: 28px;
          border: 1px solid rgba(212,175,55,0.14);
          backdrop-filter: blur(6px);
          color: var(--white);
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
          box-sizing: border-box;
        }

        .reg-title { font-size: 26px; text-align:center; font-weight:700; color:var(--gold); margin-bottom:8px; }
        .reg-sub { text-align:center; color:var(--muted); margin-bottom:14px; font-size:14px; }

        .reg-field { margin-bottom:14px; }
        label { display:block; margin-bottom:6px; font-size:14px; font-weight:600; color:var(--white); }

        .reg-input {
          width:100%;
          padding:12px 14px;
          padding-right:44px;
          border:1px solid #444;
          border-radius:10px;
          background:#0d0d0d;
          font-size:15px;
          color:var(--white);
          outline:none;
          box-sizing:border-box;
          transition: box-shadow .12s, border-color .12s;
        }
        .reg-input:focus { border-color: var(--gold); box-shadow: 0 6px 18px rgba(212,175,55,0.12); }

        .reg-password-wrapper { position: relative; }
        .reg-eye { position:absolute; right:10px; top:50%; transform:translateY(-50%); font-size:18px; cursor:pointer; color:var(--muted); }
        .reg-eye:hover { color:var(--gold); }

        .reg-btn {
          width:100%;
          padding:12px;
          background: linear-gradient(180deg, var(--gold), #caa23a);
          color:black;
          border:none;
          border-radius:10px;
          font-size:16px;
          font-weight:700;
          margin-top:10px;
          cursor:pointer;
        }
        .reg-btn:disabled { opacity:.8; cursor:not-allowed; }

        .reg-error { color: #ffb4b4; background: rgba(255,180,180,0.1); padding: 10px; border-radius:8px; margin-bottom:12px; }

        .reg-footer { text-align:center; margin-top:12px; color:var(--muted); }
        .reg-footer a { color:var(--gold); font-weight:600; text-decoration:none; }
        .reg-footer a:hover { text-decoration:underline; }

        @media (max-width: 420px) { .reg-card { padding:18px; max-width:420px; } }
      `}</style>

      <div className="auth-root" role="main" aria-label="Register page">
        <div className="reg-card" aria-labelledby="register-heading">
          <h2 id="register-heading" className="reg-title">Create Account</h2>
          <p className="reg-sub">Join our platform today</p>

          {errorMsg && <div className="reg-error" role="alert">{errorMsg}</div>}

          <form onSubmit={handleRegister} noValidate>
            <div className="reg-field">
              <label htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                className="reg-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Choose a username"
                autoComplete="username"
              />
            </div>

            <div className="reg-field">
              <label htmlFor="reg-password">Password</label>
              <div className="reg-password-wrapper">
                <input
                  id="reg-password"
                  className="reg-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  autoComplete="new-password"
                />
                <span className="reg-eye" role="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(s => !s)}>
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
            </div>

            <div className="reg-field">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <div className="reg-password-wrapper">
                <input
                  id="reg-confirm"
                  className="reg-input"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
                <span className="reg-eye" role="button" aria-label={showConfirm ? "Hide confirm" : "Show confirm"} onClick={() => setShowConfirm(s => !s)}>
                  {showConfirm ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
            </div>

            <button className="reg-btn" type="submit" disabled={submitting}>
              {submitting ? "Creating…" : "Register"}
            </button>

            <div className="reg-footer">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
