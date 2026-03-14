/**
 * Client for OTShield AI Chat API.
 * Calls /api/chat (server-side Gemini) or falls back to null for mock mode.
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  content: string;
}

/**
 * Sends messages to the AI chat API. Returns the assistant reply, or null if
 * the API is unavailable (e.g. no key configured) or errors.
 */
export async function sendChatMessage(
  messages: ChatMessage[]
): Promise<string | null> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (res.status === 503) {
      // API key not configured - caller should use mock
      return null;
    }

    const data = await res.json();
    if (!res.ok) {
      console.warn("[OTShield AI] API error:", data);
      return null;
    }

    return typeof data.content === "string" ? data.content : null;
  } catch (err) {
    console.warn("[OTShield AI] Request failed:", err);
    return null;
  }
}
