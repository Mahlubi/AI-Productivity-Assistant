import { Link } from "@tanstack/react-router";
import { Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRand, getBarber, getService, type Barber, type Service } from "@/lib/data";
import type { Appointment } from "@/lib/booking";
import type { ReactNode } from "react";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="card-lift flex flex-col rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-bold">{service.name}</h3>
        <span className="font-display text-2xl font-bold text-primary">{formatRand(service.price)}</span>
      </div>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{service.description}</p>
      <div className="mt-5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />{service.duration} min</span>
        <Button size="sm" variant="outline" asChild>
          <Link to="/book" search={{ service: service.id }}>Book</Link>
        </Button>
      </div>
    </div>
  );
}

export function BarberCard({ barber }: { barber: Barber }) {
  return (
    <div className="card-lift group overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={barber.photo} alt={barber.name} loading="lazy" width={768} height={960} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="absolute bottom-0 p-5">
          <span className="flex items-center gap-1 text-sm text-primary"><Star className="h-4 w-4 fill-current" />{barber.rating.toFixed(1)}</span>
          <h3 className="mt-1 text-3xl font-bold">{barber.name}</h3>
          <p className="text-sm text-muted-foreground">{barber.specialty} · {barber.experience} yrs</p>
        </div>
      </div>
      <div className="p-5 pt-3">
        <Button className="w-full" variant="outline" asChild>
          <Link to="/book" search={{ barber: barber.id }}>Book with {barber.name.split(" ")[0]}</Link>
        </Button>
      </div>
    </div>
  );
}

const statusStyle: Record<Appointment["status"], string> = {
  confirmed: "bg-success/15 text-success border-success/30",
  pending: "bg-primary/15 text-primary border-primary/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  completed: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: Appointment["status"] }) {
  return <Badge variant="outline" className={`capitalize ${statusStyle[status]}`}>{status}</Badge>;
}

export function AppointmentCard({ appt, actions }: { appt: Appointment; actions?: ReactNode }) {
  const s = getService(appt.serviceId);
  const b = getBarber(appt.barberId);
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground">Ref {appt.id}</p>
          <h3 className="text-2xl font-bold">{s?.name}</h3>
          <p className="text-sm text-muted-foreground">with {b?.name}</p>
        </div>
        <StatusBadge status={appt.status} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div><p className="text-xs text-muted-foreground">Date</p><p className="font-semibold">{new Date(appt.date + "T12:00:00").toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" })}</p></div>
        <div><p className="text-xs text-muted-foreground">Time</p><p className="font-semibold">{appt.time}</p></div>
        <div><p className="text-xs text-muted-foreground">Price</p><p className="font-semibold text-primary">{s && formatRand(s.price)}</p></div>
      </div>
      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, icon }: { label: string; value: string; hint?: string; icon: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between text-muted-foreground"><span className="text-xs uppercase tracking-wider">{label}</span>{icon}</div>
      <p className="mt-2 font-display text-4xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function AIBadge() {
  return <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">AI-generated</Badge>;
}

export function PageHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 text-5xl font-bold sm:text-6xl">{title}</h1>
      {sub && <p className="mt-4 max-w-2xl text-muted-foreground">{sub}</p>}
    </div>
  );
}
