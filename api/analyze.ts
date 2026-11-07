// Second Look: AI photo inspection for a used car.
// POST /api/analyze  { car: {...}, photos: [{ shot, label, data }], answers: {...} }
// Returns a structured visual inspection from Claude. Deployed as a Vercel Function;
// needs ANTHROPIC_API_KEY in the project's environment variables.
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const MAX_PHOTOS = 14;
const MAX_PHOTO_BYTES = 900_000; // the app shrinks photos before upload; this guards against raw camera files

const SEVERITY = ["ok", "minor", "moderate", "serious", "unclear"];

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["photo_findings", "odometer_reading", "dashboard_warnings", "overall_summary", "questions_for_seller", "mechanic_focus"],
  properties: {
    photo_findings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["shot", "severity", "finding"],
        properties: {
          shot: { type: "string", description: "The shot id exactly as given, e.g. front_left" },
          severity: { type: "string", enum: SEVERITY },
          finding: { type: "string", description: "One or two plain sentences a car buyer understands" },
        },
      },
    },
    odometer_reading: { type: "string", description: "Digits and unit read from the odometer photo, or an empty string if not readable" },
    dashboard_warnings: { type: "array", items: { type: "string" }, description: "Warning lights visible with the engine running" },
    overall_summary: { type: "string" },
    questions_for_seller: { type: "array", items: { type: "string" } },
    mechanic_focus: { type: "array", items: { type: "string" }, description: "What a mechanic should check in person" },
  },
} as const;

const SYSTEM = `You help a private buyer look over a used car before buying it. You get labelled photos taken by the buyer at the car, plus the details they typed in.

For each photo, report what you can actually see that matters to a buyer: paint colour or gloss differences between panels, uneven panel gaps, dents, scratches, rust, overspray, mismatched or cracked lights and glass, tyre tread depth and uneven wear, oil or fluid leaks, corrosion in the engine bay, interior wear that doesn't fit the stated mileage, water marks or damp carpet, and warning lights on the dashboard.

Be honest about the limits of a photo. Use "unclear" when the photo is too dark, blurry or far away to judge, and say what to re-shoot. Never guess at mechanical condition you cannot see; put those items under mechanic_focus instead. Use "ok" when the shot shows nothing of concern. Keep findings short and in plain language, without jargon.

Read the odometer if a photo shows it. List any dashboard warning lights by name.

Write questions_for_seller as things the buyer can ask on the spot, based on what you saw. Write the overall_summary in two or three sentences. Reply in the language given in the request.`;

type Photo = { shot: string; label: string; data: string };

export async function POST(request: Request): Promise<Response> {
  let body: { car?: Record<string, unknown>; photos?: Photo[]; answers?: Record<string, string>; lang?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "The request body must be JSON." }, 400);
  }

  const photos = Array.isArray(body.photos) ? body.photos.slice(0, MAX_PHOTOS) : [];
  if (!photos.length) return json({ error: "Add at least one photo." }, 400);

  const content: Anthropic.Beta.BetaContentBlockParam[] = [];
  for (const p of photos) {
    const m = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(String(p.data || ""));
    if (!m) return json({ error: `Photo "${p.label}" is not a JPEG, PNG or WebP image.` }, 400);
    if (m[2].length * 0.75 > MAX_PHOTO_BYTES) return json({ error: `Photo "${p.label}" is too large.` }, 413);
    content.push({ type: "text", text: `Shot "${p.shot}": ${p.label}` });
    content.push({ type: "image", source: { type: "base64", media_type: m[1] as "image/jpeg" | "image/png" | "image/webp", data: m[2] } });
  }
  content.push({
    type: "text",
    text: `Car details from the buyer: ${JSON.stringify(body.car ?? {})}\nBuyer's checklist answers: ${JSON.stringify(body.answers ?? {})}\nReply language: ${body.lang || "English"}\nGive one photo_findings entry per shot above.`,
  });

  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA } },
      system: SYSTEM,
      messages: [{ role: "user", content }],
    });

    if (response.stop_reason === "refusal") {
      return json({ error: "The photos could not be analysed. Try retaking them." }, 422);
    }
    const text = response.content.find((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text");
    if (!text) return json({ error: "No analysis came back. Please try again." }, 502);
    return json({ inspection: JSON.parse(text.text), model: response.model });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return json({ error: "Too many checks right now. Try again in a minute." }, 429);
    if (err instanceof Anthropic.AuthenticationError) return json({ error: "The AI service is not configured on the server." }, 500);
    if (err instanceof Anthropic.BadRequestError) return json({ error: "The photos could not be processed." }, 400);
    if (err instanceof Anthropic.APIError) return json({ error: "The AI service had a problem. Try again." }, 502);
    if (err instanceof SyntaxError) return json({ error: "The analysis came back incomplete. Try again." }, 502);
    throw err;
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
