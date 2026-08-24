import React from "react";
import "./Portfolio.css";

import reagGraceImage from "../assets/reg1.jpg";
import horizonImage from "../assets/hori.jpg";

import logoImage from "../assets/logoo.jpg";
import businessCardImage from "../assets/card.jpg";
import pearlImage from "../assets/pearl.jpg";
import witiImage from "../assets/witi.png";

function Portfolio() {
  return (
    <div className="portfolio-page">

      {/* HERO SECTION */}

      <section className="portfolio-hero">

        <span className="portfolio-tag">
          Our Portfolio
        </span>

        <h1>
          Turning Ideas Into Digital Success
        </h1>

        <p>
          Every project represents our passion for innovation, quality,
          creativity, and delivering technology solutions that create value.
        </p>

      </section>


      {/* FEATURED PROJECTS */}

      <section className="featured-projects">

        <h2>Featured Projects</h2>

        <div className="projects-grid">

          {/* REAG'S GRACE */}

          <div className="project-card">

            <img
              src={reagGraceImage}
              alt="Reag's Grace Tours & Travel website"
            />

            <div className="project-content">

              <h3>
                Reag's Grace Tours & Travel
              </h3>

              <p>
                A professional tours and travel company website featuring
                tour packages, destination information, inquiry forms,
                and a modern responsive design.
              </p>

              <div className="tech-stack">
                <span>HTML</span>
                <span>CSS</span>
                <span>JavaScript</span>
                <span>Responsive</span>
              </div>

              <a
                href="https://reagsgracetours.com/"
                target="_blank"
                rel="noreferrer"
                className="visit-link"
              >
                Visit Website →
              </a>

            </div>

          </div>


          {/* HORIZON */}

          <div className="project-card">

            <img
              src={horizonImage}
              alt="Horizon Software Company Ltd website"
            />

            <div className="project-content">

              <h3>
                Horizon Software Company Ltd
              </h3>

              <p>
                Our official company website currently under development,
                showcasing our services, portfolio, and software development
                capabilities.
              </p>

              <div className="tech-stack">
                <span>React</span>
                <span>CSS</span>
                <span>Flask</span>
                <span>In Progress</span>
              </div>

              <p className="coming-soon">
                Currently Under Development
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* GRAPHIC DESIGN */}

      <section className="graphics-section">

        <h2>
          Graphic Design Portfolio
        </h2>

        <p>
          We also create professional branding and marketing materials that
          help businesses establish a strong visual identity.
        </p>

        <div className="graphics-grid">

          {/* COMPANY LOGO */}

          <div className="graphic-card">

            <img
              src={logoImage}
              alt="Company Logo"
            />

            <h3>
              Company Logo
            </h3>

          </div>


          {/* BUSINESS CARD */}

          <div className="graphic-card">

            <img
              src={businessCardImage}
              alt="Business Card"
            />

            <h3>
              Business Card
            </h3>

          </div>


          {/* PEARL ROAST */}

          <div className="graphic-card">

            <img
              src={pearlImage}
              alt="Pearl Roast Coffee Flyer"
            />

            <h3>
              Pearl Roast Coffee Flyer
            </h3>

          </div>


          {/* WITI */}

          <div className="graphic-card">

            <img
              src={witiImage}
              alt="WITI Design Project"
            />

            <h3>
              WITI Design Project
            </h3>

          </div>

        </div>

      </section>


      {/* TECHNOLOGIES */}

      <section className="technology-section">

        <h2>
          Technologies We Use
        </h2>

        <p className="tech-intro">
          We use modern technologies and professional tools to create reliable,
          scalable and user-friendly digital solutions.
        </p>


        <div className="tech-category">

          <h3>
            Frontend Development
          </h3>

          <div className="technology-grid">
            <span>React</span>
            <span>HTML5</span>
            <span>CSS3</span>
            <span>JavaScript</span>
            <span>Bootstrap</span>
          </div>

        </div>


        <div className="tech-category">

          <h3>
            Backend Development
          </h3>

          <div className="technology-grid">
            <span>Python</span>
            <span>Flask</span>
            <span>Laravel</span>
            <span>Firebase</span>
          </div>

        </div>


        <div className="tech-category">

          <h3>
            Database & Cloud
          </h3>

          <div className="technology-grid">
            <span>Firebase Database</span>
            <span>MySQL</span>
          </div>

        </div>


        <div className="tech-category">

          <h3>
            Design & Development Tools
          </h3>

          <div className="technology-grid">
            <span>Git</span>
            <span>GitHub</span>
            <span>Figma</span>
            <span>Canva</span>
            <span>Adobe Photoshop</span>
            <span>Adobe Illustrator</span>
            <span>VS Code</span>
          </div>

        </div>

      </section>


      {/* DEVELOPMENT PROCESS */}

      <section className="process-section">

        <h2>
          Our Software Development Process
        </h2>

        <div className="process-grid">

          <div className="process-card">

            <div className="process-number">
              01
            </div>

            <h3>
              Planning
            </h3>

            <p>
              Understanding project goals, objectives and creating a clear roadmap.
            </p>

          </div>


          <div className="process-arrow">
            →
          </div>


          <div className="process-card">

            <div className="process-number">
              02
            </div>

            <h3>
              Requirements Analysis
            </h3>

            <p>
              Gathering and analyzing client needs and system requirements.
            </p>

          </div>


          <div className="process-arrow">
            →
          </div>


          <div className="process-card">

            <div className="process-number">
              03
            </div>

            <h3>
              System Design
            </h3>

            <p>
              Designing system structure, UI/UX and user experiences.
            </p>

          </div>


          <div className="process-arrow">
            →
          </div>


          <div className="process-card">

            <div className="process-number">
              04
            </div>

            <h3>
              Development
            </h3>

            <p>
              Building secure and functional software solutions.
            </p>

          </div>


          <div className="process-arrow">
            →
          </div>


          <div className="process-card">

            <div className="process-number">
              05
            </div>

            <h3>
              Testing
            </h3>

            <p>
              Checking quality, performance and fixing possible issues.
            </p>

          </div>


          <div className="process-arrow">
            →
          </div>


          <div className="process-card">

            <div className="process-number">
              06
            </div>

            <h3>
              Deployment
            </h3>

            <p>
              Launching the completed solution for users.
            </p>

          </div>


          <div className="process-arrow">
            →
          </div>


          <div className="process-card">

            <div className="process-number">
              07
            </div>

            <h3>
              Maintenance
            </h3>

            <p>
              Continuous updates, improvements and technical support.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Portfolio;