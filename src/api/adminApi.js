// src/api/adminApi.js
import axios from "axios";

const BASE = "http://localhost:5000"; // change to env var in production

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const adminApi = {
  getStats: () => axios.get(`${BASE}/api/admin/stats`, { headers: authHeaders() }),
  getAppointments: () => axios.get(`${BASE}/api/admin/appointments`, { headers: authHeaders() }),
  getServiceBookings: () => axios.get(`${BASE}/api/admin/service-bookings`, { headers: authHeaders() }),
  updateAppointment: (id, data) => axios.put(`${BASE}/api/admin/appointments/${id}`, data, { headers: authHeaders() }),
  deleteAppointment: (id) => axios.delete(`${BASE}/api/admin/appointments/${id}`, { headers: authHeaders() }),
  updateServiceBooking: (id, data) => axios.put(`${BASE}/api/admin/service-bookings/${id}`, data, { headers: authHeaders() }),
  deleteServiceBooking: (id) => axios.delete(`${BASE}/api/admin/service-bookings/${id}`, { headers: authHeaders() }),
};
