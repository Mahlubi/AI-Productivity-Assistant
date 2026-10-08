import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { SHOP } from "@/lib/data";
import { PageHeader } from "@/components/site/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Location — FreshCut AI Barbershop" },
      { name: "description", content: "Find FreshCut on Bree Street, Cape Town. Opening hours, phone and email." },
      { property: "og:title", content: "Contact FreshCut Barbershop" },
      { property: "og:description", content: "Bree Street, Cape Town. Hours, phone and directions." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || form.message.trim().length < 5) {
      toast.error("Please fill in your name, a valid email and a message.");
      return;
    }
    toast.success("Thanks! We'll get back to you within one business day. (Demo — message not sent.)");
    setForm({ name: "", email: "", message: "" });
  };
  return (
    <>
      <PageHeader eyebrow="Contact" title="Come through" />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe title="Map" className="h-72 w-full grayscale invert-[0.9]" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=18.414%2C-33.925%2C18.424%2C-33.918&layer=mapnik" />
          </div>
          <div className="grid gap-3 rounded-2xl border border-border bg-card p-6 text-sm">
            <p className="flex gap-3"><MapPin className="h-5 w-5 text-primary" />{SHOP.address}</p>
            <p className="flex gap-3"><Phone className="h-5 w-5 text-primary" />{SHOP.phone}</p>
            <p className="flex gap-3"><Mail className="h-5 w-5 text-primary" />{SHOP.email}</p>
            <div className="mt-2 border-t border-border pt-4">
              {SHOP.hours.map((h) => <p key={h.day} className="flex justify-between py-1"><span className="text-muted-foreground">{h.day}</span><span>{h.close ? `${h.open} – ${h.close}` : h.open}</span></p>)}
            </div>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-3xl font-bold">Send a message</h2>
          <div><Label htmlFor="cn">Name</Label><Input id="cn" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label htmlFor="ce">Email</Label><Input id="ce" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><Label htmlFor="cm">Message</Label><Textarea id="cm" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
          <Button type="submit" className="w-full">Send message</Button>
        </form>
      </div>
    </>
  );
}
