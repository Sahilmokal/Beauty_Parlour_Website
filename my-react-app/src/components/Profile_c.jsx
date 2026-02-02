// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import "../css/profile.css";
import { useNavigate } from "react-router-dom";

export default function Profile_c() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  const navigate = useNavigate();

  // ---------------- LOAD PROFILE ----------------
  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          return navigate("/login");
        }

        const data = await res.json();
        setUser(data);

        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
        });
      } catch (err) {
        console.error("Load profile error:", err);
        alert(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [navigate]);

  // ---------------- UPDATE FORM ----------------
  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  // ---------------- SAVE PROFILE ----------------
  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update profile");
      }

      const updated = await res.json();
      setUser(updated);
      setEditing(false);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="profile-shell">Loading profile…</div>;

  return (
    <div className="profile-shell container">
      <h1 className="profile-header">My Profile</h1>

      <div className="profile-card" style={{ padding: 30 }}>

        {/* ---------- VIEW MODE ---------- */}
        {!editing ? (
          <>
            <div className="info-row">
              <strong className="label">Username:</strong>
              <span className="value">@{user.username}</span>
            </div>

            <div className="info-row">
              <strong className="label">Name:</strong>
              <span className="value">{user.name || "—"}</span>
            </div>

            <div className="info-row">
              <strong className="label">Email:</strong>
              <span className="value">{user.email || "—"}</span>
            </div>

            <div className="info-row">
              <strong className="label">Phone:</strong>
              <span className="value">{user.phone || "—"}</span>
            </div>

            <div className="info-row">
              <strong className="label">Location:</strong>
              <span className="value">{user.location || "—"}</span>
            </div>

            <div className="info-bio">
              <strong className="label">Bio:</strong>
              <p>{user.bio || "No bio added"}</p>
            </div>

            <div className="profile-actions-row">
              <button className="btn-outline" onClick={() => setEditing(true)}>Edit Profile</button>
              <button className="btn-gold" onClick={() => navigate("/my-bookings")}>
                My Bookings
              </button>
            </div>
          </>
        ) : (
          /* ---------- EDIT MODE ---------- */
          <form onSubmit={saveProfile} className="profile-form">

            <label className="form-row">
              <span className="form-label">Name</span>
              <input name="name" value={form.name} onChange={onChange} />
            </label>

            <label className="form-row">
              <span className="form-label">Email</span>
              <input name="email" type="email" value={form.email} onChange={onChange} />
            </label>

            <label className="form-row">
              <span className="form-label">Phone</span>
              <input name="phone" value={form.phone} onChange={onChange} />
            </label>

            <label className="form-row">
              <span className="form-label">Location</span>
              <input name="location" value={form.location} onChange={onChange} />
            </label>

            <label className="form-row">
              <span className="form-label">Bio</span>
              <textarea name="bio" value={form.bio} onChange={onChange} />
            </label>

            <div className="profile-actions">
              <button type="button" className="btn-cancel" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-gold" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
