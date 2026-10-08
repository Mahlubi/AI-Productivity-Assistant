// Demo data layer: appointments live in this browser's localStorage.
// Swap these functions for API calls to connect a real backend later.
import { useSyncExternalStore } from "react";
import { addDays, localDate, type Appointment } from "./booking";

const KEY = "freshcut.appointments.v1";
const MY_KEY = "freshcut.mybookings.v1";

function seed(): Appointment[] {
  const today = localDate(new Date());
  const t1 = addDays(today, 1);
  const y = addDays(today, -1);
  const rows: [string, string, string, string, string, string, Appointment["status"]][] = [
    ["Sipho Dlamini", "skin-fade", "thabo", today, "09:00", "082 555 0101", "confirmed"],
    ["Daniel Kruger", "low-taper", "mike", today, "09:30", "083 555 0102", "confirmed"],
    ["Aaron Pillay", "premium", "ravi", today, "10:00", "084 555 0103", "confirmed"],
    ["Luthando Ndlovu", "classic", "jayden", today, "11:00", "072 555 0104", "pending"],
    ["James Smith", "cut-beard", "thabo", today, "13:00", "071 555 0105", "pending"],
    ["Kyle Jacobs", "beard", "ravi", today, "14:30", "076 555 0106", "confirmed"],
    ["Bongani Zulu", "skin-fade", "jayden", t1, "09:15", "079 555 0107", "confirmed"],
    ["Ethan Botha", "kids", "mike", t1, "10:30", "082 555 0108", "pending"],
    ["Sipho Dlamini", "beard", "thabo", y, "15:00", "082 555 0101", "completed"],
    ["Daniel Kruger", "classic", "mike", y, "11:00", "083 555 0102", "completed"],
    ["Ruan Venter", "low-taper", "thabo", addDays(today, 2), "12:00", "061 555 0109", "confirmed"],
  ];
  return rows.map(([name, serviceId, barberId, date, time, phone, status], i) => ({
    id: `FC-D${String(i + 1).padStart(3, "0")}`,
    name, serviceId, barberId, date, time, phone, status,
    email: name.split(" ")[0].toLowerCase() + "@example.com",
    createdAt: new Date().toISOString(),
  }));
}

let cache: Appointment[] | null = null;
const listeners = new Set<() => void>();
const EMPTY: Appointment[] = [];

function read(): Appointment[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? JSON.parse(raw) : seed();
  } catch {
    cache = seed();
  }
  localStorage.setItem(KEY, JSON.stringify(cache));
  return cache!;
}
function write(next: Appointment[]) {
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

export function useAppointments() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    read,
    () => EMPTY,
  );
}
export const getAppointments = read;
export function addAppointment(a: Appointment) {
  write([...read(), a]);
  const mine = getMyRefs();
  localStorage.setItem(MY_KEY, JSON.stringify([...mine, a.id]));
}
export function updateAppointment(id: string, patch: Partial<Appointment>) {
  write(read().map((a) => (a.id === id ? { ...a, ...patch } : a)));
}
export function resetDemo() {
  localStorage.removeItem(MY_KEY);
  write(seed());
}
export function getMyRefs(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(MY_KEY) || "[]"); } catch { return []; }
}
