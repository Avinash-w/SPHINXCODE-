import "../index.css";

export default function CosmicCards() {
  const cards = [
    {
      title: "FROM SPIRIT",
      text: "The journey begins at the source — a pulse of primordial energy forming in the vast cosmic sea. Swirling particles gather, drifting like living stardust around a glowing core.",
      img: "/assets/img_1.png",
    },
    {
      title: "DESCENT",
      text: "The energy falls inward, slipping through layers of shifting light, nebula fog, and spiraling particles. Colors stretch, shapes distort, and the tunnel pulls you closer to its unseen core.",
      img: "/assets/img_1.png",
    },
    {
      title: "BECOMING HUMAN",
      text: "The swirling cosmic energy begins to take form. Light condenses into structure — shifting patterns, flowing geometry, and faint outlines emerging from the luminous haze.",
      img: "/assets/img_1.png",
    },
  ];

  return (
    <section className="cosmic-card-section">
      <div className="cosmic-cards">
        {cards.map((card, index) => (
          <div className="cosmic-card" key={index}>
            <div
              className="card-front"
              style={{ backgroundImage: `url(${card.img})` }}
            ></div>
            <div className="card-back">
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
