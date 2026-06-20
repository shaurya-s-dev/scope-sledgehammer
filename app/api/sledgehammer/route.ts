import { NextResponse } from 'next/server';

function getFallbackTickets(prompt: string, brutality: string) {
  const cleanPrompt = prompt.trim().replace(/[^\w\s]/g, "");
  const words = cleanPrompt.split(/\s+/).filter(w => w.length > 3);
  const keyword = words.length > 0 ? words[0].toUpperCase() : "PRODUCT";
  const name = words.length > 1 ? `${keyword} ${words[1].toUpperCase()}` : `${keyword} CORE`;

  if (brutality === 'gentle') {
    return [
      {
        title: `${name} - CORE DATA MODELING & UPLOAD`,
        scope: "Bare minimum database schema and a direct CSV file parser upload pipeline.",
        whyCut: "Third-party cloud storage integrations and automated database syncing are scope-creep that would stall the launch.",
        framework: "Jobs-to-be-Done",
        effort: 3
      },
      {
        title: `${name} - MAIN STATISTICS VIEW`,
        scope: "Implement a clean, read-only grid displaying static calculated parameters.",
        whyCut: "Dynamic charting modules and real-time websockets are cut to maintain simple database fetches.",
        framework: "Jobs-to-be-Done",
        effort: 2
      },
      {
        title: `${name} - MANUAL WORKSPACE SCHEDULING`,
        scope: "Minimal calendar interface allowing local date scheduling controls.",
        whyCut: "Google Calendar syncing and automatic AI reminder notifications are slashed.",
        framework: "Jobs-to-be-Done",
        effort: 4
      },
      {
        title: `${name} - BASIC NOTIFICATION TRIGGER`,
        scope: "Single rule-based email alert triggered on one key status change.",
        whyCut: "Multi-channel push/SMS/Slack notification systems are deferred until users prove they actually want alerts.",
        framework: "Jobs-to-be-Done",
        effort: 1
      },
      {
        title: `${name} - SIMPLE USER PROFILE`,
        scope: "Minimal account page showing name, email, and one editable preference field.",
        whyCut: "Granular permission tiers, avatar uploads, and social profile linking add no validation value pre-launch.",
        framework: "Jobs-to-be-Done",
        effort: 2
      }
    ];
  } else if (brutality === 'ruthless') {
    return [
      {
        title: `${name} - RAW PIPELINE INPUT`,
        scope: "Single raw text area input allowing copy-paste parsing with synchronous processing.",
        whyCut: "Integrations with Slack, Microsoft Teams, and JIRA webhooks are cut to focus on direct interface entry.",
        framework: "MoSCoW Rules: Must-Have",
        effort: 2
      },
      {
        title: `${name} - SYNCHRONOUS TICKET PARSER`,
        scope: "Local script translating the text inputs directly to a JSON payload.",
        whyCut: "Worker queue pipelines, notification relays, and background cron schedules are completely slashed.",
        framework: "MoSCoW Rules: Must-Have",
        effort: 3
      },
      {
        title: `${name} - SYSTEM TEXT CLIPBOARD`,
        scope: "Simple copy-to-clipboard button using the standard browser clipboard API.",
        whyCut: "PDF generation tools and direct export-to-Jira components are cut to reduce dependency weight.",
        framework: "MoSCoW Rules: Must-Have",
        effort: 1
      }
    ];
  } else {
    return [
      {
        title: `${name} - RAW CLI MVP UTILITY`,
        scope: "A single command-line conceptual text box outputting the core feature.",
        whyCut: "All components, dashboard telemetry, custom layout configurations, and graphical ticket renders are vaporized.",
        framework: "Nuclear Option",
        effort: 1
      }
    ];
  }
}

export async function POST(request: Request) {
  let promptText = "";
  let brutalityLevel = "ruthless";

  try {
    const body = await request.json();
    promptText = body.prompt;
    brutalityLevel = body.brutality || "ruthless";
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON input." },
      { status: 400 }
    );
  }

  if (!promptText || typeof promptText !== 'string' || promptText.trim().length < 10) {
    return NextResponse.json(
      { error: "Input is too short or invalid to process." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    console.warn("GROK_API_KEY missing — activating fallback mock tickets (Groq key not set).");
    const fallback = getFallbackTickets(promptText, brutalityLevel);
    return NextResponse.json({
      tickets: fallback,
      stats: { mode: "fallback", brutality: brutalityLevel }
    });
  }

  let frameworkInstruction = "";
  if (brutalityLevel === 'gentle') {
    frameworkInstruction = "Apply a light Jobs-to-be-Done (JTBD) framework. Keep essential quality-of-life additions but organize them tightly. Return exactly 5 tickets.";
  } else if (brutalityLevel === 'ruthless') {
    frameworkInstruction = "Apply a strict MoSCoW framework. Isolate ONLY the absolute 'Must-Have' core features. Cut the 'Should-Haves' completely. Return exactly 3 tickets.";
  } else {
    frameworkInstruction = "Apply a Nuclear Option MVP strategy. Strip the idea down to a single-feature conceptually. Return exactly 1 ticket.";
  }

  const systemInstruction = `You are a cynical, elite Silicon Valley Product Auditor. The user will provide a bloated product idea.
Your task:
1. ${frameworkInstruction}
2. Extract the highly focused development tickets.
3. You must return a valid JSON object containing a 'tickets' key which holds an array of ticket objects. 
Each ticket object MUST have these exact keys:
- 'title': A clean, production-ready ticket header.
- 'scope': What is explicitly included in this ticket.
- 'whyCut': A sharp, cynical one-sentence explanation of what feature bloat was discarded and why it would have killed the startup.
- 'framework': The framework applied.
- 'effort': An integer from 1 to 5 (where 1 = trivial, 5 = very hard) representing the development effort required for this stripped-down ticket.

Return ONLY a valid JSON object. Do not wrap it in markdown code blocks (\`\`\`json) or add introductory text.`;

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
          { role: "system", content: systemInstruction },
          { role: "user", content: promptText }
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

    if (parsedData && Array.isArray(parsedData.tickets)) {
      return NextResponse.json({
        tickets: parsedData.tickets,
        stats: { mode: "live", brutality: brutalityLevel }
      });
    } else {
      throw new Error("Malformed data format received from Groq.");
    }

  } catch (error: unknown) {
    console.error("Groq Route Error, invoking fallback:", error);
    const fallback = getFallbackTickets(promptText, brutalityLevel);
    return NextResponse.json({
      tickets: fallback,
      stats: { mode: "fallback", error: error instanceof Error ? error.message : String(error) }
    });
  }
}