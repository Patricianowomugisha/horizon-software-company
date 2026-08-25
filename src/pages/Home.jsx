import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import heroImage from "../assets/hero.png";

const API_URL = "https://horizon-software-backend.onrender.com";

function Home() {
  const [content, setContent] = useState({
    hero_title:
      "Building Technology That Moves Businesses Forward",

    hero_subtitle:
      "Innovative Digital Solutions",

    hero_description:
      "Horizon Software Company Ltd creates modern software solutions, websites, mobile applications, and digital experiences that help businesses grow in the digital world.",

    services_title:
      "Innovative Solutions For Modern Businesses",

    services_description:
      "We combine creativity, innovation, and technology to deliver digital solutions that help businesses grow and succeed.",

    about_title:
      "Building Digital Solutions With Quality And Innovation",

    about_description:
      "At Horizon Software Company Ltd, we focus on creating reliable, innovative, and user-centered digital solutions. We work closely with businesses to transform ideas into powerful technology solutions.",

    mission: "",
    vision: "",
    about_image: "",
  });

  // =====================================================
  // LOAD WEBSITE CONTENT
  // =====================================================

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

        const loadedContent = {};

        data.forEach((item) => {
          if (item.section) {
            loadedContent[item.section] =
              item.content || "";
          }
        });

        setContent((current) => ({
          ...current,
          ...loadedContent,
        }));

      } catch (error) {
        console.error(
          "HOME CONTENT ERROR:",
          error
        );

        // The original website content remains visible
        // if the backend is unavailable.
      }
    };

    fetchContent();
  }, []);

  // =====================================================
  // FORMAT HERO TITLE
  // =====================================================

  const heroTitleParts =
    content.hero_title.split("\n");

  return (
    <div className="home">

      {/* =================================================
          HERO SECTION
         ================================================= */}

      <section className="hero-section">

        <div className="hero-text">

          <span className="hero-tag">
            {content.hero_subtitle ||
              "Innovative Digital Solutions"}
          </span>


          <h1>
            {heroTitleParts.map(
              (part, index) => (
                <React.Fragment key={index}>
                  {part}

                  {index <
                    heroTitleParts.length - 1 && (
                    <br />
                  )}
                </React.Fragment>
              )
            )}
          </h1>


          <p>
            {content.hero_description ||
              "Horizon Software Company Ltd creates modern software solutions, websites, mobile applications, and digital experiences that help businesses grow in the digital world."}
          </p>


          <div className="hero-actions">

            <Link
              to="/contact"
              className="primary-btn"
            >
              Get a Quote
            </Link>


            <Link
              to="/services"
              className="outline-btn"
            >
              Explore Services
            </Link>

          </div>

        </div>


        <div className="hero-image">

          <img
            src={heroImage}
            alt="Horizon Software Solutions"
          />

        </div>

      </section>


      {/* =================================================
          OUR EXPERTISE
         ================================================= */}

      <section className="services-section">

        <div className="section-title">

          <span>
            Our Expertise
          </span>


          <h2>
            {content.services_title ||
              "Innovative Solutions For Modern Businesses"}
          </h2>


          <p>
            {content.services_description ||
              "We combine creativity, innovation, and technology to deliver digital solutions that help businesses grow and succeed."}
          </p>

        </div>


        <div className="services-grid">

          <div className="service-box">
            <div className="service-icon">
              💻
            </div>

            <h3>
              Web Development
            </h3>
          </div>


          <div className="service-box">
            <div className="service-icon">
              📱
            </div>

            <h3>
              Mobile Applications
            </h3>
          </div>


          <div className="service-box">
            <div className="service-icon">
              ⚙️
            </div>

            <h3>
              Custom Software
            </h3>
          </div>


          <div className="service-box">
            <div className="service-icon">
              ☁️
            </div>

            <h3>
              SaaS Products
            </h3>
          </div>


          <div className="service-box">
            <div className="service-icon">
              🎨
            </div>

            <h3>
              Graphic Design
            </h3>
          </div>


          <div className="service-box">
            <div className="service-icon">
              ✨
            </div>

            <h3>
              UI / UX Design
            </h3>
          </div>

        </div>


        <Link
          to="/services"
          className="primary-btn"
        >
          Explore Our Services
        </Link>

      </section>


      {/* =================================================
          WHY BUSINESSES TRUST US
         ================================================= */}

      <section className="about-section">

        <div className="about-left">

          <span className="section-tag">
            Why Businesses Trust Us
          </span>


          <h2>
            {content.about_title ||
              "Building Digital Solutions With Quality And Innovation"}
          </h2>


          <p>
            {content.about_description ||
              "At Horizon Software Company Ltd, we focus on creating reliable, innovative, and user-centered digital solutions. We work closely with businesses to transform ideas into powerful technology solutions."}
          </p>

        </div>


        <div className="about-right">

          <div className="feature-card">

            <h3>
              ⭐ 100% Commitment
            </h3>

            <p>
              We are committed to delivering
              high-quality solutions with
              professionalism and attention to
              detail.
            </p>

          </div>


          <div className="feature-card">

            <h3>
              💡 24/7 Innovation
            </h3>

            <p>
              We continuously embrace modern
              technologies and creative ideas
              to keep our clients ahead.
            </p>

          </div>


          <div className="feature-card">

            <h3>
              🚀 Modern Technology
            </h3>

            <p>
              We use modern tools and industry
              practices to build secure and
              future-ready solutions.
            </p>

          </div>


          <div className="feature-card">

            <h3>
              🤝 Client Satisfaction
            </h3>

            <p>
              We create lasting partnerships
              by understanding our clients'
              needs and delivering valuable
              solutions.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          CTA
         ================================================= */}

      <section className="cta-section">

        <h2>
          Have A Project In Mind?
        </h2>


        <p>
          Let Horizon Software Company Ltd turn
          your ideas into powerful digital
          solutions.
        </p>


        <Link
          to="/contact"
          className="primary-btn"
        >
          Contact Us
        </Link>

      </section>

    </div>
  );
}

export default Home;
