import { describe, expect, it } from "vitest";
import { availableSlots, hasConflict, hoursFor, type Appointment } from "./booking";

const base: Appointment = {
  id: "A1", serviceId: "skin-fade", barberId: "thabo", date: "2030-03-04", time: "10:00",
  name: "x", phone: "1", email: "x@x.co", status: "confirmed", createdAt: "",
};
const now = new Date("2030-03-01T08:00:00");

describe("booking rules", () => {
  it("is closed on Sundays", () => {
    expect(hoursFor("2030-03-03")).toBeNull();
  });
  it("blocks overlapping slots for the same barber", () => {
    const slots = availableSlots([base], "thabo", "2030-03-04", "classic", { now });
    expect(slots).not.toContain("10:00");
    expect(slots).not.toContain("10:30");
    expect(slots).toContain("10:45");
    expect(slots).toContain("09:30");
  });
  it("does not block another barber", () => {
    expect(availableSlots([base], "mike", "2030-03-04", "classic", { now })).toContain("10:00");
  });
  it("detects conflicts and ignores cancelled bookings", () => {
    const c = { ...base, id: "A2", time: "10:15" };
    expect(hasConflict([base], c)).toBe(true);
    expect(hasConflict([{ ...base, status: "cancelled" }], c)).toBe(false);
  });
  it("services must finish before closing (18:00 weekdays)", () => {
    const slots = availableSlots([], "thabo", "2030-03-04", "premium", { now });
    expect(slots.at(-1)).toBe("16:30");
  });
});
