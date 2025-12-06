import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Testimonials from "./Testimonials";
import CardsSection from "./CardsSection";
import Green from "../Green";

gsap.registerPlugin(ScrollTrigger);

export default function Sections() {
useEffect(() => {
  requestAnimationFrame(() => {
    const sections = document.querySelectorAll(".section");

    sections.forEach((sec) => {
      const elements = sec.querySelectorAll("h1, h2, p, img, button");

      // Entrance Animation
      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 60,
          scale: 0.95,
          filter: "blur(6px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sec,
            start: "top 80%",
            end: "top 30%",
            scrub: false,
          },
        }
      );

      gsap.to(sec, {
        backgroundPositionY: "40%",
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          scrub: 1.5,
        },
      });
    });



   
  });
}, []);



  return (
    <>
    <div className="sections-wrapper" id="sec5" >

      <section id="welcome" className="section">
        <h1 className="h1">
          WELCOME TO <span className="gold">SPHINX CODE</span>
        </h1>
        <p className="lead">
          The Sphinx Code is a new personality wisdom system with an algorithm
          that changes the game in self-development, personal empowerment, and
          self-understanding. Using your birth information, the Sphinx Code
          generates an Archetypal Blueprint of your personal subconscious
          archetypes that govern different aspects of your life.
        </p>
        <p className="lead">
          Through this map, you gain clearer understanding of your function,
          your behaviors, beliefs, and traits that swing from positive to
          negative attributes.
        </p>
      </section>
      
      <section id="oracles" className="section">
        <h2 className="h1">THE SPHINX CODE ORACLES</h2>
        <p className="lead">
          Become a Wisdom Keeper. Learn how to read the Archetypal Blueprint and
          give readings to your clients.
        </p>
        <img
          src="public/assets/image.png"
          alt="Sphinx Oracles"
          style={{ maxWidth: "50%", marginTop: "2rem" }}
        />
        <p className="lead gold" style={{ marginTop: "1rem" }}>
          GET CERTIFIED
        </p>
      </section>

      <section id="archetypes" className="section" style={{ position: "relative", zIndex: 999 }}>
  <h2 className="h1 gold">THE ARCHETYPES</h2>

  <p className="lead">
    A map of 16 archetypal subconscious patterns that define your psyche.
  </p>

  <div className="card-grid">
    {[
      {
        title: "Archetypal Blueprint",
        paragraph: "Get your Free Blueprint and discover your Archetypal subconscious structure that is your psyche.",
        img: "/assets/img_1.png"
      },
      {
        title: "Global Transits",
        paragraph: "Follow each day’s archetypal flow, and align your special events with proper archetypal influence.",
        img: "/assets/img_2.png"
      },
      {
        title: "Get A Reading",
        paragraph: "A Wisdom Keeper reading provides greater depth to understand your Archetypal Blueprint, and master yourself.",
        img: "/assets/img_3.png"
      }
    ].map((card, index) => (
      <div className="card3d" key={index}>
        <div className="card-inner">
          <img src={card.img} alt={card.title} style={{height:"220px"}} />
          <h3 className="gold">{card.title}</h3>
          <p className="card-desc">{card.paragraph}</p>
        </div>
      </div>
    ))}
  </div>
      </section>
      


      {/* <section id="testimonials" className="section"> */}
        <Testimonials/>
      {/* </section> */}

      {/* <section id="readings" className="section">
        <h2 className="h1">GET SPHINX SCROLLS</h2>
        <p className="lead">
          Sign up for our free newsletter and unlock your archetypal blueprint.
        </p>

        <button
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            border: "2px solid var(--gold)",
            background: "transparent",
            color: "var(--gold)",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          JOIN NEWSLETTER
        </button>
      </section> */}

      <Green/>
      </div>



      
    </>
  );
}

const sectionStyle = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  alignItems: "left",
  textAlign: "left",
  padding: "8rem",
  color: "white",
  fontFamily: "'Poppins', sans-serif",
  textShadow: "0 0 20px rgba(0,0,0,0.25)",
};

const h1Style = {
  fontSize: "clamp(42px, 6vw, 92px)",
  fontWeight: 300,
  letterSpacing: "0.12em",
  margin: 0,
  color: "#ffffff",
};

const pStyle = {
  marginTop: 18,
  maxWidth: 900,
  opacity: 0.92,
  fontSize: "clamp(15px, 1.15vw, 20px)",
  lineHeight: 1.6,
  color: "rgba(255,255,255,0.92)",
};