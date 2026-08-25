import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminMessages.css";

const API_URL = "https://horizon-software-backend.onrender.com";

function AdminMessages() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const getToken = () => {
    return localStorage.getItem("horizon_admin_token");
  };

  const logoutAndRedirect = () => {
    localStorage.removeItem("horizon_admin_token");
    localStorage.removeItem("horizon_admin_user");
    navigate("/admin/login");
  };

  // =========================================================
  // FETCH MESSAGES
  // =========================================================

  const fetchMessages = useCallback(async () => {
    const token = getToken();

    if (!token) {
      logoutAndRedirect();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/contact`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.status === 401) {
        logoutAndRedirect();
        return;
      }

      if (!response.ok) {
        const serverMessage =
          data?.message ||
          data?.error ||
          `Server returned status ${response.status}.`;

        throw new Error(serverMessage);
      }

      const messageList = Array.isArray(data)
        ? data
        : data?.messages || data?.data || [];

      setMessages(messageList);

      if (selectedMessage) {
        const updatedSelectedMessage = messageList.find(
          (message) => message.id === selectedMessage.id
        );

        setSelectedMessage(
          updatedSelectedMessage || null
        );
      }
    } catch (err) {
      console.error("FETCH MESSAGES ERROR:", err);

      if (err instanceof TypeError) {
        setError(
          "The browser could not connect to Flask at https://horizon-software-backend.onrender.com. Make sure the Flask backend is running."
        );
      } else {
        setError(
          err.message ||
            "Unable to load messages from the Flask backend."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, selectedMessage]);

  useEffect(() => {
    fetchMessages();
  }, []);

  // =========================================================
  // MARK AS READ
  // =========================================================

  const markAsRead = async (message) => {
    const token = getToken();

    if (!token) {
      logoutAndRedirect();
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/contact/${message.id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        logoutAndRedirect();
        return;
      }

      if (!response.ok) {
        console.error(
          "MARK AS READ FAILED:",
          response.status
        );
        return;
      }

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? {
                ...item,
                is_read: true,
              }
            : item
        )
      );

      setSelectedMessage({
        ...message,
        is_read: true,
      });
    } catch (err) {
      console.error(
        "Unable to mark message as read:",
        err
      );
    }
  };

  // =========================================================
  // DELETE MESSAGE
  // =========================================================

  const deleteMessage = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      logoutAndRedirect();
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/contact/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.status === 401) {
        logoutAndRedirect();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Unable to delete this message."
        );
      }

      setMessages((current) =>
        current.filter(
          (message) => message.id !== id
        )
      );

      setSelectedMessage(null);
    } catch (err) {
      console.error("DELETE MESSAGE ERROR:", err);

      alert(
        err.message ||
          "Unable to delete this message. Please try again."
      );
    }
  };

  // =========================================================
  // OPEN MESSAGE
  // =========================================================

  const openMessage = (message) => {
    setSelectedMessage(message);

    if (!message.is_read) {
      markAsRead(message);
    }
  };

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const searchText = search.trim().toLowerCase();

  const filteredMessages = messages.filter(
    (message) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !message.is_read) ||
        (filter === "read" && message.is_read);

      const matchesSearch =
        !searchText ||
        message.name
          ?.toLowerCase()
          .includes(searchText) ||
        message.email
          ?.toLowerCase()
          .includes(searchText) ||
        message.subject
          ?.toLowerCase()
          .includes(searchText) ||
        message.message
          ?.toLowerCase()
          .includes(searchText);

      return matchesFilter && matchesSearch;
    }
  );

  const unreadCount = messages.filter(
    (message) => !message.is_read
  ).length;

  const readCount =
    messages.length - unreadCount;

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "No date";
    }

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
    if (!date) {
      return "";
    }

    const formatted = new Date(date);

    if (Number.isNaN(formatted.getTime())) {
      return "";
    }

    return formatted.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="messages-loading">
        <div className="messages-spinner"></div>

        <h3>Loading messages</h3>

        <p>
          Fetching your customer enquiries...
        </p>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="messages-error">
        <div className="messages-error-card">

          <div className="messages-error-icon">
            !
          </div>

          <span className="messages-error-label">
            COMMUNICATION CENTRE
          </span>

          <h2>
            Unable to Load Messages
          </h2>

          <p>
            {error}
          </p>

          <div className="messages-error-endpoint">
            API: {API_URL}/api/contact
          </div>

          <button
            className="messages-retry-button"
            onClick={fetchMessages}
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="messages-page">

      {/* =====================================================
          HEADER
         ===================================================== */}

      <section className="messages-page-header">

        <div>
          <span className="messages-eyebrow">
            COMMUNICATION CENTRE
          </span>

          <h1>Messages</h1>

          <p>
            Manage enquiries and messages received
            from visitors through your website.
          </p>
        </div>

        <button
          className="messages-refresh-button"
          onClick={fetchMessages}
        >
          <span>↻</span>
          Refresh
        </button>

      </section>


      {/* =====================================================
          SUMMARY
         ===================================================== */}

      <section className="messages-summary">

        <div className="messages-summary-card">

          <div className="messages-summary-icon blue">
            ✉
          </div>

          <div>
            <span>Total Messages</span>
            <strong>
              {messages.length}
            </strong>
          </div>

        </div>


        <div className="messages-summary-card">

          <div className="messages-summary-icon gold">
            ●
          </div>

          <div>
            <span>Unread Messages</span>
            <strong>
              {unreadCount}
            </strong>
          </div>

        </div>


        <div className="messages-summary-card">

          <div className="messages-summary-icon green">
            ✓
          </div>

          <div>
            <span>Read Messages</span>
            <strong>
              {readCount}
            </strong>
          </div>

        </div>

      </section>


      {/* =====================================================
          TOOLBAR
         ===================================================== */}

      <section className="messages-toolbar">

        <div className="messages-search">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              className="messages-clear-search"
              onClick={() => setSearch("")}
              type="button"
            >
              ×
            </button>
          )}

        </div>


        <div className="messages-filters">

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
              {messages.length}
            </span>
          </button>


          <button
            className={
              filter === "unread"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("unread")
            }
          >
            Unread
            <span>
              {unreadCount}
            </span>
          </button>


          <button
            className={
              filter === "read"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("read")
            }
          >
            Read
            <span>
              {readCount}
            </span>
          </button>

        </div>

      </section>


      {/* =====================================================
          WORKSPACE
         ===================================================== */}

      <section className="messages-workspace">

        {/* ===================================================
            LIST
           =================================================== */}

        <div className="messages-list-panel">

          <div className="messages-list-heading">

            <div>
              <span>INBOX</span>

              <h2>
                Customer Messages
              </h2>
            </div>

            <strong>
              {filteredMessages.length}
            </strong>

          </div>


          {filteredMessages.length === 0 ? (

            <div className="messages-empty">

              <div className="messages-empty-icon">
                ✉
              </div>

              <h3>
                No messages found
              </h3>

              <p>
                {search
                  ? "Try changing your search."
                  : "Messages submitted through your website will appear here."
                }
              </p>

            </div>

          ) : (

            <div className="messages-list">

              {filteredMessages.map(
                (message) => (

                  <button
                    key={message.id}
                    className={`
                      message-list-item
                      ${
                        selectedMessage?.id ===
                        message.id
                          ? "selected"
                          : ""
                      }
                      ${
                        !message.is_read
                          ? "unread"
                          : ""
                      }
                    `}
                    onClick={() =>
                      openMessage(message)
                    }
                  >

                    <div className="message-avatar">

                      {(
                        message.name ||
                        "V"
                      )
                        .charAt(0)
                        .toUpperCase()}

                    </div>


                    <div className="message-list-content">

                      <div className="message-list-top">

                        <strong>
                          {message.name ||
                            "Visitor"}
                        </strong>

                        <span>
                          {formatDate(
                            message.created_at
                          )}
                        </span>

                      </div>


                      <div className="message-list-subject">

                        {message.subject ||
                          "Website enquiry"}

                      </div>


                      <p>

                        {message.message ||
                          "No message content."}

                      </p>

                    </div>


                    {!message.is_read && (
                      <div className="message-unread-dot"></div>
                    )}

                  </button>

                )
              )}

            </div>

          )}

        </div>


        {/* ===================================================
            DETAILS
           =================================================== */}

        <div className="message-details-panel">

          {!selectedMessage ? (

            <div className="message-details-empty">

              <div className="message-details-empty-icon">
                ✉
              </div>

              <h2>
                Select a message
              </h2>

              <p>
                Choose a message from your inbox
                to view the full enquiry.
              </p>

            </div>

          ) : (

            <div className="message-details">

              <div className="message-details-header">

                <div>

                  <span className="message-details-label">
                    CUSTOMER ENQUIRY
                  </span>

                  <h2>
                    {selectedMessage.subject ||
                      "Website enquiry"}
                  </h2>

                </div>


                <button
                  className="message-delete-button"
                  onClick={() =>
                    deleteMessage(
                      selectedMessage.id
                    )
                  }
                >
                  Delete
                </button>

              </div>


              <div className="message-sender">

                <div className="message-large-avatar">

                  {(
                    selectedMessage.name ||
                    "V"
                  )
                    .charAt(0)
                    .toUpperCase()}

                </div>


                <div>

                  <strong>
                    {selectedMessage.name ||
                      "Visitor"}
                  </strong>


                  <a
                    href={`mailto:${
                      selectedMessage.email || ""
                    }`}
                  >
                    {selectedMessage.email ||
                      "No email provided"}
                  </a>


                  {selectedMessage.phone && (
                    <a
                      href={`tel:${
                        selectedMessage.phone
                      }`}
                    >
                      {selectedMessage.phone}
                    </a>
                  )}

                </div>

              </div>


              <div className="message-date">

                Received{" "}
                {formatDate(
                  selectedMessage.created_at
                )}

                {" · "}

                {formatTime(
                  selectedMessage.created_at
                )}

              </div>


              <div className="message-body">

                <p>
                  {selectedMessage.message ||
                    "No message content."}
                </p>

              </div>


              <div className="message-details-actions">

                <a
                  className="message-reply-button"
                  href={`mailto:${
                    selectedMessage.email || ""
                  }`}
                >
                  Reply by Email →
                </a>


                {selectedMessage.phone && (
                  <a
                    className="message-call-button"
                    href={`tel:${
                      selectedMessage.phone
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

export default AdminMessages;
