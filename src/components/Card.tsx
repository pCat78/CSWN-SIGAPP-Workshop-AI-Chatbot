import WorkshopButton from "./WorkshopButton";

export default function Card() {
  return (
    <article className="workshop-card" data-name="card" data-node-id="1:10">
      <div className="workshop-card__content" data-node-id="1:11">
        <h1 data-node-id="1:12">Heading Text</h1>
        <p data-node-id="1:13">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
          scelerisque urna a vestibulum ultricies. Nam aliquam fringilla risus,
          at rutrum dui vulputate sed. 
        </p>
        <WorkshopButton />
      </div>
    </article>
  );
}
