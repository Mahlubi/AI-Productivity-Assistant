// Pure booking rules — no storage, easy to test and to move to a real backend later.
import { SERVICES } from "./data";

export type Status = "pending" | "confirmed" | "cancelled" | "completed";

export type Appointment = {
  id: string; // booking reference
  serviceId: string;
  barberId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  name: string;
  phone: string;
  email: string;
  notes?: string;
  status: Status;
  createdAt: string;
};

export const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
export const fromMin = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export const durationOf = (serviceId: string) =>
  SERVICES.find((s) => s.id === serviceId)?.duration ?? 30;

/** Opening hours for a date, or null when closed (Sunday). */
export function hoursFor(date: string): { open: number; close: number } | null {
  const day = new Date(date + "T12:00:00").getDay();
  if (day === 0) return null;
  if (day === 6) return { open: toMin("08:00"), close: toMin("16:00") };
  return { open: toMin("09:00"), close: toMin("18:00") };
}

export function overlaps(aStart: number, aDur: number, bStart: number, bDur: number) {
  return aStart < bStart + bDur && bStart < aStart + aDur;
}

/** Start times (every 15 min) where the service fits inside hours and doesn't clash with that barber's bookings. */
export function availableSlots(
  appointments: Appointment[],
  barberId: string,
  date: string,
  serviceId: string,
  opts: { now?: Date; ignoreId?: string } = {},
): string[] {
  const hours = hoursFor(date);
  if (!hours) return [];
  const dur = durationOf(serviceId);
  const taken = appointments.filter(
    (a) => a.barberId === barberId && a.date === date && a.status !== "cancelled" && a.id !== opts.ignoreId,
  );
  const now = opts.now ?? new Date();
  const todayStr = localDate(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const slots: string[] = [];
  for (let t = hours.open; t + dur <= hours.close; t += 15) {
    if (date === todayStr && t <= nowMin) continue;
    if (date < todayStr) continue;
    if (taken.some((a) => overlaps(t, dur, toMin(a.time), durationOf(a.serviceId)))) continue;
    slots.push(fromMin(t));
  }
  return slots;
}

export function hasConflict(appointments: Appointment[], candidate: Omit<Appointment, "status" | "createdAt">) {
  return appointments.some(
    (a) =>
      a.id !== candidate.id &&
      a.status !== "cancelled" &&
      a.barberId === candidate.barberId &&
      a.date === candidate.date &&
      overlaps(toMin(a.time), durationOf(a.serviceId), toMin(candidate.time), durationOf(candidate.serviceId)),
  );
}

export function localDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function addDays(date: string, n: number) {
  const d = new Date(date + "T12:00:00");
  d.setDate(d.getDate() + n);
  return localDate(d);
}
export function makeRef() {
  return "FC-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}
