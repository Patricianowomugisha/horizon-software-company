import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminQuotes.css";

const API_URL = "http://127.0.0.1:5000";

function AdminQuotes() {
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const getToken = () => {
    return localStorage.getItem("horizon_admin_token");
  };

  /* =====================================================
     FETCH QUOTE REQUESTS
     ===================================================== */

  const fetchQuotes = async () => {
    const token = getToken();

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/quotes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("horizon_admin_token");
        localStorage.removeItem("horizon_admin_user");
        navigate("/admin/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load quote requests."
        );
      }

      setQuotes(
        Array.isArray(data)
          ? data
          : data.quotes || data.data || []
      );
    } catch (err) {
      console.error("FETCH QUOTES ERROR:", err);

      setError(
        "Unable to load quote requests. Please make sure the Flask backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  /* =====================================================
     DELETE QUOTE
     ===================================================== */

  const deleteQuote = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quote request?"
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/quotes/${id}`,
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
          data.message || "Unable to delete quote request."
        );
      }

      setQuotes((current) =>
        current.filter((quote) => quote.id !== id)
      );

      if (selectedQuote?.id === id) {
        setSelectedQuote(null);
      }
    } catch (err) {
      console.error("DELETE QUOTE ERROR:", err);

      alert(
        "Unable to delete this quote request. Please try again."
      );
    }
  };

  /* =====================================================
     FILTER + SEARCH
     ===================================================== */

  const filteredQuotes = quotes.filter((quote) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "new" &&
        !quote.is_read &&
        !quote.status) ||
      (filter === "read" && quote.is_read);

    const searchText = search.toLowerCase();

    const matchesSearch =
      !search ||
      quote.name?.toLowerCase().includes(searchText) ||
      quote.email?.toLowerCase().includes(searchText) ||
      quote.phone?.toLowerCase().includes(searchText) ||
      quote.company?.toLowerCase().includes(searchText) ||
      quote.service?.toLowerCase().includes(searchText) ||
      quote.message?.toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  });

  const unreadCount = quotes.filter(
    (quote) => !quote.is_read
  ).length;

  const readCount = quotes.length - unreadCount;

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

  const formatTime = (date) => {
    if (!date) return "";

    const formatted = new Date(date);

    if (Number.isNaN(formatted.getTime())) {
      return "";
    }

    return formatted.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <div className="quotes-loading">
        <div className="quotes-spinner"></div>

        <h3>Loading quote requests</h3>

        <p>
          Fetching customer quotation requests...
        </p>
      </div>
    );
  }

  /* =====================================================
     ERROR
     ===================================================== */

  if (error) {
    return (
      <div className="quotes-error">
        <div className="quotes-error-card">

          <div className="quotes-error-icon">
            !
          </div>

          <h2>
            Unable to Load Quote Requests
          </h2>

          <p>{error}</p>

          <button
            className="quotes-retry-button"
            onClick={fetchQuotes}
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
    <div className="quotes-page">

      {/* HEADER */}

      <section className="quotes-page-header">

        <div>

          <span className="quotes-eyebrow">
            SALES & ENQUIRIES
          </span>

          <h1>Quote Requests</h1>

          <p>
            Review quotation requests submitted by
            potential customers through your website.
          </p>

        </div>

        <button
          className="quotes-refresh-button"
          onClick={fetchQuotes}
        >
          <span>↻</span>
          Refresh
        </button>

      </section>


      {/* SUMMARY */}

      <section className="quotes-summary">

        <div className="quotes-summary-card">

          <div className="quotes-summary-icon blue">
            #
          </div>

          <div>
            <span>Total Requests</span>
            <strong>{quotes.length}</strong>
          </div>

        </div>


        <div className="quotes-summary-card">

          <div className="quotes-summary-icon gold">
            !
          </div>

          <div>
            <span>New Requests</span>
            <strong>{unreadCount}</strong>
          </div>

        </div>


        <div className="quotes-summary-card">

          <div className="quotes-summary-icon green">
            ✓
          </div>

          <div>
            <span>Reviewed</span>
            <strong>{readCount}</strong>
          </div>

        </div>

      </section>


      {/* TOOLBAR */}

      <section className="quotes-toolbar">

        <div className="quotes-search">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Search quote requests..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="quotes-filters">

          <button
            className={
              filter === "all" ? "active" : ""
            }
            onClick={() =>
              setFilter("all")
            }
          >
            All
            <span>{quotes.length}</span>
          </button>


          <button
            className={
              filter === "new" ? "active" : ""
            }
            onClick={() =>
              setFilter("new")
            }
          >
            New
            <span>{unreadCount}</span>
          </button>


          <button
            className={
              filter === "read" ? "active" : ""
            }
            onClick={() =>
              setFilter("read")
            }
          >
            Reviewed
            <span>{readCount}</span>
          </button>

        </div>

      </section>


      {/* WORKSPACE */}

      <section className="quotes-workspace">

        {/* LIST */}

        <div className="quotes-list-panel">

          <div className="quotes-list-heading">

            <div>

              <span>REQUESTS</span>

              <h2>
                Customer Quotes
              </h2>

            </div>

            <strong>
              {filteredQuotes.length}
            </strong>

          </div>


          {filteredQuotes.length === 0 ? (

            <div className="quotes-empty">

              <div className="quotes-empty-icon">
                #
              </div>

              <h3>
                No quote requests found
              </h3>

              <p>
                {search
                  ? "Try changing your search."
                  : "Quotation requests submitted through your website will appear here."
                }
              </p>

            </div>

          ) : (

            <div className="quotes-list">

              {filteredQuotes.map(
                (quote) => (

                  <button
                    key={quote.id}
                    className={`
                      quote-list-item
                      ${
                        selectedQuote?.id ===
                        quote.id
                          ? "selected"
                          : ""
                      }
                      ${
                        !quote.is_read
                          ? "unread"
                          : ""
                      }
                    `}
                    onClick={() =>
                      setSelectedQuote(quote)
                    }
                  >

                    <div className="quote-avatar">

                      {(
                        quote.name ||
                        "C"
                      )
                        .charAt(0)
                        .toUpperCase()}

                    </div>


                    <div className="quote-list-content">

                      <div className="quote-list-top">

                        <strong>
                          {quote.name ||
                            "Customer"}
                        </strong>

                        <span>
                          {formatDate(
                            quote.created_at
                          )}
                        </span>

                      </div>


                      <div className="quote-list-service">

                        {quote.service ||
                          "Quotation request"}

                      </div>


                      <p>

                        {quote.company ||
                          quote.email ||
                          "Customer enquiry"}

                      </p>

                    </div>


                    {!quote.is_read && (
                      <div className="quote-unread-dot"></div>
                    )}

                  </button>

                )
              )}

            </div>

          )}

        </div>


        {/* DETAILS */}

        <div className="quote-details-panel">

          {!selectedQuote ? (

            <div className="quote-details-empty">

              <div className="quote-details-empty-icon">
                #
              </div>

              <h2>
                Select a quote request
              </h2>

              <p>
                Choose a request from the list to
                view the customer's quotation details.
              </p>

            </div>

          ) : (

            <div className="quote-details">

              {/* DETAILS HEADER */}

              <div className="quote-details-header">

                <div>

                  <span className="quote-details-label">
                    QUOTATION REQUEST
                  </span>

                  <h2>
                    {selectedQuote.service ||
                      "Website quotation"}
                  </h2>

                </div>


                <button
                  className="quote-delete-button"
                  onClick={() =>
                    deleteQuote(
                      selectedQuote.id
                    )
                  }
                >
                  Delete
                </button>

              </div>


              {/* CUSTOMER */}

              <div className="quote-customer">

                <div className="quote-large-avatar">

                  {(
                    selectedQuote.name ||
                    "C"
                  )
                    .charAt(0)
                    .toUpperCase()}

                </div>


                <div>

                  <strong>
                    {selectedQuote.name ||
                      "Customer"}
                  </strong>


                  {selectedQuote.email && (

                    <a
                      href={`mailto:${
                        selectedQuote.email
                      }`}
                    >
                      {selectedQuote.email}
                    </a>

                  )}


                  {selectedQuote.phone && (

                    <a
                      href={`tel:${
                        selectedQuote.phone
                      }`}
                    >
                      {selectedQuote.phone}
                    </a>

                  )}

                </div>

              </div>


              {/* INFORMATION */}

              <div className="quote-information">

                {selectedQuote.company && (

                  <div className="quote-info-item">

                    <span>Company</span>

                    <strong>
                      {selectedQuote.company}
                    </strong>

                  </div>

                )}


                {selectedQuote.service && (

                  <div className="quote-info-item">

                    <span>Service</span>

                    <strong>
                      {selectedQuote.service}
                    </strong>

                  </div>

                )}


                {selectedQuote.budget && (

                  <div className="quote-info-item">

                    <span>Budget</span>

                    <strong>
                      {selectedQuote.budget}
                    </strong>

                  </div>

                )}

              </div>


              {/* DATE */}

              <div className="quote-date">

                Received{" "}
                {formatDate(
                  selectedQuote.created_at
                )}

                {" · "}

                {formatTime(
                  selectedQuote.created_at
                )}

              </div>


              {/* MESSAGE */}

              <div className="quote-message-box">

                <span>
                  PROJECT DETAILS
                </span>

                <p>
                  {selectedQuote.message ||
                    "No additional project details were provided."}
                </p>

              </div>


              {/* ACTIONS */}

              <div className="quote-actions">

                {selectedQuote.email && (

                  <a
                    className="quote-reply-button"
                    href={`mailto:${
                      selectedQuote.email
                    }`}
                  >
                    Reply by Email →
                  </a>

                )}


                {selectedQuote.phone && (

                  <a
                    className="quote-call-button"
                    href={`tel:${
                      selectedQuote.phone
                    }`}
                  >
                    Call Customer
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

export default AdminQuotes;