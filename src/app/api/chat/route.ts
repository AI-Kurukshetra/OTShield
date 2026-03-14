import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const OT_SYSTEM_PROMPT = `You are OTShield AI Copilot, an expert assistant for industrial operational technology (OT) and ICS cybersecurity. You help operators and security analysts with:
- Analyzing device risks (PLCs, RTUs, HMIs, gateways, sensors)
- Explaining security alerts and anomalies
- Recommending mitigations for Modbus, OPC-UA, S7, EtherNet/IP
- Network segmentation and OT security best practices
- Compliance (NERC CIP, IEC 62443, NIST)

Keep responses concise and actionable. Focus on OT/ICS context.`;

type RequestMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI_API_KEY_NOT_CONFIGURED', message: 'OPENAI_API_KEY is not set' },
      { status: 503 },
    );
  }

  let body: { messages: RequestMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'INVALID_JSON', message: 'Invalid request body' },
      { status: 400 },
    );
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: 'MESSAGES_REQUIRED', message: 'messages array is required' },
      { status: 400 },
    );
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: 'gpt-5',
      input: [
        {
          role: 'system',
          content: OT_SYSTEM_PROMPT,
        },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    });

    const text = response.output_text;
    if (typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'EMPTY_RESPONSE', message: 'Model returned empty response' },
        { status: 502 },
      );
    }

    return NextResponse.json({ content: text.trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[OTShield AI] Chat error:', message);
    return NextResponse.json(
      { error: 'AI_ERROR', message: 'Failed to get AI response' },
      { status: 500 },
    );
  }
}
