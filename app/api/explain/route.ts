import { NextResponse } from 'next/server';

function getMockExplanation(title: string) {
  return {
    dayOne: `Write the bare minimum script/code to implement ${title}. No database, no auth, no UI wrapper.`,
    defer: "Push all cloud integrations, advanced databases, dynamic scaling, and analytics dashboard to the post-launch backlog.",
    watchFor: "Watch out for stakeholders asking 'does this support SSO?' or 'how do we scale this to 10k users?'. Ignore them."
  };
}

export const maxDuration = 60;
export const runtime = 'edge';

export async function POST(request: Request) {
  let requestBody: any = {};
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON input." },
      { status: 400 }
    );
  }

  const ticket = requestBody.ticket || {};
  const title = requestBody.title || ticket.title;
  const scope = requestBody.scope || ticket.scope;
  const why = requestBody.why || ticket.whyCut || ticket.why;

  if (!title || !scope) {
    return NextResponse.json(
      { error: "Missing required fields (title, scope)." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    console.warn("GROK_API_KEY missing for Groq API. Activating mock explanation fallback...");
    return NextResponse.json(getMockExplanation(title));
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a cynical, elite Silicon Valley Product Auditor. For the provided MVP ticket, give a brutalist analysis in JSON format with exactly three keys: 'dayOne', 'defer', and 'watchFor'. Keep each explanation very concise (1-2 sentences max). Return ONLY the JSON object. Do not wrap it in markdown code blocks or add introductory text."
          },
          {
            role: "user",
            content: `Ticket Title: ${title}\nScope: ${scope}\nWhy Cut: ${why}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error?.message || response.statusText || "Groq API Error";
      throw new Error(errMsg);
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from Groq engine.");
    }

    const parsedData = JSON.parse(content);
    return NextResponse.json(parsedData);

  } catch (e: any) {
    console.error("Groq Route Error:", e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}