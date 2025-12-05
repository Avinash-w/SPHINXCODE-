import { useState } from "react";
import "../index.css";

export default function Navbar() {
  const [active, setActive] = useState("Home");

  const menu = [
    "Home",
    "About",
    "Courses",
    "Workshops",
    "News",
    "Podcasts",
    "Shop",
    "My Account",
  ];

  return (
    <div>
        <div className="top-navbar">
      <div className="top-left">SPIRITUAL CONSCIOUSNESS ELEVATION</div>

      <div className="top-center">
        <button className="top-btn">BOOK A SESSION</button>
      </div>

      <div className="top-right">
        <a href="#" className="login-link">Membership Login</a>
      </div>
    </div>
    <nav className="nav-glass fade-in">
      <div className="nav-logo">
        <span>SPIRITUAL</span>
      </div>

      <ul className="nav-links">
        {menu.map((item) => (
          <li key={item}>
            <button
              className={active === item ? "link active" : "link"}
              onClick={() => setActive(item)}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </nav>
    </div>
  );
}
