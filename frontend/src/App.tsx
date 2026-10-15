import { useState } from "react";
import SearchBar from "./components/SearchBar";
import ChatThread from "./components/ChatThread";
import WorkshopButton from "./components/WorkshopButton";
import type { ChatMessageData } from "./components/ChatMessage";

export default function App() {
  // The full back-and-forth, in order, so the UI can show a real thread
  // instead of just the latest reply. This resets on page refresh.
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [busy, setBusy] = useState(false);
  // Same idea as previous_response_id in the Python script: keeps context.
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(null);

  async function ask(message: string) {
    if (busy) return;
    setBusy(true);
    setMessages((prev) => [...prev, { role: "user", text: message }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, previous_response_id: previousResponseId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Request failed.");
      setPreviousResponseId(data.response_id);
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "error", text: (err as Error).message }]);
    } finally {
      setBusy(false);
    }
  }

  function newChat() {
    setPreviousResponseId(null);
    setMessages([]);
  }

  return (
    <main className="page">
      <div className="stack">
        <ChatThread messages={messages} pending={busy} />
        <SearchBar onSubmit={ask} disabled={busy} />
        <WorkshopButton text="New chat" onClick={newChat} disabled={busy} />
      </div>
    </main>
  );
}
