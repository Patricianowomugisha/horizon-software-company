import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Services.css";

const API_URL = "http://127.0.0.1:5000";

function Services() {

  // =====================================================
  // ORIGINAL HORIZON SERVICES
  // =====================================================

  const defaultServices = [
    {
      id: "default-1",
      name: "Website Development",
      description:
        "Professional business websites, company profiles, e-commerce platforms, booking systems, and custom web applications.",
      image: "",
      is_active: true,
    },
    {
      id: "default-2",
      name: "Mobile App Development",
      description:
        "Android and cross-platform mobile applications built with modern technologies for startups, businesses, and organizations.",
      image: "",
      is_active: true,
    },
    {
      id: "default-3",
      name: "Custom Software",
      description:
        "Tailor-made software solutions designed around your business processes and operational needs.",
      image: "",
      is_active: true,
    },
    {
      id: "default-4",
      name: "UI / UX Design",
      description:
        "Beautiful, user-friendly interfaces designed to give users the best possible digital experience.",
      image: "",
      is_active: true,
    },
    {
      id: "default-5",
      name: "SaaS Solutions",
      description:
        "Cloud-based software platforms that help businesses automate, manage, and scale their operations.",
      image: "",
      is_active: true,
    },
    {
      id: "default-6",
      name: "Graphic Design",
      description:
        "Professional branding materials including logos, company profiles, flyers, business cards, and digital graphics.",
      image: "",
      is_active: true,
    },
  ];

  // =====================================================
  // STATE
  // =====================================================

  const [services, setServices] =
    useState(defaultServices);

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // LOAD DATABASE SERVICES
  // =====================================================

  useEffect(() => {

    const fetchServices = async () => {

      try {

        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/services`
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load services."
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid services data."
          );
        }

        // -------------------------------------------------
        // Only use active services from dashboard
        // -------------------------------------------------

        const activeDatabaseServices =
          data.filter(
            (service) =>
              service.is_active !== false
          );

        // -------------------------------------------------
        // Start with the six original services
        // -------------------------------------------------

        const combinedServices = [
          ...defaultServices
        ];

        // -------------------------------------------------
        // Add dashboard services
        //
        // If the dashboard service has the same name
        // as one of the default services, replace the
        // default service with the database version.
        // -------------------------------------------------

        activeDatabaseServices.forEach(
          (databaseService) => {

            const databaseName =
              (
                databaseService.name || ""
              )
                .trim()
                .toLowerCase();

            const existingIndex =
              combinedServices.findIndex(
                (defaultService) =>
                  (
                    defaultService.name || ""
                  )
                    .trim()
                    .toLowerCase() ===
                  databaseName
              );

            if (existingIndex !== -1) {

              combinedServices[
                existingIndex
              ] = databaseService;

            } else {

              combinedServices.push(
                databaseService
              );

            }

          }
        );

        setServices(
          combinedServices
        );

      } catch (error) {

        console.error(
          "SERVICES FETCH ERROR:",
          error
        );

        // Keep the six original services
        // if the backend cannot be reached.
        setServices(
          defaultServices
        );

      } finally {

        setLoading(false);

      }

    };

    fetchServices();

  }, []);

  // =====================================================
  // SERVICE ICON
  // =====================================================

  const getServiceIcon = (
    service,
    index
  ) => {

    const name = (
      service.name || ""
    ).toLowerCase();

    if (
      name.includes("website") ||
      name.includes("web")
    ) {
      return "💻";
    }

    if (
      name.includes("mobile") ||
      name.includes("app")
    ) {
      return "📱";
    }

    if (
      name.includes("software") ||
      name.includes("custom")
    ) {
      return "⚙️";
    }

    if (
      name.includes("ui") ||
      name.includes("ux")
    ) {
      return "🎨";
    }

    if (
      name.includes("saas") ||
      name.includes("cloud")
    ) {
      return "☁️";
    }

    if (
      name.includes("graphic") ||
      name.includes("design")
    ) {
      return "🎨";
    }

    const icons = [
      "💻",
      "📱",
      "⚙️",
      "🎨",
      "☁️",
      "✨",
    ];

    return icons[
      index % icons.length
    ];

  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="services-page">

      {/* =================================================
          HERO
         ================================================= */}

      <section className="services-hero">

        <span className="services-tag">
          Our Services
        </span>

        <h1>
          Digital Solutions Built For Your Business
        </h1>

        <p>
          At Horizon Software Company Ltd, we
          provide innovative technology solutions
          that help businesses improve efficiency,
          strengthen their digital presence, and
          accelerate growth.
        </p>

      </section>


      {/* =================================================
          SERVICES
         ================================================= */}

      <section className="services-grid">

        {loading ? (

          <div className="services-message">

            <h2>
              Loading our services...
            </h2>

            <p>
              Please wait a moment.
            </p>

          </div>

        ) : (

          services.map(
            (service, index) => (

              <div
                className="service-card"
                key={
                  service.id ||
                  `service-${index}`
                }
              >

                <div className="service-icon">

                  {getServiceIcon(
                    service,
                    index
                  )}

                </div>

                <h2>
                  {service.name ||
                    "Digital Solution"}
                </h2>

                <p>
                  {service.description ||
                    "Professional technology solutions designed to help your business grow."}
                </p>

              </div>

            )
          )

        )}

      </section>


      {/* =================================================
          WHY CHOOSE HORIZON
         ================================================= */}

      <section className="why-us">

        <div className="why-left">

          <span>
            Why Choose Horizon
          </span>

          <h2>
            Technology That Works For You
          </h2>

          <p>
            We combine creativity, innovation,
            and technical expertise to deliver
            reliable digital solutions that help
            businesses succeed.
          </p>

        </div>


        <div className="why-right">

          <div className="feature-card">

            <h3>
              ✔ Quality First
            </h3>

            <p>
              Every project is built with
              attention to detail.
            </p>

          </div>


          <div className="feature-card">

            <h3>
              ✔ Modern Technology
            </h3>

            <p>
              We use current technologies and
              industry best practices.
            </p>

          </div>


          <div className="feature-card">

            <h3>
              ✔ Reliable Support
            </h3>

            <p>
              We support our clients even after
              project completion.
            </p>

          </div>


          <div className="feature-card">

            <h3>
              ✔ Customer Focused
            </h3>

            <p>
              Your goals become our development
              priorities.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          CTA
         ================================================= */}

      <section className="services-cta">

        <h2>
          Ready To Start Your Project?
        </h2>

        <p>
          Let's build a modern digital solution
          that moves your business forward.
        </p>

        <Link
          to="/contact"
          className="services-btn"
        >
          Request a Quote
        </Link>

      </section>

    </div>
  );
}

export default Services;