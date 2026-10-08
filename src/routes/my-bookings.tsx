import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarX, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getMyRefs, updateAppointment, useAppointments } from "@/lib/store";
import { localDate } from "@/lib/booking";
import { AppointmentCard, PageHeader } from "@/components/site/cards";

export const Route = createFileRoute("/my-bookings")({
  head: () => ({
    meta: [
      { title: "My Bookings — FreshCut AI Barbershop" },
      { name: "description", content: "View, reschedule or cancel your FreshCut appointments." },
      { property: "og:title", content: "My Bookings — FreshCut" },
      { property: "og:description", content: "Manage your FreshCut appointments." },
    ],
  }),
  component: MyBookings,
});

function MyBookings() {
  const appts = useAppointments();
  const [refs, setRefs] = useState<string[]>([]);
  const [lookup, setLookup] = useState("");
  useEffect(() => setRefs(getMyRefs()), []);

  function find(e: React.FormEvent) {
    e.preventDefault();
    const q = lookup.trim().toUpperCase();
    const a = appts.find((x) => x.id === q);
    if (!a) { toast.error("No booking found with that reference."); return; }
    if (!refs.includes(a.id)) setRefs([...refs, a.id]);
    setLookup("");
  }

  const mine = appts.filter((a) => refs.includes(a.id));
  const today = localDate(new Date());
  const upcoming = mine.filter((a) => a.date >= today && a.status !== "cancelled" && a.status !== "completed").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const past = mine.filter((a) => !upcoming.includes(a));

  return (
    <>
      <PageHeader eyebrow="Customer dashboard" title="My bookings" sub="Bookings made on this device appear here. Have a reference? Look it up below." />
      <div className="mx-auto max-w-4xl space-y-10 px-4 pb-24 sm:px-6">
        <form onSubmit={find} className="flex gap-2">
          <Input placeholder="Booking reference, e.g. FC-D001" value={lookup} onChange={(e) => setLookup(e.target.value)} />
          <Button type="submit" variant="outline"><Search />Find</Button>
        </form>

        <section>
          <h2 className="mb-4 text-3xl font-bold">Upcoming</h2>
          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center">
              <CalendarX className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-muted-foreground">No upcoming appointments.</p>
              <Button className="mt-5" asChild><Link to="/book">Book a cut</Link></Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {upcoming.map((a) => (
                <AppointmentCard key={a.id} appt={a} actions={<>
                  <Button size="sm" variant="outline" asChild><Link to="/book" search={{ reschedule: a.id }}>Reschedule</Link></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-destructive">Cancel</Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
                        <AlertDialogDescription>Your slot on {a.date} at {a.time} will be released.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep it</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { updateAppointment(a.id, { status: "cancelled" }); toast.success("Appointment cancelled"); }}>Yes, cancel</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>} />
              ))}
            </div>
          )}
        </section>

        {past.length > 0 && (
          <section>
            <h2 className="mb-4 text-3xl font-bold">History</h2>
            <div className="grid gap-4 md:grid-cols-2">{past.map((a) => <AppointmentCard key={a.id} appt={a} />)}</div>
          </section>
        )}
      </div>
    </>
  );
}
