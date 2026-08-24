import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminClients.css";

const API_URL = "http://127.0.0.1:5000";

function AdminClients() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const getToken = () => {
    return localStorage.getItem("horizon_admin_token");
  };

  /* =====================================================
     FETCH CLIENTS
     ===================================================== */

  const fetchClients = async () => {
    const token = getToken();

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/clients`,
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
          data.message || "Unable to load clients."
        );
      }

      setClients(
        Array.isArray(data)
          ? data
          : data.clients || data.data || []
      );
    } catch (err) {
      console.error("FETCH CLIENTS ERROR:", err);

      setError(
        "Unable to load clients. Please make sure the Flask backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  /* =====================================================
     DELETE CLIENT
     ===================================================== */

  const deleteClient = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/clients/${id}`,
        {
          method: "DELETE",
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

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message || "Unable to delete client."
        );
      }

      setClients((current) =>
        current.filter((client) => client.id !== id)
      );

      if (selectedClient?.id === id) {
        setSelectedClient(null);
      }
    } catch (err) {
      console.error("DELETE CLIENT ERROR:", err);

      alert(
        "Unable to delete this client. Please try again."
      );
    }
  };

  /* =====================================================
     SEARCH
     ===================================================== */

  const filteredClients = clients.filter((client) => {
    const searchText = search.toLowerCase();

    return (
      !search ||
      client.name?.toLowerCase().includes(searchText) ||
      client.email?.toLowerCase().includes(searchText) ||
      client.phone?.toLowerCase().includes(searchText) ||
      client.company?.toLowerCase().includes(searchText) ||
      client.address?.toLowerCase().includes(searchText) ||
      client.service?.toLowerCase().includes(searchText)
    );
  });

  /* =====================================================
     DATE
     ===================================================== */

  const formatDate = (date) => {
    if (!date) return "No date";

    const formatted = new Date(date);

    if (Number.isNaN(formatted.getTime())) {
      return date;
    }

    return formatted.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <div className="clients-loading">

        <div className="clients-spinner"></div>

        <h3>
          Loading clients
        </h3>

        <p>
          Fetching your customer records...
        </p>

      </div>
    );
  }

  /* =====================================================
     ERROR
     ===================================================== */

  if (error) {
    return (
      <div className="clients-error">

        <div className="clients-error-card">

          <div className="clients-error-icon">
            !
          </div>

          <h2>
            Unable to Load Clients
          </h2>

          <p>
            {error}
          </p>

          <button
            className="clients-retry-button"
            onClick={fetchClients}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  /* =====================================================
     PAGE
     ===================================================== */

  return (
    <div className="clients-page">

      {/* ================================================
          HEADER
         ================================================ */}

      <section className="clients-page-header">

        <div>

          <span className="clients-eyebrow">
            CUSTOMER MANAGEMENT
          </span>

          <h1>
            Clients
          </h1>

          <p>
            Manage your customer records, contact
            information and service relationships.
          </p>

        </div>

        <button
          className="clients-refresh-button"
          onClick={fetchClients}
        >
          <span>↻</span>
          Refresh
        </button>

      </section>


      {/* ================================================
          SUMMARY
         ================================================ */}

      <section className="clients-summary">

        <div className="clients-summary-card">

          <div className="clients-summary-icon blue">
            #
          </div>

          <div>
            <span>Total Clients</span>

            <strong>
              {clients.length}
            </strong>
          </div>

        </div>


        <div className="clients-summary-card">

          <div className="clients-summary-icon gold">
            ★
          </div>

          <div>
            <span>Active Records</span>

            <strong>
              {clients.length}
            </strong>
          </div>

        </div>


        <div className="clients-summary-card">

          <div className="clients-summary-icon green">
            ✓
          </div>

          <div>
            <span>Customer Database</span>

            <strong>
              Active
            </strong>
          </div>

        </div>

      </section>


      {/* ================================================
          SEARCH
         ================================================ */}

      <section className="clients-toolbar">

        <div className="clients-search">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </section>


      {/* ================================================
          WORKSPACE
         ================================================ */}

      <section className="clients-workspace">

        {/* ==============================================
            CLIENT LIST
           ============================================== */}

        <div className="clients-list-panel">

          <div className="clients-list-heading">

            <div>

              <span>
                CUSTOMER DATABASE
              </span>

              <h2>
                Client Records
              </h2>

            </div>

            <strong>
              {filteredClients.length}
            </strong>

          </div>


          {filteredClients.length === 0 ? (

            <div className="clients-empty">

              <div className="clients-empty-icon">
                #
              </div>

              <h3>
                No clients found
              </h3>

              <p>
                {search
                  ? "Try changing your search."
                  : "Client records will appear here when they are added."
                }
              </p>

            </div>

          ) : (

            <div className="clients-list">

              {filteredClients.map(
                (client) => (

                  <button
                    key={client.id}
                    className={`client-list-item ${
                      selectedClient?.id === client.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedClient(client)
                    }
                  >

                    <div className="client-avatar">

                      {(
                        client.name ||
                        "C"
                      )
                        .charAt(0)
                        .toUpperCase()}

                    </div>


                    <div className="client-list-content">

                      <div className="client-list-top">

                        <strong>
                          {client.name ||
                            "Client"}
                        </strong>

                        <span>
                          {formatDate(
                            client.created_at
                          )}
                        </span>

                      </div>


                      <div className="client-list-company">

                        {client.company ||
                          client.service ||
                          "Customer"}

                      </div>


                      <p>

                        {client.email ||
                          client.phone ||
                          "No contact information"}

                      </p>

                    </div>

                  </button>

                )
              )}

            </div>

          )}

        </div>


        {/* ==============================================
            CLIENT DETAILS
           ============================================== */}

        <div className="client-details-panel">

          {!selectedClient ? (

            <div className="client-details-empty">

              <div className="client-details-empty-icon">
                #
              </div>

              <h2>
                Select a client
              </h2>

              <p>
                Choose a client from your records
                to view their full information.
              </p>

            </div>

          ) : (

            <div className="client-details">

              {/* DETAILS HEADER */}

              <div className="client-details-header">

                <div>

                  <span className="client-details-label">
                    CLIENT PROFILE
                  </span>

                  <h2>
                    {selectedClient.name ||
                      "Client"}
                  </h2>

                </div>


                <button
                  className="client-delete-button"
                  onClick={() =>
                    deleteClient(
                      selectedClient.id
                    )
                  }
                >
                  Delete
                </button>

              </div>


              {/* CUSTOMER */}

              <div className="client-profile">

                <div className="client-large-avatar">

                  {(
                    selectedClient.name ||
                    "C"
                  )
                    .charAt(0)
                    .toUpperCase()}

                </div>


                <div>

                  <strong>
                    {selectedClient.name ||
                      "Client"}
                  </strong>


                  {selectedClient.company && (

                    <span>
                      {selectedClient.company}
                    </span>

                  )}

                </div>

              </div>


              {/* CONTACT INFORMATION */}

              <div className="client-information">

                {selectedClient.email && (

                  <div className="client-info-item">

                    <span>
                      Email
                    </span>

                    <a
                      href={`mailto:${selectedClient.email}`}
                    >
                      {selectedClient.email}
                    </a>

                  </div>

                )}


                {selectedClient.phone && (

                  <div className="client-info-item">

                    <span>
                      Phone
                    </span>

                    <a
                      href={`tel:${selectedClient.phone}`}
                    >
                      {selectedClient.phone}
                    </a>

                  </div>

                )}


                {selectedClient.company && (

                  <div className="client-info-item">

                    <span>
                      Company
                    </span>

                    <strong>
                      {selectedClient.company}
                    </strong>

                  </div>

                )}


                {selectedClient.address && (

                  <div className="client-info-item">

                    <span>
                      Address
                    </span>

                    <strong>
                      {selectedClient.address}
                    </strong>

                  </div>

                )}


                {selectedClient.service && (

                  <div className="client-info-item">

                    <span>
                      Service
                    </span>

                    <strong>
                      {selectedClient.service}
                    </strong>

                  </div>

                )}

              </div>


              {/* DATE */}

              <div className="client-date">

                Client record created{" "}
                {formatDate(
                  selectedClient.created_at
                )}

              </div>


              {/* ACTIONS */}

              <div className="client-actions">

                {selectedClient.email && (

                  <a
                    className="client-email-button"
                    href={`mailto:${selectedClient.email}`}
                  >
                    Email Client →
                  </a>

                )}


                {selectedClient.phone && (

                  <a
                    className="client-call-button"
                    href={`tel:${selectedClient.phone}`}
                  >
                    Call Client
                  </a>

                )}

              </div>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default AdminClients;