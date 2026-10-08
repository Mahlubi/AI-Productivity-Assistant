import { createFileRoute } from "@tanstack/react-router";
import { BARBERS } from "@/lib/data";
import { BarberCard, PageHeader } from "@/components/site/cards";

export const Route = createFileRoute("/barbers")({
  head: () => ({
    meta: [
      { title: "Our Barbers — FreshCut AI Barbershop" },
      { name: "description", content: "Meet Thabo, Mike, Ravi and Jayden — fade, scissor, beard and curly-hair specialists." },
      { property: "og:title", content: "Meet the FreshCut Barbers" },
      { property: "og:description", content: "Fade, scissor, beard and curly-hair specialists in Cape Town." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="The team" title="Meet our barbers" sub="Four specialists, one standard: walk out looking sharper than you walked in." />
      <div className="mx-auto grid max-w-7xl gap-5 px-4 pb-24 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {BARBERS.map((b) => (
          <div key={b.id}>
            <BarberCard barber={b} />
            <p className="mt-3 px-1 text-sm text-muted-foreground">{b.bio}</p>
          </div>
        ))}
      </div>
    </>
  ),
});
