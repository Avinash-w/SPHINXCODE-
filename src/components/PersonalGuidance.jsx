import "../index.css";

export default function PersonalGuidance() {
  return (
    <section className="personal-guidance-section">
      {/* Main Heading */}
      <h1 className="guidance-main-title">
        PERSONALIZED GUIDANCE IN SPIRIT CONSCIOUSNESS
      </h1>

      <div className="guidance-section">
        {/* Left Text */}
        <div className="guidance-left">
          <h2 className="guidance-subtitle">
            For individual wisdom & EVOLVED LIFE PERFORMANCE
          </h2>
          <p className="guidance-text">
            My Goal is to impact leaders, innovators, teachers, masters, and awakened individuals towards deeper intimate connection with Nature & Spirit consciousness, empowering wisdom inspired action, and elevating individuality, relationships, and life essence. I craft direct experiences with wonder, spirit, and nature that awaken your magic and mystical qualities innate to your life purpose...
            <br />
            Welcome to your elevated self
          </p>
        </div>

        {/* Right Spotify-style Player */}
        <div className="guidance-right spotify-player">
          <h3>Welcome To My Site</h3>

          <div className="spotify-card">
            <div className="spotify-header">
              <img src="/music-cover.jpg" alt="Music Cover" className="spotify-cover" />
              <div className="spotify-info">
                <h4>Intro Audio</h4>
                <p>Spirit Consciousness Guidance</p>
              </div>
            </div>

            <audio controls className="spotify-audio">
              <source src="/intro-audio.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>

            <div className="spotify-buttons">
              <button className="audio-btn">Play Intro</button>
              <button className="audio-btn">Intro Message</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
