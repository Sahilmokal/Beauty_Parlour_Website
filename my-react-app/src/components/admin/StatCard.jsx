// src/components/admin/StatCard.jsx
import React from "react";

const GOLD = "#d4af37";

export default function StatCard({ label, value }) {
  return (
    <div
      className="p-4 rounded-lg shadow-md"
      style={{ background: "#0b0b0b", color: "#fff" }}
    >
      <div className="text-xs uppercase text-gray-400">{label}</div>
      <div
        className="mt-2 text-2xl font-bold"
        style={{ color: GOLD }}
      >
        {value}
      </div>
    </div>
  );
}
