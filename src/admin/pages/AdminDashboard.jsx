import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

import logowhite from "../../assets/logowhite.png";

const API_URL = "https://horizon-software-backend.onrender.com";

/* =========================================================
   SIMPLE PROFESSIONAL ICONS
   ========================================================= */

const Icon = ({ type, size = 22 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    message: (
      <svg {...common}>
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 2 1.5-4A7.5 7.5 0 1 1 20 11.5Z" />
        <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" />
      </svg>
    ),

    quote: (
      <svg {...common}>
        <path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),

    services: (
      <svg {...common}>
        <path d="M12 3v18M3 12h18" />
        <circle cx="12" cy="12" r="8.5" />
      </svg>
    ),

    portfolio: (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="m3 16 5-5 4 4 3-3 6 6" />
        <circle cx="8.5" cy="8.5" r="1.2" />
      </svg>
    ),

    clients: (
      <svg {...common}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
        <path d="M16 5.5a3 3 0 0 1 0 5.8M17 14a4.5 4.5 0 0 1 3.5 4.4" />
      </svg>
    ),

    arrow: (
      <svg {...common}>
        <path d="M5 12h13" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    ),

    external: (
      <svg {...common}>
        <path d="M14 5h5v5" />
        <path d="M19 5 11 13" />
        <path d="M18 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
      </svg>
    ),

    plus: (
      <svg {...common}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),

    check: (
      <svg {...common}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    ),

    bolt: (
      <svg {...common}>
        <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />
      </svg>
    ),

    star: (
      <svg {...common}>
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
      </svg>
    ),
  };

  return icons[type] || null;
};


/* =========================================================
   DASHBOARD
   ========================================================= */

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("horizon_admin_token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchDashboardStats = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/dashboard/summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("horizon_admin_token");
          localStorage.removeItem("horizon_admin_user");
          navigate("/admin/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load dashboard statistics."
          );
        }

        setStats(data);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load dashboard information. Make sure the Flask backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner"></div>

        <h3>Loading your dashboard</h3>

        <p>Preparing your Horizon workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="dashboard-error-card">

          <div className="dashboard-error-icon">!</div>

          <span className="dashboard-error-label">
            SYSTEM MESSAGE
          </span>

          <h2>Dashboard unavailable</h2>

          <p>{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="dashboard-retry-button"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  const messages = stats?.messages?.total ?? 0;
  const unreadMessages = stats?.messages?.unread ?? 0;

  const quotes = stats?.quotes?.total ?? 0;
  const pendingQuotes = stats?.quotes?.pending ?? 0;

  const services = stats?.services?.total ?? 0;
  const activeServices = stats?.services?.active ?? 0;

  const projects = stats?.portfolio?.total ?? 0;

  const clients = stats?.clients?.total ?? 0;

  const statCards = [
    {
      title: "Messages",
      value: messages,
      subtitle:
        unreadMessages === 1
          ? "1 unread message"
          : `${unreadMessages} unread messages`,
      icon: "message",
      color: "blue",
      path: "/admin/messages",
    },

    {
      title: "Quote Requests",
      value: quotes,
      subtitle:
        pendingQuotes === 1
          ? "1 request pending"
          : `${pendingQuotes} requests pending`,
      icon: "quote",
      color: "gold",
      path: "/admin/quotes",
    },

    {
      title: "Services",
      value: services,
      subtitle:
        activeServices === 1
          ? "1 active service"
          : `${activeServices} active services`,
      icon: "services",
      color: "violet",
      path: "/admin/services",
    },

    {
      title: "Portfolio",
      value: projects,
      subtitle:
        projects === 1
          ? "1 project published"
          : `${projects} projects published`,
      icon: "portfolio",
      color: "green",
      path: "/admin/portfolio",
    },

    {
      title: "Clients",
      value: clients,
      subtitle:
        clients === 1
          ? "1 client recorded"
          : `${clients} clients recorded`,
      icon: "clients",
      color: "orange",
      path: "/admin/clients",
    },
  ];

  const quickActions = [
    {
      title: "Add New Service",
      description: "Create a service for your website",
      icon: "plus",
      path: "/admin/services",
    },

    {
      title: "Add Portfolio Project",
      description: "Showcase a completed project",
      icon: "portfolio",
      path: "/admin/portfolio",
    },

    {
      title: "Add Client",
      description: "Create a new client record",
      icon: "clients",
      path: "/admin/clients",
    },

    {
      title: "View Messages",
      description: "Check enquiries from visitors",
      icon: "message",
      path: "/admin/messages",
    },
  ];

  return (
    <div className="dashboard-page">

      {/* =====================================================
          WELCOME HERO
          ===================================================== */}

      <section className="dashboard-welcome">

        <div className="dashboard-welcome-grid">

          <div className="dashboard-welcome-content">

            <div className="dashboard-brand-row">

              <div className="dashboard-logo-wrap">
                <img
                  src={logowhite}
                  alt="Horizon Software Company"
                />
              </div>

              <div className="dashboard-brand-text">
                <strong>
                  HORIZON SOFTWARE COMPANY
                </strong>

                <span>
                  Technology within reach
                </span>
              </div>

            </div>


            <div className="dashboard-welcome-copy">

              <div className="dashboard-eyebrow">
                <span></span>
                ADMINISTRATION CENTER
              </div>

              <h1>
                Welcome back,
                <strong> Horizon Admin.</strong>
              </h1>

              <p>
                Your central workspace for managing website
                content, services, projects, clients and
                customer enquiries.
              </p>

            </div>


            <div className="dashboard-welcome-buttons">

              <button
                className="dashboard-primary-button"
                onClick={() =>
                  navigate("/admin/services")
                }
              >
                <span>Manage Website</span>

                <span className="button-icon">
                  <Icon type="arrow" size={16} />
                </span>
              </button>


              <button
                className="dashboard-secondary-button"
                onClick={() =>
                  window.open(
                    "http://localhost:5173/",
                    "_blank"
                  )
                }
              >
                <span>View Live Website</span>

                <span className="button-icon">
                  <Icon type="external" size={16} />
                </span>
              </button>

            </div>

          </div>


          {/* HERO VISUAL */}

          <div className="dashboard-hero-visual">

            <div className="hero-ring hero-ring-one"></div>
            <div className="hero-ring hero-ring-two"></div>
            <div className="hero-ring hero-ring-three"></div>

            <div className="hero-glow"></div>

            <div className="hero-center">

              <div className="hero-center-inner">
                H
              </div>

            </div>

            <div className="hero-floating-card hero-card-top">
              <Icon type="bolt" size={16} />

              <div>
                <strong>System</strong>
                <span>Running smoothly</span>
              </div>
            </div>

            <div className="hero-floating-card hero-card-bottom">
              <Icon type="check" size={16} />

              <div>
                <strong>All systems</strong>
                <span>Operational</span>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          OVERVIEW HEADER
          ===================================================== */}

      <div className="dashboard-section-heading">

        <div>

          <div className="section-eyebrow">
            OVERVIEW
          </div>

          <h2>
            Website Performance
          </h2>

          <p>
            A quick look at what's happening across your website.
          </p>

        </div>


        <div className="dashboard-live-indicator">

          <span className="live-pulse"></span>

          <span>System Online</span>

        </div>

      </div>


      {/* =====================================================
          STATISTICS
          ===================================================== */}

      <section className="dashboard-stat-grid">

        {statCards.map((card) => (

          <button
            key={card.title}
            className={`dashboard-stat-card ${card.color}`}
            onClick={() => navigate(card.path)}
          >

            <div className="stat-card-header">

              <div className="dashboard-stat-icon">
                <Icon type={card.icon} size={20} />
              </div>

              <div className="stat-card-arrow">
                <Icon type="arrow" size={15} />
              </div>

            </div>


            <div className="dashboard-stat-number">
              {card.value}
            </div>


            <div className="dashboard-stat-name">
              {card.title}
            </div>


            <div className="dashboard-stat-description">
              {card.subtitle}
            </div>


            <div className="stat-card-accent"></div>

          </button>

        ))}

      </section>


      {/* =====================================================
          LOWER CONTENT
          ===================================================== */}

      <section className="dashboard-content-grid">


        {/* QUICK ACTIONS */}

        <div className="dashboard-white-panel">

          <div className="dashboard-panel-heading">

            <div>

              <div className="panel-eyebrow">
                MANAGEMENT
              </div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Frequently used administration tools.
              </p>

            </div>

            <div className="dashboard-panel-symbol">
              <Icon type="bolt" size={18} />
            </div>

          </div>


          <div className="dashboard-action-list">

            {quickActions.map((action) => (

              <button
                key={action.title}
                className="dashboard-action-item"
                onClick={() => navigate(action.path)}
              >

                <div className="dashboard-action-icon">
                  <Icon type={action.icon} size={18} />
                </div>


                <div className="dashboard-action-content">

                  <strong>
                    {action.title}
                  </strong>

                  <span>
                    {action.description}
                  </span>

                </div>


                <div className="dashboard-action-arrow">
                  <Icon type="arrow" size={16} />
                </div>

              </button>

            ))}

          </div>

        </div>


        {/* SYSTEM STATUS */}

        <div className="dashboard-white-panel">

          <div className="dashboard-panel-heading">

            <div>

              <div className="panel-eyebrow">
                SYSTEM
              </div>

              <h2>
                Website Status
              </h2>

              <p>
                Current technical environment.
              </p>

            </div>


            <div className="dashboard-status-badge">

              <span></span>

              Online

            </div>

          </div>


          <div className="dashboard-system-list">

            <div className="dashboard-system-item">

              <div className="system-status-icon blue-status">
                <Icon type="bolt" size={15} />
              </div>

              <div className="system-info">

                <span>Frontend</span>

                <strong>
                  React + Vite
                </strong>

              </div>

              <b>
                Active
              </b>

            </div>


            <div className="dashboard-system-item">

              <div className="system-status-icon gold-status">
                <Icon type="services" size={15} />
              </div>

              <div className="system-info">

                <span>Backend</span>

                <strong>
                  Flask REST API
                </strong>

              </div>

              <b>
                Active
              </b>

            </div>


            <div className="dashboard-system-item">

              <div className="system-status-icon violet-status">
                <Icon type="portfolio" size={15} />
              </div>

              <div className="system-info">

                <span>Database</span>

                <strong>
                  SQLite
                </strong>

              </div>

              <b>
                Connected
              </b>

            </div>


            <div className="dashboard-system-item">

              <div className="system-status-icon green-status">
                <Icon type="check" size={15} />
              </div>

              <div className="system-info">

                <span>Authentication</span>

                <strong>
                  JWT Security
                </strong>

              </div>

              <b>
                Protected
              </b>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TIP
          ===================================================== */}

      <section className="dashboard-tip">

        <div className="dashboard-tip-icon">
          <Icon type="star" size={18} />
        </div>


        <div className="dashboard-tip-content">

          <span>
            HORIZON ADMIN TIP
          </span>

          <p>
            Keep your services and portfolio projects
            updated so visitors always see your latest work.
          </p>

        </div>


        <button
          onClick={() =>
            navigate("/admin/portfolio")
          }
        >
          Manage Portfolio

          <Icon type="arrow" size={15} />

        </button>

      </section>

    </div>
  );
}

export default AdminDashboard;
