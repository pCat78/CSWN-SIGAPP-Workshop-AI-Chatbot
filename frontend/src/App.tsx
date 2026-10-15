import { useState } from "react";
import SearchBar from "./components/SearchBar";
import Card from "./components/Card";

type View =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "chat"; reply: string }
  | { kind: "error"; message: string };

export default function App() {
  const [view, setView] = useState<View>({ kind: "idle" });
  // Same idea as previous_response_id in the Python script: keeps context.
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(null);
  const busy = view.kind === "loading";

  async function ask(message: string) {
    if (busy) return;
    setView({ kind: "loading" });
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, previous_response_id: previousResponseId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Request failed.");
      setPreviousResponseId(data.response_id);
      setView({ kind: "chat", reply: data.reply });
    } catch (err) {
      setView({ kind: "error", message: (err as Error).message });
    }
  }

  function newChat() {
    setPreviousResponseId(null);
    setView({ kind: "idle" });
  }

  let heading = "Ask a question";
  let body: string | undefined = "Type in the search bar above and press Enter.";

  if (view.kind === "loading") {
    heading = "One moment";
    body = "Working on it…";
  } else if (view.kind === "chat") {
    heading = "Chatbot reply";
    body = view.reply;
  } else if (view.kind === "error") {
    heading = "Something went wrong";
    body = view.message;
  }

  return (
    <main className="page">
      <div className="stack">
        <SearchBar onSubmit={ask} disabled={busy} />
        <Card
          heading={heading}
          body={body}
          buttonText="New chat"
          onButtonClick={newChat}
          busy={busy}
        />
      </div>
    </main>
  );
}
