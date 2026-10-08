import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Loader2, RotateCcw, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { recommendStyle, type StyleRecommendation } from "@/lib/ai/ai.functions";
import { formatRand, getService, SERVICES } from "@/lib/data";
import { AIBadge, PageHeader } from "@/components/site/cards";

export const Route = createFileRoute("/style-finder")({
  head: () => ({
    meta: [
      { title: "AI Style Finder — FreshCut AI Barbershop" },
      { name: "description", content: "Answer six quick questions and get an AI haircut recommendation, then book it." },
      { property: "og:title", content: "Find Your Perfect Style — FreshCut" },
      { property: "og:description", content: "AI haircut recommendations based on your face shape, hair type and lifestyle." },
    ],
  }),
  component: StyleFinder,
});

const QUESTIONS = [
  { key: "faceShape", label: "Face shape", options: ["Oval", "Round", "Square", "Heart", "Oblong", "Not sure"] },
  { key: "hairType", label: "Hair type", options: ["Straight", "Wavy", "Curly", "Coily", "Not sure"] },
  { key: "hairLength", label: "Current length", options: ["Very short", "Short", "Medium", "Long"] },
  { key: "preferredStyle", label: "Preferred style", options: ["Fade", "Taper", "Textured crop", "Classic side part", "Longer on top", "Surprise me"] },
  { key: "maintenance", label: "Maintenance", options: ["Low", "Medium", "High"] },
  { key: "vibe", label: "Look", options: ["Professional", "Casual", "Bit of both"] },
] as const;

type Answers = Record<(typeof QUESTIONS)[number]["key"], string>;

function StyleFinder() {
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [current, setCurrent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rec, setRec] = useState<StyleRecommendation | null>(null);

  const complete = QUESTIONS.every((q) => answers[q.key]);

  async function submit() {
    if (!complete) return;
    setLoading(true); setError(""); setRec(null);
    try {
      const res = await recommendStyle({ data: { ...(answers as Answers), current } });
      if (res.ok) setRec(res.data); else setError(res.error);
    } catch {
      setError("Sorry, we couldn't generate a recommendation right now. Please try again or speak directly with one of our barbers.");
    } finally { setLoading(false); }
  }

  return (
    <>
      <PageHeader eyebrow="AI Style Finder" title="Find your perfect style" sub="Six quick questions. Our AI barber consultant suggests a cut, the right service and how to style it." />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-24 sm:px-6 lg:grid-cols-[1fr_440px]">
        <div className="space-y-8">
          {QUESTIONS.map((q, i) => (
            <fieldset key={q.key}>
              <legend className="mb-3 flex items-center gap-3"><span className="font-display text-2xl font-bold text-primary">0{i + 1}</span><span className="font-semibold">{q.label}</span></legend>
              <div className="flex flex-wrap gap-2">
                {q.options.map((o) => (
                  <button key={o} type="button" onClick={() => setAnswers({ ...answers, [q.key]: o })}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${answers[q.key] === o ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50"}`}>{o}</button>
                ))}
              </div>
            </fieldset>
          ))}
          <div>
            <p className="mb-3 font-semibold">Describe your current hairstyle <span className="text-muted-foreground">(optional)</span></p>
            <Textarea maxLength={500} value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="e.g. Grown-out taper, thick on top, cowlick at the front" />
          </div>
          <Button size="lg" disabled={!complete || loading} onClick={submit}>
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}{loading ? "Finding your perfect style…" : "Get my recommendation"}
          </Button>
          {!complete && <p className="text-xs text-muted-foreground">Answer all six questions to continue.</p>}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          {loading ? (
            <div className="grid min-h-80 place-items-center rounded-3xl border border-border bg-card p-8 text-center">
              <div><Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" /><p className="mt-4 font-semibold">Finding your perfect style…</p><p className="text-sm text-muted-foreground">Analysing your answers</p></div>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-destructive/40 bg-card p-8 text-center">
              <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
              <p className="mt-4 text-sm">{error}</p>
              <Button variant="outline" className="mt-5" onClick={submit}><RotateCcw />Try again</Button>
            </div>
          ) : rec ? (
            <AIRecommendationCard rec={rec} onReset={() => setRec(null)} />
          ) : (
            <div className="grid min-h-80 place-items-center rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground">
              <div><Wand2 className="mx-auto h-10 w-10" /><p className="mt-4 text-sm">Your recommendation will appear here.</p></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function AIRecommendationCard({ rec, onReset }: { rec: StyleRecommendation; onReset: () => void }) {
  const service = getService(rec.serviceId) ?? SERVICES[0];
  return (
    <article className="overflow-hidden rounded-3xl border border-primary/40 bg-card shadow-gold animate-rise">
      <div className="bg-gold p-6 text-primary-foreground">
        <p className="text-xs font-bold uppercase tracking-[0.2em]">Recommended style</p>
        <h2 className="mt-2 text-5xl font-extrabold">{rec.styleName}</h2>
      </div>
      <div className="space-y-5 p-6 text-sm">
        <div className="flex items-center justify-between"><AIBadge /><span className="text-xs text-muted-foreground">Maintenance: <b className="text-foreground">{rec.maintenance}</b></span></div>
        <Item k="Why it works" v={rec.whyItWorks} />
        <div className="grid grid-cols-2 gap-4"><Item k="Fade / technique" v={rec.fadeOrTechnique} /><Item k="Suggested length" v={rec.suggestedLength} /></div>
        <Item k="Styling advice" v={rec.stylingAdvice} />
        <Item k="Product" v={rec.product} />
        {rec.alternatives.length > 0 && <Item k="Also consider" v={rec.alternatives.join(" · ")} />}
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Recommended service</p>
          <div className="flex items-center justify-between"><p className="font-semibold">{service.name}</p><p className="font-bold text-primary">{formatRand(service.price)} · {service.duration} min</p></div>
        </div>
        <Button size="lg" className="w-full" asChild><Link to="/book" search={{ service: service.id }}>Book This Style</Link></Button>
        <Button variant="ghost" className="w-full" onClick={onReset}><RotateCcw />Start over</Button>
        <p className="text-xs text-muted-foreground">AI recommendations are general grooming suggestions and may not account for every individual characteristic. Your barber can provide personalised professional advice.</p>
      </div>
    </article>
  );
}
function Item({ k, v }: { k: string; v: string }) {
  return <div><p className="text-xs uppercase tracking-wider text-primary">{k}</p><p className="mt-1 leading-relaxed">{v}</p></div>;
}
