import React, { useState } from "react";
import "./Contact.css";

const API_URL = "http://127.0.0.1:5000";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const whatsappNumber = "256770343407";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSending(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.service,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to send your message."
        );
      }

      setSuccessMessage(
        "Thank you! Your message has been received. We will get back to you shortly."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch (error) {
      console.error("CONTACT FORM ERROR:", error);

      setErrorMessage(
        "We could not send your message right now. Please try WhatsApp or call us directly."
      );
    } finally {
      setSending(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      "Hello Horizon Software Company Ltd, I would like to inquire about your services."
    );

    window.open(
      `https://wa.me/${whatsappNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="contact-page">

      {/* HERO */}

      <section className="contact-hero">

        <span className="contact-tag">
          Contact Us
        </span>

        <h1>
          Connect with Horizon.
        </h1>

        <p>
          We'd love to hear about your ideas. Whether you need a website,
          mobile application, business system, branding or custom software,
          Horizon Software Company Ltd is ready to help.
        </p>

      </section>


      {/* CONTACT CARDS */}

      <section className="contact-cards">

        <div className="contact-card">

          <div className="contact-icon">
            📞
          </div>

          <h3>
            Call Us
          </h3>

          <p>
            +256 795255211
          </p>
          <p>+256 707451174</p>

        </div>


        <div
          className="contact-card whatsapp-card"
          onClick={openWhatsApp}
          role="button"
          tabIndex="0"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              openWhatsApp();
            }
          }}
        >

          <div className="contact-icon">
            💬
          </div>

          <h3>
            WhatsApp
          </h3>

          <p>
            +256 770343407
          </p>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openWhatsApp();
            }}
          >
            Chat With Us
          </button>

        </div>


        <div className="contact-card">

          <div className="contact-icon">
            ✉️
          </div>

          <h3>
            Email
          </h3>

          <p>
            patriciakarekyezi@gmail.com
          </p>

        </div>


        <div className="contact-card">

          <div className="contact-icon">
            📍
          </div>

          <h3>
            Location
          </h3>

          <p>
            Nalubega Complex, Room L32
          </p>

          <p>
            Kampala rd, opp Watoto church
          </p>

          <p>
            Kampala, Uganda.
          </p>

        </div>

      </section>


      {/* CONTACT SECTION */}

      <section className="contact-section">

        <div className="contact-form">

          <h2>
            Send Us A Message
          </h2>

          {successMessage && (
            <div className="contact-success">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="contact-error">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
            />

            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Service
              </option>

              <option value="Website Development">
                Website Development
              </option>

              <option value="Mobile App Development">
                Mobile App Development
              </option>

              <option value="Custom Software">
                Custom Software
              </option>

              <option value="UI / UX Design">
                UI / UX Design
              </option>

              <option value="SaaS Solutions">
                SaaS Solutions
              </option>

              <option value="Graphic Design">
                Graphic Design
              </option>

            </select>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              placeholder="Tell us about your project..."
              required
            ></textarea>

            <button
              type="submit"
              disabled={sending}
            >
              {sending ? "Sending..." : "Send Message"}
            </button>

          </form>

        </div>


        <div className="office-info">

          <h2>
            Why Work With Horizon?
          </h2>

          <p>
            We don't just build software. We create digital experiences
            that help businesses grow.
          </p>

          <div className="info-box">

            <h3>
              Business Hours
            </h3>

            <p>
              Monday - Friday
            </p>

            <p>
              9:00 AM - 5:00 PM
            </p>

          </div>


          <div className="info-box">

            <h3>
              Average Response
            </h3>

            <p>
              We respond to inquiries within 24 hours.
            </p>

          </div>


          <div className="info-box">

            <h3>
              Services
            </h3>

            <ul>

              <li>
                ✔ Software Development
              </li>

              <li>
                ✔ Website Development
              </li>

              <li>
                ✔ Mobile Applications
              </li>

              <li>
                ✔ UI / UX Design
              </li>

              <li>
                ✔ Graphic Design
              </li>

            </ul>

          </div>

        </div>

      </section>


      {/* MAP */}

      <section className="map-section">

        <h2>
          Find Us
        </h2>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3989.756446051404!2d32.57170032396607!3d0.319092614023819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1snalubega%20complex%20Bombo%20Rd%20opp%20watoto%20church!5e0!3m2!1sen!2sug!4v1785398492941!5m2!1sen!2sug"
          width="100%"
          height="450"
          style={{
            border: 0,
            borderRadius: "20px",
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Horizon Software Company Location"
        ></iframe>

      </section>


      {/* FAQ */}

      <section className="faq-section">

        <h2>
          Frequently Asked Questions
        </h2>

        <div className="faq-item">

          <h3>
            How long does a project take?
          </h3>

          <p>
            Timelines depend on the project size, but we always provide
            clear schedules before work begins.
          </p>

        </div>

        <div className="faq-item">

          <h3>
            Do you build mobile applications?
          </h3>

          <p>
            Yes. We develop modern Android and cross-platform mobile apps.
          </p>

        </div>

        <div className="faq-item">

          <h3>
            Do you redesign existing websites?
          </h3>

          <p>
            Absolutely. We modernize old websites with improved design,
            speed and functionality.
          </p>

        </div>

        <div className="faq-item">

          <h3>
            Do you provide support?
          </h3>

          <p>
            Yes. We offer maintenance and technical support after project
            delivery.
          </p>

        </div>

      </section>


      {/* FOOTER CTA */}

      <section className="contact-bottom">

        <h2>
          Your Next Software Project Starts With A Conversation.
        </h2>

      </section>

    </div>
  );
}

export default Contact;