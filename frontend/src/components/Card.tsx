import WorkshopButton from "./WorkshopButton";

type CardProps = {
  heading?: string;
  body?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  busy?: boolean;
};

export default function Card({
  heading = "Heading Text",
  body,
  buttonText = "Text",
  onButtonClick,
  busy = false,
}: CardProps) {
  return (
    <article className="workshop-card" data-name="card" data-node-id="1:10">
      <div className="workshop-card__content" data-node-id="1:11">
        <h1 data-node-id="1:12">{heading}</h1>
        <div className="workshop-card__output" aria-live="polite">
          {body && <p data-node-id="1:13">{body}</p>}
        </div>
        <WorkshopButton
          text={buttonText}
          onClick={onButtonClick}
          disabled={busy}
        />
      </div>
    </article>
  );
}
