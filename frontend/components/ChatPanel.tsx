"use client";

import { useEffect, useRef, useState } from "react";
import { NdaFormData } from "@/lib/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  formData: NdaFormData;
  onFieldsUpdate: (fields: Partial<NdaFormData>) => void;
}

export default function ChatPanel({ formData, onFieldsUpdate }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      sendToBackend([]);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendToBackend(history: Message[]) {
    setLoading(true);
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
          current_fields: formData,
        }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;

          try {
            const event = JSON.parse(raw);
            if (event.type === "token") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + event.content }
                    : m
                )
              );
            } else if (event.type === "fields") {
              applyFieldUpdate(event.fields);
            }
          } catch {
            // malformed chunk — skip
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }

  function applyFieldUpdate(fields: Record<string, unknown>) {
    const update: Partial<NdaFormData> = {};
    for (const [key, val] of Object.entries(fields)) {
      if (val == null) continue;
      (update as Record<string, unknown>)[key] = val;
    }
    if (Object.keys(update).length > 0) {
      onFieldsUpdate(update);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    await sendToBackend(nextHistory);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "text-white rounded-br-sm"
                  : "text-gray-800 bg-gray-100 rounded-bl-sm"
              }`}
              style={m.role === "user" ? { backgroundColor: "#032147" } : {}}
            >
              {m.content || (
                <span className="text-gray-400 italic animate-pulse">…</span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex-shrink-0 border-t border-gray-200 p-4 flex gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
          placeholder="Répondez ici… (Entrée pour envoyer)"
          disabled={loading}
          rows={2}
          className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50"
          style={{ "--tw-ring-color": "#209dd7" } as React.CSSProperties}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="self-end rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ backgroundColor: "#753991" }}
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
