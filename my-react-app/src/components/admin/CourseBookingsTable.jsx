import React from "react";

export default function CourseBookingsTable({
  data,
  loading,
  onConfirm,
  onDelete,
}) {
  if (loading) {
    return <div className="text-gray-500">Loading course bookings...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-black text-white">
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Course</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((b) => (
            <tr key={b._id} className="border-b">
              <td className="px-3 py-3">{b.name}</td>
              <td className="px-3 py-3">{b.courseTitle}</td>
              <td className="px-3 py-3">{b.email}</td>
              <td className="px-3 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    b.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : b.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {b.status}
                </span>
              </td>
              <td className="px-3 py-3 text-right space-x-2">
                {b.status !== "confirmed" && (
                  <button
                    onClick={() => onConfirm(b._id)}
                    className="px-2 py-1 bg-green-600 text-white rounded"
                  >
                    Confirm
                  </button>
                )}
                <button
                  onClick={() => onDelete(b._id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No course bookings
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
