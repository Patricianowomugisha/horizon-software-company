import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AboutUs.css";
import pasha from "../assets/pasha.jpg";

const API_URL = "http://127.0.0.1:5000";

function AboutUs() {
  const [content, setContent] = useState({
    about_title: "Technology Within Reach",

    about_description_1:
      "Building Horizon Software Company Ltd has always been about more than creating software—it has been about creating solutions that make a real difference. I founded this company with a vision of making technology practical, innovative, and accessible, helping businesses solve challenges, improve efficiency, and achieve sustainable growth.",

    about_description_2:
      "At Horizon Software Company Ltd, we believe every project is an opportunity to transform ideas into meaningful digital solutions. We combine creativity, technical expertise, and modern technologies to build websites, mobile applications, custom software, SaaS solutions, and digital experiences that deliver lasting value.",

    about_description_3:
      "We are committed to building lasting partnerships founded on trust, quality, and innovation. By understanding our clients' goals and working closely with them throughout every stage of development, we create solutions that not only meet today's needs but also support tomorrow's growth. Our mission is simple: to build technology that moves businesses forward.",

    mission:
      "To deliver innovative, reliable, and affordable technology solutions that empower businesses to grow confidently in the digital world.",

    vision:
      "To become one of Africa's most trusted software companies, recognized for innovation, excellence, and customer satisfaction.",
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/content`
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load website content."
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          return;
        }

        const sections = {};

        data.forEach((item) => {
          if (item.section) {
            sections[item.section] = item;
          }
        });

        setContent((current) => ({
          ...current,

          ...(sections.about_title?.content && {
            about_title:
              sections.about_title.content,
          }),

          ...(sections.about_description_1?.content && {
            about_description_1:
              sections.about_description_1.content,
          }),

          ...(sections.about_description_2?.content && {
            about_description_2:
              sections.about_description_2.content,
          }),

          ...(sections.about_description_3?.content && {
            about_description_3:
              sections.about_description_3.content,
          }),

          ...(sections.mission?.content && {
            mission:
              sections.mission.content,
          }),

          ...(sections.vision?.content && {
            vision:
              sections.vision.content,
          }),
        }));

      } catch (error) {
        console.error(
          "ABOUT CONTENT ERROR:",
          error
        );
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="about-page">

      {/* =================================================
          HERO SECTION
         ================================================= */}

      <section className="about-hero">

        <div className="about-content">

          <span className="about-tag">
            About Horizon
          </span>

          <h1>
            {content.about_title}
          </h1>

          <p>
            {content.about_description_1}
          </p>

          <p>
            {content.about_description_2}
          </p>

          <p>
            {content.about_description_3}
          </p>

        </div>

        <div className="about-image">

          <img
            src={pasha}
            alt="Patricia Nowomugisha - Founder of Horizon Software Company Ltd"
          />

          <div className="founder-info">

            <h3>
              Patricia Nowomugisha
            </h3>

            <p>
              Founder & Lead Engineer.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          MISSION & VISION
         ================================================= */}

      <section className="mission-vision">

        <div className="info-card">

          <div className="card-icon">
            🎯
          </div>

          <h2>
            Our Mission
          </h2>

          <p>
            {content.mission}
          </p>

        </div>


        <div className="info-card">

          <div className="card-icon">
            🌍
          </div>

          <h2>
            Our Vision
          </h2>

          <p>
            {content.vision}
          </p>

        </div>

      </section>


      {/* =================================================
          CORE VALUES
         ================================================= */}

      <section className="values-section">

        <div className="values-title">

          <span>
            Our Foundation
          </span>

          <h2>
            Core Values
          </h2>

          <p>
            These principles define who we are and
            how we serve our clients.
          </p>

        </div>


        <div className="values-grid">

          <div className="value-card">
            <h3>
              Integrity
            </h3>

            <p>
              We are honest, transparent and
              accountable.
            </p>
          </div>


          <div className="value-card">
            <h3>
              Innovation
            </h3>

            <p>
              We embrace creativity and emerging
              technologies.
            </p>
          </div>


          <div className="value-card">
            <h3>
              Customer Service
            </h3>

            <p>
              Our clients remain at the heart of
              everything we do.
            </p>
          </div>


          <div className="value-card">
            <h3>
              Simplicity
            </h3>

            <p>
              We build solutions that are elegant
              and easy to use.
            </p>
          </div>


          <div className="value-card">
            <h3>
              Reliability
            </h3>

            <p>
              We deliver dependable products our
              clients can trust.
            </p>
          </div>


          <div className="value-card">
            <h3>
              Continuous Growth
            </h3>

            <p>
              We constantly learn, improve and
              evolve with technology.
            </p>
          </div>

        </div>

      </section>


      {/* =================================================
          CTA
         ================================================= */}

      <section className="about-cta">

        <h2>
          Let's Build Something Amazing Together
        </h2>

        <p>
          Whether you need a website, mobile
          application, or custom software, Horizon
          Software Company Ltd is ready to help your
          business succeed.
        </p>

        <Link
          to="/contact"
          className="about-btn"
        >
          Work With Us
        </Link>

      </section>

    </div>
  );
}

export default AboutUs;