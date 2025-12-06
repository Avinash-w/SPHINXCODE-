import "../index.css";

export default function HeroBanner() {
  return (
    <section className="hero-section">
      {/* Background Video */}
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src="/banner.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="hero-overlay" id="sec0">
        <h1 className="hero-title">Awaken Your Inner Consciousness</h1>
        <p className="hero-subtitle">
          Experience Spiritual Alignment, Healing & Universal Energy
        </p>

        <div className="hero-buttons">
          <button className="hero-btn">Book a Healing Session</button>
          <button className="hero-btn">Explore Courses</button>
          <button className="hero-btn">Join Membership</button>
        </div>
      </div>
    </section>
  );
}
