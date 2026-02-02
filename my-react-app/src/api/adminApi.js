// src/api/adminApi.js

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

/**
 * Generic admin fetch helper
 */
async function adminRequest(endpoint, options = {}) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Admin not authenticated");
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined, // ✅ stringify ONLY here
  });

  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    console.error("❌ Invalid JSON from server:", text);
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    throw new Error(data.message || "Admin API error");
  }

  return data;
}

/* ------------------ STATS ------------------ */
export const getAdminStats = () =>
  adminRequest("/admin/stats");

/* ---------------- APPOINTMENTS ------------- */
export const getAdminAppointments = () =>
  adminRequest("/admin/appointments");

export const updateAdminAppointment = (id, payload) =>
  adminRequest(`/admin/appointments/${id}`, {
    method: "PUT",
    body: payload, // ✅ NOT stringified
  });

export const deleteAdminAppointment = (id) =>
  adminRequest(`/admin/appointments/${id}`, {
    method: "DELETE",
  });

/* ------------- SERVICE BOOKINGS ------------ */
export const getAdminServiceBookings = () =>
  adminRequest("/admin/service-bookings");

export const updateAdminServiceBooking = (id, payload) =>
  adminRequest(`/admin/service-bookings/${id}`, {
    method: "PUT",
    body: payload,
  });

export const deleteAdminServiceBooking = (id) =>
  adminRequest(`/admin/service-bookings/${id}`, {
    method: "DELETE",
  });

/* ------------- COURSE BOOKINGS ------------- */
export const getAdminCourseBookings = () =>
  adminRequest("/admin/course-bookings");

export const updateAdminCourseBooking = (id, payload) =>
  adminRequest(`/admin/course-bookings/${id}`, {
    method: "PUT",
    body: payload,
  });

export const deleteAdminCourseBooking = (id) =>
  adminRequest(`/admin/course-bookings/${id}`, {
    method: "DELETE",
  });
