"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// ===== Simple text renderer (tanpa ReactMarkdown) =====
const SimpleTextProcessor = ({ content }: { content: string }) => {
  if (!content) return null;

  // Normalisasi newline
  let processed = content
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  const sections = processed.split(/\n\n+/).filter((s) => s.trim());

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        // Heading "##"
        if (trimmed.startsWith("##")) {
          const headingText = trimmed.replace(/^##\s*/, "");
          return (
            <div
              key={idx}
              className="text-base font-semibold text-indigo-700 border-b border-indigo-200 pb-2 mb-3"
            >
              {headingText}
            </div>
          );
        }

        // Numbered list "1.","2.",...
        if (/^\d+\./.test(trimmed)) {
          const parts = trimmed.split("\n").filter((p) => p.trim());
          return (
            <div key={idx} className="space-y-2">
              {parts.map((part, pidx) => {
                const t = part.trim();
                if (!t) return null;

                // Lettered "a.","b.",...
                if (/^[a-z]\./i.test(t)) {
                  return (
                    <div
                      key={pidx}
                      className="ml-6 pl-3 py-2 border-l-3 border-indigo-300 bg-indigo-50 rounded-r"
                    >
                      <div
                        className="text-sm text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: t
                            .replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong class="font-semibold text-indigo-800">$1</strong>'
                            )
                            .replace(
                              /(https?:\/\/[^\s]+)/g,
                              '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline break-all">$1</a>'
                            ),
                        }}
                      />
                    </div>
                  );
                }

                return (
                  <div
                    key={pidx}
                    className="text-sm text-gray-800 leading-relaxed"
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: t
                          .replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong class="font-semibold text-indigo-800">$1</strong>'
                          )
                          .replace(
                            /(https?:\/\/[^\s]+)/g,
                            '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline break-all">$1</a>'
                          ),
                      }}
                    />
                  </div>
                );
              })}
            </div>
          );
        }

        // Lettered list yang langsung di awal
        if (/^[a-z]\./i.test(trimmed)) {
          const points = trimmed.split(/\n(?=[a-z]\.)/).filter((p) => p.trim());
          return (
            <div key={idx} className="space-y-2">
              {points.map((pt, j) => (
                <div
                  key={j}
                  className="ml-4 pl-3 py-2 border-l-2 border-indigo-300 bg-indigo-50 rounded-r"
                >
                  <div
                    className="text-sm text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: pt
                        .trim()
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="font-semibold text-indigo-800">$1</strong>'
                        )
                        .replace(
                          /(https?:\/\/[^\s]+)/g,
                          '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline break-all">$1</a>'
                        ),
                    }}
                  />
                </div>
              ))}
            </div>
          );
        }

        // Paragraph biasa
        return (
          <div key={idx} className="text-sm text-gray-800 leading-relaxed">
            <div
              dangerouslySetInnerHTML={{
                __html: trimmed
                  .replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong class="font-semibold text-indigo-800">$1</strong>'
                  )
                  .replace(
                    /(https?:\/\/[^\s]+)/g,
                    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline break-all">$1</a>'
                  )
                  .replace(/\n/g, "<br/>"),
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

// ===== Chat Widget =====
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!msg.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: msg };
    setMessages((prev) => [
      ...prev,
      userMsg,
      { role: "assistant", content: "" },
    ]);
    setMsg("");
    setLoading(true);

    // ===== DEBUG START =====
    const t0 = performance.now();
    const debugChunks: string[] = [];
    const debugLines: string[] = [];
    const debugRequestId = Math.random().toString(36).slice(2);
    console.groupCollapsed(
      `%c[FE] /ask-stream request ${debugRequestId}`,
      "color:#4f46e5;font-weight:bold;"
    );
    console.log("question:", userMsg.content);
    // ===== DEBUG END =====

    try {
      const resp = await fetch("http://127.0.0.1:5000/ask-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg.content }),
      });

      const beRequestId = resp.headers.get("X-Request-ID") || "n/a";
      console.log("status:", resp.status, resp.statusText);
      console.log("X-Request-ID:", beRequestId);
      console.log(
        "response headers:",
        Object.fromEntries(resp.headers.entries())
      );

      if (!resp.body) throw new Error("No stream body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let partialLine = "";
      let finalText = ""; // ini yang akan tampil di UI

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        debugChunks.push(chunk); // raw chunk (debug)

        const lines = (partialLine + chunk).split("\n");
        partialLine = lines.pop() || "";

        for (const line of lines) {
          debugLines.push(line); // raw line (debug)

          if (!line.startsWith("data: ")) continue;

          const payload = line.slice(6).trim();

          // ---- Parser SSE JSON (server baru) ----
          try {
            const obj = JSON.parse(payload);

            if (obj.type === "done") {
              setLoading(false);
              const ms = Math.round(performance.now() - t0);
              console.log(
                "raw SSE lines (sample up to 50):",
                debugLines.slice(0, 50)
              );
              console.log("raw chunks count:", debugChunks.length);
              console.log("finalText (to UI):", finalText);
              console.log("duration_ms:", ms);
              console.groupEnd();
              return;
            }

            if (obj.type === "error") {
              setLoading(false);
              setMessages((prev) => {
                const updated = [...prev];
                const lastIndex = updated.length - 1;
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  content:
                    "Maaf, terjadi kesalahan dalam memproses permintaan Anda.",
                };
                return updated;
              });
              console.error("[FE] SSE ERROR payload:", obj);
              console.groupEnd();
              return;
            }

            if (obj.type === "chunk") {
              const data: string = obj.content ?? "";
              setMessages((prev) => {
                const updated = [...prev];
                const lastIndex = updated.length - 1;
                if (lastIndex >= 0 && updated[lastIndex].role === "assistant") {
                  updated[lastIndex] = {
                    ...updated[lastIndex],
                    content: updated[lastIndex].content + data,
                  };
                }
                return updated;
              });
              finalText += data;
              continue;
            }
          } catch {
            // ---- Fallback: server lama (plain text) ----
            if (payload === "[DONE]") {
              setLoading(false);
              const ms = Math.round(performance.now() - t0);
              console.log(
                "raw SSE lines (sample up to 50):",
                debugLines.slice(0, 50)
              );
              console.log("raw chunks count:", debugChunks.length);
              console.log("finalText (to UI):", finalText);
              console.log("duration_ms:", ms);
              console.groupEnd();
              return;
            }
            if (payload.startsWith("[ERROR]")) {
              setLoading(false);
              setMessages((prev) => {
                const updated = [...prev];
                const lastIndex = updated.length - 1;
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  content:
                    "Maaf, terjadi kesalahan dalam memproses permintaan Anda.",
                };
                return updated;
              });
              console.error("[FE] SSE ERROR payload:", payload);
              console.groupEnd();
              return;
            }
            // plain chunk
            setMessages((prev) => {
              const updated = [...prev];
              const lastIndex = updated.length - 1;
              if (lastIndex >= 0 && updated[lastIndex].role === "assistant") {
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  content: updated[lastIndex].content + payload,
                };
              }
              return updated;
            });
            finalText += payload;
          }
        }
      }

      // Jika stream berakhir tanpa tanda "done"
      setLoading(false);
      console.warn(
        "[FE] Stream ended without [DONE]. Final so far:",
        finalText
      );
      console.groupEnd();
    } catch (err) {
      console.error("Stream error:", err);
      setLoading(false);
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && updated[lastIndex].role === "assistant") {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: "Maaf, terjadi kesalahan koneksi.",
          };
        }
        return updated;
      });
      console.groupEnd();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          className="p-4 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-[400px] h-[60vh] bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-2xl">
              <div>
                <h3 className="font-semibold text-sm">Mall Pelayanan Publik</h3>
                <p className="text-xs text-indigo-100">Kota Bengkulu</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="p-1 rounded-full hover:bg-indigo-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Selamat datang!</p>
                  <p className="text-xs text-gray-400">
                    Silakan tanya tentang layanan publik
                  </p>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm max-w-[90%] ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-md"
                        : "bg-white text-gray-900 rounded-bl-md border border-gray-200"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <SimpleTextProcessor
                        content={
                          m.content ||
                          (loading && i === messages.length - 1
                            ? "Mengetik..."
                            : "")
                        }
                      />
                    ) : (
                      <p className="text-sm leading-relaxed">{m.content}</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t bg-white rounded-b-2xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-end gap-2 p-3"
              >
                <input
                  ref={inputRef}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tulis pesan Anda..."
                  disabled={loading}
                  className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !msg.trim()}
                  className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
