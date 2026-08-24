import React from "react";
import { Link } from "react-router-dom";
import logowhite from "../assets/logowhite.png";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">


        {/* COMPANY */}
        <div className="footer-column company">

          <img 
            src={logowhite}
            alt="Horizon Software Company"
            className="footer-logo"
          />

          <p>
            Horizon Software Company Ltd delivers modern digital solutions
            including software development, web applications, mobile apps,
            and creative technology solutions.
          </p>

        </div>



        {/* QUICK LINKS */}
        <div className="footer-column">

          <h3>
            Quick Links
          </h3>

          <ul>

            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/about">About Us</Link>
            </li>

            <li>
              <Link to="/services">Services</Link>
            </li>

            <li>
              <Link to="/portfolio">Portfolio</Link>
            </li>

            <li>
              <Link to="/contact">Contact</Link>
            </li>

          </ul>

        </div>




        {/* SERVICES */}
        <div className="footer-column">

          <h3>
            Services
          </h3>

          <ul>

            <li>Web Development</li>
            <li>Mobile Applications</li>
            <li>Custom Software</li>
            <li>UI/UX Design</li>
            <li>Graphic Design</li>

          </ul>

        </div>




        {/* CONTACT */}
        <div className="footer-column">

          <h3>
            Contact Us
          </h3>


          <p>
            📞+256 795255211 / +256 707451174
          </p>

          <p>
            💬 WhatsApp:+256 770343407
          </p>

          <p>
            ✉patriciakarekyezi@gmail.com
          </p>

          <p>
            📍 Kampala, Uganda
          </p>


        </div>


      </div>



      {/* BOTTOM BAR */}

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Horizon Software Company Ltd. All Rights Reserved.
        </p>

      </div>


    </footer>
  );
}

export default Footer;