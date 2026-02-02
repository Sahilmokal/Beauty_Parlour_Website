import React, { useEffect, useState } from "react";
import { generateTimeSlots } from "../../utils/timeSlots";

export default function EditServiceBookingModal({
  open,
  booking,
  onClose,
  onSave,
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Booked");
  const [saving, setSaving] = useState(false);

  const slots = generateTimeSlots(); // 10:00 → 21:00 (30 min)

  useEffect(() => {
    if (booking) {
      const d = new Date(booking.date);
      setDate(d.toISOString().slice(0, 10));
      setTime(booking.time);
      setStatus(booking.status || "Booked");
    }
  }, [booking]);

  if (!open) return null;

  const handleSave = async () => {
    if (!date || !time) {
      alert("Date & time required");
      return;
    }

    setSaving(true);
    try {
      await onSave({ date, time, status });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Edit Service Booking</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm">
              Time <span className="text-xs">(30-min slots)</span>
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select time</option>
              {slots.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* <div>
            <label className="text-sm">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option>Booked</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div> */}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
