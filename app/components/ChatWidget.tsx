"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// Komponen bubble pesan
const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
          isUser
            ? "text-white rounded-br-md"
            : "bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm"
        }`}
        style={isUser ? { backgroundColor: "#800000" } : {}}
      >
        <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
      </div>
    </div>
  );
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
      const resp = await fetch("https://be.chatmpp.site/ask-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg.content }),
      });

      if (!resp.body) throw new Error("No stream body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let partialLine = "";


      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = (partialLine + chunk).split("\n");
        partialLine = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();

          try {
            const obj = JSON.parse(payload);

            if (obj.type === "done") {
              setLoading(false);
              return;
            }

            if (obj.type === "error") {
              setLoading(false);
              setMessages((prev) => {
                const updated = [...prev];
                const lastIndex = updated.length - 1;
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  content: "Maaf, terjadi kesalahan.",
                };
                return updated;
              });
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

            }
          } catch {

            if (payload === "[DONE]") {
              setLoading(false);
              return;
            }
            
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

          }
        }
      }
    } catch (err) {
      console.error("Stream error:", err);
      setLoading(false);
    }
    
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-[12px] right-[28px] z-50">
      {/* Tombol chatbot */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          className="p-0 bg-transparent border-none shadow-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative w-[110px] h-[110px] drop-shadow-2xl">
            <Image
              src="/images/5.png"
              alt="Chatbot"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.button>
      )}

      {/* Kotak chat */}
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
            <div
              className="flex items-center justify-between p-4 border-b rounded-t-2xl text-white"
              style={{ backgroundColor: "#800000" }}
            >
              <div className="flex items-center gap-3">
                <Image
                  src="/images/harimau.png"
                  alt="Logo Harimau"
                  width={52}
                  height={52}
                  className="object-contain drop-shadow-md"
                  priority
                />
                <div>
                  <h3 className="font-semibold text-base leading-tight">
                    Mall Pelayanan Publik
                  </h3>
                  <p className="text-xs opacity-90">Kota Bengkulu</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-full transition-colors"
                style={{ color: "#fff" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#990000")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Area pesan */}
            <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle
                    className="h-8 w-8 mx-auto mb-2 opacity-50"
                    style={{ color: "#800000" }}
                  />
                  <p className="text-sm font-medium">Selamat datang!</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Silakan tanya tentang layanan publik
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageBubble message={message} />
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t bg-white rounded-b-2xl p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-end gap-3"
              >
                <div className="flex-1">
                  <input
                    ref={inputRef}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tulis pesan Anda..."
                    disabled={loading}
                    className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none disabled:opacity-50 placeholder-gray-400 text-black"
                    style={{
                      borderColor: "#800000",
                      outlineColor: "#800000",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !msg.trim()}
                  className="p-2 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{
                    backgroundColor: "#800000",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#990000")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#800000")
                  }
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
