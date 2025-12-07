// src/pages/BookService.jsx
import React, { useState, useMemo } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Booking page (no auto-scroll). Accepts:
 * - location.state.selectedService  (object { name, image, description })
 * - or legacy location.state.serviceName/serviceId if present
 */
export default function BookService() {
  const location = useLocation();
  const navigate = useNavigate();

  // prefer location.state.selectedService (object), fallback to older keys
  const selectedServiceFromState = location?.state?.selectedService || null;
  const legacyServiceName = location?.state?.serviceName || null;
  const legacyServiceId = location?.state?.serviceId || null;

  const serviceName =
    selectedServiceFromState?.name || legacyServiceName || "Service";

  const serviceId =
    selectedServiceFromState?.id || legacyServiceId || null; // may be null if not provided

  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    specialRequests: "",
  });
  const [loading, setLoading] = useState(false);

  // generate 30-min slots from 10:00 to 20:30
  const slots = useMemo(() => {
    const s = [];
    for (let h = 10; h < 21; h++) {
      ["00", "30"].forEach((mm) => {
        s.push(`${String(h).padStart(2, "0")}:${mm}`);
      });
    }
    return s;
  }, []);

  const formatLabel = (slot) => {
    const [hhStr, mm] = slot.split(":");
    const hh = parseInt(hhStr, 10);
    const suffix = hh >= 12 ? "PM" : "AM";
    const hour12 = ((hh + 11) % 12) + 1;
    return `${hour12}:${mm} ${suffix}`;
  };

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.date || !form.time) {
      alert("Please fill required fields (name, email, date, time).");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        serviceId,
        serviceName,
        ...form,
      };

      const res = await axios.post(
        "http://localhost:5000/api/service-bookings",
        payload,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      alert(res.data.message || "Service booked!");
      // After booking, go back to services page or show confirmation — choose services
      navigate("/services");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error booking service");
    } finally {
      setLoading(false);
    }
  };

  // Back helper: prefer history back, otherwise go to /services
  const handleBack = () => {
    // Try to go back in browser history; fallback to /services
    if (window.history.length > 1) navigate(-1);
    else navigate("/services");
  };

  return (
    <div className="min-h-screen bg-booking flex items-center justify-center px-4 py-8">
      <div
        className="
          w-full max-w-md md:max-w-lg
          bg-white
          rounded-xl shadow-xl
          border-t-4 border-[#d4af37]
          p-6 min-h-[380px]
        "
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-xl font-bold text-[#111]">
              Book <span className="text-[#d4af37]">{serviceName}</span>
            </h1>
            
          </div>

          {/* Back to services */}
          <div>
            <button
              onClick={handleBack}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition bg-yellow-400"
            >
              ← Back
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mb-4">
          Choose date &amp; a 30-min time slot
        </p>

        <form onSubmit={submit} className="space-y-3">
          {/* Hidden fields to send selected service details to backend */}
          <input type="hidden" name="serviceName" value={serviceName} />
          {serviceId && <input type="hidden" name="serviceId" value={serviceId} />}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={update}
              required
              className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-1 focus:ring-yellow-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              required
              className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-1 focus:ring-yellow-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={update}
                required
                className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Time slot
              </label>
              <select
                name="time"
                value={form.time}
                onChange={update}
                required
                className="w-full border border-gray-300 p-2 rounded-md text-sm bg-white focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              >
                <option value="">-- Select slot --</option>
                {slots.map((s) => (
                  <option key={s} value={s}>
                    {formatLabel(s)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Special requests (opt.)
            </label>
            <textarea
              name="specialRequests"
              value={form.specialRequests}
              onChange={update}
              rows="2"
              className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-1 focus:ring-yellow-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition bg-yellow-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                px-4 py-2 rounded-md text-sm font-semibold
                bg-[#d4af37] text-black
                hover:bg-[#e0c14d]
                disabled:opacity-60 disabled:cursor-not-allowed
                transition
                bg-yellow-400
              "
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
