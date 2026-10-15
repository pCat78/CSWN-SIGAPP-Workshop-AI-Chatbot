import { useEffect, useRef } from "react";
import ChatMessage, { type ChatMessageData } from "./ChatMessage";

type ChatThreadProps = {
  messages: ChatMessageData[];
  // Shown as a trailing "..." bubble while waiting on the backend.
  pending?: boolean;
};

export default function ChatThread({ messages, pending = false }: ChatThreadProps) {
  // Keep the newest message in view instead of making the user scroll down.
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, pending]);

  return (
    <div className="chat-thread" aria-live="polite">
      {messages.length === 0 && !pending && (
        <p className="chat-thread__empty">Type in the search bar below and press Enter.</p>
      )}
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
      {pending && (
        <div className="bubble bubble--assistant bubble--pending">
          <p>Working on it…</p>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
