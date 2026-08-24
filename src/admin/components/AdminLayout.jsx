import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

import logowhite from "../../assets/logowhite.png";

function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("horizon_admin_user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("horizon_admin_token");
    localStorage.removeItem("horizon_admin_user");
    navigate("/admin/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "⌂",
    },
    {
      name: "Messages",
      path: "/admin/messages",
      icon: "✉",
    },
    {
      name: "Quote Requests",
      path: "/admin/quotes",
      icon: "▤",
    },
    {
      name: "Services",
      path: "/admin/services",
      icon: "⚙",
    },
    {
      name: "Portfolio",
      path: "/admin/portfolio",
      icon: "▦",
    },
    {
      name: "Clients",
      path: "/admin/clients",
      icon: "♙",
    },
    {
      name: "Website Content",
      path: "/admin/content",
      icon: "✎",
    },
  ];

  return (
    <div className="admin-layout">

      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "admin-sidebar-open" : ""
        }`}
      >

        {/* LOGO */}

        <div className="admin-brand">
          <img
            src={logowhite}
            alt="Horizon Software Company"
            className="admin-brand-logo"
          />
        </div>

        {/* NAVIGATION */}

        <nav className="admin-navigation">

          <p className="admin-nav-label">
            MAIN MENU
          </p>

          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `admin-nav-link ${
                  isActive ? "admin-nav-active" : ""
                }`
              }
            >
              <span className="admin-nav-icon">
                {item.icon}
              </span>

              <span className="admin-nav-text">
                {item.name}
              </span>
            </NavLink>
          ))}

        </nav>

        {/* SIDEBAR FOOTER */}

        <div className="admin-sidebar-footer">

          <div className="admin-sidebar-divider" />

          <button
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <span className="admin-nav-icon">
              ⇥
            </span>

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* MAIN AREA */}

      <div className="admin-main">

        {/* TOP HEADER */}

        <header className="admin-header">

          <button
            className="admin-menu-button"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          >
            ☰
          </button>

          <div className="admin-header-left">

            <div className="admin-header-heading">
              <span className="admin-header-title">
                Horizon Administration
              </span>

              <span className="admin-header-subtitle">
                Technology within reach
              </span>
            </div>

          </div>

          <div className="admin-header-right">

            <div className="admin-status">
              <span className="admin-status-dot" />
              System Online
            </div>

            <div className="admin-profile">

              <div className="admin-avatar">
                {(user.username || "A")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="admin-profile-info">

                <strong>
                  {user.username || "Administrator"}
                </strong>

                <span>
                  Administrator
                </span>

              </div>

            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}

        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;