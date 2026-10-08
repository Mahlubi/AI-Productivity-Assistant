import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { MessageCircle, Scissors, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chatWithAssistant } from "@/lib/ai/ai.functions";
import { getAppointments } from "@/lib/store";
import { addDays, availableSlots, localDate } from "@/lib/booking";
import { BARBERS } from "@/lib/data";

type Msg = { role: "user" | "assistant"; content: string; error?: boolean };

const SUGGESTIONS = [
  "Recommend a hairstyle",
  "Which service should I book?",
  "Do you have appointments tomorrow?",
  "View prices",
  "Beard grooming tips",
];

/** Compact, real availability for today + next 2 days, sent with each question so the AI never invents slots. */
function availabilitySummary() {
  const appts = getAppointments();
  const today = localDate(new Date());
  return [0, 1, 2]
    .map((n) => {
      const date = addDays(today, n);
      const label = n === 0 ? "Today" : n === 1 ? "Tomorrow" : "Day after tomorrow";
      const lines = BARBERS.map((b) => {
        const s = availableSlots(appts, b.id, date, "classic");
        return `  - ${b.name}: ${s.length ? `${s.length} open 30-min slots, e.g. ${s.filter((_, i) => i % 4 === 0).slice(0, 5).join(", ")}` : "fully booked / closed"}`;
      });
      return `${label} (${date}):\n${lines.join("\n")}`;
    })
    .join("\n");
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);
  useEffect(() => { if (open && !loading) inputRef.current?.focus(); }, [open, loading]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || loading) return;
    const next: Msg[] = [...msgs, { role: "user", content: t }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const res = await chatWithAssistant({
        data: {
          messages: next.filter((m) => !m.error).slice(-20).map(({ role, content }) => ({ role, content })),
          availability: availabilitySummary(),
        },
      });
      setMsgs((m) => [...m, res.ok ? { role: "assistant", content: res.data } : { role: "assistant", content: res.error, error: true }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Sorry, something went wrong. Please try again or call us.", error: true }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open FreshCut Assistant"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gold px-5 py-3.5 font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-105"
        >
          <MessageCircle className="h-5 w-5" /> <span className="hidden sm:inline">Ask FreshCut</span>
        </button>
      )}
      {open && (
        <div className="fixed inset-x-3 bottom-3 z-50 flex h-[min(78vh,620px)] flex-col overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[400px] animate-rise">
          <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-primary-foreground"><Scissors className="h-4 w-4" /></span>
              <div>
                <p className="font-semibold leading-tight">FreshCut Assistant</p>
                <p className="text-xs text-muted-foreground">AI helper · replies are suggestions</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat"><X className="h-5 w-5" /></button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {msgs.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Hi! Ask me about services, prices, availability or which style might suit you.</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="rounded-full border border-primary/40 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/10">{s}</button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">{m.content}</div>
              ) : (
                <div key={i} className="max-w-[95%] space-y-2">
                  <div className={`prose-chat text-sm ${m.error ? "text-destructive" : ""}`}>
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                  {!m.error && i === msgs.length - 1 && (
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" asChild onClick={() => setOpen(false)}><Link to="/book">Book now</Link></Button>
                      <Button size="sm" variant="outline" asChild onClick={() => setOpen(false)}><Link to="/style-finder">Style Finder</Link></Button>
                    </div>
                  )}
                </div>
              ),
            )}
            {loading && (
              <div className="flex items-center gap-1.5 text-muted-foreground" aria-label="Assistant is typing">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:240ms]" />
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                rows={1}
                placeholder="Ask about a cut, price or time…"
                className="max-h-28 flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send"><Send className="h-4 w-4" /></Button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">AI can make mistakes. Please confirm important details with the shop.</p>
          </form>
        </div>
      )}
    </>
  );
}
