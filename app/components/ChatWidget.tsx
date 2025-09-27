"use client";

import { useEffect, useRef, useState } from "react";
import React from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

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

    try {
      const resp = await fetch("http://127.0.0.1:5000/ask-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: msg }),
      });

      if (!resp.body) throw new Error("No stream body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let partialLine = "";
      let buffer = ""; // 👉 penampung gabungan semua token

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = (partialLine + chunk).split("\n");
        partialLine = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              console.log("FINAL STREAM:", buffer); // tampil utuh di console
              setLoading(false);
              return;
            }

            if (data.startsWith("[ERROR]")) {
              console.error("STREAM ERROR:", data);
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
              return;
            }

            // 👉 tambahkan ke buffer
            buffer += data;

            // update UI sekaligus dari buffer, bukan per token
            setMessages((prev) => {
              const updated = [...prev];
              const lastIndex = updated.length - 1;
              if (lastIndex >= 0 && updated[lastIndex].role === "assistant") {
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  content: buffer,
                };
              }
              return updated;
            });
          }
        }
      }
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

            {/* Chat Messages */}
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
                      <div className="text-sm leading-relaxed text-gray-800">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                          components={{
                            // Headers - hanya untuk ## heading
                            h2: ({ children }) => (
                              <h2 className="text-base font-light text-indigo-700 mb-3 mt-2">
                                {children}
                              </h2>
                            ),
                            // Paragraphs dengan line break yang proper
                            p: ({ children }) => {
                              // Convert children to string untuk analisis
                              const textContent =
                                React.Children.toArray(children).join("");

                              // Cek apakah ini adalah point (a., b., c., 1., 2., dll)
                              const isListItem = /^[a-z0-9]+\.\s/i.test(
                                textContent
                              );

                              if (isListItem) {
                                return (
                                  <div className="mb-2 ml-4 pl-3 border-l-2 border-indigo-200 bg-gray-50 py-2 rounded-r">
                                    {children}
                                  </div>
                                );
                              }

                              return (
                                <div className="mb-2 whitespace-pre-line">
                                  {children}
                                </div>
                              );
                            },
                            // Bold text - hanya untuk **text**
                            strong: ({ children }) => (
                              <span className="font-light text-indigo-800">
                                {children}
                              </span>
                            ),
                            // Links
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 underline break-all"
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {m.content ||
                            (loading && i === messages.length - 1
                              ? "Mengetik..."
                              : "")}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{m.content}</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input Form */}
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
