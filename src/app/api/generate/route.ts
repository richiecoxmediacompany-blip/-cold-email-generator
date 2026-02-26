import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const client = new Anthropic();
    const { companyName, offering, targetCompany, targetPersona } =
      await req.json();

    if (!companyName || !offering || !targetCompany || !targetPersona) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Write a personalized cold email for the following scenario:

- Sender's company: ${companyName}
- What we offer: ${offering}
- Target company: ${targetCompany}
- Target persona/role: ${targetPersona}

Requirements:
- Address the target persona directly and naturally (use a plausible first name if helpful, or just the role)
- Reference what the sender's company offers and how it could help the target company
- Include a clear, low-friction call-to-action (e.g., quick call, reply)
- Professional but conversational tone — not salesy or generic
- 3-4 short paragraphs maximum
- Include a subject line at the top prefixed with "Subject: "
- Do NOT include any placeholders like [Name] or [Your Name] — write it as a complete, ready-to-send email
- Sign off with the sender's company name

Return ONLY the email text, nothing else.`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const email = textBlock ? textBlock.text : "";

    return NextResponse.json({ email });
  } catch (error: unknown) {
    console.error("Error generating email:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate email";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
