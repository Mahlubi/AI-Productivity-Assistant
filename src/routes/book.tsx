import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarCheck, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BARBERS, SERVICES, formatRand, getBarber, getService } from "@/lib/data";
import { addDays, availableSlots, hasConflict, hoursFor, localDate, makeRef, type Appointment } from "@/lib/booking";
import { addAppointment, updateAppointment, useAppointments } from "@/lib/store";
import { PageHeader } from "@/components/site/cards";

type Search = { service?: string; barber?: string; reschedule?: string };

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    service: typeof s.service === "string" ? s.service : undefined,
    barber: typeof s.barber === "string" ? s.barber : undefined,
    reschedule: typeof s.reschedule === "string" ? s.reschedule : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book an Appointment — FreshCut AI Barbershop" },
      { name: "description", content: "Pick a service, barber and time. Book your cut in under a minute." },
      { property: "og:title", content: "Book at FreshCut" },
      { property: "og:description", content: "Pick a service, barber and time — done in under a minute." },
    ],
  }),
  component: Book,
});

function Book() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const appts = useAppointments();
  const existing = search.reschedule ? appts.find((a) => a.id === search.reschedule) : undefined;

  const [serviceId, setServiceId] = useState(search.service && getService(search.service) ? search.service : "");
  const [barberId, setBarberId] = useState(search.barber && getBarber(search.barber) ? search.barber : "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [details, setDetails] = useState({ name: "", phone: "", email: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState<Appointment | null>(null);

  useEffect(() => { setDate(localDate(new Date())); }, []);
  useEffect(() => {
    if (existing) {
      setServiceId(existing.serviceId); setBarberId(existing.barberId); setDate(existing.date);
      setDetails({ name: existing.name, phone: existing.phone, email: existing.email, notes: existing.notes ?? "" });
    }
  }, [existing?.id]);

  const days = useMemo(() => {
    if (!date) return [];
    const today = localDate(new Date());
    return Array.from({ length: 14 }, (_, i) => addDays(today, i));
  }, [date]);

  const slots = useMemo(
    () => (serviceId && barberId && date ? availableSlots(appts, barberId, date, serviceId, { ignoreId: existing?.id }) : []),
    [appts, serviceId, barberId, date, existing?.id],
  );

  // brief "checking" state when the slot query changes
  useEffect(() => {
    if (!serviceId || !barberId) return;
    setChecking(true); setTime("");
    const t = setTimeout(() => setChecking(false), 350);
    return () => clearTimeout(t);
  }, [serviceId, barberId, date]);

  const service = getService(serviceId);
  const barber = getBarber(barberId);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!serviceId) er.service = "Choose a service";
    if (!barberId) er.barber = "Choose a barber";
    if (!time) er.time = "Choose a time";
    if (details.name.trim().length < 2) er.name = "Enter your name";
    if (!/^(\+27|0)[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{4}$/.test(details.phone.trim())) er.phone = "Enter a valid SA number, e.g. 082 555 0101";
    if (!/^\S+@\S+\.\S+$/.test(details.email.trim())) er.email = "Enter a valid email";
    setErrors(er);
    if (Object.keys(er).length) { toast.error("Please complete the highlighted fields."); return; }

    const candidate = {
      id: existing?.id ?? makeRef(), serviceId, barberId, date, time,
      name: details.name.trim(), phone: details.phone.trim(), email: details.email.trim(), notes: details.notes.trim() || undefined,
    };
    if (hasConflict(appts, candidate)) { toast.error("That slot was just taken. Please pick another time."); setTime(""); return; }

    if (existing) {
      updateAppointment(existing.id, { ...candidate, status: "pending" });
      setDone({ ...existing, ...candidate, status: "pending" });
      toast.success("Appointment rescheduled");
    } else {
      const a: Appointment = { ...candidate, status: "pending", createdAt: new Date().toISOString() };
      addAppointment(a);
      setDone(a);
      toast.success("Booking confirmed!");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    const s = getService(done.serviceId)!; const b = getBarber(done.barberId)!;
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-primary/40 bg-card p-8 text-center shadow-gold animate-rise">
          <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
          <h1 className="mt-4 text-5xl font-bold">You're booked</h1>
          <p className="mt-2 text-muted-foreground">Booking reference</p>
          <p className="font-display text-4xl font-bold text-primary">{done.id}</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 text-left text-sm">
            {[
              ["Service", s.name], ["Barber", b.name],
              ["Date", new Date(done.date + "T12:00:00").toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" })],
              ["Time", done.time], ["Price", formatRand(s.price)], ["Duration", `${s.duration} min`],
              ["Name", done.name], ["Phone", done.phone],
            ].map(([k, v]) => (
              <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild><Link to="/my-bookings">Manage booking</Link></Button>
            <Button variant="outline" onClick={() => navigate({ to: "/book", search: { reschedule: done.id } }).then(() => setDone(null))}>Reschedule</Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Free cancellation up to 2 hours before. Cancel anytime from My Bookings.</p>
        </div>
      </div>
    );
  }

  const closed = date && !hoursFor(date);

  return (
    <>
      <PageHeader eyebrow={existing ? `Reschedule ${existing.id}` : "Booking"} title={existing ? "Pick a new time" : "Book your cut"} />
      <form onSubmit={submit} className="mx-auto grid max-w-7xl gap-8 px-4 pb-24 sm:px-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          <Step n={1} title="Service" error={errors.service}>
            <div className="grid gap-3 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <button type="button" key={s.id} onClick={() => setServiceId(s.id)}
                  className={`rounded-xl border p-4 text-left transition-colors ${serviceId === s.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"}`}>
                  <div className="flex justify-between gap-2"><span className="font-semibold">{s.name}</span><span className="font-bold text-primary">{formatRand(s.price)}</span></div>
                  <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{s.duration} min</span>
                </button>
              ))}
            </div>
          </Step>

          <Step n={2} title="Barber" error={errors.barber}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {BARBERS.map((b) => (
                <button type="button" key={b.id} onClick={() => setBarberId(b.id)}
                  className={`overflow-hidden rounded-xl border text-left transition-colors ${barberId === b.id ? "border-primary ring-2 ring-primary/40" : "border-border hover:border-primary/50"}`}>
                  <img src={b.photo} alt={b.name} loading="lazy" width={768} height={960} className="aspect-square w-full object-cover object-top" />
                  <div className="p-3"><p className="text-sm font-semibold">{b.name.split(" ")[0]}</p><p className="text-xs text-muted-foreground">{b.specialty}</p></div>
                </button>
              ))}
            </div>
          </Step>

          <Step n={3} title="Date & time" error={errors.time}>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {days.map((d) => {
                const dt = new Date(d + "T12:00:00"); const isClosed = !hoursFor(d);
                return (
                  <button type="button" key={d} onClick={() => setDate(d)}
                    className={`min-w-16 shrink-0 rounded-xl border px-3 py-2 text-center ${date === d ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"} ${isClosed ? "opacity-40" : ""}`}>
                    <span className="block text-[11px] uppercase">{dt.toLocaleDateString("en-ZA", { weekday: "short" })}</span>
                    <span className="block font-display text-2xl font-bold">{dt.getDate()}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4">
              {!serviceId || !barberId ? (
                <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Choose a service and barber to see open times.</p>
              ) : checking ? (
                <p className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Checking available appointments…</p>
              ) : closed ? (
                <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">We're closed on Sundays. Pick another day.</p>
              ) : slots.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No open times left for {barber?.name.split(" ")[0]} on this day. Try another day or barber.</p>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                  {slots.map((s) => (
                    <button type="button" key={s} onClick={() => setTime(s)}
                      className={`rounded-lg border py-2 text-sm font-medium ${time === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50"}`}>{s}</button>
                  ))}
                </div>
              )}
            </div>
          </Step>

          <Step n={4} title="Your details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Full name" error={errors.name}><Input id="name" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} /></Field>
              <Field id="phone" label="Phone" error={errors.phone}><Input id="phone" inputMode="tel" placeholder="082 555 0101" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} /></Field>
              <Field id="email" label="Email" error={errors.email}><Input id="email" type="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} /></Field>
              <Field id="notes" label="Notes (optional)"><Textarea id="notes" rows={1} maxLength={300} value={details.notes} onChange={(e) => setDetails({ ...details, notes: e.target.value })} /></Field>
            </div>
          </Step>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-2xl font-bold">Summary</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <Row k="Service" v={service?.name} /><Row k="Barber" v={barber?.name} />
              <Row k="Date" v={date ? new Date(date + "T12:00:00").toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" }) : undefined} />
              <Row k="Time" v={time} /><Row k="Duration" v={service ? `${service.duration} min` : undefined} />
            </dl>
            <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-4xl font-bold text-primary">{service ? formatRand(service.price) : "—"}</span>
            </div>
            <Button type="submit" size="lg" className="mt-5 w-full"><CalendarCheck />{existing ? "Confirm new time" : "Confirm booking"}</Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Pay in-store. Free cancellation up to 2h before.</p>
          </div>
        </aside>
      </form>
    </>
  );
}

function Step({ n, title, error, children }: { n: number; title: string; error?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gold font-bold text-primary-foreground">{n}</span>
        <h2 className="text-3xl font-bold">{title}</h2>
        {error && <span className="text-sm text-destructive">{error}</span>}
      </div>
      {children}
    </section>
  );
}
function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label htmlFor={id}>{label}</Label>{children}{error && <p className="text-xs text-destructive">{error}</p>}</div>;
}
function Row({ k, v }: { k: string; v?: string }) {
  return <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v || "—"}</dd></div>;
}
