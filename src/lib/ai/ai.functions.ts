import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CHAT_SYSTEM_PROMPT, SCHEDULE_SYSTEM_PROMPT, STYLE_SYSTEM_PROMPT, SUMMARY_SYSTEM_PROMPT } from "./prompts";

type AIResult<T> = { ok: true; data: T } | { ok: false; error: string };

const FRIENDLY = "Sorry, we couldn't complete that right now. Please try again or speak directly with one of our barbers.";

function friendlyError(e: unknown): string {
  const status = (e as { statusCode?: number })?.statusCode;
  if (status === 429) return "Our AI is busy right now. Please wait a moment and try again.";
  if (status === 402) return "AI credits have run out for this demo. Please contact the shop directly.";
  return FRIENDLY;
}

async function runText(system: string, messages: { role: "user" | "assistant"; content: string }[]) {
  const { streamText } = await import("ai");
  const { getModel, providerOptions } = await import("./gateway.server");
  const result = streamText({ model: getModel(), system, messages, providerOptions });
  return await result.text;
}

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).max(40),
      availability: z.string().max(4000),
    }),
  )
  .handler(async ({ data }): Promise<AIResult<string>> => {
    try {
      const system = `${CHAT_SYSTEM_PROMPT}\n\n# Live availability (from the booking system)\n${data.availability}`;
      const text = await runText(system, data.messages);
      if (!text.trim()) return { ok: false, error: FRIENDLY };
      return { ok: true, data: text };
    } catch (e) {
      console.error("chat error", e);
      return { ok: false, error: friendlyError(e) };
    }
  });

const styleSchema = z.object({
  styleName: z.string(),
  whyItWorks: z.string(),
  fadeOrTechnique: z.string(),
  suggestedLength: z.string(),
  maintenance: z.enum(["Low", "Medium", "High"]),
  stylingAdvice: z.string(),
  serviceId: z.string(),
  product: z.string(),
  alternatives: z.array(z.string()),
});
export type StyleRecommendation = z.infer<typeof styleSchema>;

export const recommendStyle = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      faceShape: z.string().max(40),
      hairType: z.string().max(40),
      hairLength: z.string().max(40),
      preferredStyle: z.string().max(60),
      maintenance: z.string().max(40),
      vibe: z.string().max(40),
      current: z.string().max(500).optional(),
    }),
  )
  .handler(async ({ data }): Promise<AIResult<StyleRecommendation>> => {
    try {
      const { streamText, Output } = await import("ai");
      const { getModel, providerOptions } = await import("./gateway.server");
      const prompt = `Customer profile:
- Face shape: ${data.faceShape}
- Hair type: ${data.hairType}
- Current hair length: ${data.hairLength}
- Preferred style: ${data.preferredStyle}
- Maintenance preference: ${data.maintenance}
- Professional/casual: ${data.vibe}
- Current hairstyle notes: ${data.current?.trim() || "none given"}`;
      const result = streamText({
        model: getModel(),
        system: STYLE_SYSTEM_PROMPT,
        prompt,
        output: Output.object({ schema: styleSchema }),
        providerOptions,
      });
      let out: StyleRecommendation;
      try {
        out = (await result.output) as StyleRecommendation;
      } catch {
        const raw = await result.text;
        out = styleSchema.parse(JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)));
      }
      return { ok: true, data: { ...out, alternatives: out.alternatives.slice(0, 3) } };
    } catch (e) {
      console.error("style error", e);
      return { ok: false, error: friendlyError(e) };
    }
  });

export const planSchedule = createServerFn({ method: "POST" })
  .inputValidator(z.object({ input: z.string().min(1).max(8000) }))
  .handler(async ({ data }): Promise<AIResult<string>> => {
    try {
      return { ok: true, data: await runText(SCHEDULE_SYSTEM_PROMPT, [{ role: "user", content: data.input }]) };
    } catch (e) {
      console.error("schedule error", e);
      return { ok: false, error: friendlyError(e) };
    }
  });

export const summariseNotes = createServerFn({ method: "POST" })
  .inputValidator(z.object({ notes: z.string().min(1).max(6000) }))
  .handler(async ({ data }): Promise<AIResult<string>> => {
    try {
      return { ok: true, data: await runText(SUMMARY_SYSTEM_PROMPT, [{ role: "user", content: data.notes }]) };
    } catch (e) {
      console.error("summary error", e);
      return { ok: false, error: friendlyError(e) };
    }
  });
