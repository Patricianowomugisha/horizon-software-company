import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPortfolio.css";

const API_URL = "https://horizon-software-backend.onrender.com";

function AdminPortfolio() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const getToken = () => {
    return localStorage.getItem("horizon_admin_token");
  };

  // =====================================================
  // FETCH PORTFOLIO PROJECTS
  // =====================================================

  const fetchProjects = async () => {
    const token = getToken();

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/portfolio`,
        {
          method: "GET",
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
          data.message ||
            "Unable to load portfolio projects."
        );
      }

      setProjects(
        Array.isArray(data)
          ? data
          : data.projects ||
              data.portfolio ||
              data.data ||
              []
      );
    } catch (err) {
      console.error(
        "FETCH PORTFOLIO ERROR:",
        err
      );

      setError(
        "Unable to load portfolio projects. Please make sure the Flask backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // =====================================================
  // DELETE PROJECT
  // =====================================================

  const deleteProject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this portfolio project?"
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/portfolio/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem(
          "horizon_admin_token"
        );

        localStorage.removeItem(
          "horizon_admin_user"
        );

        navigate("/admin/login");
        return;
      }

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message ||
            "Unable to delete portfolio project."
        );
      }

      setProjects((current) =>
        current.filter(
          (project) => project.id !== id
        )
      );

      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }
    } catch (err) {
      console.error(
        "DELETE PORTFOLIO ERROR:",
        err
      );

      alert(
        "Unable to delete this project. Please try again."
      );
    }
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredProjects = projects.filter(
    (project) => {
      const matchesFilter =
        filter === "all" ||
        project.category
          ?.toLowerCase()
          .includes(filter.toLowerCase());

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        project.title
          ?.toLowerCase()
          .includes(searchText) ||
        project.name
          ?.toLowerCase()
          .includes(searchText) ||
        project.category
          ?.toLowerCase()
          .includes(searchText) ||
        project.description
          ?.toLowerCase()
          .includes(searchText) ||
        project.technology
          ?.toLowerCase()
          .includes(searchText);

      return matchesFilter && matchesSearch;
    }
  );

  // =====================================================
  // CATEGORY COUNTS
  // =====================================================

  const totalProjects = projects.length;

  const webProjects = projects.filter(
    (project) =>
      project.category
        ?.toLowerCase()
        .includes("web")
  ).length;

  const softwareProjects = projects.filter(
    (project) =>
      project.category
        ?.toLowerCase()
        .includes("software")
  ).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="portfolio-loading">

        <div className="portfolio-spinner"></div>

        <h3>
          Loading portfolio
        </h3>

        <p>
          Fetching your projects...
        </p>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="portfolio-error">

        <div className="portfolio-error-card">

          <div className="portfolio-error-icon">
            !
          </div>

          <h2>
            Unable to Load Portfolio
          </h2>

          <p>
            {error}
          </p>

          <button
            className="portfolio-retry-button"
            onClick={fetchProjects}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="portfolio-page">

      {/* ==========================================
          PAGE HEADER
         ========================================== */}

      <section className="portfolio-page-header">

        <div>

          <span className="portfolio-eyebrow">
            PROJECT SHOWCASE
          </span>

          <h1>
            Portfolio
          </h1>

          <p>
            Manage the projects displayed in
            your company's portfolio.
          </p>

        </div>

        <button
          className="portfolio-refresh-button"
          onClick={fetchProjects}
        >
          <span>↻</span>
          Refresh
        </button>

      </section>


      {/* ==========================================
          SUMMARY CARDS
         ========================================== */}

      <section className="portfolio-summary">

        <div className="portfolio-summary-card">

          <div className="portfolio-summary-icon blue">
            #
          </div>

          <div>

            <span>
              Total Projects
            </span>

            <strong>
              {totalProjects}
            </strong>

          </div>

        </div>


        <div className="portfolio-summary-card">

          <div className="portfolio-summary-icon gold">
            ◇
          </div>

          <div>

            <span>
              Web Projects
            </span>

            <strong>
              {webProjects}
            </strong>

          </div>

        </div>


        <div className="portfolio-summary-card">

          <div className="portfolio-summary-icon green">
            ✓
          </div>

          <div>

            <span>
              Software Projects
            </span>

            <strong>
              {softwareProjects}
            </strong>

          </div>

        </div>

      </section>


      {/* ==========================================
          TOOLBAR
         ========================================== */}

      <section className="portfolio-toolbar">

        <div className="portfolio-search">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search portfolio projects..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="portfolio-filters">

          <button
            className={
              filter === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("all")
            }
          >
            All

            <span>
              {projects.length}
            </span>

          </button>


          <button
            className={
              filter === "web"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("web")
            }
          >
            Web

            <span>
              {webProjects}
            </span>

          </button>


          <button
            className={
              filter === "software"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("software")
            }
          >
            Software

            <span>
              {softwareProjects}
            </span>

          </button>

        </div>

      </section>


      {/* ==========================================
          WORKSPACE
         ========================================== */}

      <section className="portfolio-workspace">


        {/* ========================================
            PROJECT LIST
           ======================================== */}

        <div className="portfolio-list-panel">

          <div className="portfolio-list-heading">

            <div>

              <span>
                PROJECTS
              </span>

              <h2>
                Company Portfolio
              </h2>

            </div>

            <strong>
              {filteredProjects.length}
            </strong>

          </div>


          {filteredProjects.length === 0 ? (

            <div className="portfolio-empty">

              <div className="portfolio-empty-icon">
                #
              </div>

              <h3>
                No projects found
              </h3>

              <p>
                {search
                  ? "Try changing your search."
                  : "Portfolio projects will appear here once they are added."
                }
              </p>

            </div>

          ) : (

            <div className="portfolio-list">

              {filteredProjects.map(
                (project) => (

                  <button
                    key={project.id}
                    className={`
                      portfolio-list-item
                      ${
                        selectedProject?.id ===
                        project.id
                          ? "selected"
                          : ""
                      }
                    `}
                    onClick={() =>
                      setSelectedProject(
                        project
                      )
                    }
                  >

                    <div className="portfolio-avatar">

                      {(
                        project.title ||
                        project.name ||
                        "P"
                      )
                        .charAt(0)
                        .toUpperCase()}

                    </div>


                    <div className="portfolio-list-content">

                      <div className="portfolio-list-top">

                        <strong>
                          {project.title ||
                            project.name ||
                            "Untitled Project"}
                        </strong>

                        <span>
                          {project.category ||
                            "Project"}
                        </span>

                      </div>


                      <div className="portfolio-list-service">

                        {project.technology ||
                          project.tech_stack ||
                          "Technology project"}

                      </div>


                      <p>

                        {project.description ||
                          "No project description available."}

                      </p>

                    </div>

                  </button>

                )
              )}

            </div>

          )}

        </div>


        {/* ========================================
            PROJECT DETAILS
           ======================================== */}

        <div className="portfolio-details-panel">

          {!selectedProject ? (

            <div className="portfolio-details-empty">

              <div className="portfolio-details-empty-icon">
                #
              </div>

              <h2>
                Select a project
              </h2>

              <p>
                Choose a project from your
                portfolio to view its details.
              </p>

            </div>

          ) : (

            <div className="portfolio-details">


              {/* PROJECT HEADER */}

              <div className="portfolio-details-header">

                <div>

                  <span className="portfolio-details-label">
                    PORTFOLIO PROJECT
                  </span>

                  <h2>
                    {selectedProject.title ||
                      selectedProject.name ||
                      "Untitled Project"}
                  </h2>

                </div>


                <button
                  className="portfolio-delete-button"
                  onClick={() =>
                    deleteProject(
                      selectedProject.id
                    )
                  }
                >
                  Delete
                </button>

              </div>


              {/* PROJECT IMAGE */}

              {(
                selectedProject.image ||
                selectedProject.image_url ||
                selectedProject.thumbnail
              ) && (

                <div className="portfolio-project-image">

                  <img
                    src={
                      selectedProject.image ||
                      selectedProject.image_url ||
                      selectedProject.thumbnail
                    }
                    alt={
                      selectedProject.title ||
                      selectedProject.name ||
                      "Portfolio project"
                    }
                  />

                </div>

              )}


              {/* PROJECT INFORMATION */}

              <div className="portfolio-information">

                {selectedProject.category && (

                  <div className="portfolio-info-item">

                    <span>
                      Category
                    </span>

                    <strong>
                      {selectedProject.category}
                    </strong>

                  </div>

                )}


                {(
                  selectedProject.technology ||
                  selectedProject.tech_stack
                ) && (

                  <div className="portfolio-info-item">

                    <span>
                      Technology
                    </span>

                    <strong>
                      {
                        selectedProject.technology ||
                        selectedProject.tech_stack
                      }
                    </strong>

                  </div>

                )}


                {selectedProject.client && (

                  <div className="portfolio-info-item">

                    <span>
                      Client
                    </span>

                    <strong>
                      {selectedProject.client}
                    </strong>

                  </div>

                )}

              </div>


              {/* DESCRIPTION */}

              <div className="portfolio-description-box">

                <span>
                  PROJECT DESCRIPTION
                </span>

                <p>
                  {selectedProject.description ||
                    "No project description available."}
                </p>

              </div>


              {/* PROJECT LINK */}

              {(
                selectedProject.project_url ||
                selectedProject.url ||
                selectedProject.link
              ) && (

                <div className="portfolio-actions">

                  <a
                    className="portfolio-view-button"
                    href={
                      selectedProject.project_url ||
                      selectedProject.url ||
                      selectedProject.link
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project →
                  </a>

                </div>

              )}

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default AdminPortfolio;
