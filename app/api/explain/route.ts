import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { ticket } = await request.json();

  const apiKey = process.env.GROK_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      dayOne:   "Build the absolute minimum: one screen, one action, one data write.",
      defer:    "All integrations, notifications, and analytics go to v2 — ship without them.",
      watchFor: "Any sentence starting with 'can we also add…' is scope creep. Kill it.",
    });
  }

  const system = `You are a brutally efficient product lead. Given a development ticket,
return ONLY a valid JSON object with exactly these three string keys:
- "dayOne": one short sentence — what to ship by end of day 1
- "defer": one short sentence — what to explicitly cut and push to v2
- "watchFor": one short sentence — the most likely scope-creep trap for this ticket
No markdown, no preamble.`;

  const user = `Ticket: ${ticket.title}\nScope: ${ticket.scope}\nWhy: ${ticket.why}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      response_format: { type: "json_object" },
      temperature: 0.25,
      max_tokens: 256,
    }),
  });

  const data = await res.json();
  const raw  = data.choices?.[0]?.message?.content ?? "{}";

  try {
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({
      dayOne:   "Ship core CRUD in a single route. No auth layer yet.",
      defer:    "Dashboard, notifications, and integrations → v2.",
      watchFor: "Stakeholder requests for 'just one more field' — decline every one.",
    });
  }
}