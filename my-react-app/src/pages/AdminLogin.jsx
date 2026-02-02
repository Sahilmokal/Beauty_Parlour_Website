// src/pages/AdminLogin.jsx
import React, { useState, useLayoutEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { parseJwt } from "../utils/jwt";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById("root");

    const prev = {
      htmlPadding: html.style.paddingTop,
      bodyPadding: body.style.paddingTop,
      rootPadding: root ? root.style.paddingTop : "",
      bodyMargin: body.style.marginTop,
      htmlMargin: html.style.marginTop,
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password) {
      setErrorMsg("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/auth/admin/login", {
        username,
        password,
      });

      const token = res.data.token;
      if (!token) {
        setErrorMsg("Login failed: no token received.");
        return;
      }

      // store token
      localStorage.setItem("adminToken", token);


      // decode token to check role quickly (token contains role if server set it)
      const payload = parseJwt(token);
      const role = payload?.role || "user";
      if (role !== "admin") {
        // extra safety: clear token and error out
        localStorage.removeItem("token");
        setErrorMsg("Admin access required.");
        return;
      }

      // navigate to admin dashboard (create route /admin)
      navigate("/adminDashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      // show helpful message from server if available
      const serverMessage = err?.response?.data?.message || err?.response?.data || err?.message;
      setErrorMsg(serverMessage || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .auth-no-pad { padding-top: 0 !important; margin-top: 0 !important; }
        :root { --gold: #d4af37; --white: #fff; --muted: #aaaaaa; }
        html, body, #root { height: 100%; }
        .auth-root { min-height: 100vh; display: flex; background: linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url('/images/login-bg.jpg') center/cover no-repeat; align-items: center; justify-content: center; padding: 20px; }
        .lp-card { width:100%; max-width:520px; background: rgba(8,8,8,0.92); border-radius:14px; padding:28px; border:1px solid rgba(212,175,55,0.14); box-shadow:0 10px 40px rgba(0,0,0,0.6); color:var(--white); box-sizing:border-box; }
        .lp-title { font-size:28px; text-align:center; margin-bottom:6px; color:var(--gold); font-weight:700; }
        .lp-sub { text-align:center; color:var(--muted); margin-bottom:14px; }
        .lp-field { margin-bottom:14px; }
        .lp-input { width:100%; padding:12px 14px; padding-right:46px; border-radius:10px; border:1px solid #333; background:#0d0d0d; color:var(--white); font-size:15px; outline:none; box-sizing:border-box; }
        .lp-input:focus { border-color: rgba(212,175,55,0.95); box-shadow:0 6px 18px rgba(212,175,55,0.06); transform: translateY(-1px); }
        .lp-password-wrapper { position: relative; width:100%; }
        .lp-eye { position:absolute; right:10px; top:50%; transform:translateY(-50%); font-size:18px; color:var(--muted); cursor:pointer; user-select:none; }
        .lp-btn { width:100%; padding:12px; background: linear-gradient(180deg, var(--gold), #caa23a); color:black; border:none; border-radius:10px; font-size:16px; font-weight:700; cursor:pointer; }
        .lp-footer{ margin-top:12px; text-align:center; font-size:14px; color:var(--muted); }
        @media (max-width:420px){ .lp-card{ padding:18px; max-width:420px } }
      `}</style>

      <div className="auth-root" role="main" aria-label="Admin Authentication page">
        <div className="lp-card" aria-labelledby="login-heading">
          <h2 id="login-heading" className="lp-title">Admin Sign In</h2>
          <div className="lp-sub">Enter admin credentials</div>

          {errorMsg && <div style={{ background: "rgba(255,180,180,0.08)", color: "#ffb4b4", padding: 10, borderRadius: 8, marginBottom: 12 }}>{errorMsg}</div>}

          <form onSubmit={handleLogin} noValidate>
            <div className="lp-field">
              <label htmlFor="username">Username</label>
              <input id="username" className="lp-input" type="text" value={username} placeholder="Admin username" onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
            </div>

            <div className="lp-field">
              <label htmlFor="password">Password</label>
              <div className="lp-password-wrapper">
                <input id="password" className="lp-input" type={showPassword ? "text" : "password"} value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                <span className="lp-eye" role="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(s => !s)}>
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
            </div>

            <button className="lp-btn" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>

            <div className="lp-footer" style={{ marginTop: 12 }}>
              {/* no register link here on purpose */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
