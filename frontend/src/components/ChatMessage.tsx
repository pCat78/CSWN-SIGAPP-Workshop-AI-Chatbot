// A single entry in the conversation: one user question, one assistant
// reply, or an error. The `role` picks which bubble style to use (see
// the .bubble--* rules in App.css).
export type ChatMessageData = {
  role: "user" | "assistant" | "error";
  text: string;
};

type ChatMessageProps = {
  message: ChatMessageData;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`bubble bubble--${message.role}`}>
      <p>{message.text}</p>
    </div>
  );
}
