import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminContent.css";

const API_URL = "http://127.0.0.1:5000";

function AdminContent() {
  const navigate = useNavigate();

  const [content, setContent] = useState({
    hero_title: "",
    hero_subtitle: "",
    hero_description: "",

    about_title: "",
    about_description: "",
    mission: "",
    vision: "",
    about_image: "",

    services_title: "",
    services_description: "",

    contact_email: "",
    contact_phone: "",
    address: "",

    footer_text: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("horizon_admin_token");
  };

  // =====================================================
  // LOAD WEBSITE CONTENT
  // =====================================================

  const fetchContent = async () => {
    const token = getToken();

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/content`,
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
            "Unable to load website content."
        );
      }

      /*
       * The backend returns an array of WebsiteContent
       * records.
       *
       * We convert those records into the format used
       * by this page.
       */

      const loadedContent = {
        hero_title: "",
        hero_subtitle: "",
        hero_description: "",

        about_title: "",
        about_description: "",
        mission: "",
        vision: "",
        about_image: "",

        services_title: "",
        services_description: "",

        contact_email: "",
        contact_phone: "",
        address: "",

        footer_text: "",
      };

      if (Array.isArray(data)) {
        data.forEach((item) => {
          if (
            item.section &&
            Object.prototype.hasOwnProperty.call(
              loadedContent,
              item.section
            )
          ) {
            loadedContent[item.section] =
              item.content || "";
          }
        });
      }

      setContent(loadedContent);

    } catch (err) {
      console.error(
        "FETCH CONTENT ERROR:",
        err
      );

      setError(
        "Unable to load website content. Please make sure the Flask backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setContent((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // =====================================================
  // SAVE FULL WEBSITE CONTENT
  // =====================================================

  const saveContent = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/api/content/full`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(content),
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to save website content."
        );
      }

      setMessage(
        "Website content has been saved successfully."
      );

    } catch (err) {
      console.error(
        "SAVE CONTENT ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to save website content."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="content-loading">

        <div className="content-spinner"></div>

        <h3>
          Loading website content
        </h3>

        <p>
          Preparing your website content manager...
        </p>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="content-page">

      {/* =================================================
          HEADER
         ================================================= */}

      <section className="content-page-header">

        <div>

          <span className="content-eyebrow">
            WEBSITE MANAGEMENT
          </span>

          <h1>
            Website Content
          </h1>

          <p>
            Manage the important information
            displayed across your Horizon Software
            Company website.
          </p>

        </div>

        <button
          type="button"
          className="content-refresh-button"
          onClick={fetchContent}
        >
          <span>↻</span>
          Refresh
        </button>

      </section>


      {/* =================================================
          SUCCESS
         ================================================= */}

      {message && (
        <div className="content-success">
          <span>✓</span>
          {message}
        </div>
      )}


      {/* =================================================
          ERROR
         ================================================= */}

      {error && (
        <div className="content-error">
          <span>!</span>
          {error}
        </div>
      )}


      {/* =================================================
          FORM
         ================================================= */}

      <form
        className="content-form"
        onSubmit={saveContent}
      >


        {/* =================================================
            HERO SECTION
           ================================================= */}

        <section className="content-card">

          <div className="content-card-header">

            <div className="content-card-icon blue">
              H
            </div>

            <div>

              <span>
                HOMEPAGE
              </span>

              <h2>
                Hero Section
              </h2>

              <p>
                Manage the main text visitors see
                when they first arrive on your website.
              </p>

            </div>

          </div>


          <div className="content-fields">

            <div className="content-field">

              <label>
                Hero Title
              </label>

              <input
                type="text"
                name="hero_title"
                value={content.hero_title}
                onChange={handleChange}
                placeholder="Technology within reach"
              />

            </div>


            <div className="content-field">

              <label>
                Hero Subtitle
              </label>

              <input
                type="text"
                name="hero_subtitle"
                value={content.hero_subtitle}
                onChange={handleChange}
                placeholder="Innovative technology solutions"
              />

            </div>


            <div className="content-field full">

              <label>
                Hero Description
              </label>

              <textarea
                name="hero_description"
                value={content.hero_description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe what Horizon Software Company does..."
              />

            </div>

          </div>

        </section>


        {/* =================================================
            ABOUT US
           ================================================= */}

        <section className="content-card">

          <div className="content-card-header">

            <div className="content-card-icon gold">
              A
            </div>

            <div>

              <span>
                COMPANY
              </span>

              <h2>
                About Us
              </h2>

              <p>
                Manage your company information,
                story, mission, vision and image.
              </p>

            </div>

          </div>


          <div className="content-fields">

            <div className="content-field full">

              <label>
                About Title
              </label>

              <input
                type="text"
                name="about_title"
                value={content.about_title}
                onChange={handleChange}
                placeholder="About Horizon Software Company"
              />

            </div>


            <div className="content-field full">

              <label>
                About Description
              </label>

              <textarea
                name="about_description"
                value={content.about_description}
                onChange={handleChange}
                rows="6"
                placeholder="Tell visitors about Horizon Software Company..."
              />

            </div>


            <div className="content-field">

              <label>
                Mission
              </label>

              <textarea
                name="mission"
                value={content.mission}
                onChange={handleChange}
                rows="5"
                placeholder="Our mission..."
              />

            </div>


            <div className="content-field">

              <label>
                Vision
              </label>

              <textarea
                name="vision"
                value={content.vision}
                onChange={handleChange}
                rows="5"
                placeholder="Our vision..."
              />

            </div>


            <div className="content-field full">

              <label>
                About Us Image
              </label>

              <input
                type="text"
                name="about_image"
                value={content.about_image}
                onChange={handleChange}
                placeholder="Enter image URL or image path"
              />

              <small>
                Add the image URL/path that should be
                used for the About Us section.
              </small>

            </div>

          </div>

        </section>


        {/* =================================================
            SERVICES
           ================================================= */}

        <section className="content-card">

          <div className="content-card-header">

            <div className="content-card-icon blue">
              S
            </div>

            <div>

              <span>
                SERVICES
              </span>

              <h2>
                Services Introduction
              </h2>

              <p>
                Manage the main introductory text
                displayed on your Services page.
              </p>

            </div>

          </div>


          <div className="content-fields">

            <div className="content-field full">

              <label>
                Services Title
              </label>

              <input
                type="text"
                name="services_title"
                value={content.services_title}
                onChange={handleChange}
                placeholder="Our Services"
              />

            </div>


            <div className="content-field full">

              <label>
                Services Description
              </label>

              <textarea
                name="services_description"
                value={
                  content.services_description
                }
                onChange={handleChange}
                rows="5"
                placeholder="Describe your services..."
              />

            </div>

          </div>

        </section>


        {/* =================================================
            CONTACT
           ================================================= */}

        <section className="content-card">

          <div className="content-card-header">

            <div className="content-card-icon green">
              C
            </div>

            <div>

              <span>
                CONTACT
              </span>

              <h2>
                Contact Information
              </h2>

              <p>
                Update the contact details displayed
                throughout your website.
              </p>

            </div>

          </div>


          <div className="content-fields">

            <div className="content-field">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="contact_email"
                value={content.contact_email}
                onChange={handleChange}
                placeholder="info@horizonsoftware.ug"
              />

            </div>


            <div className="content-field">

              <label>
                Phone Number
              </label>

              <input
                type="text"
                name="contact_phone"
                value={content.contact_phone}
                onChange={handleChange}
                placeholder="+256..."
              />

            </div>


            <div className="content-field full">

              <label>
                Address
              </label>

              <input
                type="text"
                name="address"
                value={content.address}
                onChange={handleChange}
                placeholder="Kampala, Uganda"
              />

            </div>

          </div>

        </section>


        {/* =================================================
            FOOTER
           ================================================= */}

        <section className="content-card">

          <div className="content-card-header">

            <div className="content-card-icon purple">
              F
            </div>

            <div>

              <span>
                FOOTER
              </span>

              <h2>
                Footer Content
              </h2>

              <p>
                Manage the description displayed
                in your website footer.
              </p>

            </div>

          </div>


          <div className="content-fields">

            <div className="content-field full">

              <label>
                Footer Text
              </label>

              <textarea
                name="footer_text"
                value={content.footer_text}
                onChange={handleChange}
                rows="5"
                placeholder="Technology within reach..."
              />

            </div>

          </div>

        </section>


        {/* =================================================
            SAVE CHANGES
           ================================================= */}

        <div className="content-save-area">

          <div>

            <strong>
              Website Content
            </strong>

            <p>
              Review your changes before saving.
            </p>

          </div>


          <button
            type="submit"
            className="content-save-button"
            disabled={saving}
          >

            {saving ? (
              <>
                <span className="content-button-spinner"></span>
                Saving...
              </>
            ) : (
              <>
                Save Changes
                <span>→</span>
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
}

export default AdminContent;