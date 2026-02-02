import React from "react";

const MENU = [
  { key: "dashboard", label: "Dashboard" },
  { key: "appointments", label: "Appointments" },
  { key: "services", label: "Service Bookings" },
  { key: "courses", label: "Course Bookings" },
];

export default function Sidebar({ active, onChange, onLogout }) {
  return (
    <aside className="w-64 min-h-screen bg-black text-white px-4 py-6">
      <h2 className="text-xl font-bold mb-8 text-yellow-400">
        Admin Panel
      </h2>

      <nav className="space-y-2">
        {MENU.map((item) => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`w-full text-left px-4 py-2 rounded ${
              active === item.key
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="mt-10 w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
      >
        Logout
      </button>
    </aside>
  );
}
