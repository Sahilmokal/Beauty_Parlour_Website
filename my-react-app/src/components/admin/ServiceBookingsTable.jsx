// src/components/admin/ServiceBookingsTable.jsx
import React from "react";

export default function ServiceBookingsTable({
  data,
  onEdit,
  onDelete,
  loading,
}) {
  if (loading) {
    return (
      <div className="text-gray-500 text-sm">
        Loading service bookings...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-black text-white">
            <th className="px-4 py-3 text-left text-sm font-medium">
              Service
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Customer
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Time
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((b) => (
            <tr
              key={b._id}
              className="border-b hover:bg-gray-50 transition"
            >
              {/* SERVICE */}
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {b.serviceName}
              </td>

              {/* CUSTOMER */}
              <td className="px-4 py-3 text-sm">
                <div className="font-medium text-gray-800">
                  {b.name || "Unknown"}
                </div>
                <div className="text-xs text-gray-500">
                  {b.email}
                </div>
              </td>

              {/* DATE */}
              <td className="px-4 py-3 text-sm text-gray-700">
                {new Date(b.date).toISOString().slice(0, 10)}
              </td>

              {/* TIME */}
              <td className="px-4 py-3 text-sm text-gray-700">
                {b.time}
              </td>

              {/* ACTIONS */}
              <td className="px-4 py-3 text-sm text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(b)}
                    className="px-3 py-1.5 text-sm border border-indigo-300 text-indigo-700 rounded hover:bg-indigo-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(b._id)}
                    className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td
                colSpan="5"
                className="text-center py-8 text-gray-500"
              >
                No service bookings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
