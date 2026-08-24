import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// ==========================================
// PUBLIC WEBSITE COMPONENTS
// ==========================================

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ==========================================
// PUBLIC WEBSITE PAGES
// ==========================================

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";

// ==========================================
// ADMIN COMPONENTS
// ==========================================

import AdminLayout from "./admin/components/AdminLayout";

// ==========================================
// ADMIN PAGES
// ==========================================

import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminMessages from "./admin/pages/AdminMessages";
import AdminQuotes from "./admin/pages/AdminQuotes";
import AdminServices from "./admin/pages/AdminServices";
import AdminPortfolio from "./admin/pages/AdminPortfolio";
import AdminClients from "./admin/pages/AdminClients";
import AdminContent from "./admin/pages/AdminContent";

// ==========================================
// PUBLIC WEBSITE LAYOUT
// ==========================================

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

// ==========================================
// MAIN APP
// ==========================================

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>

        {/* ==========================================
            PUBLIC WEBSITE
           ========================================== */}

        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path="/about"
          element={
            <PublicLayout>
              <AboutUs />
            </PublicLayout>
          }
        />

        <Route
          path="/services"
          element={
            <PublicLayout>
              <Services />
            </PublicLayout>
          }
        />

        <Route
          path="/portfolio"
          element={
            <PublicLayout>
              <Portfolio />
            </PublicLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />

        {/* ==========================================
            ADMIN LOGIN
           ========================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ==========================================
            ADMIN PANEL
           ========================================== */}

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          {/* ADMIN DASHBOARD */}

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          {/* ADMIN MESSAGES */}

          <Route
            path="messages"
            element={<AdminMessages />}
          />

          {/* ADMIN QUOTE REQUESTS */}

          <Route
            path="quotes"
            element={<AdminQuotes />}
          />

          {/* ADMIN SERVICES */}

          <Route
            path="services"
            element={<AdminServices />}
          />

          {/* ADMIN PORTFOLIO */}

          <Route
            path="portfolio"
            element={<AdminPortfolio />}
          />

          {/* ADMIN CLIENTS */}

          <Route
            path="clients"
            element={<AdminClients />}
          />

          {/* WEBSITE CONTENT */}

          <Route
            path="content"
            element={<AdminContent />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;