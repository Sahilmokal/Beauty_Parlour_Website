import React from "react";

export default function AppointmentsTable({ data, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {/* HEADER ROW */}
      <div className="grid grid-cols-5 gap-4 px-4 text-sm font-semibold text-slate-600">
        <div>Name</div>
        <div>Date</div>
        <div>Time</div>
        <div>Phone</div>
        <div className="text-right">Actions</div>
      </div>

      {/* DATA ROWS */}
      {data.map((a) => (
        <div
          key={a._id}
          className="grid grid-cols-5 gap-4 items-center bg-white rounded-xl border px-4 py-4 shadow-sm hover:shadow-md transition"
        >
          <div className="font-medium text-slate-800">{a.name}</div>

          <div className="text-slate-700">
            {a.date.slice(0, 10)}
          </div>

          <div className="text-slate-700">{a.time}</div>

          <div className="text-slate-700">{a.phone}</div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => onEdit(a)}
              className="px-4 py-1.5 rounded-md text-sm bg-yellow-400 text-black hover:bg-yellow-500 transition"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(a._id)}
              className="px-4 py-1.5 rounded-md text-sm bg-red-500 text-white hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="text-center py-10 text-slate-500 bg-white rounded-xl border">
          No appointments found
        </div>
      )}
    </div>
  );
}
