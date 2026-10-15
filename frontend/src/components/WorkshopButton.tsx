import { useState } from "react";

type WorkshopButtonState = "Default" | "Hover" | "Click";

type WorkshopButtonProps = {
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function WorkshopButton({
  text = "Text",
  onClick,
  disabled = false,
}: WorkshopButtonProps) {
  const [state, setState] = useState<WorkshopButtonState>("Default");
  const isPressed = state === "Click";

  return (
    <button
      className={`workshop-button workshop-button--${state.toLowerCase()}`}
      data-node-id={isPressed ? "1:8" : state === "Hover" ? "1:6" : "1:4"}
      disabled={disabled}
      onBlur={() => setState("Default")}
      onClick={onClick}
      onPointerCancel={() => setState("Default")}
      onPointerDown={() => setState("Click")}
      onPointerEnter={() => setState("Hover")}
      onPointerLeave={() => setState("Default")}
      onPointerUp={() => setState("Default")}
      type="button"
    >
      <span data-node-id="1:5">{text}</span>
    </button>
  );
}
