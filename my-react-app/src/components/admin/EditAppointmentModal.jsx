import React, { useEffect, useState } from "react";

export default function EditAppointmentModal({
  open,
  onClose,
  appointment,
  onSave,
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [saving, setSaving] = useState(false);

  /* ================== SLOT GENERATOR ================== */
  const generateSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 20; hour++) {
      slots.push(`${String(hour).padStart(2, "0")}:00`);
      slots.push(`${String(hour).padStart(2, "0")}:30`);
    }
    return slots; // last slot = 20:30
  };

  const slots = generateSlots();

  /* ================== PREFILL ================== */
  useEffect(() => {
    if (appointment) {
      const d = new Date(appointment.date);
      setDate(d.toISOString().slice(0, 10));
      setTime(appointment.time || "");
    }
  }, [appointment]);

  if (!open) return null;

  /* ================== SAVE ================== */
  const handleSave = async () => {
    if (!date || !time) {
      alert("Date and time are required");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        date,
        time,
      });
    } catch (err) {
      alert(err.message || "Failed to update appointment");
    } finally {
      setSaving(false);
    }
  };

  /* ================== UI ================== */
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Appointment</h2>

        <div className="space-y-4">
          {/* DATE */}
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* TIME SLOT */}
          <div>
            <label className="block text-sm mb-1">
              Time <span className="text-xs text-gray-500">(30-minute slots)</span>
            </label>

            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white"
            >
              <option value="">Select time</option>
              {slots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
