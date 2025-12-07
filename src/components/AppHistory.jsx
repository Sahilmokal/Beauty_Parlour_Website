// src/components/AppHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const GOLD = "#d4af37";

export default function AppHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Reschedule modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setAppointments([]);
        setLoading(false);
        return;
      }
      const res = await axios.get("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch appointment history");
    } finally {
      setLoading(false);
    }
  };

  // 30-min slots from 10:00 to 20:30
  const generateSlots = (start = 10, end = 21) => {
    const slots = [];
    for (let h = start; h < end; h++) {
      ["00", "30"].forEach((mm) => {
        const hh = String(h).padStart(2, "0");
        slots.push(`${hh}:${mm}`);
      });
    }
    return slots;
  };
  const slots = generateSlots();

  const formatLabel = (slot) => {
    const [hhStr, mm] = slot.split(":");
    const hh = parseInt(hhStr, 10);
    const suffix = hh >= 12 ? "PM" : "AM";
    const hour12 = ((hh + 11) % 12) + 1;
    return `${hour12}:${mm} ${suffix}`;
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString();
    } catch {
      return iso;
    }
  };

  // date-only comparison (local timezone)
  const isPast = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d)) return false;
    d.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    return d < today;
  };

  // Open reschedule modal
  const openReschedule = (appt) => {
    if (isPast(appt.date)) {
      alert("Past appointments cannot be rescheduled.");
      return;
    }
    setSelectedAppt(appt);
    setNewDate(appt.date ? appt.date.split("T")[0] : "");
    setNewTime(appt.time || "");
    setShowModal(true);
  };

  // Submit reschedule
  const submitReschedule = async (e) => {
    e.preventDefault();
    if (!newDate || !newTime) {
      alert("Please pick date and time.");
      return;
    }
    if (!selectedAppt) return;

    // prevent rescheduling to past
    if (isPast(newDate)) {
      alert("Cannot reschedule to a past date.");
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/appointments/${selectedAppt._id}`,
        { date: newDate, time: newTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data.appointment || { ...selectedAppt, date: newDate, time: newTime };
      setAppointments((prev) => prev.map((a) => (a._id === selectedAppt._id ? updated : a)));

      setShowModal(false);
      setSelectedAppt(null);
      setNewDate("");
      setNewTime("");
      alert("Appointment rescheduled.");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to reschedule.");
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel appointment
  const cancelAppointment = async (appt) => {
    if (isPast(appt.date)) {
      alert("Past appointments cannot be cancelled.");
      return;
    }
    const ok = window.confirm("Are you sure you want to cancel this appointment?");
    if (!ok) return;
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/appointments/${appt._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments((prev) => prev.filter((a) => a._id !== appt._id));
      alert("Appointment cancelled.");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to cancel.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-10 px-4" style={{ background: "#fff" }}>
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold" style={{ color: "#111" }}>
            <span style={{ color: GOLD }}>Your</span> Appointment History
          </h2>
          <p className="mt-2 text-sm text-gray-600">Manage, reschedule or cancel your bookings.</p>
        </div>

        {/* Loading / Empty */}
        {loading ? (
          <div className="p-6 bg-black text-white rounded-lg shadow">Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="p-6 rounded-lg text-center border border-gray-200">
            <p className="text-gray-700">You haven't booked any appointments yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Special Requests</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y">
                {appointments.map((appt) => {
                  const past = isPast(appt.date);
                  return (
                    <tr key={appt._id} className="hover:bg-[#fff8e1] transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-800">{appt.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(appt.date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{appt.time}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{appt.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{appt.specialRequests || appt.notes || "-"}</td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-sm text-right">
                        {past ? (
                          <span className="text-sm text-gray-500">Past — no actions</span>
                        ) : (
                          <div className="inline-flex gap-2 items-center">
                            <button
                              onClick={() => openReschedule(appt)}
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-semibold"
                              style={{
                                background: "transparent",
                                border: `1px solid ${GOLD}`,
                                color: "#111",
                              }}
                            >
                              📅 Reschedule
                            </button>

                            <button
                              onClick={() => cancelAppointment(appt)}
                              disabled={actionLoading}
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-semibold"
                              style={{
                                background: "#ffeded",
                                border: "1px solid rgba(255,0,0,0.12)",
                                color: "#b91c1c",
                              }}
                            >
                              🗑 Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {showModal && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6" style={{ border: `2px solid ${GOLD}` }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2" style={{ color: "#111" }}>
              Reschedule appointment
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {selectedAppt.name} — current: <strong>{formatDate(selectedAppt.date)}</strong> @ <strong>{selectedAppt.time}</strong>
            </p>

            <form onSubmit={submitReschedule} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">New date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">New time</label>
                <select required value={newTime} onChange={(e) => setNewTime(e.target.value)} className="mt-1 block w-full border rounded-md p-2">
                  <option value="">-- pick a 30-min slot --</option>
                  {slots.map((s) => (
                    <option key={s} value={s}>
                      {formatLabel(s)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1 rounded-md text-sm">
                  Cancel
                </button>

                <button type="submit" disabled={actionLoading} className="px-4 py-2 rounded-md font-bold" style={{ background: GOLD, color: "#000" }}>
                  {actionLoading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
