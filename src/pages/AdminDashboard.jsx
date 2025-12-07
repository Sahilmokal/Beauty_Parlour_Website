// src/pages/AdminDashboardStatic.jsx
import React from "react";

/**
 * Static Admin Dashboard (black / gold / white theme)
 * - purely static (no network calls)
 * - copy-paste ready
 */

const GOLD = "#d4af37";

const sampleAppointments = [
  {
    _id: "a1",
    name: "Riya Sharma",
    date: "2025-12-10",
    time: "10:30",
    phone: "+91 98765 43210",
    requests: "Keratin treatment",
  },
  {
    _id: "a2",
    name: "Mohit Patel",
    date: "2025-12-12",
    time: "14:00",
    phone: "+91 91234 56789",
    requests: "",
  },
];

const sampleServiceBookings = [
  {
    _id: "s1",
    name: "Neha Kapoor",
    serviceName: "Bridal Makeup",
    date: "2025-12-20",
    time: "09:30",
    email: "neha@example.com",
  },
  {
    _id: "s2",
    name: "Aman Verma",
    serviceName: "Hair Spa",
    date: "2025-12-18",
    time: "16:00",
    email: "aman@example.com",
  },
];

function StatCard({ label, value }) {
  return (
    <div className="p-4 rounded-lg shadow-md" style={{ background: "#0b0b0b", color: "#fff" }}>
      <div className="text-xs uppercase text-gray-300">{label}</div>
      <div className="mt-2 text-2xl font-bold" style={{ color: GOLD }}>{value}</div>
    </div>
  );
}

export default function AdminDashboardStatic() {
  return (
    <div className="min-h-screen" style={{ background: "#070707", color: "#fff" }}>
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              <span style={{ color: GOLD }}>Admin</span> Dashboard
            </h1>
            <p className="text-sm text-gray-300">Static preview — for admin only</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="px-3 py-2 rounded-md text-sm font-medium"
              style={{ border: `1px solid ${GOLD}`, color: GOLD, background: "transparent" }}
            >
              Refresh
            </button>
            <button
              className="px-3 py-2 rounded-md text-sm font-semibold"
              style={{ background: "#fff", color: "#000" }}
              onClick={() => alert("Sign out (static)") }
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Appointments" value={sampleAppointments.length} />
          <StatCard label="Service Bookings" value={sampleServiceBookings.length} />
          <StatCard label="Active Users" value={42} />
        </div>

        {/* Appointments */}
        <section className="mb-8 bg-white text-black rounded-xl p-4 shadow">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Customer Appointments</h2>
            <div className="text-sm text-gray-600">{sampleAppointments.length} records</div>
          </div>

          {/* search / filters (static UI) */}
          <div className="flex gap-2 items-center mb-4">
            <input
              className="px-3 py-2 border rounded-md text-sm w-64"
              placeholder="Search name / phone..."
              disabled
            />
            <select className="px-3 py-2 border rounded-md text-sm" disabled>
              <option>All dates</option>
            </select>
            <div className="text-xs text-gray-500 ml-auto">Actions disabled in static view</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-3 py-2 text-left text-sm">Name</th>
                  <th className="px-3 py-2 text-left text-sm">Date</th>
                  <th className="px-3 py-2 text-left text-sm">Time</th>
                  <th className="px-3 py-2 text-left text-sm">Phone</th>
                  <th className="px-3 py-2 text-left text-sm">Requests</th>
                  <th className="px-3 py-2 text-right text-sm">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sampleAppointments.map((a) => (
                  <tr key={a._id} className="border-b last:border-b-0">
                    <td className="px-3 py-3 text-sm">{a.name}</td>
                    <td className="px-3 py-3 text-sm">{a.date}</td>
                    <td className="px-3 py-3 text-sm">{a.time}</td>
                    <td className="px-3 py-3 text-sm">{a.phone}</td>
                    <td className="px-3 py-3 text-sm">{a.requests || "-"}</td>
                    <td className="px-3 py-3 text-sm text-right">
                      <div className="inline-flex gap-2">
                        <button
                          className="px-2 py-1 rounded-md text-sm"
                          style={{ border: `1px solid ${GOLD}`, color: "#111", background: "transparent" }}
                          disabled
                        >
                          Reschedule
                        </button>
                        <button
                          className="px-2 py-1 rounded-md text-sm"
                          style={{ background: "#fee", color: "#b91c1c" }}
                          disabled
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Service bookings */}
        <section className="mb-8 bg-white text-black rounded-xl p-4 shadow">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Service Bookings</h2>
            <div className="text-sm text-gray-600">{sampleServiceBookings.length} records</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-3 py-2 text-left text-sm">Customer</th>
                  <th className="px-3 py-2 text-left text-sm">Service</th>
                  <th className="px-3 py-2 text-left text-sm">Date</th>
                  <th className="px-3 py-2 text-left text-sm">Time</th>
                  <th className="px-3 py-2 text-left text-sm">Email</th>
                  <th className="px-3 py-2 text-right text-sm">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sampleServiceBookings.map((b) => (
                  <tr key={b._id} className="border-b last:border-b-0">
                    <td className="px-3 py-3 text-sm">{b.name}</td>
                    <td className="px-3 py-3 text-sm">{b.serviceName}</td>
                    <td className="px-3 py-3 text-sm">{b.date}</td>
                    <td className="px-3 py-3 text-sm">{b.time}</td>
                    <td className="px-3 py-3 text-sm">{b.email}</td>
                    <td className="px-3 py-3 text-sm text-right">
                      <div className="inline-flex gap-2">
                        <button
                          className="px-2 py-1 rounded-md text-sm"
                          style={{ border: `1px solid ${GOLD}`, color: "#111", background: "transparent" }}
                          disabled
                        >
                          Reschedule
                        </button>
                        <button
                          className="px-2 py-1 rounded-md text-sm"
                          style={{ background: "#fee", color: "#b91c1c" }}
                          disabled
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer note */}
        <div className="text-xs text-gray-400 mt-4">
          This is a static preview. Wire the buttons and API endpoints when ready.
        </div>
      </div>
    </div>
  );
}
