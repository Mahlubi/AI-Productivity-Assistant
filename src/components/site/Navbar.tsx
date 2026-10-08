import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Scissors, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LINKS = [
  { to: "/services", label: "Services" },
  { to: "/barbers", label: "Barbers" },
  { to: "/style-finder", label: "Style Finder" },
  { to: "/my-bookings", label: "My Bookings" },
  { to: "/contact", label: "Contact" },
  { to: "/admin", label: "Staff" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-primary-foreground">
            <Scissors className="h-4 w-4" />
          </span>
          <span className="font-display text-2xl font-bold uppercase tracking-wide">
            FreshCut <span className="text-primary">AI</span>
          </span>
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-primary" }}>
              {l.label}
            </Link>
          ))}
          <Button asChild><Link to="/book">Book Now</Link></Button>
        </div>
        <button className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-border bg-background px-4 pb-6 lg:hidden">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block border-b border-border/50 py-3 font-medium">
              {l.label}
            </Link>
          ))}
          <Button asChild className="mt-4 w-full"><Link to="/book" onClick={() => setOpen(false)}>Book Now</Link></Button>
        </div>
      )}
    </header>
  );
}
