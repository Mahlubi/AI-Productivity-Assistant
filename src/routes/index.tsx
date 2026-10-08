import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, Clock, MapPin, Sparkles as _s, Star, Wand2, Scissors, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.jpg";
import { BARBERS, REVIEWS, SERVICES, SHOP } from "@/lib/data";
import { BarberCard, ServiceCard } from "@/components/site/cards";

void _s;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreshCut AI Barbershop — Your Style. Your Barber. Your Time." },
      { name: "description", content: "Book premium fades, cuts and shaves in Cape Town. Get AI hairstyle recommendations and instant answers." },
      { property: "og:title", content: "FreshCut AI Barbershop" },
      { property: "og:description", content: "Premium Cape Town barbershop with online booking and an AI style assistant." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="Barber giving a fade at FreshCut" width={1920} height={1088} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-hero-fade" />
        <div className="mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-end px-4 pb-20 pt-32 sm:px-6">
          <p className="eyebrow animate-rise">Cape Town · Est. 2019</p>
          <h1 className="mt-4 max-w-4xl text-6xl font-extrabold sm:text-8xl animate-rise [animation-delay:100ms]">
            Your Style.<br />Your Barber.<br /><span className="text-gold">Your Time.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground animate-rise [animation-delay:200ms]">
            Book your next cut and let our AI assistant help you find the perfect style.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-rise [animation-delay:300ms]">
            <Button size="lg" asChild className="shadow-gold"><Link to="/book"><CalendarCheck />Book an Appointment</Link></Button>
            <Button size="lg" variant="outline" asChild><Link to="/style-finder"><Wand2 />Find My Style</Link></Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="eyebrow">Services</p><h2 className="mt-3 text-5xl font-bold">The menu</h2></div>
          <Link to="/services" className="text-sm text-primary hover:underline">All services & prices →</Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 6).map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <p className="eyebrow">The team</p><h2 className="mt-3 text-5xl font-bold">Meet our barbers</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BARBERS.map((b) => <BarberCard key={b.id} barber={b} />)}
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow">AI Style Finder</p>
            <h2 className="mt-3 text-5xl font-bold sm:text-6xl">Not sure what to ask for?</h2>
            <p className="mt-5 max-w-lg text-muted-foreground">Answer six quick questions about your face shape, hair and lifestyle. Our AI suggests a cut, the right service and how to style it — then book it in one tap.</p>
            <Button size="lg" className="mt-8" asChild><Link to="/style-finder"><Wand2 />Find My Style</Link></Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { n: "01", t: "Tell us your style", i: Scissors },
              { n: "02", t: "AI recommends your look", i: Wand2 },
              { n: "03", t: "Choose your barber", i: UserCheck },
              { n: "04", t: "Book your appointment", i: CalendarCheck },
            ].map(({ n, t, i: Icon }) => (
              <div key={n} className="rounded-2xl border border-border bg-background p-6">
                <div className="flex items-center justify-between"><span className="font-display text-4xl font-bold text-primary">{n}</span><Icon className="h-5 w-5 text-muted-foreground" /></div>
                <p className="mt-6 font-semibold">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <p className="eyebrow">Reviews</p><h2 className="mt-3 text-5xl font-bold">Word on the street</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex gap-0.5 text-primary">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <blockquote className="mt-4 text-sm leading-relaxed">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-xs text-muted-foreground">— {r.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-24 sm:px-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-8">
          <Clock className="h-6 w-6 text-primary" />
          <h3 className="mt-4 text-3xl font-bold">Opening hours</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {SHOP.hours.map((h) => <li key={h.day} className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted-foreground">{h.day}</span><span className="font-semibold">{h.close ? `${h.open} – ${h.close}` : h.open}</span></li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8">
          <MapPin className="h-6 w-6 text-primary" />
          <h3 className="mt-4 text-3xl font-bold">Find us</h3>
          <p className="mt-4 text-sm text-muted-foreground">{SHOP.address}</p>
          <p className="mt-2 text-sm">{SHOP.phone} · {SHOP.email}</p>
          <Button variant="outline" className="mt-6" asChild><Link to="/contact">Directions & contact</Link></Button>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-3xl bg-gold px-8 py-16 text-center text-primary-foreground">
          <h2 className="text-5xl font-extrabold sm:text-7xl">Ready for a fresh cut?</h2>
          <Button size="lg" variant="secondary" className="mt-8" asChild><Link to="/book">Book Now</Link></Button>
        </div>
      </section>
    </>
  );
}
