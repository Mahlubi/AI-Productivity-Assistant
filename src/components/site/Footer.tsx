import { Link } from "@tanstack/react-router";
import { SHOP } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl font-bold uppercase">FreshCut <span className="text-primary">AI</span></p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">Premium cuts in the heart of Cape Town, with an AI assistant that handles the admin so our barbers can focus on the craft.</p>
          <p className="mt-6 text-xs text-muted-foreground">AI recommendations are general grooming suggestions. Your barber can provide personalised professional advice.</p>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Visit</p>
          <p className="text-muted-foreground">{SHOP.address}</p>
          <p className="mt-2 text-muted-foreground">{SHOP.phone}</p>
          <p className="text-muted-foreground">{SHOP.email}</p>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Explore</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/book" className="hover:text-primary">Book an appointment</Link></li>
            <li><Link to="/style-finder" className="hover:text-primary">AI Style Finder</Link></li>
            <li><Link to="/my-bookings" className="hover:text-primary">My bookings</Link></li>
            <li><Link to="/admin" className="hover:text-primary">Staff dashboard</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} {SHOP.name} · Mahlubi habe. Demo prototype.</p>
    </footer>
  );
}
