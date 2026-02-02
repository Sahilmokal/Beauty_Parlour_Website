export function generateTimeSlots(
  start = "10:00",
  end = "21:00",
  intervalMinutes = 30
) {
  const slots = [];
  let [h, m] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  while (h < endH || (h === endH && m <= endM - intervalMinutes)) {
    slots.push(
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    );
    m += intervalMinutes;
    if (m >= 60) {
      h += 1;
      m = 0;
    }
  }
  return slots;
}
