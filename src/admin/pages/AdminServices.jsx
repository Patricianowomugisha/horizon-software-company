import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminServices.css";

const API_URL = "http://127.0.0.1:5000";

function AdminServices() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    is_active: true,
  });

  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("horizon_admin_token");
  };

  // ==========================================
  // AUTH CHECK
  // ==========================================

  const checkAuthentication = () => {
    const token = getToken();

    if (!token) {
      navigate("/admin/login");
      return false;
    }

    return true;
  };

  // ==========================================
  // FETCH SERVICES
  // ==========================================

  const fetchServices = async () => {
    if (!checkAuthentication()) return;

    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/services`,
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
          data.message || "Unable to load services."
        );
      }

      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH SERVICES ERROR:", err);

      setError(
        "Unable to load services. Please make sure the Flask backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      is_active: true,
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ==========================================
  // ADD SERVICE
  // ==========================================

  const openAddForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      is_active: true,
    });

    setEditingId(null);
    setSelectedService(null);
    setShowForm(true);
    setError("");
  };

  // ==========================================
  // EDIT SERVICE
  // ==========================================

  const openEditForm = (service) => {
    setFormData({
      name: service.name || "",
      description: service.description || "",
      image: service.image || "",
      is_active: service.is_active !== false,
    });

    setEditingId(service.id);
    setSelectedService(service);
    setShowForm(true);
    setError("");
  };

  // ==========================================
  // CREATE SERVICE
  // ==========================================

  const createService = async () => {
    if (!checkAuthentication()) return;

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description,
            image: formData.image,
            is_active: formData.is_active,
          }),
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
          data.message || "Unable to create service."
        );
      }

      await fetchServices();

      resetForm();

    } catch (err) {
      console.error("CREATE SERVICE ERROR:", err);

      setError(
        err.message || "Unable to create service."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // UPDATE SERVICE
  // ==========================================

  const updateService = async () => {
    if (!checkAuthentication()) return;

    if (!editingId) return;

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/services/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description,
            image: formData.image,
            is_active: formData.is_active,
          }),
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
          data.message || "Unable to update service."
        );
      }

      await fetchServices();

      resetForm();

    } catch (err) {
      console.error("UPDATE SERVICE ERROR:", err);

      setError(
        err.message || "Unable to update service."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Please enter a service name.");
      return;
    }

    if (editingId) {
      await updateService();
    } else {
      await createService();
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const deleteService = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    if (!checkAuthentication()) return;

    try {
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/services/${id}`,
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete service."
        );
      }

      setServices((current) =>
        current.filter((service) => service.id !== id)
      );

      if (selectedService?.id === id) {
        setSelectedService(null);
      }

      if (editingId === id) {
        resetForm();
      }

    } catch (err) {
      console.error("DELETE SERVICE ERROR:", err);

      setError(
        err.message ||
        "Unable to delete service. Please try again."
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredServices = services.filter((service) => {
    const searchText = search.toLowerCase();

    return (
      !search ||
      service.name?.toLowerCase().includes(searchText) ||
      service.description?.toLowerCase().includes(searchText)
    );
  });

  // ==========================================
  // COUNTS
  // ==========================================

  const activeCount = services.filter(
    (service) => service.is_active === true
  ).length;

  const inactiveCount = services.filter(
    (service) => service.is_active === false
  ).length;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="services-loading">
        <div className="services-spinner"></div>

        <h3>Loading services</h3>

        <p>
          Fetching your website services...
        </p>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="admin-services-page">

      {/* HEADER */}

      <section className="admin-services-header">

        <div>
          <span className="admin-services-eyebrow">
            WEBSITE MANAGEMENT
          </span>

          <h1>Services</h1>

          <p>
            Manage the services displayed on your
            Horizon Software Company website.
          </p>
        </div>

        <div className="admin-services-header-actions">

          <button
            className="admin-services-refresh"
            onClick={fetchServices}
          >
            ↻ Refresh
          </button>

          <button
            className="admin-services-add"
            onClick={openAddForm}
          >
            + Add Service
          </button>

        </div>

      </section>


      {/* ERROR */}

      {error && (
        <div className="admin-services-error">

          <span>!</span>

          <p>{error}</p>

          <button
            onClick={() => setError("")}
          >
            ×
          </button>

        </div>
      )}


      {/* SUMMARY */}

      <section className="admin-services-summary">

        <div className="admin-services-summary-card">

          <div className="admin-services-summary-icon blue">
            #
          </div>

          <div>
            <span>Total Services</span>
            <strong>{services.length}</strong>
          </div>

        </div>


        <div className="admin-services-summary-card">

          <div className="admin-services-summary-icon gold">
            ✓
          </div>

          <div>
            <span>Active Services</span>
            <strong>{activeCount}</strong>
          </div>

        </div>


        <div className="admin-services-summary-card">

          <div className="admin-services-summary-icon grey">
            ○
          </div>

          <div>
            <span>Inactive Services</span>
            <strong>{inactiveCount}</strong>
          </div>

        </div>

      </section>


      {/* SEARCH */}

      <section className="admin-services-toolbar">

        <div className="admin-services-search">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        <span className="admin-services-count">
          {filteredServices.length} service
          {filteredServices.length === 1 ? "" : "s"}
        </span>

      </section>


      {/* WORKSPACE */}

      <section className="admin-services-workspace">

        {/* SERVICE LIST */}

        <div className="admin-services-list-panel">

          <div className="admin-services-list-heading">

            <div>

              <span>SERVICES</span>

              <h2>
                Website Services
              </h2>

            </div>

            <strong>
              {filteredServices.length}
            </strong>

          </div>


          {filteredServices.length === 0 ? (

            <div className="admin-services-empty">

              <div className="admin-services-empty-icon">
                #
              </div>

              <h3>
                No services found
              </h3>

              <p>
                {search
                  ? "Try changing your search."
                  : "Add your first service to begin managing your website services."
                }
              </p>

              {!search && (
                <button onClick={openAddForm}>
                  + Add Service
                </button>
              )}

            </div>

          ) : (

            <div className="admin-services-list">

              {filteredServices.map((service) => (

                <button
                  key={service.id}
                  className={`admin-service-item ${
                    selectedService?.id === service.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedService(service)
                  }
                >

                  <div className="admin-service-icon">

                    {service.name
                      ?.charAt(0)
                      .toUpperCase() || "#"}

                  </div>


                  <div className="admin-service-item-content">

                    <div className="admin-service-item-top">

                      <strong>
                        {service.name ||
                          "Unnamed Service"}
                      </strong>

                      <span
                        className={
                          service.is_active
                            ? "active"
                            : "inactive"
                        }
                      >
                        {service.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>


                    <p>
                      {service.description ||
                        "No description available."}
                    </p>

                  </div>

                </button>

              ))}

            </div>

          )}

        </div>


        {/* DETAILS PANEL */}

        <div className="admin-services-details-panel">

          {showForm ? (

            <div className="admin-service-form">

              <div className="admin-service-form-header">

                <div>

                  <span>
                    {editingId
                      ? "EDIT SERVICE"
                      : "NEW SERVICE"}
                  </span>

                  <h2>
                    {editingId
                      ? "Edit Service"
                      : "Add Service"}
                  </h2>

                </div>

                <button
                  type="button"
                  className="admin-service-close"
                  onClick={resetForm}
                >
                  ×
                </button>

              </div>


              <form onSubmit={handleSubmit}>

                <div className="admin-service-field">

                  <label>
                    Service Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Web Development"
                  />

                </div>


                <div className="admin-service-field">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe this service..."
                    rows="7"
                  />

                </div>


                <div className="admin-service-field">

                  <label>
                    Image URL
                  </label>

                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Optional image URL"
                  />

                </div>


                <div className="admin-service-active-field">

                  <label>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                    />

                    <span>
                      Active service
                    </span>

                  </label>

                </div>


                <div className="admin-service-form-actions">

                  <button
                    type="button"
                    className="admin-service-cancel"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="admin-service-save"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Save Changes"
                      : "Create Service"}
                  </button>

                </div>

              </form>

            </div>

          ) : selectedService ? (

            <div className="admin-service-details">

              <div className="admin-service-details-header">

                <div>

                  <span>
                    SERVICE DETAILS
                  </span>

                  <h2>
                    {selectedService.name ||
                      "Service"}
                  </h2>

                </div>

                <div className="admin-service-detail-actions">

                  <button
                    className="admin-service-edit"
                    onClick={() =>
                      openEditForm(selectedService)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="admin-service-delete"
                    onClick={() =>
                      deleteService(
                        selectedService.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>


              <div className="admin-service-preview-icon">

                {selectedService.name
                  ?.charAt(0)
                  .toUpperCase() || "#"}

              </div>


              <div className="admin-service-detail-status">

                <span
                  className={
                    selectedService.is_active
                      ? "active"
                      : "inactive"
                  }
                >
                  {selectedService.is_active
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>


              <div className="admin-service-detail-block">

                <span>
                  DESCRIPTION
                </span>

                <p>
                  {selectedService.description ||
                    "No description available."}
                </p>

              </div>


              {selectedService.image && (
                <div className="admin-service-detail-block">

                  <span>
                    IMAGE
                  </span>

                  <p>
                    {selectedService.image}
                  </p>

                </div>
              )}

            </div>

          ) : (

            <div className="admin-service-details-empty">

              <div className="admin-service-details-empty-icon">
                #
              </div>

              <h2>
                Select a service
              </h2>

              <p>
                Choose a service from the list to
                view its details, or add a new service.
              </p>

              <button onClick={openAddForm}>
                + Add Service
              </button>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default AdminServices;