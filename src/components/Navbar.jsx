import { Link } from "react-router-dom";
import logo3 from "../assets/logo3.png";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="header">
      <nav className="navbar">

        <Link to="/" className="logo">
          <img src={logo3} alt="Horizon Software Company" />
        </Link>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/portfolio">Portfolio</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        <Link to="/contact" className="quote-btn">
          Get a Quote
        </Link>

      </nav>
    </header>
  );
}

export default Navbar;