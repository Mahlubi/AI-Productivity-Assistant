import { createFileRoute } from "@tanstack/react-router";
import { SERVICES } from "@/lib/data";
import { PageHeader, ServiceCard } from "@/components/site/cards";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Prices — FreshCut AI Barbershop" },
      { name: "description", content: "Fades, tapers, beard trims and premium grooming in Cape Town. Prices in Rand with durations." },
      { property: "og:title", content: "Services & Prices — FreshCut" },
      { property: "og:description", content: "Fades, tapers, beard trims and premium grooming. See prices and book." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="Services" title="Cuts, fades & grooming" sub="Clear prices, honest timings. Every service includes a consultation with your barber." />
      <div className="mx-auto grid max-w-7xl gap-5 px-4 pb-24 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {SERVICES.map((s) => <ServiceCard key={s.id} service={s} />)}
      </div>
    </>
  ),
});
