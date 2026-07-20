import { useEffect, useRef, useState } from "react";
import { askChatbot } from "../../services/chatbotService";

const SUGGESTIONS = [
  "What are the school fees?",
  "Admission process kya hai?",
  "School ka address aur phone?",
  "School timings?",
];

export default function SchoolChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Namaste! Main Rising Star Public School assistant hoon. Admissions, fees, timings, contact, academics — school se related kuch bhi poochho. Sirf official school data se jawab dunga.",
    },
  ]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, messages, loading]);

  const send = async (text) => {
    const message = String(text || input).trim();
    if (!message || loading) return;

    const nextMessages = [...messages, { role: "user", content: message }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const history = nextMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(0, -1)
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await askChatbot(message, history);
      const reply = res?.data?.reply || "Sorry, I could not get a response. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Something went wrong. Please try again or contact the school office.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close school chat" : "Open school chat"}
        className="fixed bottom-5 right-5 z-[70] w-14 h-14 rounded-full bg-brand text-white shadow-lift flex items-center justify-center hover:bg-brand-dark transition-colors"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-5 z-[70] w-[min(100vw-1.5rem,22rem)] h-[min(70vh,32rem)] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden"
          role="dialog"
          aria-label="Rising Star school chatbot"
        >
          <div className="bg-ink text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-heading font-bold text-sm">
              AI
            </div>
            <div className="min-w-0">
              <p className="font-heading font-semibold text-sm leading-tight">School Assistant</p>
              <p className="text-white/55 text-[11px]">Answers from official school data only</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-paper/60">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-brand text-white rounded-br-md"
                      : "bg-white text-ink border border-neutral-200 rounded-bl-md shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-200 rounded-2xl rounded-bl-md px-4 py-3 text-sm text-ink/50">
                  Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  disabled={loading}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-brand/25 text-brand bg-brand/5 hover:bg-brand/10 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit} className="p-3 border-t border-neutral-100 flex gap-2 bg-white">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our school…"
              maxLength={1000}
              disabled={loading}
              className="flex-1 rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/30"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary !px-3 !py-2.5 disabled:opacity-50"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
